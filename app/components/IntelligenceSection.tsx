"use client";

import { useMemo } from "react";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import {
  recommendForProfile,
  recommendDiscovery,
} from "../lib/customer/recommendations/RecommendationEngine";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import { hasMeaningfulProfile } from "../lib/customer/profile/profileUtils";
import type { AnalyticsSource } from "../lib/analytics";
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

  const { fragrances, isPersonalised, reasonContext } = useMemo(() => {
    if (!profile) return { fragrances: [], isPersonalised: false, reasonContext: null };

    const personalised = hasMeaningfulProfile(profile);
    const result = personalised
      ? recommendForProfile(profile)
      : recommendDiscovery(profile);

    if (!result.success) return { fragrances: [], isPersonalised: false, reasonContext: null };

    const fragrances = result.recommendations
      .map((rec) => {
        const knowledge = catalogueMaps.bySlug.get(rec.slug);
        return knowledge
          ? { ...toDisplayFragrance(knowledge), scentCharacter: knowledge.scentCharacter }
          : null;
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    // Part D: surface the top reason from the first recommendation as context
    const topReason = personalised
      ? result.recommendations[0]?.reasons[0]?.description ?? null
      : null;

    return { fragrances, isPersonalised: personalised, reasonContext: topReason };
  }, [profile]);

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
