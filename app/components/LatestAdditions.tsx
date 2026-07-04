"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import QuickAddModal from "./QuickAddModal";
import { mkcCatalogue } from "../lib/mkc/catalogue";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";

export default function LatestAdditions() {
  const [selectedFragrance, setSelectedFragrance] = useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const latestAdditions = useMemo(
    () =>
      mkcCatalogue
        .filter((k) => k.newArrival)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8)
        .map(toDisplayFragrance),
    []
  );

  if (latestAdditions.length === 0) return null;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#b67d73]">
          Just Arrived
        </p>

        <h2 className="mt-4 text-5xl font-black uppercase tracking-tighter text-[#4f4a52]">
          Latest Additions
        </h2>

        <p className="mt-6 max-w-2xl text-zinc-600">
          Recently added luxury inspirations curated for our collection.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {latestAdditions.map((fragrance, i) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              source="homepage-trending"
              rank={i + 1}
              onQuickAdd={() => {
                setSelectedFragrance(fragrance);
                setQuickOpen(true);
              }}
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
