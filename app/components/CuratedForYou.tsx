"use client";

import { useMemo } from "react";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import {
  recommendForProfile,
  recommendDiscovery,
} from "../lib/customer/recommendations/RecommendationEngine";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { UnifiedCustomerProfile } from "../lib/customer/profile/UnifiedCustomerProfile";
import DiscoverCollectionGrid from "./DiscoverCollectionGrid";

function hasMeaningfulProfile(profile: UnifiedCustomerProfile): boolean {
  return (
    profile.signals.length > 0 ||
    profile.recentlyViewed.length > 0 ||
    profile.savedSlugs.length > 0 ||
    profile.lastQuizSlugs.length > 0
  );
}

export default function CuratedForYou() {
  const { profile, isReady } = useUnifiedCustomerProfile();

  const { fragrances, isPersonalised } = useMemo(() => {
    if (!profile) return { fragrances: [], isPersonalised: false };

    const personalised = hasMeaningfulProfile(profile);
    const result = personalised
      ? recommendForProfile(profile)
      : recommendDiscovery(profile);

    if (!result.success) return { fragrances: [], isPersonalised: false };

    const fragrances = result.recommendations
      .map((rec) => {
        const knowledge = catalogueMaps.bySlug.get(rec.slug);
        return knowledge ? toDisplayFragrance(knowledge) : null;
      })
      .filter((f): f is ReturnType<typeof toDisplayFragrance> => f !== null);

    return { fragrances, isPersonalised: personalised };
  }, [profile]);

  if (!isReady || fragrances.length === 0) return null;

  return (
    <section className="bg-[#faf7f5] py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            {isPersonalised ? "Curated For You" : "Discover Something New"}
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
            {isPersonalised
              ? "Selected For Your Fragrance Profile"
              : "Curated Discovery"}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#7b7480]">
            {isPersonalised
              ? "A selection built around the fragrances you have explored and the preferences you have expressed."
              : "A curated selection chosen to introduce you to the depth and range of the Maison Skye & Rose collection."}
          </p>
        </div>

        <DiscoverCollectionGrid
          fragrances={fragrances}
          source="homepage-curated"
          columns={3}
        />
      </div>
    </section>
  );
}
