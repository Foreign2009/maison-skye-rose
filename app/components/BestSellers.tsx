"use client";

import ProductCard from "./ProductCard";
import { fragrances } from "../data/fragrances";

interface BestSellersProps {
  onQuickAdd: (fragrance: any) => void;
}

export default function BestSellers({ onQuickAdd }: BestSellersProps) {
  const bestSellers = fragrances
    .filter((item) => item.bestSeller)
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
          Most Loved
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-[-0.05em]">
          Best Sellers
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {bestSellers.map((fragrance) => (
          <ProductCard
            key={fragrance.title}
            {...fragrance}
            onQuickAdd={() => onQuickAdd(fragrance)}
          />
        ))}
      </div>
    </section>
  );
}