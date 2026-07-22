"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";
import IntelligenceSection from "../components/IntelligenceSection";
import CustomerInsightsPanel from "../components/CustomerInsightsPanel";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { DisplayFragrance } from "../lib/knowledgeAdapter";

export default function RecentlyViewedPage() {
  const [products, setProducts] = useState<DisplayFragrance[]>([]);
  const [selectedFragrance, setSelectedFragrance] = useState<DisplayFragrance | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("recentlyViewed") ?? "[]");
      const resolved: DisplayFragrance[] = (Array.isArray(raw) ? raw : [])
        .map((item: unknown) => {
          const title =
            item && typeof item === "object" && "title" in item
              ? String((item as Record<string, unknown>).title)
              : "";
          const knowledge = catalogueMaps.byName.get(title);
          return knowledge ? toDisplayFragrance(knowledge) : null;
        })
        .filter((f): f is DisplayFragrance => f !== null);
      setProducts(resolved);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1a1a1a]">
      <Navbar />

      <section className="px-6 pt-40 pb-14">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#b67d73]">
            Maison Skye & Rose
          </p>

          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[-0.05em]">
            Continue
            <span className="block text-[#b67d73]">
              Your Discovery
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            Revisit fragrances you've explored and continue building your Maison Skye & Rose collection.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold shadow-sm">
            {products.length} Fragrance{products.length !== 1 ? "s" : ""} Viewed
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 rounded-3xl bg-white p-5 text-center shadow-sm">
            <p className="font-semibold text-[#b67d73]">
              Every fragrance you explore refines your Maison recommendations.
            </p>
          </div>

          {/* Customer intelligence — journey stage + learned preferences */}
          <CustomerInsightsPanel />

          {products.length === 0 ? (
            <div className="rounded-[40px] bg-white p-14 text-center shadow-sm">
              <h2 className="text-3xl font-black">
                Your Fragrance Journey Starts Here
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-600">
                Browse our collection and every fragrance you explore will be saved here for easy rediscovery.
              </p>

              <div className="mt-8">
                <a
                  href="/shop"
                  className="inline-flex rounded-2xl bg-[#d89ca4] px-8 py-4 font-bold text-white transition hover:opacity-90"
                >
                  Explore Fragrances
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {products.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  {...fragrance}
                  onQuickAdd={() => { setSelectedFragrance(fragrance); setQuickOpen(true); }}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      <IntelligenceSection
        experience="recently_viewed"
        personalisedLabel="Selected For You"
        personalisedHeading="Based On Your Journey"
        personalisedBody="Selected from across the Maison Skye & Rose collection to continue the exploration you have already begun."
        discoveryLabel="Continue Exploring"
        discoveryHeading="Discover What Awaits"
        discoveryBody="A curated introduction to the Maison Skye & Rose collection — fragrances worth exploring next."
        source="recently-viewed-recommendation"
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
  );
}