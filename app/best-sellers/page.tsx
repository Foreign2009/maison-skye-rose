"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";
import { fragrances } from "../data/fragrances";
import { useFavorites } from "../context/FavoritesContext";

export default function BestSellersPage() {
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const products = fragrances.filter((item) => item.bestSeller);

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Most Loved
          </p>
          <h1 className="mt-4 text-6xl font-black tracking-[-0.05em]">
            Best Sellers
          </h1>
          <p className="mt-6 text-zinc-600 max-w-xl mx-auto">
            Our community's absolute favorites. Explore the luxury-inspired fragrances that everyone is talking about.
          </p>
        </div>

        <div className="mt-12">
          <p className="mb-8 text-sm text-zinc-500">
            Showing {products.length} top trending fragrances
          </p>

          {products.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-3xl font-black">No Best Sellers Found</h3>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {products.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  {...fragrance}
                  onQuickAdd={() => setSelectedFragrance(fragrance)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

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