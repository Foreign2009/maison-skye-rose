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
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Your Journey
          </p>

          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[-0.05em]">
            Recently
            <span className="block text-[#b67d73]">
              Viewed
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            Continue exploring fragrances you've recently discovered.
          </p>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">

          {items.length === 0 ? (
            <div className="rounded-[40px] bg-white p-14 text-center shadow-sm">
              <h2 className="text-3xl font-black uppercase">
                No Recently Viewed Fragrances
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-600">
                Start exploring fragrances and they'll appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
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
