"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import QuickAddModal from "../../components/QuickAddModal";
import SearchBar from "../../components/SearchBar";
import Footer from "../../components/Footer";
import { fragrances } from "../../data/fragrances";

export default function SkyeCollectionPage() {
  const [search, setSearch] = useState("");
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  // Advanced search logic consistent with your Shop page
  const products = fragrances.filter((item) => {
    if (item.collection !== "Skye") return false;

    const searchTerm = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm) ||
      item.subtitle?.toLowerCase().includes(searchTerm) ||
      item.notes?.some((note: string) => note.toLowerCase().includes(searchTerm));

    return matchesSearch;
  });

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
              placeholder="Search by name, note (e.g. oud, wood, citrus)..."
            />
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.length > 0 ? (
              products.map((fragrance) => (
                <ProductCard
                  key={fragrance.title}
                  {...fragrance}
                  onQuickAdd={() => setSelectedFragrance(fragrance)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-zinc-500">
                <p>No fragrances found matching "{search}".</p>
                <button 
                  onClick={() => setSearch("")} 
                  className="mt-4 text-[#7a8fa3] underline font-bold uppercase tracking-widest"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        <Footer />

        {selectedFragrance && (
          <QuickAddModal
            open={true}
            onClose={() => setSelectedFragrance(null)}
            {...selectedFragrance}
          />
        )}
      </main>

      <FloatingWhatsApp />
    </>
  );
}