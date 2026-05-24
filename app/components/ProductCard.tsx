"use client";

import { useState } from "react";

import ProductModal from "./ProductModal";

import { useFavorites } from "../context/FavoritesContext";

type ProductCardProps = {
  title: string;
  subtitle: string;
  mood: string;
  profile: string;
  season: string[];
  notes: string[];
  prices: {
    "5ml": number;
    "10ml": number;
    "30ml": number;
  };
  images: {
    "5ml": string;
    "10ml": string;
    "30ml": string;
  };
  bestSeller?: boolean;
  newArrival?: boolean;
};

export default function ProductCard({
  title,
  subtitle,
  mood,
  profile,
  season,
  notes,
  prices,
  images,
  bestSeller,
  newArrival,
}: ProductCardProps) {

  const [open, setOpen] =
    useState(false);

  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
  } = useFavorites();

  const isFavorite =
    favorites.some(
      (item) =>
        item.title === title
    );

  const toggleFavorite = () => {

    const product = {
      title,
      subtitle,
      mood,
      profile,
      season,
      notes,
      prices,
      images,
      bestSeller,
      newArrival,
    };

    if (isFavorite) {

      removeFromFavorites(
        title
      );

    } else {

      addToFavorites(product);

    }

  };

  return (
    <>
      {/* CARD */}
      <div className="fade-up group relative overflow-hidden rounded-[36px] bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_30px_90px_rgba(0,0,0,0.14)]">

        {/* SHADOW GLOW */}
        <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-white/20 opacity-0 transition duration-700 group-hover:opacity-100" />

        {/* IMAGE AREA */}
        <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[28px] bg-[#f3efe8]">

          {/* BACKGROUND GLOW */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#dfe7ef]/40 opacity-0 transition duration-700 group-hover:opacity-100" />

          {/* FAVORITE */}
          <button
            onClick={toggleFavorite}
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-lg shadow-xl backdrop-blur-md transition duration-300 hover:scale-110"
          >
            {isFavorite
              ? "❤️"
              : "🤍"}
          </button>

          {/* PRODUCT IMAGE */}
          <img
            src={images["10ml"]}
            alt={title}
            className="object-contain transition duration-700 group-hover:scale-110 group-hover:-translate-y-2"
            style={{
              height: "220px",
              width: "auto",
            }}
          />

          {/* QUICK VIEW */}
          <button
            onClick={() =>
              setOpen(true)
            }
            className="absolute bottom-6 translate-y-8 rounded-full bg-white px-6 py-4 text-xs uppercase tracking-[0.25em] text-black opacity-0 shadow-2xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105"
          >
            Quick View
          </button>

        </div>

        {/* BADGES */}
        <div className="mt-4 flex gap-2">

          {bestSeller && (

            <span className="rounded-full bg-black px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white shadow-lg">
              Best Seller
            </span>

          )}

          {newArrival && (

            <span className="rounded-full bg-[#b67d73] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white shadow-lg">
              New
            </span>

          )}

        </div>

        {/* TITLE */}
        <h3 className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] transition duration-500 group-hover:text-[#7a8fa3]">
          {title}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-5 text-sm leading-8 text-zinc-600">
          {subtitle}
        </p>

        {/* MOOD */}
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
          {mood}
        </p>

        {/* PRICE */}
        <div className="mt-8 flex items-end justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Starting From
            </p>

            <h4 className="mt-2 text-4xl font-black text-[#b67d73] transition duration-300 group-hover:scale-105">
              R{prices["5ml"]}
            </h4>

          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              setOpen(true)
            }
            className="rounded-full bg-black px-6 py-4 text-xs uppercase tracking-[0.25em] text-white shadow-xl transition duration-300 hover:scale-105 hover:bg-[#1a1a1a]"
          >
            View Product
          </button>

        </div>

      </div>

      {/* MODAL */}
      {open && (

        <ProductModal
          title={title}
          subtitle={subtitle}
          mood={mood}
          profile={profile}
          season={season}
          notes={notes}
          prices={prices}
          images={images}
          onClose={() =>
            setOpen(false)
          }
        />

      )}

    </>
  );
}