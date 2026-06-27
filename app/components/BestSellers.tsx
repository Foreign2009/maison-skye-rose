"use client";

import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { fragrances } from "../data/fragrances";

interface BestSellersProps {
  onQuickAdd: (fragrance: any) => void;
}

export default function BestSellers({ onQuickAdd }: BestSellersProps) {
  const displayedBestSellers = useMemo(() => {
    const skyeBest = fragrances.filter((f) => f.collection === "Skye" && f.bestSeller);
    const roseBest = fragrances.filter((f) => f.collection === "Rose" && f.bestSeller);
    const eliteBest = fragrances.filter((f) => f.collection === "Elite" && f.bestSeller);

    const result: any[] = [];
    const maxLength = Math.max(skyeBest.length, roseBest.length, eliteBest.length);
    for (let i = 0; i < maxLength; i++) {
      if (skyeBest[i]) result.push(skyeBest[i]);
      if (roseBest[i]) result.push(roseBest[i]);
      if (eliteBest[i]) result.push(eliteBest[i]);
    }
    return result.slice(0, 8);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-20">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Most Loved
        </p>

        {/* Global heading scale down from Step 2 */}
        <h2 className="mt-2 text-2xl md:text-5xl font-black tracking-[-0.05em]">
          Best Sellers
        </h2>
      </div>

      <>
        {/* Mobile Luxury Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {displayedBestSellers.map((fragrance) => (
            /* Updated to w-[210px] for the card visual peek preview effect */
            <div
              key={fragrance.title}
              className="w-[210px] flex-shrink-0 snap-start"
            >
              <ProductCard
                {...fragrance}
                onQuickAdd={() => onQuickAdd(fragrance)}
              />
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-4">
          {displayedBestSellers.map((fragrance) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              onQuickAdd={() => onQuickAdd(fragrance)}
            />
          ))}
        </div>
      </>
    </section>
  );
}