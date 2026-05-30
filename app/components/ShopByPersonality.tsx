"use client";

import Link from "next/link";

const personalities = [
  {
    title: "The Modern Gentleman",

    description:
      "Clean, confident and versatile. Perfect for daily luxury.",

    fragrances: [
      "Sauvage Inspired",
      "Bleu Inspired",
      "Aventus Inspired",
    ],

    href: "/quiz",
  },

  {
    title: "The Luxury Romantic",

    description:
      "Elegant, sophisticated and memorable.",

    fragrances: [
      "Delina Inspired",
      "Libre Inspired",
      "Good Girl Inspired",
    ],

    href: "/quiz",
  },

  {
    title: "The Compliment Magnet",

    description:
      "Bold fragrances chosen to leave an impression.",

    fragrances: [
      "Ultra Male Inspired",
      "Eros Inspired",
      "Stronger With You Inspired",
    ],

    href: "/quiz",
  },

  {
    title: "The Oud Collector",

    description:
      "Rich, deep and luxurious scent profiles.",

    fragrances: [
      "Oud Wood Inspired",
      "Royal Oud Inspired",
      "Oud Ispahan Inspired",
    ],

    href: "/quiz",
  },

  {
    title: "The Fresh Minimalist",

    description:
      "Bright, modern and effortlessly clean.",

    fragrances: [
      "Imagination Inspired",
      "Light Blue Inspired",
      "Allure Sport Inspired",
    ],

    href: "/quiz",
  },

  {
    title: "The Bold Trendsetter",

    description:
      "Unique fragrances for confident personalities.",

    fragrances: [
      "Baccarat Rouge Inspired",
      "Khamrah Inspired",
      "Tobacco Vanille Inspired",
    ],

    href: "/quiz",
  },
];

export default function ShopByPersonality() {

  return (

    <section className="px-5 py-24">

      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">

            Discover Your Style

          </p>

          <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#4f4a52]">

            Shop By Personality

          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[#7b7480] leading-8">

            Explore fragrance personalities designed to help
            you discover scents that match your lifestyle,
            confidence and personal style.

          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {personalities.map(
            (personality) => (

              <Link
                key={personality.title}
                href={personality.href}
              >

                <div
                  className="
                    h-full
                    rounded-[32px]
                    border
                    border-white/40
                    bg-white/70
                    p-8
                    shadow-[0_20px_60px_rgba(0,0,0,0.06)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]
                  "
                >

                  <h3 className="text-2xl font-black text-[#4f4a52]">

                    {personality.title}

                  </h3>

                  <p className="mt-4 text-[#7b7480] leading-7">

                    {personality.description}

                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">

                    {personality.fragrances.map(
                      (item) => (

                        <span
                          key={item}
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
                          {item}
                        </span>

                      )
                    )}

                  </div>

                  <div className="mt-8">

                    <span
                      className="
                        text-sm
                        font-bold
                        text-[#d89ca4]
                      "
                    >
                      Explore →
                    </span>

                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      </div>

    </section>

  );

}