"use client";

import Image from "next/image";
import Link from "next/link";
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

  const productSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-");

  const saveRecentlyViewed = () => {
    const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = existing.filter((item: any) => item.title !== title);
    localStorage.setItem("recentlyViewed", JSON.stringify([{ title, subtitle, mood, profile, season, notes, prices, images }, ...filtered].slice(0,12)));
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
    <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] bg-white p-4 md:p-6 border border-[#e8ddd6] shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2">
      {(bestSeller || newArrival) && (
        <div className="absolute right-2 md:right-4 top-2 md:top-4 z-20">
          {bestSeller && <span className="rounded-full bg-black px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-white">Best Seller</span>}
          {!bestSeller && newArrival && <span className="rounded-full bg-pink-500 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-white">New</span>}
        </div>
      )}

      <button 
        onClick={handleFavorite} 
        className="absolute left-2 md:left-4 top-2 md:top-4 z-20 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white shadow-md transition-all"
      >
        <Heart className="h-4 w-4 md:h-[18px] md:w-[18px]" fill={favorite ? "currentColor" : "none"} />
      </button>

      {/* Premium Upgrade: Compressed height on mobile to bring focus up */}
      <Link
        href={`/product/${productSlug}`}
        onClick={saveRecentlyViewed}
        className="relative flex h-[110px] md:h-[280px] cursor-pointer items-center justify-center rounded-[24px] bg-gradient-to-br from-pink-50 to-blue-50 p-3 md:p-4"
      >
        <Image
          src={images["10ml"]}
          alt={title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 240px"
          priority
          unoptimized
        />
      </Link>

      <div className="mt-2 md:mt-6 flex flex-1 flex-col">
        <Link
          href={`/product/${productSlug}`}
          onClick={saveRecentlyViewed}
        >
          <h3 className="min-h-[32px] md:min-h-[64px] text-sm md:text-2xl font-black text-[#4f4a52] leading-tight hover:text-[#d89ca4] transition-colors">
            {title}
          </h3>
        </Link>
        
        {/* Luxury mobile rule: Kept subtitle on desktop, hidden on mobile */}
        <p className="hidden md:block mt-2 min-h-[40px] text-sm font-semibold text-[#d89ca4]">{subtitle}</p>
        
        <p className="hidden md:block mt-4 line-clamp-2 text-sm leading-6 text-[#7b7480]">{mood}</p>
        
        <div className="hidden md:flex mt-6 flex-wrap gap-2">
          {notes.slice(0, 2).map((note) => (
            <span
              key={note}
              className="rounded-full bg-pink-50 px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-semibold text-[#d89ca4]"
            >
              {note}
            </span>
          ))}
        </div>
        
        <div className="hidden md:block mt-6">
          <p className="text-sm text-[#7b7480]">{profile} • {season}</p>
        </div>

        <div className="mt-auto pt-2 md:pt-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] md:text-xs uppercase text-[#7b7480]">From</p>

              <p className="text-base md:text-2xl font-black text-[#4f4a52]">
                R{prices["5ml"]}
              </p>

              <p className="hidden md:block mt-1 text-[10px] md:text-xs font-medium text-[#d89ca4]">
                🎁 Free 5ml Sample over R400
              </p>

              <p className="hidden md:block text-[10px] md:text-xs text-[#7b7480]">
                30ml offers the best value
              </p>
            </div>
            <button
              onClick={handleCardClick}
              className="w-full rounded-full bg-gradient-to-r from-pink-400 to-blue-400 px-3 md:px-6 py-1.5 md:py-3 text-xs md:text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Quick Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}