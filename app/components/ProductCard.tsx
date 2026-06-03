"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

type ProductCardProps = {
  title: string;
  subtitle: string;
  mood: string;
  profile: string;
  season: string;
  notes: string[];
  prices: { "5ml": number; "10ml": number; "30ml": number };
  images: { "5ml": string; "10ml": string; "30ml": string };
  bestSeller?: boolean;
  newArrival?: boolean;
  onQuickAdd?: () => void;
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
  onQuickAdd,
}: ProductCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const favorite = isFavorite(title);

  const saveRecentlyViewed = () => {
    const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = existing.filter((item: any) => item.title !== title);
    localStorage.setItem("recentlyViewed", JSON.stringify([{ title, subtitle, mood, profile, season, notes, prices, images }, ...filtered]));
  };

  const handleCardClick = () => {
    saveRecentlyViewed();
    onQuickAdd?.();
  };

  const handleFavorite = () => {
    if (favorite) {
      removeFromFavorites(title);
      return;
    }
    addToFavorites({
      title,
      subtitle,
      mood,
      profile,
      season: [season],
      notes,
      prices,
      images,
      image: images["10ml"],
      bestSeller: bestSeller ?? false,
      newArrival: newArrival ?? false,
    });
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2">
      {(bestSeller || newArrival) && (
        <div className="absolute right-4 top-4 z-20">
          {bestSeller && <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">Best Seller</span>}
          {!bestSeller && newArrival && <span className="rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white">New</span>}
        </div>
      )}

      <button onClick={handleFavorite} className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
        <Heart size={18} fill={favorite ? "currentColor" : "none"} />
      </button>

      <div onClick={handleCardClick} className="flex cursor-pointer items-center justify-center rounded-[24px] bg-gradient-to-br from-pink-50 to-blue-50 p-6">
        <Image
          src={images["10ml"]}
          alt={title}
          width={260}
          height={260}
          className="h-[260px] w-auto object-contain"
          style={{ width: "auto", height: "auto" }}
          sizes="(max-width: 768px) 100vw, 260px"
          priority
        />
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <h3 className="min-h-[64px] text-2xl font-black text-[#4f4a52]">{title}</h3>
        <p className="mt-2 min-h-[40px] text-sm font-semibold text-[#d89ca4]">{subtitle}</p>
        <p className="mt-4 text-sm leading-7 text-[#7b7480]">{mood}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {notes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#d89ca4]"
            >
              {note}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-sm text-[#7b7480]">{profile} • {season}</p>
        </div>

        <div className="mt-auto pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-[#7b7480]">From</p>
              <p className="text-2xl font-black text-[#4f4a52]">R{prices["5ml"]}</p>
            </div>
            <button
              onClick={handleCardClick}
              className="rounded-full bg-gradient-to-r from-pink-400 to-blue-400 px-6 py-3 text-sm font-bold text-white transition hover:scale-105"
            >
              Quick Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}