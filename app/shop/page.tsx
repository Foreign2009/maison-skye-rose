"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";

import { fragrances } from "../data/fragrances";
import { useFavorites } from "../context/FavoritesContext";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [currentFilter, setCurrentFilter] = useState("All");
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);
  
  // You can now use these in your ProductCard or here as needed
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const filtered = fragrances.filter((item: any) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      currentFilter === "All"
        ? true
        : currentFilter === "Skye" || currentFilter === "Rose"
        ? item.collection === currentFilter
        : currentFilter === "Best Sellers"
        ? item.bestSeller
        : item.newArrival;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Maison Skye & Rose
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-[-0.05em]">
            Shop All
          </h1>

          <p className="mt-6 text-zinc-600">
            Explore our luxury-inspired fragrance collection.
          </p>
        </div>

        {/* Search & Improved Filter Navigation Bar */}
        <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center">
          <input
            type="text"
            placeholder="Search fragrances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm outline-none transition focus:border-zinc-400"
          />

          <div className="flex flex-wrap gap-2">
            {["All", "Skye", "Rose", "Best Sellers", "New Arrivals"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentFilter(tab)}
                className={`rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  currentFilter === tab
                    ? "bg-black text-white shadow-md"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Result Counter Container */}
        <div className="mt-12">
          <p className="mb-8 text-sm text-zinc-500">
            Showing {filtered.length} fragrances
          </p>

          {/* Conditional Rendering for Grid vs Empty State */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-3xl font-black">No Fragrances Found</h3>
              <p className="mt-4 text-zinc-500">Try another search term.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {filtered.map((fragrance) => (
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