"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import MiniCart from "../components/MiniCart";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

import { fragrances } from "../data/fragrances";

export default function ShopPage() {

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFragrances = fragrances.filter((fragrance) => {

    const matchesSearch =
      fragrance.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      fragrance.mood
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      fragrance.profile
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      fragrance.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      fragrance.notes.some((note) =>
        note.toLowerCase().includes(searchTerm.toLowerCase())
      );

    let matchesFilter = true;

    if (activeFilter === "For Him")
      matchesFilter = fragrance.gender === "For Him";

    if (activeFilter === "For Her")
      matchesFilter = fragrance.gender === "For Her";

    if (activeFilter === "Fresh")
      matchesFilter = fragrance.category.includes("Fresh");

    if (activeFilter === "Sweet")
      matchesFilter = fragrance.category.includes("Sweet");

    if (activeFilter === "Luxury")
      matchesFilter = fragrance.category.includes("Luxury");

    if (activeFilter === "Date Night")
      matchesFilter = fragrance.collection === "Date Night";

    if (activeFilter === "Summer")
      matchesFilter = fragrance.season.includes("Summer");

    if (activeFilter === "Winter")
      matchesFilter = fragrance.season.includes("Winter");

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#1a1a1a]">

      {/* NAVBAR */}
      <Navbar />

      {/* MINI CART */}
      <MiniCart />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-14 pt-20">

        {/* BACKGROUND BLOBS */}
        <div className="absolute left-[-120px] top-[60px] h-[240px] w-[240px] rounded-full bg-[#dfe7ef]/60 blur-[120px]" />

        <div className="absolute right-[-100px] top-[120px] h-[220px] w-[220px] rounded-full bg-[#f2deda]/70 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Maison Skye & Rose
          </p>

          <h1 className="text-5xl font-black uppercase tracking-[-0.05em] md:text-7xl">
            Shop
            <span className="block text-[#7a8fa3]">
              All Fragrances
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            Discover luxury-inspired fragrances curated for confidence,
            lifestyle, travel, nightlife, elegance, and everyday energy.
          </p>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="px-6 pb-28">

        <div className="mx-auto max-w-7xl">

          {/* SEARCH */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* FILTERS */}
          <FilterBar
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {/* RESULTS */}
          <div className="mb-10 flex items-center justify-between">

            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
              {filteredFragrances.length} Fragrances Found
            </p>

          </div>

          {/* PRODUCT GRID */}
          <div className="grid gap-6 md:grid-cols-3">

            {filteredFragrances.map((fragrance) => (

              <ProductCard
                key={fragrance.id}
                title={fragrance.title}
                subtitle={fragrance.description}
                mood={fragrance.mood}
                profile={fragrance.profile}
                season={fragrance.season}
                notes={fragrance.notes}
                prices={fragrance.prices}
                images={fragrance.images}
              />

            ))}

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <Footer />

    </main>
  );
}