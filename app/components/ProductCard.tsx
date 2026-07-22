"use client";

import { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import type { AnalyticsSource } from "../lib/analytics";
import { trackProductClick, trackFavouriteToggled } from "../lib/analytics";
import { toggleSavedProduct } from "../lib/customer/sync/CustomerProfileSync";

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
  scentCharacter?: string;
  onQuickAdd?: () => void;
  onLearnMore?: () => void;
  priority?: boolean;
  source?: AnalyticsSource;
  rank?: number;
  recReason?: string | null;
  slug?: string;
};

const WARDROBE_ROLE_SHORT: Record<string, string> = {
  "Fresh & Light":       "Opening Chapter",
  "Balanced Signature":  "Daily Anchor",
  "Rich & Long Wearing": "Statement Piece",
  "Deep & Intense":      "Signature Depth",
};

function ProductCard({
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
  scentCharacter,
  onQuickAdd,
  onLearnMore,
  priority = false,
  source,
  rank,
  recReason,
  slug,
}: ProductCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const favorite = isFavorite(title);

  const productSlug = useMemo(
    () => title.toLowerCase().replace(/\s+/g, "-"),
    [title]
  );

  const saveRecentlyViewed = useCallback(() => {
    const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = existing.filter((item: any) => item.title !== title);
    localStorage.setItem("recentlyViewed", JSON.stringify([{ title, subtitle, mood, profile, season, notes, prices, images }, ...filtered].slice(0, 12)));
  }, [title, subtitle, mood, profile, season, notes, prices, images]);

  const handleCardClick = useCallback(() => {
    saveRecentlyViewed();
    onQuickAdd?.();
  }, [saveRecentlyViewed, onQuickAdd]);

  const handleProductNavigation = useCallback(() => {
    saveRecentlyViewed();
    if (source !== undefined) {
      trackProductClick({ title, slug: slug ?? productSlug, source, rank });
    }
  }, [saveRecentlyViewed, source, rank, title, slug, productSlug]);

  const handleFavorite = useCallback(() => {
    const action = favorite ? "remove" : "add";
    if (favorite) {
      removeFromFavorites(title);
    } else {
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
    }
    toggleSavedProduct(title);
    trackFavouriteToggled({ title, slug: slug ?? productSlug, source, action });
  }, [favorite, removeFromFavorites, addToFavorites, title, subtitle, mood, profile, season, notes, prices, images, bestSeller, newArrival, slug, productSlug, source]);

  const handleLearnMoreClick = useCallback(() => {
    saveRecentlyViewed();
    onLearnMore?.();
  }, [saveRecentlyViewed, onLearnMore]);

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
        className="absolute left-2 md:left-4 top-2 md:top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition-all"
      >
        <Heart className="h-4 w-4 md:h-[18px] md:w-[18px]" fill={favorite ? "currentColor" : "none"} />
      </button>

      {/* Premium Upgrade: Compressed height on mobile to bring focus up */}
      <Link
        href={`/product/${slug ?? productSlug}`}
        onClick={handleProductNavigation}
        className="relative flex h-[110px] md:h-[280px] cursor-pointer items-center justify-center rounded-[24px] bg-gradient-to-br from-pink-50 to-blue-50 p-3 md:p-4"
      >
        <Image
          src={images["10ml"]}
          alt={title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 50vw, 240px"
          priority={priority}
        />
      </Link>

      <div className="mt-2 md:mt-6 flex flex-1 flex-col">
        <Link
          href={`/product/${slug ?? productSlug}`}
          onClick={handleProductNavigation}
        >
          <h3 className="min-h-[32px] md:min-h-[64px] text-sm md:text-2xl font-black text-[#4f4a52] leading-tight hover:text-[#d89ca4] transition-colors">
            {title}
          </h3>
        </Link>
        
        {/* Luxury mobile rule: Kept subtitle on desktop, hidden on mobile */}
        <p className="hidden md:block mt-2 min-h-[40px] text-sm font-semibold text-[#d89ca4]">{subtitle}</p>

        {recReason && (
          <p className="hidden md:block mt-1 text-[11px] italic leading-5 text-[#9b9298] line-clamp-1">
            {recReason}
          </p>
        )}

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
          {scentCharacter && WARDROBE_ROLE_SHORT[scentCharacter] && (
            <p className="mt-1 text-[10px] text-zinc-400 italic">
              {WARDROBE_ROLE_SHORT[scentCharacter]}
            </p>
          )}
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleCardClick}
                className="flex-1 rounded-full bg-[#d89ca4] px-3 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold text-white transition-all duration-300 hover:bg-[#c48898] hover:scale-[1.02]"
              >
                Quick Add
              </button>
              {onLearnMore && (
                <button
                  onClick={handleLearnMoreClick}
                  aria-label={`Learn more about ${title}`}
                  className="hidden md:flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8ddd6] bg-white text-[#7b7480] transition-all hover:border-[#d89ca4] hover:text-[#d89ca4]"
                >
                  <span className="text-[11px] leading-none" aria-hidden="true">↗</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);