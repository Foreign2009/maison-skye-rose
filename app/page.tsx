"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import AIHeroSection from "./components/AIHeroSection";
import BestSellers from "./components/BestSellers";
import LatestAdditions from "./components/LatestAdditions";
import ComingSoon from "./components/ComingSoon";
import RequestFragrance from "./components/RequestFragrance";
import ShopByPersonality from "./components/ShopByPersonality";
import DiscoverySets from "./components/DiscoverySets";
import RecentlyViewed from "./components/RecentlyViewed";
import QuickAddModal from "./components/QuickAddModal";
import Link from "next/link";

import { fragrances } from "./data/fragrances";

export default function HomePage() {
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState("All");

  const filteredFragrances = fragrances.filter((item) => {
    if (currentFilter === "All") return true;
    if (currentFilter === "Skye" || currentFilter === "Rose") {
      return item.collection === currentFilter;
    }
    if (currentFilter === "Best Sellers") return item.bestSeller;
    if (currentFilter === "New Arrivals") return item.newArrival;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#faf7f5]">
      {/* ANNOUNCEMENT BANNER */}
      <div className="bg-black text-white text-[10px] text-center py-2 uppercase tracking-[0.3em] sticky top-0 z-[60]">
        Free Nationwide Delivery on Orders Over R800
      </div>

      <Navbar />
      <AIHeroSection />

      {/* BEST SELLERS SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-12 text-center text-[#4f4a52]">Best Sellers</h2>
        <BestSellers onQuickAdd={(fragrance) => setSelectedFragrance(fragrance)} />
      </section>

      {/* HOMEPAGE CTA SECTION */}
      <section className="bg-[#f5f1eb] py-20 text-center px-6">
        <h3 className="text-3xl font-black mb-6 text-[#4f4a52]">Find Your Signature</h3>
        <Link href="/shop" className="inline-block bg-black text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
          Explore Collection
        </Link>
      </section>

      {/* MAIN FRAGRANCES LIST */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">Signature Collection</p>
          <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#4f4a52]">Inspired Scent Journeys</h2>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-2.5">
          {["All", "Skye", "Rose", "Best Sellers", "New Arrivals"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentFilter(tab)}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                currentFilter === tab
                  ? "bg-[#d89ca4] text-white shadow-md"
                  : "bg-white text-[#7b7480] border border-gray-200/60 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {filteredFragrances.slice(0, 8).map((fragrance) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              onQuickAdd={() => setSelectedFragrance(fragrance)}
            />
          ))}
        </div>
      </section>

      {/* ADDITIONAL SECTIONS ORDER */}
      <DiscoverySets />
      <ShopByPersonality />
      <RequestFragrance />
      <LatestAdditions />
      <RecentlyViewed />
      <ComingSoon />

      {selectedFragrance && (
        <QuickAddModal
          open={true}
          onClose={() => setSelectedFragrance(null)}
          {...selectedFragrance}
        />
      )}
    </main>
  );
}