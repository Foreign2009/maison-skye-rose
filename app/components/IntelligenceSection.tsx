"use client";

import { useMemo, useRef, useEffect } from "react";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import {
  recommendForProfile,
  recommendDiscovery,
} from "../lib/customer/recommendations/RecommendationEngine";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import { hasMeaningfulProfile } from "../lib/customer/profile/profileUtils";
import type { AnalyticsSource } from "../lib/analytics";
import { trackRecommendationShown } from "../lib/analytics";
import DiscoverCollectionGrid from "./DiscoverCollectionGrid";

interface IntelligenceSectionProps {
  personalisedLabel: string;
  personalisedHeading: string;
  personalisedBody: string;
  discoveryLabel: string;
  discoveryHeading: string;
  discoveryBody: string;
  source: AnalyticsSource;
  className?: string;
}

export default function IntelligenceSection({
  personalisedLabel,
  personalisedHeading,
  personalisedBody,
  discoveryLabel,
  discoveryHeading,
  discoveryBody,
  source,
  className = "bg-[#faf7f5]",
}: IntelligenceSectionProps) {
  const { profile, isReady } = useUnifiedCustomerProfile();

  const { fragrances, isPersonalised, reasonContext, feedbackSlugs, processingTimeMs } = useMemo(() => {
    const empty = { fragrances: [], isPersonalised: false, reasonContext: null, feedbackSlugs: [] as string[], processingTimeMs: 0 };
    if (!profile) return empty;

    const personalised = hasMeaningfulProfile(profile);
    const result = personalised
      ? recommendForProfile(profile)
      : recommendDiscovery(profile);

    if (!result.success) return empty;

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

    // Part D: surface the top reason from the first recommendation as context
    const topReason = personalised
      ? result.recommendations[0]?.reasons[0]?.description ?? null
      : null;

    return {
      fragrances,
      isPersonalised:  personalised,
      reasonContext:   topReason,
      feedbackSlugs:   result.recommendations.map((r) => r.slug),
      processingTimeMs: result.metrics.processingTimeMs,
    };
  }, [profile]);

  // Fire recommendation impression once when the set is first rendered.
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current || !isReady || feedbackSlugs.length === 0) return;
    firedRef.current = true;
    trackRecommendationShown({
      strategy:        isPersonalised ? "personalised" : "discovery",
      surface:         source,
      count:           feedbackSlugs.length,
      slugs:           feedbackSlugs,
      isPersonalised,
      processingTimeMs,
    });
  }, [isReady, feedbackSlugs, isPersonalised, source, processingTimeMs]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isReady || fragrances.length === 0) return null;

  return (
    <section className={`${className} py-16 md:py-28`}>
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            {isPersonalised ? personalisedLabel : discoveryLabel}
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
            {isPersonalised ? personalisedHeading : discoveryHeading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#7b7480]">
            {isPersonalised ? (reasonContext ?? personalisedBody) : discoveryBody}
          </p>
        </div>

        <DiscoverCollectionGrid
          fragrances={fragrances}
          source={source}
          columns={3}
        />
      </div>
    </section>
  );
}
