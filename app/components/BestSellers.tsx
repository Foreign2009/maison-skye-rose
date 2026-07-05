"use client";

import { useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { getCollection } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";

interface BestSellersProps {
  onQuickAdd: (fragrance: ReturnType<typeof toDisplayFragrance>) => void;
}

export default function BestSellers({ onQuickAdd }: BestSellersProps) {
  const displayedProducts = useMemo(
    () => getCollection("trending").map(toDisplayFragrance),
    []
  );

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
      <div className="mb-12 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
          The Collection
        </p>
        <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">
          Maison Favourites
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#7b7480] max-w-xl mx-auto">
          Our most loved fragrances — chosen by the Maison community.
        </p>
      </div>

      {/* Mobile carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
        {displayedProducts.map((fragrance) => (
          <div key={fragrance.title} className="w-[210px] flex-shrink-0 snap-start">
            <ProductCard
              {...fragrance}
              source="homepage-trending"
              onQuickAdd={() => onQuickAdd(fragrance)}
            />
          </div>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-4">
        {displayedProducts.map((fragrance, i) => (
          <ProductCard
            key={fragrance.title}
            {...fragrance}
            source="homepage-trending"
            rank={i + 1}
            onQuickAdd={() => onQuickAdd(fragrance)}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="rounded-full border border-[#4f4a52] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#4f4a52] transition hover:bg-[#4f4a52] hover:text-white"
        >
          Explore All Fragrances
        </Link>
      </div>
    </section>
  );
}
