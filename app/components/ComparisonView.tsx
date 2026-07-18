"use client";

import Link from "next/link";
import RecommendationCard from "./RecommendationCard";

export interface FragranceComparisonDTO {
  slug:        string;
  name:        string;
  subtitle:    string | null;
  mood:        string;
  profile:     string;
  freshness:   number;
  warmth:      number;
  sweetness:   number;
  intensity:   number;
  versatility: number;
  notes:       string[];
}

export default function ComparisonView({
  fragranceA,
  fragranceB,
  reasons,
}: {
  fragranceA: FragranceComparisonDTO;
  fragranceB: FragranceComparisonDTO;
  reasons:    string[];
}) {
  return (
    <section className="px-4 md:px-6 pt-16 md:pt-28 pb-16">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d89ca4]">
            Fragrance Comparison
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#4f4a52] md:text-4xl">
            {fragranceA.name}{" "}
            <span className="text-[#d89ca4]">vs</span>{" "}
            {fragranceB.name}
          </h1>
          <div className="mt-5 flex items-center justify-center gap-6 text-sm">
            <Link
              href={`/product/${fragranceA.slug}`}
              className="text-zinc-500 hover:text-[#d89ca4] transition-colors"
            >
              ← {fragranceA.name}
            </Link>
            <span className="text-zinc-300">·</span>
            <Link
              href={`/product/${fragranceB.slug}`}
              className="text-zinc-500 hover:text-[#d89ca4] transition-colors"
            >
              {fragranceB.name} →
            </Link>
          </div>
        </div>

        {/* Comparison grid — stacks on mobile, two columns on desktop */}
        <div className="grid gap-6 md:grid-cols-2">
          <RecommendationCard
            slug={fragranceA.slug}
            title={fragranceA.name}
            subtitle={fragranceA.subtitle}
            profile={fragranceA.profile}
            mood={fragranceA.mood}
            notes={fragranceA.notes}
            freshness={fragranceA.freshness}
            warmth={fragranceA.warmth}
            sweetness={fragranceA.sweetness}
            intensity={fragranceA.intensity}
            versatility={fragranceA.versatility}
            reasons={reasons}
          />
          <RecommendationCard
            slug={fragranceB.slug}
            title={fragranceB.name}
            subtitle={fragranceB.subtitle}
            profile={fragranceB.profile}
            mood={fragranceB.mood}
            notes={fragranceB.notes}
            freshness={fragranceB.freshness}
            warmth={fragranceB.warmth}
            sweetness={fragranceB.sweetness}
            intensity={fragranceB.intensity}
            versatility={fragranceB.versatility}
            reasons={reasons}
          />
        </div>

      </div>
    </section>
  );
}
