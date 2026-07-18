"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";
import IntelligenceSection from "../components/IntelligenceSection";
import { mkcCatalogue } from "../lib/mkc/catalogue";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";

export default function NewArrivalsPage() {
  const [selectedFragrance, setSelectedFragrance] = useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const products = useMemo(
    () =>
      mkcCatalogue
        .filter((k) => k.newArrival)
        .sort((a, b) => b.popularity - a.popularity)
        .map(toDisplayFragrance),
    []
  );

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="px-6 pb-14 pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em]">
              New Arrivals
            </h1>
            <p className="mt-6 text-zinc-600 max-w-2xl mx-auto">
              Explore the newest additions to Maison Skye &amp; Rose — modern fragrances inspired by luxury lifestyle.
            </p>
          </div>

          <div className="mt-12">
            <p className="mb-8 text-sm text-zinc-500">
              Showing {products.length} new fragrances
            </p>

            {products.length === 0 ? (
              <div className="py-20 text-center">
                <h3 className="text-3xl font-black">No New Arrivals Yet</h3>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {products.map((fragrance, i) => (
                  <ProductCard
                    key={fragrance.title}
                    {...fragrance}
                    rank={i + 1}
                    onQuickAdd={() => {
                      setSelectedFragrance(fragrance);
                      setQuickOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <IntelligenceSection
        personalisedLabel="Continue Discovering"
        personalisedHeading="Matched To Your Preferences"
        personalisedBody="Selected from across the full Maison Skye & Rose catalogue to reflect the style and character you have expressed."
        discoveryLabel="Continue Discovering"
        discoveryHeading="Explore the Collection"
        discoveryBody="A curated selection to guide you further into the depth and range of Maison Skye & Rose."
        source="new-arrivals-recommendation"
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
