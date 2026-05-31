"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function RecentlyViewed() {
  const [items, setItems] = useState<any[]>([]);

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
          Recently Viewed
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
          />
        ))}
      </div>
    </section>
  );
}