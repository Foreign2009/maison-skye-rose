"use client";

import { useState, useMemo, useEffect } from "react";

import Navbar from "../components/Navbar";
import QuickAddModal from "../components/QuickAddModal";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { fragrances } from "../data/fragrances";
import { parseIntent, type IntentSignals } from "../lib/intentParser";
import { adaptCatalogue, DisplayFragrance } from "../lib/knowledgeAdapter";
import { recommendFragrances } from "../lib/recommendFragrances";
import { generateReasons } from "../lib/explainability";
import { trackDiscovery, trackFilter, trackSort, trackConfidence } from "../lib/analytics";
import type { AnalyticsSource } from "../lib/analytics";

const adaptedCatalogue = adaptCatalogue(fragrances as DisplayFragrance[]);
const displayByTitle = new Map<string, DisplayFragrance>(
  (fragrances as DisplayFragrance[]).map((f) => [f.title, f])
);
const adaptedByTitle = new Map(adaptedCatalogue.map((f) => [f.name, f]));

const GENDER_LABELS: Record<NonNullable<IntentSignals["gender"]>, string> = {
  male: "For Him",
  female: "For Her",
  unisex: "Unisex",
};

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Debounce search input — clears immediately, delays non-empty terms by 300ms
  useEffect(() => {
    if (!search) {
      setDebouncedSearch("");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Detect intent signals from the debounced search term.
  // Returns null in Mode 0 (empty query) and Mode 2 (no signals found).
  // Non-null value is the reliable Mode 1 indicator for the UI.
  const detectedSignals = useMemo((): IntentSignals | null => {
    if (!debouncedSearch.trim()) return null;
    const signals = parseIntent(debouncedSearch.toLowerCase());
    // parseIntent always assigns family/vibe/occasion (even as undefined), so
    // Object.keys is never empty for a non-empty query. Check for defined values instead.
    return Object.values(signals).some((v) => v !== undefined) ? signals : null;
  }, [debouncedSearch]);

  const currentMode = useMemo((): 0 | 1 | 2 => {
    if (!debouncedSearch.trim()) return 0;
    return detectedSignals !== null ? 1 : 2;
  }, [debouncedSearch, detectedSignals]);

  // 1. Filtering Logic — three-mode orchestration (Mode 0: empty, Mode 1: intent, Mode 2: keyword)
  const filtered = useMemo(() => {
    const searchTerm = debouncedSearch.toLowerCase();

    // Shared tab predicate — applied identically in all three branches
    const matchesTab = (item: DisplayFragrance): boolean => {
      if (currentFilter === "All") return true;
      if (currentFilter === "Skye" || currentFilter === "Rose" || currentFilter === "Elite")
        return item.collection === currentFilter;
      if (currentFilter === "Best Sellers") return item.bestSeller;
      if (currentFilter === "New Arrivals") return item.newArrival;
      return true;
    };

    // Mode 0 — Empty query: full catalogue in catalogue order, filtered by active tab
    if (!searchTerm) {
      return fragrances.filter((item: any) => matchesTab(item as DisplayFragrance));
    }

    // Mode 1 — Intent mode: recommendation-ranked results, intersected with active tab
    if (detectedSignals) {
      const results = recommendFragrances(adaptedCatalogue, detectedSignals);
      const seen = new Set<string>();
      const ranked: DisplayFragrance[] = [];
      for (const f of [results.bestMatch, ...results.similarMatches, results.luxuryUpgrade, results.hiddenGem]) {
        if (!f || seen.has(f.name)) continue;
        const display = displayByTitle.get(f.name);
        if (!display) continue;
        if (!matchesTab(display)) continue;
        seen.add(f.name);
        ranked.push(display);
      }
      return ranked;
    }

    // Mode 2 — Keyword fallback: existing substring search, filtered by active tab
    return fragrances.filter((item: any) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm) ||
        item.subtitle?.toLowerCase().includes(searchTerm) ||
        item.mood?.toLowerCase().includes(searchTerm) ||
        item.profile?.toLowerCase().includes(searchTerm) ||
        item.notes?.some((note: string) => note.toLowerCase().includes(searchTerm));
      return matchesSearch && matchesTab(item as DisplayFragrance);
    });
  }, [debouncedSearch, currentFilter, detectedSignals]);

  // 2. Sorting & Extra Filtering Logic — memoized; only recomputes when filtered list or sort changes
  const displayItems = useMemo(() => {
    let items = [...filtered];

    if (sortBy === "Price Low → High") {
      items.sort((a, b) => a.prices["5ml"] - b.prices["5ml"]);
    }
    if (sortBy === "Price High → Low") {
      items.sort((a, b) => b.prices["5ml"] - a.prices["5ml"]);
    }
    if (sortBy === "Best Sellers") {
      items = items.filter((f) => f.bestSeller);
    }
    if (sortBy === "New Arrivals") {
      items = items.filter((f) => f.newArrival);
    }

    return items;
  }, [filtered, sortBy]);

  // Confidence label for the first recommendation card in Mode 1 with default sort.
  // Suppressed for Mode 0, Mode 2, non-default sort orders, and "partial" matchStrength.
  const firstCardStrength = useMemo((): "Perfect Match" | "Great Match" | null => {
    if (!detectedSignals || sortBy !== "Featured" || displayItems.length === 0) return null;
    const first = displayItems[0];
    const adapted = adaptedByTitle.get(first.title);
    if (!adapted) return null;
    const { matchStrength } = generateReasons(detectedSignals, adapted);
    if (matchStrength === "strong") return "Perfect Match";
    if (matchStrength === "moderate") return "Great Match";
    return null;
  }, [detectedSignals, sortBy, displayItems]);

  useEffect(() => {
    trackDiscovery({
      mode: currentMode,
      query: currentMode !== 0 ? debouncedSearch : undefined,
      gender: detectedSignals?.gender,
      occasion: detectedSignals?.occasion,
      vibe: detectedSignals?.vibe,
      family: detectedSignals?.family,
      character: detectedSignals?.character,
      resultCount: displayItems.length,
    });
  }, [debouncedSearch, detectedSignals]);

  useEffect(() => {
    if (!firstCardStrength || displayItems.length === 0) return;
    trackConfidence({
      strength: firstCardStrength,
      productTitle: displayItems[0].title,
    });
  }, [firstCardStrength]);

  const isMainMobileTab = (tab: string) => ["All", "Skye", "Rose", "Elite"].includes(tab);

  const analyticsSource: AnalyticsSource =
    currentMode === 0
      ? "shop-mode-0"
      : currentMode === 1
        ? "shop-mode-1"
        : "shop-mode-2";

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
                onClick={() => {
                  setCurrentFilter(tab);
                  trackFilter({ filter: tab, mode: currentMode, resultCount: displayItems.length });
                }}
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
            onChange={(e) => {
              setSortBy(e.target.value);
              trackSort({ sortBy: e.target.value, mode: currentMode });
            }}
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

          {detectedSignals && displayItems.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-zinc-400">
                Curated for you:
              </span>
              {detectedSignals.gender && (
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#d89ca4]">
                  {GENDER_LABELS[detectedSignals.gender]}
                </span>
              )}
              {detectedSignals.occasion && (
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#d89ca4]">
                  {detectedSignals.occasion}
                </span>
              )}
              {detectedSignals.family && (
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#d89ca4]">
                  {detectedSignals.family}
                </span>
              )}
              {detectedSignals.vibe && (
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#d89ca4]">
                  {detectedSignals.vibe}
                </span>
              )}
              {detectedSignals.character && (
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#d89ca4]">
                  {detectedSignals.character}
                </span>
              )}
            </div>
          )}

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
              {displayItems.map((fragrance, index) => {
                if (index === 0 && firstCardStrength) {
                  return (
                    <div key={fragrance.title}>
                      <p className="mb-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#d89ca4]">
                        {firstCardStrength}
                      </p>
                      <ProductCard {...fragrance} onQuickAdd={() => { setSelectedFragrance(fragrance); setQuickOpen(true); }} source={analyticsSource} rank={index} />
                    </div>
                  );
                }
                return (
                  <ProductCard key={fragrance.title} {...fragrance} onQuickAdd={() => { setSelectedFragrance(fragrance); setQuickOpen(true); }} source={analyticsSource} rank={index} />
                );
              })}
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
                      const nextFilter = currentFilter === segment ? "All" : segment;
                      setCurrentFilter(nextFilter);
                      trackFilter({ filter: nextFilter, mode: currentMode, resultCount: displayItems.length });
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
                      trackSort({ sortBy: option, mode: currentMode });
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

      {selectedFragrance && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}

      <Footer />
    </main>
  );
}