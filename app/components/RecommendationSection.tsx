"use client";

import RecommendationCard from "./RecommendationCard";

type RecommendationSectionProps = {
  title: string;

  fragrances: any[];
};

export default function RecommendationSection({
  title,
  fragrances,
}: RecommendationSectionProps) {

  if (!fragrances?.length) {
    return null;
  }

  return (

    <section className="mb-12">

      <h2
        className="
          mb-6
          text-3xl
          font-black
          tracking-[-0.05em]
          text-[#4f4a52]
        "
      >
        {title}
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">

        {fragrances.map(
          (fragrance) => (

            <RecommendationCard
              key={fragrance.title}
              title={fragrance.title}
              profile={
                fragrance.profile
              }
              mood={fragrance.mood}
              notes={
                fragrance.notes
              }
            />

          )
        )}

      </div>

    </section>

  );

}