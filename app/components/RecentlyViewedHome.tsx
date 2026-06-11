"use client";

import Link from "next/link";

export default function RecentlyViewedHome() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Recently Viewed
        </p>

        <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#4f4a52]">
          Continue Exploring
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-[#7b7480]">
          Revisit fragrances you've recently explored.
        </p>

        <Link
          href="/recently-viewed"
          className="mt-8 inline-flex rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white"
        >
          View Recently Viewed
        </Link>
      </div>
    </section>
  );
}