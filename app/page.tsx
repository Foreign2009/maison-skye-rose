"use client";

import { useState } from "react";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

import { fragrances } from "./data/fragrances";

export default function HomePage() {
  const [activeFilter, setActiveFilter] =
    useState("All");

  const filteredFragrances =
    fragrances.filter((fragrance) => {
      if (activeFilter === "All") {
        return true;
      }

      if (activeFilter === "Best Sellers") {
        return fragrance.bestSeller;
      }

      if (activeFilter === "New Arrivals") {
        return fragrance.newArrival;
      }

      if (activeFilter === "Skye Collection") {
        return fragrance.collection === "Skye";
      }

      if (activeFilter === "Rose Collection") {
        return fragrance.collection === "Rose";
      }

      return true;
    });

  const filters = [
    "All",
    "Best Sellers",
    "New Arrivals",
    "Skye Collection",
    "Rose Collection",
  ];

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-black">

      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-20">

        <div className="max-w-4xl">

          <p className="text-xs uppercase tracking-[0.45em] text-zinc-500">
            Luxury Inspired Fragrance Lifestyle
          </p>

          <h1 className="mt-6 text-6xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-8xl">
            Maison
            <br />
            Skye & Rose
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-9 text-zinc-600">
            Luxury-inspired fragrances designed for confidence,
            nightlife, travel, fashion, and everyday lifestyle energy.
          </p>

        </div>

      </section>

      <section className="mx-auto mt-10 max-w-7xl px-6">

        <div className="flex flex-wrap gap-4">

          {filters.map((filter) => (

            <button
              key={filter}
              onClick={() =>
                setActiveFilter(filter)
              }
              className={`rounded-full px-7 py-4 text-xs uppercase tracking-[0.3em] transition duration-300 ${
                activeFilter === filter
                  ? "bg-black text-white shadow-xl"
                  : "bg-white hover:bg-black hover:text-white"
              }`}
            >
              {filter}
            </button>

          ))}

        </div>

      </section>

      <section className="mx-auto mt-16 grid max-w-7xl gap-8 px-6 pb-24 md:grid-cols-2 xl:grid-cols-3">

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
            bestSeller={fragrance.bestSeller}
            newArrival={fragrance.newArrival}
          />

        ))}

      </section>

    </main>
  );
}