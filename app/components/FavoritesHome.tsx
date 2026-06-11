"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useFavorites } from "../context/FavoritesContext";
import { fragrances } from "../data/fragrances";

export default function FavoritesHome() {
  const { favorites } = useFavorites();

  const favoriteProducts = fragrances
    .filter((fragrance) =>
      favorites.some((item) => item.title === fragrance.title)
    )
    .slice(0, 4);

  if (favoriteProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Favorites ({favoriteProducts.length})
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#4f4a52]">
            Your Saved Fragrances
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[#7b7480]">
            Revisit the fragrances you've saved for later.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {favoriteProducts.map((fragrance) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/favorites"
            className="inline-flex rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white"
          >
            View All Favorites
          </Link>
        </div>
      </div>
    </section>
  );
}