"use client";

import { useMemo } from "react";
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
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-20">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Trending This Season
        </p>

        <h2 className="mt-2 text-2xl md:text-5xl font-black tracking-[-0.05em]">
          Trending Now
        </h2>
      </div>

      <>
        {/* Mobile Luxury Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {displayedProducts.map((fragrance) => (
            <div
              key={fragrance.title}
              className="w-[210px] flex-shrink-0 snap-start"
            >
              <ProductCard
                {...fragrance}
                source="homepage-trending"
                onQuickAdd={() => onQuickAdd(fragrance)}
              />
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
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
      </>
    </section>
  );
}
