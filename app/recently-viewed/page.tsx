"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";


import { fragrances } from "../data/fragrances";

export default function RecentlyViewedPage() {
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  useEffect(() => {
    const viewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    setRecentlyViewed(viewed);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("recentlyViewed");
    setRecentlyViewed([]);
  };

  const recentProducts = fragrances.filter((fragrance) =>
    recentlyViewed.some((item: any) => item.title === fragrance.title)
  );

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1a1a1a]">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="px-6 pb-14 pt-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Your Collection
          </p>

          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em] md:text-7xl">
            Recently
            <span className="block text-[#b67d73]">Viewed</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            Fragrances you recently viewed will appear here for quick access.
          </p>
        </div>
      </section>

      {/* RECENTLY VIEWED GRID */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          {recentProducts.length === 0 ? (
            <div className="rounded-[40px] bg-white p-14 text-center shadow-sm">
              <h2 className="text-3xl font-black uppercase">No Recently Viewed Products</h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-600">
                Browse fragrances and open product cards to build your recently viewed collection.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-right">
                <button
                  onClick={clearHistory}
                  className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-bold transition hover:bg-zinc-100"
                >
                  Clear History
                </button>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {recentProducts.map((fragrance) => (
                  <ProductCard
                    key={fragrance.title}
                    title={fragrance.title}
                    subtitle={fragrance.subtitle}
                    mood={fragrance.mood}
                    profile={fragrance.profile}
                    season={fragrance.season}
                    notes={fragrance.notes}
                    prices={fragrance.prices}
                    images={fragrance.images}
                    bestSeller={fragrance.bestSeller}
                    newArrival={fragrance.newArrival}
                    onQuickAdd={() => setSelectedFragrance(fragrance)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* QUICK ADD MODAL PORTAL */}
      {selectedFragrance && (
        <QuickAddModal
          open={true}
          onClose={() => setSelectedFragrance(null)}
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}

      {/* FOOTER */}
      <Footer />
    </main>
  );
}