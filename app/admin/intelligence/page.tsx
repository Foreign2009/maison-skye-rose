import type { Metadata }       from "next";
import { cookies }              from "next/headers";
import { createHash }           from "crypto";
import { redirect }             from "next/navigation";
import {
  recommend,
  createContext,
  buildExplanation,
}                               from "@/app/lib/customer/recommendations";
import type { RecommendationResult }  from "@/app/lib/customer/recommendations";
import type { RecommendationContext } from "@/app/lib/customer/recommendations";
import { mkcCatalogue }         from "@/app/lib/mkc/catalogue";
import IntelligenceDashboard, {
  type IntelligenceData,
  type RERow,
}                               from "@/app/admin/IntelligenceDashboard";
import type { UnifiedCustomerProfile } from "@/app/lib/customer/profile/UnifiedCustomerProfile";
import {
  computePerformanceSummary,
  buildPerformanceSnapshot,
}                               from "@/app/lib/customer/recommendations/StrategyPerformance";
import { buildSignalCalibrationReport } from "@/app/lib/customer/signals/SignalCalibration";
import {
  evaluatePromotionReadiness,
  buildCurrentBaseline,
} from "@/app/lib/customer/recommendations/ExperimentPromotion";

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

// ── Run analyser — builds display rows + confidence data in one pass ──────────

interface RunData {
  rows:        RERow[];
  confidences: { score: number; reasonCount: number }[];
}

function analyzeResult(result: RecommendationResult, ctx: RecommendationContext): RunData {
  if (!result.success) return { rows: [], confidences: [] };

  const rows:        RERow[]                                   = [];
  const confidences: { score: number; reasonCount: number }[] = [];

  for (const rec of result.recommendations) {
    const explanation = buildExplanation(rec, ctx);
    rows.push({
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
      reasonCount:    explanation.reasons.length,
      allReasonTypes: explanation.reasons.map((r) => r.type),
    });
    confidences.push({
      score:       explanation.confidence.score,
      reasonCount: explanation.reasons.length,
    });
  }

  return { rows, confidences };
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

  const pivotSlug   = bestSellers[0] ?? mkcCatalogue[0]?.slug ?? "";
  const coldProfile = makeSyntheticProfile([]);
  const modestProfile = makeSyntheticProfile(bestSellers);

  // ── RE contexts (all 5 strategies) ─────────────────────────────────────────

  const discoveryCtx      = createContext(coldProfile,    "discovery",      { limit: 6 });
  const personalisedCtx   = createContext(modestProfile,  "personalised",   { limit: 6 });
  const trendingCtx       = createContext(coldProfile,    "trending",       { limit: 6 });
  const similarCtx        = createContext(modestProfile,  "similar",        { limit: 6, currentSlug: pivotSlug });
  const complementaryCtx  = createContext(modestProfile,  "complementary",  { limit: 6, currentSlug: pivotSlug });

  // ── RE runs ─────────────────────────────────────────────────────────────────

  const discoveryResult      = recommend(discoveryCtx);
  const personalisedResult   = recommend(personalisedCtx);
  const trendingResult       = recommend(trendingCtx);
  const similarResult        = recommend(similarCtx);
  const complementaryResult  = recommend(complementaryCtx);

  // ── Analysis ─────────────────────────────────────────────────────────────────

  const discoveryData      = analyzeResult(discoveryResult,     discoveryCtx);
  const personalisedData   = analyzeResult(personalisedResult,  personalisedCtx);
  const trendingData       = analyzeResult(trendingResult,      trendingCtx);
  const similarData        = analyzeResult(similarResult,       similarCtx);
  const complementaryData  = analyzeResult(complementaryResult, complementaryCtx);

  // ── Catalogue stats ──────────────────────────────────────────────────────────

  const catalogueStats = {
    total:       mkcCatalogue.length,
    bestSellers: mkcCatalogue.filter((r) => r.bestSeller).length,
    newArrivals: mkcCatalogue.filter((r) => r.newArrival).length,
    featured:    mkcCatalogue.filter((r) => r.featured).length,
  };

  // ── Strategy performance snapshot ────────────────────────────────────────────

  const performanceSnapshot = buildPerformanceSnapshot([
    computePerformanceSummary("personalised",  true,  personalisedResult,  personalisedData.confidences),
    computePerformanceSummary("discovery",     true,  discoveryResult,     discoveryData.confidences),
    computePerformanceSummary("similar",       true,  similarResult,       similarData.confidences),
    computePerformanceSummary("complementary", true,  complementaryResult, complementaryData.confidences),
    computePerformanceSummary("trending",      false, trendingResult,      trendingData.confidences),
  ]);

  // ── Signal calibration ───────────────────────────────────────────────────────

  const signalCalibration = buildSignalCalibrationReport();

  // ── Experiment status — baseline mode (EP24.1 pending) ───────────────────────

  const experimentStatus = {
    frameworkImplemented: true as const,
    activeExperiments:    [] as readonly string[],
    baselineMode:         true,
  };

  // ── Calibration status — baseline mode (EP24.2 pending) ──────────────────────

  const calibrationStatus = {
    frameworkImplemented: false as const,
    activeCalibrationId:  "default",
    registeredCount:      1,
    strategyWeights: {
      personalised:  { profile: 0.50, catalog: 0.20, relation: 0.20, discovery: 0.10 },
      similar:       { profile: 0.20, catalog: 0.15, relation: 0.50, discovery: 0.15 },
      complementary: { profile: 0.15, catalog: 0.15, relation: 0.55, discovery: 0.15 },
      discovery:     { profile: 0.20, catalog: 0.20, relation: 0.20, discovery: 0.40 },
      trending:      { profile: 0.10, catalog: 0.60, relation: 0.10, discovery: 0.20 },
    },
  };

  // ── Promotion workflow ───────────────────────────────────────────────────────

  const promotionDecision = evaluatePromotionReadiness(
    experimentStatus,
    calibrationStatus,
    performanceSnapshot,
    signalCalibration,
  );

  const currentBaseline = buildCurrentBaseline(
    performanceSnapshot,
    signalCalibration,
    calibrationStatus,
    experimentStatus,
  );

  // ── Data assembly ────────────────────────────────────────────────────────────

  const data: IntelligenceData = {
    generatedAt:         new Date().toISOString(),
    catalogueStats,
    discoveryMetrics:    discoveryResult.metrics,
    personalisedMetrics: personalisedResult.metrics,
    trendingMetrics:     trendingResult.metrics,
    syntheticSavedSlugs: bestSellers,
    discoveryRows:       discoveryData.rows,
    personalisedRows:    personalisedData.rows,
    performanceSnapshot,
    signalCalibration,
    experimentStatus,
    calibrationStatus,
    promotionDecision,
    currentBaseline,
  };

  return <IntelligenceDashboard data={data} />;
}
