"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import QuickAddModal from "./QuickAddModal";

export default function YourFragranceJourney() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");

    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
          Your Fragrance Journey
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-[-0.05em]">
          Continue Exploring
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <ProductCard
            key={item.title}
            {...item}
            onQuickAdd={() => setSelectedFragrance(item)}
          />
        ))}
      </div>

      {selectedFragrance && (
        <QuickAddModal
          open={true}
          onClose={() => setSelectedFragrance(null)}
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}
    </section>
  );
}