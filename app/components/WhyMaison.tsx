"use client";

const features = [
  {
    title: "Luxury Inspired Fragrances",
    description:
      "Carefully selected fragrances inspired by some of the world's most loved scent profiles.",
  },

  {
    title: "Travel Friendly Sizes",
    description:
      "Choose from 5ml, 10ml and 30ml options perfect for daily carry and discovery.",
  },

  {
    title: "AI Scent Finder",
    description:
      "Discover fragrances matched to your personality and preferences through the Maison Method™.",
  },

  {
    title: "Curated Discovery",
    description:
      "Explore multiple fragrances before committing to a full collection.",
  },
];

export default function WhyMaison() {
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
            Why Maison Skye & Rose
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#4f4a52]">
            Luxury Fragrance Discovery
          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="
                rounded-[32px]
                bg-white
                p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.06)]
              "
            >

              <h3 className="text-xl font-black text-[#4f4a52]">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-[#7b7480]">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}