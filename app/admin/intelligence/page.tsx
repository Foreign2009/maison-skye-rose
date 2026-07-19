import type { Metadata }    from "next";
import { cookies }           from "next/headers";
import { createHash }        from "crypto";
import { redirect }          from "next/navigation";
import {
  recommend,
  createContext,
  buildExplanation,
} from "@/app/lib/customer/recommendations";
import { mkcCatalogue }      from "@/app/lib/mkc/catalogue";
import IntelligenceDashboard, {
  type IntelligenceData,
  type RERow,
} from "@/app/admin/IntelligenceDashboard";
import type { UnifiedCustomerProfile } from "@/app/lib/customer/profile/UnifiedCustomerProfile";

export const metadata: Metadata = {
  title:  "Intelligence | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

// ── Auth ──────────────────────────────────────────────────────────────────────

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

// ── Synthetic profile factory ─────────────────────────────────────────────────

function makeSyntheticProfile(savedSlugs: readonly string[]): UnifiedCustomerProfile {
  const now = Date.now();
  return {
    tier:           "unified",
    identity:       {},
    metadata:       { version: 1, createdAt: now, updatedAt: now },
    signals:        [],
    recentlyViewed: [],
    savedSlugs,
    lastQuizSlugs:  [],
    lastActiveAt:   null,
  };
}

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function IntelligencePage() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();
  if (!isAuth) redirect("/admin");

  // ── Synthetic profiles ──────────────────────────────────────────────────────

  const bestSellers = mkcCatalogue
    .filter((r) => r.bestSeller)
    .slice(0, 2)
    .map((r) => r.slug);

  const coldProfile   = makeSyntheticProfile([]);
  const modestProfile = makeSyntheticProfile(bestSellers);

  // ── RE runs ─────────────────────────────────────────────────────────────────

  const discoveryCtx    = createContext(coldProfile,   "discovery",    { limit: 6 });
  const personalisedCtx = createContext(modestProfile, "personalised", { limit: 3 });

  const discoveryResult    = recommend(discoveryCtx);
  const personalisedResult = recommend(personalisedCtx);

  // ── Discovery rows ──────────────────────────────────────────────────────────

  const discoveryRows: RERow[] = discoveryResult.success
    ? discoveryResult.recommendations.map((rec) => {
        const explanation = buildExplanation(rec, discoveryCtx);
        return {
          slug:           rec.slug,
          name:           slugToTitle(rec.slug),
          rank:           rec.rank,
          scoreTotal:     rec.score.total,
          profileScore:   rec.score.profile,
          catalogScore:   rec.score.catalog,
          relationScore:  rec.score.relation,
          discoveryScore: rec.score.discovery,
          confidence:     explanation.confidence,
          topReason:      explanation.reasons[0]?.type ?? null,
          humanText:      explanation.humanText,
        };
      })
    : [];

  // ── Personalised rows ────────────────────────────────────────────────────────

  const personalisedRows: RERow[] = personalisedResult.success
    ? personalisedResult.recommendations.map((rec) => {
        const explanation = buildExplanation(rec, personalisedCtx);
        return {
          slug:           rec.slug,
          name:           slugToTitle(rec.slug),
          rank:           rec.rank,
          scoreTotal:     rec.score.total,
          profileScore:   rec.score.profile,
          catalogScore:   rec.score.catalog,
          relationScore:  rec.score.relation,
          discoveryScore: rec.score.discovery,
          confidence:     explanation.confidence,
          topReason:      explanation.reasons[0]?.type ?? null,
          humanText:      explanation.humanText,
        };
      })
    : [];

  const data: IntelligenceData = {
    generatedAt:         new Date().toISOString(),
    discoveryMetrics:    discoveryResult.metrics,
    personalisedMetrics: personalisedResult.metrics,
    syntheticSavedSlugs: bestSellers,
    discoveryRows,
    personalisedRows,
  };

  return <IntelligenceDashboard data={data} />;
}
