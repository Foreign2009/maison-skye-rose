"use client";

import { useState } from "react";

import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";


import { fragrances } from "../../data/fragrances";

export default function EliteCollectionPage() {
  

  const products = fragrances.filter(
    (item) => item.collection === "Elite"
  );

  return (
    <main className="fade-up min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.45em] text-[#9b7ce0]">
          Niche Luxury
        </p>

        <h1 className="mt-6 text-7xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
          Elite
          <br />
          Collection
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-9 text-zinc-600">
          Exclusive niche fragrances inspired by the world's
          most sought-after luxury perfume houses.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((fragrance) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              onQuickAdd={() => window.location.href = `/product/${fragrance.title.toLowerCase().replace(/\s+/g,"-")}`}
            />
          ))}
        </div>
      </section>

      {/* QUICK ADD MODAL PORTAL */}
    </main>
  );
}

