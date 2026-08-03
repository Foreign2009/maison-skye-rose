"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import QuickAddModal from "./QuickAddModal";
import { mkcCatalogue } from "../lib/mkc/catalogue";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import { trackRecommendationShown } from "../lib/analytics";

export default function LatestAdditions() {
  const [selectedFragrance, setSelectedFragrance] = useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const { latestAdditions, slugs } = useMemo(() => {
    const items = mkcCatalogue
      .filter((k) => k.newArrival)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 8);
    return {
      latestAdditions: items.map(toDisplayFragrance),
      slugs:           items.map((f) => f.slug),
    };
  }, []);

  const impressionFiredRef = useRef(false);
  useEffect(() => {
    if (impressionFiredRef.current || latestAdditions.length === 0) return;
    impressionFiredRef.current = true;
    trackRecommendationShown({
      strategy:       "discovery",
      surface:        "homepage-new-arrivals",
      count:          latestAdditions.length,
      slugs,
      isPersonalised: false,
    });
  }, [latestAdditions.length, slugs]);

  if (latestAdditions.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
          Always Evolving
        </p>
        <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">
          Newly Curated
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#7b7480] max-w-2xl">
          The latest additions to the Maison collection.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {latestAdditions.map((fragrance, i) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              source="homepage-new-arrivals"
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
