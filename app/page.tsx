// app/page.tsx
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

import { fragrances } from "./data/fragrances";

export default function HomePage() {
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);
  // Added combined filter state (All, Skye, Rose, Best Sellers, New Arrivals)
  const [currentFilter, setCurrentFilter] = useState("All");

  // Advanced filtration logic for handling the collection and flag attributes
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
      <Navbar />

      <AIHeroSection />

      {/* Added Best Sellers directly under Hero */}
      <BestSellers onQuickAdd={(fragrance) => setSelectedFragrance(fragrance)} />

      {/* Updated Stats Section */}
      <section className="bg-black py-6 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-10 px-6 text-center lg:justify-between">
          <div>
            <h3 className="text-4xl font-black">465+</h3>
            <p className="text-xs uppercase tracking-[0.3em]">
              Available On Request
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-black">90+</h3>
            <p className="text-xs uppercase tracking-[0.3em]">
              Featured Fragrances
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-black">R60</h3>
            <p className="text-xs uppercase tracking-[0.3em]">
              Starting Price
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-black">SA</h3>
            <p className="text-xs uppercase tracking-[0.3em]">
              Nationwide Delivery
            </p>
          </div>
        </div>
      </section>

      {/* Main Fragrances List Section with Filter Bars */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
            Signature Collection
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#4f4a52]">
            Inspired Scent Journeys
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[#7b7480] leading-8">
            Discover luxury-inspired fragrances crafted to complement your
            lifestyle, personality and signature presence.
          </p>
        </div>

        {/* Improved Dynamic Filter Tabs Navigation Bar */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2.5">
          {["All", "Skye", "Rose", "Best Sellers", "New Arrivals"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentFilter(tab)}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                currentFilter === tab
                  ? "bg-[#d89ca4] text-white shadow-md shadow-[#d89ca4]/20"
                  : "bg-white text-[#7b7480] border border-gray-200/60 hover:bg-gray-50 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Limited down to 12 items dynamically post filtering */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {filteredFragrances.slice(0, 12).map((fragrance) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              onQuickAdd={() => setSelectedFragrance(fragrance)}
            />
          ))}
        </div>

        {/* Empty state safeguard if a filter combination yields no results */}
        {filteredFragrances.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No fragrances matching this category found.
          </div>
        )}

        {/* Explore All Button */}
        <a
          href="/shop"
          className="mx-auto mt-12 flex w-fit rounded-full bg-black px-8 py-4 text-white text-sm font-semibold transition hover:bg-neutral-800"
        >
          Explore All Fragrances
        </a>
      </section>

      <LatestAdditions />

      {/* Relocated Request Fragrance higher up */}
      <RequestFragrance />

      <ComingSoon />

      <ShopByPersonality />

      <DiscoverySets />

      {/* Mounted RecentlyViewed directly below DiscoverySets */}
      <RecentlyViewed />

      {selectedFragrance && (
        <QuickAddModal
          open={true}
          onClose={() => setSelectedFragrance(null)}
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}
    </main>
  );
}