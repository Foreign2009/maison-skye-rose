"use client";

import Link from "next/link";

export default function AIHeroSection() {
  return (
    <section className="px-5 py-20">
      <div
        className="
          mx-auto
          max-w-7xl
          overflow-hidden
          rounded-[40px]
          bg-gradient-to-r
          from-pink-50
          to-blue-50
          p-10
          md:p-16
        "
      >
        <div className="max-w-3xl">

          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
            Maison Method™
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[#4f4a52] md:text-6xl">
            Find Your
            <br />
            Signature Scent
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#7b7480]">
            Not sure where to start?
            Take our Maison AI Scent Finder
            and discover fragrances matched
            to your personality, lifestyle and
            scent preferences.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/quiz"
              className="
                rounded-full
                bg-gradient-to-r
                from-pink-400
                to-blue-400
                px-8
                py-4
                font-bold
                text-white
                transition-all
                hover:scale-105
              "
            >
              Start My Scent Journey
            </Link>

            <Link
              href="/collections/skye"
              className="
                rounded-full
                border
                border-[#d89ca4]
                px-8
                py-4
                font-bold
                text-[#d89ca4]
              "
            >
              Browse Collection
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}