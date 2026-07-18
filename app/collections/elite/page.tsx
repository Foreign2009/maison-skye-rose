"use client";

import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import QuickAddModal from "../../components/QuickAddModal";
import { mkcCatalogue } from "../../lib/mkc/catalogue";
import { toDisplayFragrance } from "../../lib/mkc/displayAdapter";
import { ELITE_INTELLIGENCE } from "../../lib/mkc/collectionIntelligence";
import { CollectionCharacter } from "../../components/knowledge/CollectionCharacter";
import IntelligenceSection from "../../components/IntelligenceSection";

export default function EliteCollectionPage() {
  const [selectedFragrance, setSelectedFragrance] = useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const products = useMemo(
    () =>
      mkcCatalogue
        .filter((k) => k.collection === "Elite")
        .sort((a, b) => {
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
          return b.popularity - a.popularity;
        })
        .map(toDisplayFragrance),
    []
  );

  return (
    <main className="fade-up min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.45em] text-[#9b7ce0]">
          Niche Luxury
        </p>

        <h1 className="mt-6 text-7xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
          Elite
          <br />
          Collection
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-9 text-zinc-600">
          Exclusive niche fragrances inspired by the world&apos;s
          most sought-after luxury perfume houses.
        </p>

        <CollectionCharacter
          families={ELITE_INTELLIGENCE.topFamilies}
          occasions={ELITE_INTELLIGENCE.topOccasions}
          seasons={ELITE_INTELLIGENCE.topSeasons}
        />

        <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((fragrance) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              onQuickAdd={() => {
                setSelectedFragrance(fragrance);
                setQuickOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      <IntelligenceSection
        personalisedLabel="Continue Your Journey"
        personalisedHeading="Selected For Your Fragrance Profile"
        personalisedBody="From across the Maison Skye & Rose collection, selected to complement the exclusive, niche world of Elite."
        discoveryLabel="Continue Your Journey"
        discoveryHeading="Explore Further"
        discoveryBody="A curated selection from across the full Maison Skye & Rose collection to continue your discovery."
        source="collection-elite-recommendation"
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
    </main>
  );
}
