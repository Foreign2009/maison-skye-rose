"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

import { fragrances } from "../data/fragrances";
import { useFavorites } from "../context/FavoritesContext";

export default function NewArrivalsPage() {
  
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const products = fragrances.filter((item) => item.newArrival);

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="px-6 pb-14 pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em]">
              New Arrivals
            </h1>
            <p className="mt-6 text-zinc-600 max-w-2xl mx-auto">
              Explore the newest additions to Maison Skye & Rose — modern fragrances inspired by luxury lifestyle.
            </p>
          </div>

          <div className="mt-12">
            <p className="mb-8 text-sm text-zinc-500">
              Showing {products.length} new fragrances
            </p>

            {products.length === 0 ? (
              <div className="py-20 text-center">
                <h3 className="text-3xl font-black">No New Arrivals Yet</h3>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {products.map((fragrance) => (
                  <ProductCard
                    key={fragrance.title}
                    {...fragrance}
                    onQuickAdd={() => window.location.href = `/product/${fragrance.title.toLowerCase().replace(/\s+/g,"-")}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

