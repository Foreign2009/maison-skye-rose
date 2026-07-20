"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import QuickAddModal from "../components/QuickAddModal";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import IntelligenceSection from "../components/IntelligenceSection";
import CustomerInsightsPanel from "../components/CustomerInsightsPanel";
import { useFavorites } from "../context/FavoritesContext";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { DisplayFragrance } from "../lib/knowledgeAdapter";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [selectedFragrance, setSelectedFragrance] = useState<DisplayFragrance | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const favoriteProducts = useMemo(
    (): DisplayFragrance[] =>
      favorites
        .map((f) => {
          const knowledge = catalogueMaps.byName.get(f.title);
          return knowledge ? toDisplayFragrance(knowledge) : null;
        })
        .filter((f): f is DisplayFragrance => f !== null),
    [favorites],
  );

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1a1a1a]">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="px-6 pb-14 pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#b67d73]">
              Maison Skye & Rose
            </p>

            <h1 className="text-5xl md:text-6xl font-black uppercase leading-[0.95] tracking-[-0.05em]">
              Your
              <span className="block text-[#b67d73]">
                Collection
              </span>
            </h1>

            <p className="mt-8 mx-auto max-w-2xl text-lg leading-8 text-zinc-600">
              Your saved Maison Skye & Rose fragrances, ready whenever inspiration strikes.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold shadow-sm">
              {favoriteProducts.length} Fragrance{favoriteProducts.length !== 1 ? "s" : ""} Saved
            </div>
          </div>
        </div>
      </section>

      {/* FAVORITES GRID */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          
          {/* Action-Oriented Sub-banner */}
          <div className="mb-8 rounded-3xl bg-white p-5 text-center shadow-sm">
            <p className="font-semibold text-[#b67d73]">
              Save fragrances you love — each save helps personalise your Maison recommendations.
            </p>
          </div>

          {/* Customer intelligence — journey stage + learned preferences */}
          <CustomerInsightsPanel />

          {favoriteProducts.length === 0 ? (
            <div className="rounded-[40px] bg-white p-14 text-center shadow-sm">
              <h2 className="text-3xl font-black">
                Build Your Collection
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-600">
                Save fragrances you love and create your personal Maison Skye & Rose collection.
              </p>
              <div className="mt-8">
                <a
                  href="/shop"
                  className="inline-flex rounded-2xl bg-[#d89ca4] px-8 py-4 font-bold text-white transition hover:opacity-90"
                >
                  Explore Fragrances
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {favoriteProducts.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  {...fragrance}
                  onQuickAdd={() => { setSelectedFragrance(fragrance); setQuickOpen(true); }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <IntelligenceSection
        personalisedLabel="Selected For You"
        personalisedHeading="Chosen For Your Taste"
        personalisedBody="Selected from across the Maison Skye & Rose collection based on the fragrances you have saved and explored."
        discoveryLabel="You Might Also Like"
        discoveryHeading="Start Your Collection"
        discoveryBody="A curated introduction to the depth and range of Maison Skye & Rose — fragrances worth saving."
        source="favorites-recommendation"
      />

      {selectedFragrance && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}

      {/* FOOTER */}
      <Footer />
    </main>
  );
}