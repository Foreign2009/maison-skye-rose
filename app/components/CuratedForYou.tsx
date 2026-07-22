"use client";

import { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import { getContextualRecommendations } from "../lib/intelligence/ExperienceIntelligence";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import DiscoverCollectionGrid from "./DiscoverCollectionGrid";
import { trackExperienceIntelligenceShown } from "../lib/analytics";

export default function CuratedForYou() {
  const { profile, isReady } = useUnifiedCustomerProfile();

  const { fragrances, isPersonalised, topReason, context, feedbackSlugs, processingTimeMs } = useMemo(() => {
    const empty = { fragrances: [] as ReturnType<typeof toDisplayFragrance>[], isPersonalised: false, topReason: null as string | null, context: null, feedbackSlugs: [] as string[], processingTimeMs: undefined as number | undefined };
    if (!profile) return empty;

    const result = getContextualRecommendations("homepage", profile);

    if (!result.success || result.recommendations.length === 0) return empty;

    const fragrances = result.recommendations
      .map((rec) => {
        const knowledge = catalogueMaps.bySlug.get(rec.slug);
        if (!knowledge) return null;
        return {
          ...toDisplayFragrance(knowledge),
          recReason: rec.reasons[0]?.description ?? null,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    const topReason = result.isPersonalised
      ? result.recommendations[0]?.reasons[0]?.description ?? null
      : null;

    return {
      fragrances,
      isPersonalised:   result.isPersonalised,
      topReason,
      context:          result.context,
      feedbackSlugs:    result.recommendations.map((r) => r.slug),
      processingTimeMs: result.metrics.processingTimeMs,
    };
  }, [profile]);

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current || !isReady || feedbackSlugs.length === 0) return;
    firedRef.current = true;
    trackExperienceIntelligenceShown({
      experience:          "homepage",
      strategy:            isPersonalised ? "personalised" : "discovery",
      profileType:         isPersonalised ? "personalised" : "discovery",
      seeded:              false,
      recommendationCount: feedbackSlugs.length,
      slugs:               feedbackSlugs,
      renderSource:        "homepage-curated",
      processingTimeMs,
    });
  }, [isReady, feedbackSlugs, isPersonalised, processingTimeMs]);

  if (!isReady || fragrances.length === 0) return null;

  return (
    <section className="bg-[#faf7f5] py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            {isPersonalised ? (context?.label ?? "Curated For You") : "Discover Something New"}
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
            {isPersonalised
              ? (context?.heading ?? "Selected For Your Fragrance Profile")
              : "Curated Discovery"}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#7b7480]">
            {isPersonalised
              ? (topReason ?? context?.body ?? "A selection built around the fragrances you have explored and the preferences you have expressed.")
              : "A curated selection chosen to introduce you to the depth and range of the Maison Skye & Rose collection."}
          </p>
        </div>

        <DiscoverCollectionGrid
          fragrances={fragrances}
          source="homepage-curated"
          columns={3}
        />

        {isPersonalised && (
          <p className="mt-8 text-center text-sm text-[#7b7480]">
            <Link
              href="/fragrance-profile"
              className="font-semibold text-[#d89ca4] hover:underline"
            >
              See your Fragrance Profile →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
