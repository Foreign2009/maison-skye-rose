"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import QuickAddModal from "./QuickAddModal";
import { fragrances } from "../data/fragrances";

export default function LatestAdditions() {
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const latestAdditions = useMemo(() => {
    const skye = fragrances.filter((f) => f.collection === "Skye");
    const rose = fragrances.filter((f) => f.collection === "Rose");
    const elite = fragrances.filter((f) => f.collection === "Elite");

    const result: any[] = [];
    const maxLength = Math.max(skye.length, rose.length, elite.length);
    for (let i = 0; i < maxLength; i++) {
      if (skye[i]) result.push(skye[i]);
      if (rose[i]) result.push(rose[i]);
      if (elite[i]) result.push(elite[i]);
    }
    return result;
  }, []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#b67d73]">
          Maison Skye & Rose
        </p>

        <h2 className="mt-4 text-5xl font-black uppercase tracking-tighter text-[#4f4a52]">
          Latest Additions
        </h2>

        <p className="mt-6 max-w-2xl text-zinc-600">
          Recently added luxury inspirations curated for our collection.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {latestAdditions.slice(0, 8).map((fragrance) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              onQuickAdd={() => { setSelectedFragrance(fragrance); setQuickOpen(true); }}
            />
          ))}
        </div>
      </div>

      {selectedFragrance && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}
    </section>
  );
}

