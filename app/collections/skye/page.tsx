"use client";

import { useState } from "react";

import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import QuickAddModal from "../../components/QuickAddModal";
import SearchBar from "../../components/SearchBar";

import { fragrances } from "../../data/fragrances";

export default function SkyeCollectionPage() {
  const [search, setSearch] = useState("");
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  const products = fragrances.filter(
    (item) =>
      item.collection === "Skye" &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <main className="fade-up min-h-screen bg-[#f5f1eb]">
        <Navbar />

        <section className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs uppercase tracking-[0.45em] text-[#7a8fa3]">
            For Him
          </p>

          <h1 className="mt-6 text-7xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
            Skye
            <br />
            Collection
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-zinc-600">
            Bold masculine luxury fragrances inspired by confidence,
            nightlife, movement and modern elegance.
          </p>

          <div className="mt-12">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search Skye fragrances..."
            />
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((fragrance) => (
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
                bestSeller={fragrance.bestSeller ?? false}
                newArrival={fragrance.newArrival ?? false}
                onQuickAdd={() => setSelectedFragrance(fragrance)}
              />
            ))}
          </div>
        </section>

        {selectedFragrance && (
          <QuickAddModal
            open={true}
            onClose={() => setSelectedFragrance(null)}
            title={selectedFragrance.title}
            images={selectedFragrance.images}
            prices={selectedFragrance.prices}
          />
        )}
      </main>

      <FloatingWhatsApp />
    </>
  );
}