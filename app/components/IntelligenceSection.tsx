"use client";

import { useMemo, useRef, useEffect } from "react";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import { getContextualRecommendations } from "../lib/intelligence/ExperienceIntelligence";
import type { ExperienceType } from "../lib/intelligence/ExperienceIntelligence";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { AnalyticsSource } from "../lib/analytics";
import { trackExperienceIntelligenceShown } from "../lib/analytics";
import DiscoverCollectionGrid from "./DiscoverCollectionGrid";
import type { RecommendationDisplayContext } from "../lib/adaptive/buildRecommendationContext";

interface IntelligenceSectionProps {
  experience: ExperienceType;
  personalisedLabel: string;
  personalisedHeading: string;
  personalisedBody: string;
  discoveryLabel: string;
  discoveryHeading: string;
  discoveryBody: string;
  source: AnalyticsSource;
  className?: string;
  // Optional override for pages that build context externally (collection, best-sellers, new-arrivals).
  // Takes priority over context derived internally from ExperienceIntelligence.
  context?: RecommendationDisplayContext | null;
}

export default function IntelligenceSection({
  experience,
  personalisedLabel,
  personalisedHeading,
  personalisedBody,
  discoveryLabel,
  discoveryHeading,
  discoveryBody,
  source,
  className = "bg-[#faf7f5]",
  context: contextOverride,
}: IntelligenceSectionProps) {
  const { profile, isReady } = useUnifiedCustomerProfile();

  const { fragrances, isPersonalised, reasonContext, feedbackSlugs, processingTimeMs, resultContext } = useMemo(() => {
    const empty = { fragrances: [], isPersonalised: false, reasonContext: null, feedbackSlugs: [] as string[], processingTimeMs: 0, resultContext: null as RecommendationDisplayContext | null };
    if (!profile) return empty;

    const result = getContextualRecommendations(experience, profile);

    if (!result.success || result.recommendations.length === 0) return empty;

    const fragrances = result.recommendations
      .map((rec) => {
        const knowledge = catalogueMaps.bySlug.get(rec.slug);
        return knowledge
          ? {
              ...toDisplayFragrance(knowledge),
              scentCharacter: knowledge.scentCharacter,
              recReason: rec.reasons[0]?.description ?? null,
            }
          : null;
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    const topReason = result.isPersonalised
      ? result.recommendations[0]?.reasons[0]?.description ?? null
      : null;

    return {
      fragrances,
      isPersonalised:   result.isPersonalised,
      reasonContext:    topReason,
      feedbackSlugs:    result.recommendations.map((r) => r.slug),
      processingTimeMs: result.metrics.processingTimeMs,
      resultContext:    result.context,
    };
  }, [profile, experience]);

  // External context override takes priority; falls back to EI-derived context.
  const context = contextOverride ?? resultContext;

  // Fire experience intelligence impression once when the set is first rendered.
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current || !isReady || feedbackSlugs.length === 0) return;
    firedRef.current = true;
    trackExperienceIntelligenceShown({
      experience,
      strategy:            isPersonalised ? "personalised" : "discovery",
      profileType:         isPersonalised ? "personalised" : "discovery",
      seeded:              false,
      recommendationCount: feedbackSlugs.length,
      slugs:               feedbackSlugs,
      renderSource:        source,
      processingTimeMs,
    });
  }, [isReady, feedbackSlugs, isPersonalised, source, processingTimeMs, experience]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isReady || fragrances.length === 0) return null;

  return (
    <section className={`${className} py-16 md:py-28`}>
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            {isPersonalised ? (context?.label ?? personalisedLabel) : discoveryLabel}
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
            {isPersonalised ? (context?.heading ?? personalisedHeading) : discoveryHeading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#7b7480]">
            {isPersonalised ? (reasonContext ?? context?.body ?? personalisedBody) : discoveryBody}
          </p>
        </div>

        <DiscoverCollectionGrid
          fragrances={fragrances}
          source={source}
          columns={3}
        />

        {isPersonalised && (
          <p className="mt-8 text-center text-xs text-[#7b7480]/60">
            Your recommendations improve as you save, explore, and search across Maison.
          </p>
        )}
      </div>
    </section>
  );
}
