"use client";

/**
 * Your Fragrance Journey
 *
 * Canonical customer intelligence dashboard. Activated when the customer has
 * any meaningful interaction history (viewed, saved, or quiz results).
 *
 * Responsibilities:
 *   - Calls useUnifiedCustomerProfile() to assemble the profile
 *   - Calls CIE getCustomerJourney() for stage derivation
 *   - Calls RE recommendForProfile() for personalised recommendations
 *   - Renders: Journey Stage banner, Recently Viewed, Saved Fragrances, Recommendations
 *
 * Architectural role:
 *   Consumer of the Customer Intelligence Platform — does not own profile state.
 *   Profile assembly is delegated to useUnifiedCustomerProfile().
 *   CIE and RE are called directly here so their dependencies (mkcCatalogue,
 *   CANDIDATE_POOL) are tree-shaken if this component is lazy-loaded.
 *
 * Rendering contract:
 *   Returns null when profile is not ready or customer is brand-new (no data).
 *   Each subsection (viewed/saved/recommendations) renders only when it has content.
 */

import { useMemo, useState }        from "react";
import Link                          from "next/link";
import ProductCard                   from "./ProductCard";
import QuickAddModal                 from "./QuickAddModal";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import { getCustomerJourney }        from "../lib/customer/intelligence/CustomerIntelligenceEngine";
import { recommendForProfile }       from "../lib/customer/recommendations/RecommendationEngine";
import { catalogueMaps }             from "../lib/discovery";
import { toDisplayFragrance }        from "../lib/mkc/displayAdapter";
import type { CustomerJourneyStage } from "../lib/customer/intelligence/CustomerJourney";
import type { FragranceKnowledge }   from "../lib/mkc/types";
import type { DisplayFragrance }     from "../lib/knowledgeAdapter";

// ── Stage copy ────────────────────────────────────────────────────────────────

const STAGE_COPY: Record<
  CustomerJourneyStage,
  { label: string; headline: string }
> = {
  new:        { label: "Your Fragrance Journey", headline: "Start Discovering" },
  exploring:  { label: "Your Fragrance Journey", headline: "Continue Exploring" },
  engaged:    { label: "Your Fragrance Journey", headline: "Tailored For You" },
  converting: { label: "Your Fragrance Journey", headline: "Welcome Back" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugsToCards(slugs: readonly string[], limit: number): DisplayFragrance[] {
  return slugs
    .slice(0, limit)
    .map((slug) => catalogueMaps.bySlug.get(slug))
    .filter((k): k is FragranceKnowledge => k !== undefined)
    .map(toDisplayFragrance);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function YourFragranceJourney() {
  const { profile, isReady } = useUnifiedCustomerProfile();
  const [selected, setSelected]   = useState<DisplayFragrance | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  // CIE — journey stage derivation
  const journey = useMemo(
    () => (profile ? getCustomerJourney(profile) : null),
    [profile],
  );

  // Resolve recently-viewed slugs → display cards (up to 4)
  const viewedCards = useMemo(
    () => (profile ? slugsToCards(profile.recentlyViewed, 4) : []),
    [profile],
  );

  // Resolve saved-fragrance slugs → display cards (up to 4)
  const savedCards = useMemo(
    () => (profile ? slugsToCards(profile.savedSlugs, 4) : []),
    [profile],
  );

  // RE — personalised recommendations (only when profile has data, not for "new" stage)
  const recommendationCards = useMemo((): (DisplayFragrance & { recReason: string | null })[] => {
    if (!profile || !journey || journey.stage === "new") return [];
    const result = recommendForProfile(profile, 4);
    if (!result.success) return [];
    return result.recommendations
      .map((r) => {
        const k = catalogueMaps.bySlug.get(r.slug);
        if (!k) return null;
        return {
          ...toDisplayFragrance(k),
          recReason: r.reasons[0]?.description ?? null,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);
  }, [profile, journey]);

  // Nothing to render until localStorage has been read
  if (!isReady || !profile || !journey) return null;

  // New customer with no history — stay quiet
  if (
    viewedCards.length === 0 &&
    savedCards.length === 0 &&
    recommendationCards.length === 0
  ) return null;

  const copy = STAGE_COPY[journey.stage];

  function openQuickAdd(fragrance: DisplayFragrance) {
    setSelected(fragrance);
    setQuickOpen(true);
  }

  return (
    <section className="bg-[#faf7f5] py-20">
      <div className="mx-auto max-w-7xl px-5">

        {/* ── Journey Stage Banner ─────────────────────────────────────────── */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
            {copy.label}
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
            {copy.headline}
          </h2>
        </div>

        {/* ── Recently Viewed ──────────────────────────────────────────────── */}
        {viewedCards.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#4f4a52]">
                Continue Exploring
              </h3>
              <Link
                href="/recently-viewed"
                className="text-sm font-semibold text-[#d89ca4] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {viewedCards.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  {...fragrance}
                  onQuickAdd={() => openQuickAdd(fragrance)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Saved Fragrances ─────────────────────────────────────────────── */}
        {savedCards.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#4f4a52]">
                Your Saved Fragrances
              </h3>
              <Link
                href="/favorites"
                className="text-sm font-semibold text-[#d89ca4] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {savedCards.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  {...fragrance}
                  onQuickAdd={() => openQuickAdd(fragrance)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Personalised Recommendations ─────────────────────────────────── */}
        {recommendationCards.length > 0 && (
          <div>
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
                Selected For You
              </p>
              <h3 className="mt-2 text-xl font-black text-[#4f4a52]">
                Recommended For You
              </h3>
              {recommendationCards[0]?.recReason != null && (
                <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                  {recommendationCards[0]?.recReason}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {recommendationCards.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  {...fragrance}
                  recReason={fragrance.recReason}
                  onQuickAdd={() => openQuickAdd(fragrance)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {selected && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selected.title}
          images={selected.images}
          prices={selected.prices}
        />
      )}
    </section>
  );
}
