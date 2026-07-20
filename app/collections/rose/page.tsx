"use client";

import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import QuickAddModal from "../../components/QuickAddModal";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import SearchBar from "../../components/SearchBar";
import Footer from "../../components/Footer";
import { mkcCatalogue } from "../../lib/mkc/catalogue";
import { toDisplayFragrance } from "../../lib/mkc/displayAdapter";
import { ROSE_INTELLIGENCE } from "../../lib/mkc/collectionIntelligence";
import { CollectionCharacter } from "../../components/knowledge/CollectionCharacter";
import IntelligenceSection from "../../components/IntelligenceSection";

export default function RoseCollectionPage() {
  const [search, setSearch] = useState("");
  const [selectedFragrance, setSelectedFragrance] = useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const products = useMemo(() => {
    const term = search.toLowerCase();
    return mkcCatalogue
      .filter((k) => {
        if (k.collection !== "Rose") return false;
        if (!term) return true;
        return (
          k.name.toLowerCase().includes(term) ||
          (k.subtitle ?? "").toLowerCase().includes(term) ||
          [...k.notes.top, ...k.notes.heart, ...k.notes.base].some((n) =>
            n.toLowerCase().includes(term)
          )
        );
      })
      .sort((a, b) => {
        if (a.bestSeller && !b.bestSeller) return -1;
        if (!a.bestSeller && b.bestSeller) return 1;
        return b.popularity - a.popularity;
      })
      .map(toDisplayFragrance);
  }, [search]);

  return (
    <>
      <main className="fade-up min-h-screen bg-[#f5f1eb]">
        <Navbar />

        <section className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            For Her
          </p>

          <h1 className="mt-6 text-7xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
            Rose
            <br />
            Collection
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-zinc-600">
            Timeless feminine luxury fragrances inspired by grace,
            romance, beauty and soft sophistication.
          </p>

          <CollectionCharacter
            families={ROSE_INTELLIGENCE.topFamilies}
            occasions={ROSE_INTELLIGENCE.topOccasions}
            seasons={ROSE_INTELLIGENCE.topSeasons}
          />

          <div className="mt-12">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name, note (e.g. vanilla, citrus)..."
            />
            <p className="mt-4 text-sm text-zinc-500">
              {products.length} fragrances available
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.length > 0 ? (
              products.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  {...fragrance}
                  onQuickAdd={() => {
                    setSelectedFragrance(fragrance);
                    setQuickOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-zinc-500">
                <p>No fragrances found matching &ldquo;{search}&rdquo;.</p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-[#d89ca4] underline font-bold uppercase tracking-widest"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        <IntelligenceSection
          personalisedLabel="Selected For You"
          personalisedHeading="Selected For Your Fragrance Profile"
          personalisedBody="From across the Maison Skye & Rose collection, selected to complement the timeless, graceful world of Rose."
          discoveryLabel="Continue Your Journey"
          discoveryHeading="Explore Further"
          discoveryBody="A curated selection from across the full Maison Skye & Rose collection to continue your discovery."
          source="collection-rose-recommendation"
          className="bg-white"
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

        <Footer />
      </main>

      <FloatingWhatsApp />
    </>
  );
}
