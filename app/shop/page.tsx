"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { fragrances } from "../data/fragrances";

export default function ShopPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentFilter, setCurrentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 1. Filtering Logic
  const filtered = fragrances.filter((item: any) => {
    const searchTerm = search.toLowerCase();
    
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm) ||
      item.subtitle?.toLowerCase().includes(searchTerm) ||
      item.mood?.toLowerCase().includes(searchTerm) ||
      item.profile?.toLowerCase().includes(searchTerm) ||
      item.notes?.some((note: string) => note.toLowerCase().includes(searchTerm));

    const matchesFilter =
      currentFilter === "All" ? true :
      currentFilter === "Skye" || currentFilter === "Rose" || currentFilter === "Elite" ? item.collection === currentFilter :
      currentFilter === "Best Sellers" ? item.bestSeller :
      currentFilter === "New Arrivals" ? item.newArrival :
      true;

    return matchesSearch && matchesFilter;
  });

  // 2. Sorting & Extra Filtering Logic
  let displayItems = [...filtered];

  if (sortBy === "Price Low → High") {
    displayItems.sort((a, b) => a.prices["5ml"] - b.prices["5ml"]);
  }
  if (sortBy === "Price High → Low") {
    displayItems.sort((a, b) => b.prices["5ml"] - a.prices["5ml"]);
  }
  if (sortBy === "Best Sellers") {
    displayItems = displayItems.filter((f) => f.bestSeller);
  }
  if (sortBy === "New Arrivals") {
    displayItems = displayItems.filter((f) => f.newArrival);
  }

  const isMainMobileTab = (tab: string) => ["All", "Skye", "Rose", "Elite"].includes(tab);

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      {/* SECTION 1: Top Hero & Search Bar Layout */}
      <section className="px-4 md:px-6 pt-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          {/* Hide Shop Hero on Mobile */}
          <div className="hidden md:block text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em] text-[#4f4a52]">
              Shop All
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-sm md:text-base text-[#7b7480]">
              Explore our collection of luxury-inspired fragrances crafted for everyday elegance.
            </p>
          </div>

          {/* Hide Free Sample Banner on Mobile */}
          <div className="hidden md:block mx-auto max-w-3xl text-center">
            <div className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#b67d73] border border-[#efe8e1]">
              🎁 Orders over R400 receive a FREE 5ml Sample
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-4 md:mt-12">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name, note, mood or profile..."
            />
          </div>
        </div>
      </section>

      {/* ISOLATED STICKY BAR: Completely untrapped from section layout bounds */}
      <div className="fixed top-[80px] left-0 right-0 z-[45] bg-[#f5f1eb]/95 backdrop-blur-sm px-4 md:px-6 py-3 border-b border-zinc-200/20 md:relative md:top-0 md:left-auto md:right-auto md:bg-transparent md:backdrop-blur-none md:border-b-0 md:mt-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 md:gap-2 items-center overflow-x-auto no-scrollbar">
            {["All", "Skye", "Rose", "Elite", "Best Sellers", "New Arrivals"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentFilter(tab)}
                className={`${!isMainMobileTab(tab) ? "hidden md:inline-flex" : "inline-flex"} rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  currentFilter === tab ? "bg-[#d89ca4] text-white shadow-md" : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex md:hidden items-center gap-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 active:bg-zinc-50 shrink-0"
          >
            Filters {(sortBy !== "Featured" || ["Best Sellers", "New Arrivals"].includes(currentFilter)) && "•"} ▼
          </button>

          <select 
            value={sortBy}
            className="hidden md:block rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none"
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

      <div className="h-[56px] md:hidden" />

      {/* SECTION 2: Main Product Output Grid */}
      <section className="px-4 md:px-6 pb-14 mt-4 md:mt-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs text-zinc-500 uppercase tracking-wider">
            {displayItems.length} fragrances
          </p>

          {displayItems.length === 0 ? (
            <div className="py-20 text-center border-t border-zinc-200">
              <h3 className="text-3xl font-black text-[#4f4a52]">Your fragrance journey starts here.</h3>
              <p className="mt-4 text-zinc-500">No matches found for "{search}".</p>
              <button 
                onClick={() => {
                  setSearch(""); 
                  setCurrentFilter("All");
                  setSortBy("Featured");
                }} 
                className="mt-8 text-[#d89ca4] underline font-bold uppercase tracking-widest"
              >
                Explore our collection →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
              {displayItems.map((fragrance) => (
                <ProductCard key={fragrance.title} {...fragrance} onQuickAdd={() => router.push(`/product/${fragrance.title.toLowerCase().replace(/\s+/g,"-")}`)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mobile Drawer/Modal Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setIsDrawerOpen(false)}>
          <div className="w-full rounded-t-2xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">Filters & Sorting</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-zinc-400 font-bold p-1 text-sm">✕</button>
            </div>

            <div className="py-4">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Special Segments</label>
              <div className="flex flex-wrap gap-2">
                {["Best Sellers", "New Arrivals"].map((segment) => (
                  <button
                    key={segment}
                    onClick={() => {
                      setCurrentFilter(currentFilter === segment ? "All" : segment);
                      setIsDrawerOpen(false);
                    }}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      currentFilter === segment ? "bg-[#d89ca4] text-white" : "border border-zinc-200 text-zinc-600"
                    }`}
                  >
                    {segment}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-zinc-100">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Sort By</label>
              <div className="flex flex-col gap-1.5">
                {["Featured", "Price Low → High", "Price High → Low", "Best Sellers", "New Arrivals"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsDrawerOpen(false);
                    }}
                    className={`text-left rounded-xl px-4 py-3 text-xs font-semibold ${
                      sortBy === option ? "bg-zinc-100 text-[#d89ca4]" : "text-zinc-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}