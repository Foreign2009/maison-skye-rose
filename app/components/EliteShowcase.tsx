"use client";

import ProductCard from "./ProductCard";
import { fragrances } from "../data/fragrances";

export default function EliteShowcase({ onQuickAdd }: { onQuickAdd: (fragrance: any) => void }) {
  const eliteProducts = fragrances
    .filter((item) => item.collection === "Elite")
    .slice(0, 4);

  if (eliteProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">Exquisite Selection</p>
        <h2 className="mt-4 text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">Elite Collection</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {eliteProducts.map((fragrance) => (
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