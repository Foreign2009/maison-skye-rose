"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";
import IntelligenceSection from "../components/IntelligenceSection";
import { mkcCatalogue } from "../lib/mkc/catalogue";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import { applyAdaptiveOrdering } from "../lib/adaptive/adaptiveOrdering";
import { buildRecommendationContext } from "../lib/adaptive/buildRecommendationContext";

export default function BestSellersPage() {
  const [selectedFragrance, setSelectedFragrance] = useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const { profile } = useUnifiedCustomerProfile();

  const products = useMemo(
    () => {
      const sorted = mkcCatalogue
        .filter((k) => k.bestSeller)
        .sort((a, b) => b.popularity - a.popularity);
      return applyAdaptiveOrdering(sorted, profile).map(toDisplayFragrance);
    },
    [profile]
  );

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
            Our community&apos;s absolute favourites. Explore the luxury-inspired fragrances
            that everyone is talking about.
          </p>
        </div>

        <div className="mt-12">
          <p className="mb-8 text-sm text-zinc-500">
            Showing {products.length} best-selling fragrances
          </p>

          {products.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-3xl font-black">No Best Sellers Found</h3>
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
      </section>

      <IntelligenceSection
        personalisedLabel="Selected For You"
        personalisedHeading="Selected For Your Fragrance Profile"
        personalisedBody="Based on the fragrances you have explored, these selections share the character and style you are drawn to."
        discoveryLabel="Discover More Like These"
        discoveryHeading="You May Also Love"
        discoveryBody="A curated selection from across the Maison Skye & Rose collection to complement the best sellers you are exploring."
        context={buildRecommendationContext("best-sellers", profile)}
        source="best-sellers-recommendation"
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
