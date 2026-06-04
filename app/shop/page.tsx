"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";
import Footer from "../components/Footer";
import { fragrances } from "../data/fragrances";
import { brand } from "../data/brand";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [currentFilter, setCurrentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  // 1. Filtering Logic
  let filtered = fragrances.filter((item: any) => {
    const searchTerm = search.toLowerCase();
    
    // Improved search: checks title, subtitle, and notes
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm) ||
      item.subtitle?.toLowerCase().includes(searchTerm) ||
      item.notes?.some((note: string) => note.toLowerCase().includes(searchTerm));

    const matchesFilter =
      currentFilter === "All" ? true :
      currentFilter === "Skye" || currentFilter === "Rose" || currentFilter === "Elite" ? item.collection === currentFilter :
      currentFilter === "Best Sellers" ? item.bestSeller :
      currentFilter === "New Arrivals" ? item.newArrival :
      true;

    return matchesSearch && matchesFilter;
  });

  // 2. Sorting Logic
  if (sortBy === "Price Low → High") {
    filtered.sort((a, b) => a.prices["5ml"] - b.prices["5ml"]);
  }
  if (sortBy === "Price High → Low") {
    filtered.sort((a, b) => b.prices["5ml"] - a.prices["5ml"]);
  }
  if (sortBy === "Best Sellers") filtered = filtered.filter((f) => f.bestSeller);
  if (sortBy === "New Arrivals") filtered = filtered.filter((f) => f.newArrival);

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">
            {brand.name}
          </p>
          <h1 className="mt-4 text-6xl font-black tracking-[-0.05em] text-[#4f4a52]">
            Shop All
          </h1>
        </div>

        {/* Search, Filter & Sort Bar */}
        <div className="mt-12 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search by name, note (e.g. oud, vanilla, rose)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm outline-none transition focus:border-[#d89ca4]"
          />

          <div className="flex flex-wrap gap-2 items-center">
            {["All", "Skye", "Rose", "Elite", "Best Sellers", "New Arrivals"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentFilter(tab)}
                className={`rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
                  currentFilter === tab ? "bg-[#d89ca4] text-white shadow-md" : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {tab}
              </button>
            ))}
            
            <select 
              className="ml-auto rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wider outline-none"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Featured</option>
              <option>Price Low → High</option>
              <option>Price High → Low</option>
              <option>Best Sellers</option>
              <option>New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Results & Empty State */}
        <div className="mt-12">
          <p className="mb-8 text-sm text-zinc-500 uppercase tracking-widest">
            Showing {filtered.length} fragrances
          </p>

          {filtered.length === 0 ? (
            <div className="py-20 text-center border-t border-zinc-200">
              <h3 className="text-3xl font-black text-[#4f4a52]">Your fragrance journey starts here.</h3>
              <p className="mt-4 text-zinc-500">No matches found for "{search}".</p>
              <button onClick={() => {setSearch(""); setCurrentFilter("All")}} className="mt-8 text-[#d89ca4] underline font-bold uppercase tracking-widest">
                Explore our collection →
              </button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {filtered.map((fragrance) => (
                <ProductCard key={fragrance.title} {...fragrance} onQuickAdd={() => setSelectedFragrance(fragrance)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {selectedFragrance && (
        <QuickAddModal open={true} onClose={() => setSelectedFragrance(null)} {...selectedFragrance} />
      )}
    </main>
  );
}