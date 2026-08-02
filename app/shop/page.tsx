"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

import Navbar from "../components/Navbar";
import QuickAddModal from "../components/QuickAddModal";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { parseIntent, type IntentSignals } from "../lib/intentParser";
import type { DisplayFragrance } from "../lib/knowledgeAdapter";
import { catalogueMaps } from "../lib/discovery";
import { recommendFragrances } from "../lib/recommendFragrances";
import { generateReasons } from "../lib/explainability";
import { trackDiscovery, trackFilter, trackSort, trackConfidence } from "../lib/analytics";
import type { AnalyticsSource } from "../lib/analytics";
import FragranceQuickView from "../components/FragranceQuickView";
import IntelligenceSection from "../components/IntelligenceSection";
import type { FragranceKnowledge } from "../lib/mkc/types";


const GENDER_LABELS: Record<NonNullable<IntentSignals["gender"]>, string> = {
  male: "For Him",
  female: "For Her",
  unisex: "Unisex",
};

// ── Dimension filter values ───────────────────────────────────────────────────

const OCCASION_ORDER = [
  "Daily Wear", "Office", "Date Night", "Evening",
  "Summer Days", "Winter Evenings", "Wedding",
] as const;

// Verified at module init: only show occasions that exist in the repository
const CATALOGUE_OCCASIONS: string[] = (() => {
  const seen = new Set<string>();
  for (const k of catalogueMaps.byName.values()) {
    for (const o of k.occasions) seen.add(o);
  }
  return OCCASION_ORDER.filter((o) => seen.has(o));
})();

const CATALOGUE_SEASONS = ["Spring", "Summer", "Autumn", "Winter"] as const;

const SCENT_CHARACTERS = [
  "Fresh & Light",
  "Balanced Signature",
  "Rich & Long Wearing",
  "Deep & Intense",
] as const;

// Fragrance families — frequency-ordered; only values that exist in the catalogue
const CATALOGUE_FAMILIES: string[] = (() => {
  const freq = new Map<string, number>();
  for (const k of catalogueMaps.byName.values()) {
    for (const f of k.family) freq.set(f, (freq.get(f) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([f]) => f);
})();

// Vibe values — frequency-ordered; only values that exist in the catalogue
const CATALOGUE_VIBES: string[] = (() => {
  const freq = new Map<string, number>();
  for (const k of catalogueMaps.byName.values()) {
    for (const v of k.vibe) freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v);
})();

// Projection values — logical intensity order; only values that exist in the catalogue
const PROJECTION_ORDER = ["soft", "moderate", "strong"] as const;
const CATALOGUE_PROJECTIONS: string[] = (() => {
  const seen = new Set<string>();
  for (const k of catalogueMaps.byName.values()) seen.add(k.projection);
  return PROJECTION_ORDER.filter((p) => seen.has(p));
})();

function chipCls(active: boolean) {
  return active
    ? "shrink-0 rounded-full bg-[#d89ca4] px-2.5 py-1 text-[11px] font-semibold text-white border border-[#d89ca4] transition-all"
    : "shrink-0 rounded-full bg-[#f5f1eb] px-2.5 py-1 text-[11px] font-semibold text-[#7b7480] border border-transparent hover:border-[#d89ca4] hover:text-[#d89ca4] transition-all";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFragrance, setSelectedFragrance] = useState<DisplayFragrance | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<FragranceKnowledge | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedOccasion,   setSelectedOccasion]   = useState<string | null>(null);
  const [selectedSeason,     setSelectedSeason]     = useState<string | null>(null);
  const [selectedCharacter,  setSelectedCharacter]  = useState<string | null>(null);
  const [selectedFamily,     setSelectedFamily]     = useState<string | null>(null);
  const [selectedVibe,       setSelectedVibe]       = useState<string | null>(null);
  const [selectedProjection, setSelectedProjection] = useState<string | null>(null);

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
      return catalogueMaps.display.filter((item) => matchesTab(item));
    }

    // Mode 1 — Intent mode: recommendation-ranked results, intersected with active tab
    if (detectedSignals) {
      const results = recommendFragrances(catalogueMaps.adapted, detectedSignals);
      const seen = new Set<string>();
      const ranked: DisplayFragrance[] = [];
      for (const f of [results.bestMatch, ...results.similarMatches, results.luxuryUpgrade, results.hiddenGem]) {
        if (!f || seen.has(f.name)) continue;
        const display = catalogueMaps.displayByName.get(f.name);
        if (!display) continue;
        if (!matchesTab(display)) continue;
        seen.add(f.name);
        ranked.push(display);
      }
      return ranked;
    }

    // Mode 2 — Keyword fallback: existing substring search, filtered by active tab
    return catalogueMaps.display.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm) ||
        item.subtitle?.toLowerCase().includes(searchTerm) ||
        item.mood?.toLowerCase().includes(searchTerm) ||
        item.profile?.toLowerCase().includes(searchTerm) ||
        item.notes?.some((note: string) => note.toLowerCase().includes(searchTerm));
      return matchesSearch && matchesTab(item);
    });
  }, [debouncedSearch, currentFilter, detectedSignals]);

  // 2a. Dimension predicates — applied after search/tab, before sort
  const dimensionFiltered = useMemo((): DisplayFragrance[] => {
    if (!selectedOccasion && !selectedSeason && !selectedCharacter && !selectedFamily && !selectedVibe && !selectedProjection) return filtered;
    return filtered.filter((item) => {
      const k = catalogueMaps.byName.get(item.title);
      if (!k) return true;
      if (selectedOccasion   && !k.occasions.includes(selectedOccasion))  return false;
      if (selectedSeason     && !k.seasons.includes(selectedSeason))      return false;
      if (selectedCharacter  && k.scentCharacter !== selectedCharacter)   return false;
      if (selectedFamily     && !k.family.includes(selectedFamily))       return false;
      if (selectedVibe       && !k.vibe.includes(selectedVibe))           return false;
      if (selectedProjection && k.projection !== selectedProjection)      return false;
      return true;
    });
  }, [filtered, selectedOccasion, selectedSeason, selectedCharacter, selectedFamily, selectedVibe, selectedProjection]);

  // 2b. Sorting & Extra Filtering Logic — memoized; only recomputes when filtered list or sort changes
  const displayItems = useMemo(() => {
    let items = [...dimensionFiltered];

    if (sortBy === "Price Low → High") {
      items.sort((a, b) => a.prices["5ml"] - b.prices["5ml"]);
    }
    if (sortBy === "Price High → Low") {
      items.sort((a, b) => b.prices["5ml"] - a.prices["5ml"]);
    }
    return items;
  }, [dimensionFiltered, sortBy]);

  // Confidence label for the first recommendation card in Mode 1 with default sort.
  // Suppressed for Mode 0, Mode 2, non-default sort orders, and "partial" matchStrength.
  const firstCardStrength = useMemo((): "Perfect Match" | "Great Match" | null => {
    if (!detectedSignals || sortBy !== "Featured" || displayItems.length === 0) return null;
    const first = displayItems[0];
    const adapted = catalogueMaps.adaptedByName.get(first.title);
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

  const hasDimensionFilters = selectedOccasion !== null || selectedSeason !== null || selectedCharacter !== null || selectedFamily !== null || selectedVibe !== null || selectedProjection !== null;

  function clearDimensionFilters() {
    setSelectedOccasion(null);
    setSelectedSeason(null);
    setSelectedCharacter(null);
    setSelectedFamily(null);
    setSelectedVibe(null);
    setSelectedProjection(null);
  }

  const isMainMobileTab = (tab: string) => ["All", "Skye", "Rose", "Elite"].includes(tab);

  const analyticsSource: AnalyticsSource =
    currentMode === 0
      ? "shop-mode-0"
      : currentMode === 1
        ? "shop-mode-1"
        : "shop-mode-2";

  const handleLearnMore = useCallback((title: string) => {
    const knowledge = catalogueMaps.byName.get(title);
    if (!knowledge) return;
    setSelectedKnowledge(knowledge);
    setQuickViewOpen(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      {/* SECTION 1: Top Hero & Search Bar Layout */}
      <section className="px-4 md:px-6 pt-24 md:pt-40">
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
            Filters {(sortBy !== "Featured" || ["Best Sellers", "New Arrivals"].includes(currentFilter) || hasDimensionFilters) && "•"} ▼
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
          </select>
        </div>
      </div>

      <div className="h-[56px] md:hidden" />

      {/* DIMENSION FILTER ROW — additive predicates: Occasion · Season · Character */}
      <div className="px-4 md:px-6 md:mt-2">
        <div className="mx-auto max-w-7xl space-y-2 py-3">

          {/* Occasion */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 w-[64px]">Occasion</span>
            {CATALOGUE_OCCASIONS.map((occ) => (
              <button
                key={occ}
                onClick={() => {
                  const next = selectedOccasion === occ ? null : occ;
                  setSelectedOccasion(next);
                  trackFilter({ filter: next ?? "clear-occasion", mode: currentMode, resultCount: displayItems.length });
                }}
                className={chipCls(selectedOccasion === occ)}
              >
                {occ}
              </button>
            ))}
          </div>

          {/* Season */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 w-[64px]">Season</span>
            {CATALOGUE_SEASONS.map((sea) => (
              <button
                key={sea}
                onClick={() => {
                  const next = selectedSeason === sea ? null : sea;
                  setSelectedSeason(next);
                  trackFilter({ filter: next ?? "clear-season", mode: currentMode, resultCount: displayItems.length });
                }}
                className={chipCls(selectedSeason === sea)}
              >
                {sea}
              </button>
            ))}
          </div>

          {/* Scent Character */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 w-[64px]">Character</span>
            {SCENT_CHARACTERS.map((char) => (
              <button
                key={char}
                onClick={() => {
                  const next = selectedCharacter === char ? null : char;
                  setSelectedCharacter(next);
                  trackFilter({ filter: next ?? "clear-character", mode: currentMode, resultCount: displayItems.length });
                }}
                className={chipCls(selectedCharacter === char)}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Family */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 w-[64px]">Family</span>
            {CATALOGUE_FAMILIES.map((fam) => (
              <button
                key={fam}
                onClick={() => {
                  const next = selectedFamily === fam ? null : fam;
                  setSelectedFamily(next);
                  trackFilter({ filter: next ?? "clear-family", mode: currentMode, resultCount: displayItems.length });
                }}
                className={chipCls(selectedFamily === fam)}
              >
                {fam}
              </button>
            ))}
          </div>

          {/* Vibe */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 w-[64px]">Vibe</span>
            {CATALOGUE_VIBES.map((vibe) => (
              <button
                key={vibe}
                onClick={() => {
                  const next = selectedVibe === vibe ? null : vibe;
                  setSelectedVibe(next);
                  trackFilter({ filter: next ?? "clear-vibe", mode: currentMode, resultCount: displayItems.length });
                }}
                className={chipCls(selectedVibe === vibe)}
              >
                {vibe}
              </button>
            ))}
          </div>

          {/* Projection */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 w-[64px]">Projection</span>
            {CATALOGUE_PROJECTIONS.map((proj) => (
              <button
                key={proj}
                onClick={() => {
                  const next = selectedProjection === proj ? null : proj;
                  setSelectedProjection(next);
                  trackFilter({ filter: next ?? "clear-projection", mode: currentMode, resultCount: displayItems.length });
                }}
                className={chipCls(selectedProjection === proj)}
              >
                {capitalize(proj)}
              </button>
            ))}
          </div>

          {/* Clear Filters — only shown when at least one dimension filter is active */}
          {hasDimensionFilters && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="w-[64px]" />
              <button
                onClick={clearDimensionFilters}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d89ca4] hover:underline"
              >
                Clear Filters ×
              </button>
            </div>
          )}

        </div>
      </div>

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
                  clearDimensionFilters();
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
                      <ProductCard {...fragrance} onQuickAdd={() => { setSelectedFragrance(fragrance); setQuickOpen(true); }} onLearnMore={() => handleLearnMore(fragrance.title)} source={analyticsSource} rank={index} />
                    </div>
                  );
                }
                return (
                  <ProductCard key={fragrance.title} {...fragrance} onQuickAdd={() => { setSelectedFragrance(fragrance); setQuickOpen(true); }} onLearnMore={() => handleLearnMore(fragrance.title)} source={analyticsSource} rank={index} />
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
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Occasion</label>
              <div className="flex flex-wrap gap-2">
                {CATALOGUE_OCCASIONS.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(selectedOccasion === occ ? null : occ)}
                    className={chipCls(selectedOccasion === occ)}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-zinc-100">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Season</label>
              <div className="flex flex-wrap gap-2">
                {CATALOGUE_SEASONS.map((sea) => (
                  <button
                    key={sea}
                    onClick={() => setSelectedSeason(selectedSeason === sea ? null : sea)}
                    className={chipCls(selectedSeason === sea)}
                  >
                    {sea}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-zinc-100">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Scent Character</label>
              <div className="flex flex-wrap gap-2">
                {SCENT_CHARACTERS.map((char) => (
                  <button
                    key={char}
                    onClick={() => setSelectedCharacter(selectedCharacter === char ? null : char)}
                    className={chipCls(selectedCharacter === char)}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-zinc-100">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Fragrance Family</label>
              <div className="flex flex-wrap gap-2">
                {CATALOGUE_FAMILIES.map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamily(selectedFamily === fam ? null : fam)}
                    className={chipCls(selectedFamily === fam)}
                  >
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-zinc-100">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Vibe</label>
              <div className="flex flex-wrap gap-2">
                {CATALOGUE_VIBES.map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
                    className={chipCls(selectedVibe === vibe)}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-zinc-100">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Projection</label>
              <div className="flex flex-wrap gap-2">
                {CATALOGUE_PROJECTIONS.map((proj) => (
                  <button
                    key={proj}
                    onClick={() => setSelectedProjection(selectedProjection === proj ? null : proj)}
                    className={chipCls(selectedProjection === proj)}
                  >
                    {capitalize(proj)}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 border-t border-zinc-100">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Sort By</label>
              <div className="flex flex-col gap-1.5">
                {["Featured", "Price Low → High", "Price High → Low"].map((option) => (
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

      <FragranceQuickView
        knowledge={selectedKnowledge}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />

      <IntelligenceSection
        experience="shop"
        personalisedLabel="Selected For You"
        personalisedHeading="Chosen For Your Taste"
        personalisedBody="Selected from across the Maison Skye & Rose collection based on your fragrance journey."
        discoveryLabel="You Might Also Like"
        discoveryHeading="Worth Discovering"
        discoveryBody="A curated selection from the Maison Skye & Rose collection to inspire your next fragrance choice."
        source="shop-recommendation"
      />

      <Footer />
    </main>
  );
}