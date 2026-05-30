"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";

import { useFavorites } from "../context/FavoritesContext";
import { fragrances } from "../data/fragrances";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  const favoriteProducts = fragrances.filter((fragrance) =>
    favorites.some((item) => item.title === fragrance.title)
  );

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1a1a1a]">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="px-6 pb-14 pt-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Your Collection
          </p>

          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">
            Saved
            <span className="block text-[#b67d73]">Favorites</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            Your saved Maison Skye & Rose fragrances, ready whenever inspiration strikes.
          </p>
        </div>
      </section>

      {/* FAVORITES GRID */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          {favoriteProducts.length === 0 ? (
            <div className="rounded-[40px] bg-white p-14 text-center shadow-sm">
              <h2 className="text-3xl font-black uppercase">No Favorites Yet</h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-600">
                Start saving fragrances you love by tapping the heart icon on products.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {favoriteProducts.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  title={fragrance.title}
                  subtitle={fragrance.subtitle}
                  mood={fragrance.mood}
                  profile={fragrance.profile}
                  season={fragrance.season}
                  notes={fragrance.notes}
                  prices={fragrance.prices}
                  images={fragrance.images}
                  bestSeller={fragrance.bestSeller}
                  newArrival={fragrance.newArrival}
                  onQuickAdd={() => setSelectedFragrance(fragrance)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QUICK ADD MODAL PORTAL */}
      {selectedFragrance && (
        <QuickAddModal
          open={true}
          onClose={() => setSelectedFragrance(null)}
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