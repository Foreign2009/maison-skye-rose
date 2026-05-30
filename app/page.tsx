"use client";

import { useState } from "react";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import AIHeroSection from "./components/AIHeroSection";
import LatestAdditions from "./components/LatestAdditions";
import ComingSoon from "./components/ComingSoon";
import RequestFragrance from "./components/RequestFragrance";
import ShopByPersonality from "./components/ShopByPersonality";
import DiscoverySets from "./components/DiscoverySets";
import QuickAddModal from "./components/QuickAddModal";

import { fragrances } from "./data/fragrances";

export default function HomePage() {
  const [selectedFragrance, setSelectedFragrance] =
    useState<any>(null);

  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <Navbar />

      <AIHeroSection />

      <section className="bg-black py-6 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-10 px-6 text-center">
          <div>
            <h3 className="text-4xl font-black">
              465+
            </h3>
            <p className="text-xs uppercase tracking-[0.3em]">
              Fragrances Available
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-black">
              34
            </h3>
            <p className="text-xs uppercase tracking-[0.3em]">
              New Arrivals
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-black">
              R60
            </h3>
            <p className="text-xs uppercase tracking-[0.3em]">
              Starting Price
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 text-center">
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {fragrances.map((fragrance, index) => (
            <ProductCard
              key={index}
              {...fragrance}
              onQuickAdd={() =>
                setSelectedFragrance(fragrance)
              }
            />
          ))}
        </div>
      </section>

      <LatestAdditions />

      <ComingSoon />

      <RequestFragrance />

      <ShopByPersonality />

      <DiscoverySets />

      {selectedFragrance && (
        <QuickAddModal
          open={true}
          onClose={() =>
            setSelectedFragrance(null)
          }
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}
    </main>
  );
}