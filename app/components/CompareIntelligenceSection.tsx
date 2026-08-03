"use client";

import { useMemo, useRef, useEffect } from "react";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import { getContextualRecommendations } from "../lib/intelligence/ExperienceIntelligence";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import DiscoverCollectionGrid from "./DiscoverCollectionGrid";
import { trackExperienceIntelligenceShown } from "../lib/analytics";

interface CompareIntelligenceSectionProps {
  excludeSlugs: string[];
}

export default function CompareIntelligenceSection({ excludeSlugs }: CompareIntelligenceSectionProps) {
  const { profile, isReady } = useUnifiedCustomerProfile();

  const { fragrances, isPersonalised, feedbackSlugs, processingTimeMs } = useMemo(() => {
    const empty = {
      fragrances:       [] as ReturnType<typeof toDisplayFragrance>[],
      isPersonalised:   false,
      feedbackSlugs:    [] as string[],
      processingTimeMs: undefined as number | undefined,
    };
    if (!profile) return empty;

    const result = getContextualRecommendations("compare", profile, { currentSlug: excludeSlugs[0] });
    if (!result.success || result.recommendations.length === 0) return empty;

    const excluded = new Set(excludeSlugs);
    const filtered = result.recommendations.filter((r) => !excluded.has(r.slug));
    if (filtered.length === 0) return empty;

    const fragrances = filtered
      .map((rec) => {
        const knowledge = catalogueMaps.bySlug.get(rec.slug);
        if (!knowledge) return null;
        return {
          ...toDisplayFragrance(knowledge),
          recReason: rec.reasons[0]?.description ?? null,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    return {
      fragrances,
      isPersonalised:   result.isPersonalised,
      feedbackSlugs:    filtered.map((r) => r.slug),
      processingTimeMs: result.metrics.processingTimeMs,
    };
  }, [profile, excludeSlugs]);

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current || !isReady || feedbackSlugs.length === 0) return;
    firedRef.current = true;
    trackExperienceIntelligenceShown({
      experience:          "compare",
      strategy:            isPersonalised ? "personalised" : "discovery",
      profileType:         isPersonalised ? "personalised" : "discovery",
      seeded:              false,
      recommendationCount: feedbackSlugs.length,
      slugs:               feedbackSlugs,
      renderSource:        "compare-post-decision",
      processingTimeMs,
    });
  }, [isReady, feedbackSlugs, isPersonalised, processingTimeMs]);

  if (!isReady || fragrances.length === 0) return null;

  return (
    <section className="px-4 pb-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 md:mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            {isPersonalised ? "Selected For You" : "Explore More"}
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
            {isPersonalised ? "Chosen For Your Fragrance Profile" : "More To Discover"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
            {isPersonalised
              ? "A selection built around the preferences you have expressed across the Maison Skye & Rose collection."
              : "A curated selection to continue your fragrance journey."}
          </p>
        </div>
        <DiscoverCollectionGrid
          fragrances={fragrances}
          source="compare-post-decision"
          columns={3}
        />
      </div>
    </section>
  );
}
