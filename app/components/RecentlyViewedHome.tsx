"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { DisplayFragrance } from "../lib/knowledgeAdapter";

export default function RecentlyViewedHome() {
  const [recentProducts, setRecentProducts] = useState<DisplayFragrance[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("recentlyViewed") ?? "[]");
      const items: DisplayFragrance[] = (Array.isArray(raw) ? raw : [])
        .map((item: unknown) => {
          const title =
            item && typeof item === "object" && "title" in item
              ? String((item as Record<string, unknown>).title)
              : "";
          const knowledge = catalogueMaps.byName.get(title);
          return knowledge ? toDisplayFragrance(knowledge) : null;
        })
        .filter((f): f is DisplayFragrance => f !== null)
        .slice(0, 4);
      setRecentProducts(items);
    } catch {
      // localStorage unavailable
    }
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Recently Viewed ({recentProducts.length})
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#4f4a52]">
            Continue Exploring
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[#7b7480]">
            Pick up where you left off.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {recentProducts.map((fragrance) => (
            <ProductCard key={fragrance.title} {...fragrance} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/recently-viewed"
            className="inline-flex rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white"
          >
            View Full History
          </Link>
        </div>
      </div>
    </section>
  );
}
