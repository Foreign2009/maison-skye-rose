"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

export default function RecentlyViewedPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");

    if (stored) {
      setItems(JSON.parse(stored));
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
            {items.length} Fragrance{items.length !== 1 ? "s" : ""} Viewed
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 rounded-3xl bg-white p-5 text-center shadow-sm">
            <p className="font-semibold text-[#b67d73]">
              465+ Signature Fragrances Available
            </p>
          </div>

          {items.length === 0 ? (
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
              {items.map((item) => (
                <ProductCard
                  key={item.title}
                  {...item}
                  onQuickAdd={() =>
                    (window.location.href =
                      `/product/${item.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`)
                  }
                />
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}