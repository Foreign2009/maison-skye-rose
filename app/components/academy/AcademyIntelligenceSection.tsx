"use client";

import { useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUnifiedCustomerProfile } from "../../lib/customer/hooks/useUnifiedCustomerProfile";
import { getContextualRecommendations } from "../../lib/intelligence/ExperienceIntelligence";
import { hasMeaningfulProfile } from "../../lib/customer/profile/profileUtils";
import { trackExperienceIntelligenceShown } from "../../lib/analytics";
import { catalogueMaps } from "../../lib/discovery";
import { toDisplayFragrance } from "../../lib/mkc/displayAdapter";
import { KnowledgeChip } from "../knowledge/KnowledgeChip";

interface AcademyIntelligenceSectionProps {
  articleSeedSlugs: readonly string[];
  articleCategory:  string;
}

export function AcademyIntelligenceSection({
  articleSeedSlugs,
  articleCategory,
}: AcademyIntelligenceSectionProps) {
  const { profile, isReady } = useUnifiedCustomerProfile();

  type AcademyFragrance = ReturnType<typeof toDisplayFragrance> & {
    slug:      string;
    recReason: string | null;
  };

  const { fragrances, isPersonalised, strategy, processingTimeMs, profileType } = useMemo(() => {
    const empty = {
      fragrances:       [] as AcademyFragrance[],
      isPersonalised:   false,
      strategy:         "discovery" as string,
      processingTimeMs: undefined as number | undefined,
      profileType:      "discovery" as "personalised" | "seeded" | "discovery",
    };
    if (!profile || articleSeedSlugs.length === 0) return empty;

    const result = getContextualRecommendations("academy", profile, {
      seedSlugs: articleSeedSlugs,
      limit: 4,
    });

    if (!result.success || result.recommendations.length === 0) return empty;

    const fragrances = result.recommendations
      .map((rec) => {
        const knowledge = catalogueMaps.bySlug.get(rec.slug);
        if (!knowledge) return null;
        return {
          ...toDisplayFragrance(knowledge),
          slug:      rec.slug,
          recReason: rec.reasons[0]?.description ?? null,
        };
      })
      .filter((f): f is NonNullable<typeof f> => f !== null);

    const hasRealProfile = hasMeaningfulProfile(profile);
    const derivedProfileType: "personalised" | "seeded" | "discovery" = hasRealProfile
      ? "personalised"
      : articleSeedSlugs.length > 0
        ? "seeded"
        : "discovery";

    return {
      fragrances,
      isPersonalised:   result.isPersonalised,
      strategy:         result.strategy as string,
      processingTimeMs: result.metrics.processingTimeMs,
      profileType:      derivedProfileType,
    };
  }, [profile, articleSeedSlugs]);

  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || fragrances.length === 0) return;
    firedRef.current = true;
    trackExperienceIntelligenceShown({
      experience:          "academy",
      strategy,
      profileType,
      seeded:              profileType === "seeded",
      recommendationCount: fragrances.length,
      slugs:               fragrances.map((f) => f.slug),
      renderSource:        "academy-intelligence",
      processingTimeMs,
    });
  }, [fragrances, strategy, profileType, processingTimeMs]);

  if (!isReady || fragrances.length === 0) return null;

  const heading = isPersonalised
    ? "Selected For Your Collection"
    : `Discover ${articleCategory} Fragrances`;

  const subheading = isPersonalised
    ? "Chosen to complement the preferences you have expressed across Maison."
    : "A selection from the Maison collection to continue your learning journey.";

  return (
    <section className="mt-12 border-t border-[#e8e4e9] pt-10">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-2">
        {isPersonalised ? "Selected For You" : "Explore These Fragrances"}
      </p>
      <h2 className="text-lg font-semibold text-[#4f4a52] mb-1">
        {heading}
      </h2>
      <p className="text-sm text-[#4f4a52]/55 mb-6 leading-relaxed">
        {subheading}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {fragrances.map((fragrance) => (
          <Link
            key={fragrance.slug}
            href={`/product/${fragrance.slug}`}
            className="group block rounded-xl border border-[#e8e4e9] hover:border-[#d89ca4] transition-colors duration-200 overflow-hidden bg-white"
          >
            <div className="relative aspect-square bg-[#faf8f8]">
              <Image
                src={fragrance.images["10ml"]}
                alt={fragrance.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-3"
              />
            </div>
            <div className="px-3 py-3">
              <p className="text-[10px] font-medium tracking-widest uppercase text-[#d89ca4] mb-0.5">
                {fragrance.collection}
              </p>
              <p className="text-sm font-medium text-[#4f4a52] leading-tight group-hover:text-[#d89ca4] transition-colors duration-200 line-clamp-2">
                {fragrance.title}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <KnowledgeChip label={fragrance.profile} />
                <KnowledgeChip label={fragrance.season} />
              </div>
              {fragrance.recReason ? (
                <p className="mt-1.5 text-[11px] text-[#d89ca4]/80 leading-relaxed line-clamp-2 italic">
                  {fragrance.recReason}
                </p>
              ) : (
                <p className="mt-1.5 text-[11px] text-[#4f4a52]/55 leading-relaxed line-clamp-2">
                  {fragrance.mood}
                </p>
              )}
              <p className="mt-1.5 text-xs text-[#4f4a52]/60">
                From R{fragrance.prices["5ml"]}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {isPersonalised && (
        <p className="mt-6 text-xs text-center text-[#4f4a52]/40">
          Your recommendations improve as you save, explore, and search across Maison.
        </p>
      )}
    </section>
  );
}
