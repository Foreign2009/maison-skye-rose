"use client";

import { useMemo, useRef, useEffect } from "react";
import { useUnifiedCustomerProfile } from "../../lib/customer/hooks/useUnifiedCustomerProfile";
import { getContextualRecommendations } from "../../lib/intelligence/ExperienceIntelligence";
import { hasMeaningfulProfile } from "../../lib/customer/profile/profileUtils";
import { trackExperienceIntelligenceShown } from "../../lib/analytics";
import { catalogueMaps } from "../../lib/discovery";
import { toDisplayFragrance } from "../../lib/mkc/displayAdapter";
import DiscoverCollectionGrid from "../DiscoverCollectionGrid";

interface DiscoveryIntelligenceSectionProps {
  seedSlugs:    readonly string[]; // top representative slugs — seeds cold-start profile
  excludeSlugs: readonly string[]; // all collection slugs — excluded from results
  collectionName: string;
}

export function DiscoveryIntelligenceSection({
  seedSlugs,
  excludeSlugs,
  collectionName,
}: DiscoveryIntelligenceSectionProps) {
  const { profile, isReady } = useUnifiedCustomerProfile();

  type DiscoveryFragrance = ReturnType<typeof toDisplayFragrance> & {
    slug:           string;
    scentCharacter: "Fresh & Light" | "Balanced Signature" | "Rich & Long Wearing" | "Deep & Intense";
    recReason:      string | null;
  };

  const { fragrances, strategy, processingTimeMs, profileType } = useMemo(() => {
    const empty = {
      fragrances:       [] as DiscoveryFragrance[],
      strategy:         "discovery" as string,
      processingTimeMs: undefined as number | undefined,
      profileType:      "discovery" as "personalised" | "seeded" | "discovery",
    };
    if (!profile || seedSlugs.length === 0) return empty;

    const result = getContextualRecommendations("discover", profile, {
      seedSlugs,
      limit: 8, // request extra to absorb post-filter losses
    });

    if (!result.success || result.recommendations.length === 0) return empty;

    const excludeSet = new Set(excludeSlugs);

    const fragrances = result.recommendations
      .filter((rec) => !excludeSet.has(rec.slug))
      .slice(0, 4)
      .map((rec) => {
        const knowledge = catalogueMaps.bySlug.get(rec.slug);
        if (!knowledge) return null;
        return {
          ...toDisplayFragrance(knowledge),
          slug:           rec.slug,
          scentCharacter: knowledge.scentCharacter,
          recReason:      rec.reasons[0]?.description ?? null,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    const hasRealProfile = hasMeaningfulProfile(profile);
    const derivedProfileType: "personalised" | "seeded" | "discovery" = hasRealProfile
      ? "personalised"
      : seedSlugs.length > 0
        ? "seeded"
        : "discovery";

    return {
      fragrances,
      strategy:         result.strategy as string,
      processingTimeMs: result.metrics.processingTimeMs,
      profileType:      derivedProfileType,
    };
  }, [profile, seedSlugs, excludeSlugs]);

  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || fragrances.length === 0) return;
    firedRef.current = true;
    trackExperienceIntelligenceShown({
      experience:          "discover",
      strategy,
      profileType,
      seeded:              profileType === "seeded",
      recommendationCount: fragrances.length,
      slugs:               fragrances.map((f) => f.slug),
      renderSource:        "discover-intelligence",
      processingTimeMs,
    });
  }, [fragrances, strategy, profileType, processingTimeMs]);

  if (!isReady || fragrances.length === 0) return null;

  return (
    <section className="px-4 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 md:mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            Recommended Next
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
            Continue Your Discovery
          </h2>
          <p className="mt-2 text-sm text-[#7b7480]">
            Selected to extend your journey beyond {collectionName}.
          </p>
        </div>
        <DiscoverCollectionGrid
          fragrances={fragrances}
          source="discover-intelligence"
          columns={4}
        />
      </div>
    </section>
  );
}
