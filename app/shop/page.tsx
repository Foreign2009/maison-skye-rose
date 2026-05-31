"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import QuickAddModal from "../components/QuickAddModal";

import { fragrances } from "../data/fragrances";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState("All");
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  const filtered = fragrances.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCollection =
      collection === "All" ? true : item.collection === collection;

    return matchesSearch && matchesCollection;
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

        <div className="mt-12 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Search fragrances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-2xl border border-zinc-200 bg-white px-5 py-4"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setCollection("All")}
              className={`rounded-xl px-4 py-3 transition-colors ${
                collection === "All"
                  ? "bg-black text-white"
                  : "border border-zinc-200 bg-white text-black"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setCollection("Skye")}
              className={`rounded-xl px-4 py-3 transition-colors ${
                collection === "Skye"
                  ? "bg-black text-white"
                  : "border border-zinc-200 bg-white text-black"
              }`}
            >
              Skye
            </button>

            <button
              onClick={() => setCollection("Rose")}
              className={`rounded-xl px-4 py-3 transition-colors ${
                collection === "Rose"
                  ? "bg-black text-white"
                  : "border border-zinc-200 bg-white text-black"
              }`}
            >
              Rose
            </button>
          </div>
        </div>

        {/* Dynamic Result Counter Container */}
        <div className="mt-12">
          <p className="mb-8 text-sm text-zinc-500">
            Showing {filtered.length} fragrances
          </p>

          {/* Product Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {filtered.map((fragrance) => (
              <ProductCard
                key={fragrance.title}
                {...fragrance}
                onQuickAdd={() => setSelectedFragrance(fragrance)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mounted Floating WhatsApp CTA */}
      <FloatingWhatsApp />

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