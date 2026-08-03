"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import MomentConciergeButton from "./MomentConciergeButton";
import { getSeasonalAcademyTeasers } from "../lib/editorial/seasonConfig";
import type { SeasonConfig } from "../lib/editorial/seasonConfig";
import type { DisplayFragrance } from "../lib/knowledgeAdapter";
import { trackRecommendationShown } from "../lib/analytics";

interface SeasonalStoryProps {
  config:     SeasonConfig;
  fragrances: DisplayFragrance[];
  onQuickAdd: (fragrance: DisplayFragrance) => void;
}

export default function SeasonalStory({ config, fragrances, onQuickAdd }: SeasonalStoryProps) {
  const articles = getSeasonalAcademyTeasers(config).slice(0, 2);

  const impressionFiredRef = useRef(false);
  useEffect(() => {
    if (impressionFiredRef.current || fragrances.length === 0) return;
    impressionFiredRef.current = true;
    trackRecommendationShown({
      strategy:       "discovery",
      surface:        "homepage-seasonal",
      count:          fragrances.length,
      slugs:          fragrances.map((f) => f.title.toLowerCase().replace(/\s+/g, "-")),
      isPersonalised: false,
    });
  }, [fragrances.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Act I & II — Editorial header + Fragrance discovery */}
      <section className="bg-[#faf7f5] px-4 md:px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">

          {/* Act I — Editorial story */}
          <div className="mb-12 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              {config.editorialTagline}
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">
              {config.editorialHeadline}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#7b7480]">
              {config.editorialNote}
            </p>
          </div>

          {/* Act II — This season's fragrances */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
              This Season&apos;s Collection
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
            {fragrances.map((fragrance) => (
              <div key={fragrance.title} className="w-[195px] flex-shrink-0 snap-start">
                <ProductCard
                  {...fragrance}
                  source="homepage-seasonal"
                  onQuickAdd={() => onQuickAdd(fragrance)}
                />
              </div>
            ))}
          </div>

          <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {fragrances.map((fragrance, i) => (
              <ProductCard
                key={fragrance.title}
                {...fragrance}
                source="homepage-seasonal"
                rank={i + 1}
                onQuickAdd={() => onQuickAdd(fragrance)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Act III — Wardrobe guidance */}
      <section className="bg-white px-4 md:px-5 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
              {config.wardrobeHeadline}
            </p>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-[#7b7480]">
              {config.wardrobeGuidance}
            </p>
          </div>
        </div>
      </section>

      {/* Act IV — Learn this season */}
      <section className="bg-[#faf7f5] px-4 md:px-5 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              Maison Academy
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl font-black tracking-[-0.04em] text-[#4f4a52]">
              Learn This Season
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {articles.map(({ slug, title, excerpt, readTime }) => (
              <Link
                key={slug}
                href={`/academy/${slug}`}
                className="group block rounded-[20px] bg-white border border-[#f0ebe8] p-7 transition-all duration-300 hover:border-[#d89ca4] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
                  {readTime} min read
                </p>
                <h4 className="mt-3 text-base font-black text-[#4f4a52] leading-snug">
                  {title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
                  {excerpt}
                </p>
                <p className="mt-5 text-sm font-bold text-[#d89ca4]">
                  Read more →
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/academy"
              className="inline-flex items-center rounded-full border border-[#d89ca4] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#d89ca4] transition-all duration-300 hover:bg-[#d89ca4]/5"
            >
              Visit the Academy
            </Link>
          </div>
        </div>
      </section>

      {/* Act V — Concierge + Discovery conclusion */}
      <section className="bg-white px-4 md:px-5 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[24px] border border-[#ede8e1] bg-[#faf7f5] px-8 py-8 md:px-12 md:py-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
              Your Seasonal Concierge
            </p>
            <h3 className="mt-3 text-xl md:text-2xl font-black tracking-[-0.03em] text-[#4f4a52]">
              Let your {config.season.toLowerCase()} wardrobe take shape.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#7b7480]">
              Your Concierge understands this season&apos;s fragrances, your wardrobe, and what belongs in it next. Ask anything — from choosing your first {config.season.toLowerCase()} scent to deepening a collection you already love.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <MomentConciergeButton
                context={config.conciergeContext}
                label="Discuss This Season"
              />
              <Link
                href={`/discover/${config.collectionId}`}
                className="inline-flex items-center justify-center rounded-full border border-[#4f4a52] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#4f4a52] transition hover:bg-[#4f4a52] hover:text-white"
              >
                Explore {config.editorialHeadline} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
