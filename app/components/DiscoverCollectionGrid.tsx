"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import QuickAddModal from "./QuickAddModal";
import type { AnalyticsSource } from "../lib/analytics";

type GridFragrance = {
  title: string;
  subtitle: string;
  mood: string;
  profile: string;
  season: string;
  notes: string[];
  prices: { "5ml": number; "10ml": number; "30ml": number };
  images: { "5ml": string; "10ml": string; "30ml": string };
  bestSeller?: boolean;
  newArrival?: boolean;
  scentCharacter?: string;
  recReason?: string | null;
};

interface DiscoverCollectionGridProps {
  fragrances: GridFragrance[];
  source: AnalyticsSource;
  columns?: 2 | 3 | 4;
}

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2 md:grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
};

export default function DiscoverCollectionGrid({
  fragrances,
  source,
  columns = 4,
}: DiscoverCollectionGridProps) {
  const [selectedFragrance, setSelectedFragrance] =
    useState<GridFragrance | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  if (fragrances.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-400">
        <p className="text-sm">No fragrances in this collection yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid gap-4 md:gap-8 ${COLUMN_CLASS[columns]}`}>
        {fragrances.map((fragrance, i) => (
          <ProductCard
            key={fragrance.title}
            {...fragrance}
            scentCharacter={fragrance.scentCharacter}
            source={source}
            rank={i + 1}
            onQuickAdd={() => {
              setSelectedFragrance(fragrance);
              setQuickOpen(true);
            }}
          />
        ))}
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
    </>
  );
}
