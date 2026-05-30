"use client";

import { Fragrance } from "../data/types";

type QuizResultsProps = {
  bestMatch: Fragrance | null;
  similarMatches: Fragrance[];
  luxuryUpgrade: Fragrance | null;
  hiddenGem: Fragrance | null;
};

export default function QuizResults({
  bestMatch,
  similarMatches,
  luxuryUpgrade,
  hiddenGem,
}: QuizResultsProps) {
  return (
    <div className="space-y-12">

      {bestMatch && (
        <ResultSection
          title="🎯 Perfect Match"
          fragrances={[bestMatch]}
        />
      )}

      {similarMatches.length > 0 && (
        <ResultSection
          title="✨ You May Also Love"
          fragrances={similarMatches}
        />
      )}

      {luxuryUpgrade && (
        <ResultSection
          title="👑 Luxury Upgrade"
          fragrances={[luxuryUpgrade]}
        />
      )}

      {hiddenGem && (
        <ResultSection
          title="💎 Hidden Gem"
          fragrances={[hiddenGem]}
        />
      )}

      <div
        className="
          rounded-[32px]
          bg-gradient-to-r
          from-pink-50
          to-blue-50
          p-8
        "
      >
        <h3 className="text-2xl font-black text-[#4f4a52]">
          Fragrance Guide
        </h3>

        <p className="mt-4 leading-8 text-[#7b7480]">
          These recommendations are based on
          fragrance families, scent styles,
          occasions and preferences. Fragrance
          descriptions and scent journeys are
          intended as educational guides inspired
          by the original fragrance profile.
        </p>
      </div>

    </div>
  );
}

function ResultSection({
  title,
  fragrances,
}: {
  title: string;
  fragrances: Fragrance[];
}) {
  return (
    <section>

      <h2 className="mb-6 text-3xl font-black text-[#4f4a52]">
        {title}
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {fragrances.map((fragrance) => (
          <ResultCard
            key={fragrance.id}
            fragrance={fragrance}
          />
        ))}
      </div>

    </section>
  );
}

function ResultCard({
  fragrance,
}: {
  fragrance: Fragrance;
}) {
  return (
    <div
      className="
        rounded-[32px]
        bg-white
        p-8
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      "
    >
      <div className="mb-4">

        <h3 className="text-2xl font-black text-[#4f4a52]">
          {fragrance.name}
        </h3>

        <p className="mt-2 text-sm font-medium text-[#d89ca4]">
          {fragrance.brand}
        </p>

      </div>

      <div className="flex flex-wrap gap-2">

        {fragrance.family.map((family) => (
          <span
            key={family}
            className="
              rounded-full
              bg-pink-50
              px-3
              py-1
              text-xs
              font-semibold
              text-[#d89ca4]
            "
          >
            {family}
          </span>
        ))}

      </div>

      <div className="mt-6 space-y-4">

        <div>
          <p className="text-sm text-[#7b7480]">
            Top Notes
          </p>

          <p className="font-medium">
            {fragrance.notes.top.join(", ")}
          </p>
        </div>

        <div>
          <p className="text-sm text-[#7b7480]">
            Heart Notes
          </p>

          <p className="font-medium">
            {fragrance.notes.heart.join(", ")}
          </p>
        </div>

        <div>
          <p className="text-sm text-[#7b7480]">
            Base Notes
          </p>

          <p className="font-medium">
            {fragrance.notes.base.join(", ")}
          </p>
        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <Metric
          label="Freshness"
          value={fragrance.freshness}
        />

        <Metric
          label="Warmth"
          value={fragrance.warmth}
        />

        <Metric
          label="Sweetness"
          value={fragrance.sweetness}
        />

        <Metric
          label="Intensity"
          value={fragrance.intensity}
        />

      </div>

    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>

      <div className="flex justify-between text-sm">

        <span>{label}</span>

        <span>{value}/5</span>

      </div>

      <div className="mt-2 h-2 rounded-full bg-gray-100">

        <div
          className="
            h-2
            rounded-full
            bg-gradient-to-r
            from-pink-400
            to-blue-400
          "
          style={{
            width: `${value * 20}%`,
          }}
        />

      </div>

    </div>
  );
}