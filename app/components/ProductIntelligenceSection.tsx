"use client";

import { useMemo, useRef, useEffect } from "react";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import { getContextualRecommendations } from "../lib/intelligence/ExperienceIntelligence";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import DiscoverCollectionGrid from "./DiscoverCollectionGrid";
import { trackExperienceIntelligenceShown } from "../lib/analytics";

interface ProductIntelligenceSectionProps {
  currentSlug: string;
}

export default function ProductIntelligenceSection({ currentSlug }: ProductIntelligenceSectionProps) {
  const { profile, isReady } = useUnifiedCustomerProfile();

  const { fragrances, isPersonalised, feedbackSlugs, processingTimeMs } = useMemo(() => {
    const empty = {
      fragrances:       [] as ReturnType<typeof toDisplayFragrance>[],
      isPersonalised:   false,
      feedbackSlugs:    [] as string[],
      processingTimeMs: undefined as number | undefined,
    };
    if (!profile) return empty;

    const result = getContextualRecommendations("product", profile, { currentSlug });
    if (!result.success || result.recommendations.length === 0) return empty;

    const filtered = result.recommendations.filter((r) => r.slug !== currentSlug);
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
  }, [profile, currentSlug]);

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current || !isReady || feedbackSlugs.length === 0) return;
    firedRef.current = true;
    trackExperienceIntelligenceShown({
      experience:          "product",
      strategy:            isPersonalised ? "personalised" : "discovery",
      profileType:         isPersonalised ? "personalised" : "discovery",
      seeded:              false,
      recommendationCount: feedbackSlugs.length,
      slugs:               feedbackSlugs,
      renderSource:        "pdp-recommendation",
      processingTimeMs,
    });
  }, [isReady, feedbackSlugs, isPersonalised, processingTimeMs]);

  if (!isReady || fragrances.length === 0) return null;

  return (
    <section className="px-4 md:px-6 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-[#faf7f5] p-6 md:p-10">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              {isPersonalised ? "Selected For You" : "Discover Something New"}
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#4f4a52]">
              {isPersonalised ? "Chosen For Your Fragrance Profile" : "You Might Also Love"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              {isPersonalised
                ? "A selection from across the collection, built around the preferences you have expressed."
                : "A curated selection to guide you further into the Maison Skye & Rose collection."}
            </p>
          </div>

          <DiscoverCollectionGrid
            fragrances={fragrances}
            source="pdp-recommendation"
            columns={3}
          />
        </div>
      </div>
    </section>
  );
}
