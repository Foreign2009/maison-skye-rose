"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import { useFavorites } from "../context/FavoritesContext";
import Link from "next/link";
import { brand } from "../data/brand";
import RecommendationCard from "./RecommendationCard";
import { mkcCatalogue } from "../lib/mkc/catalogue";
import { generateWhyYoullLikeIt } from "../lib/mkc/merchandising";
import type { FragranceKnowledge } from "../lib/mkc/types";
import type { SimilarityResult } from "../lib/discovery/types";
import {
  trackProductView,
  trackAddToCart,
  trackBuyNow,
  trackCartOpened,
} from "../lib/analytics";

// ── Similarity reasons helper ─────────────────────────────────────────────────

function deriveSimilarityReasons(
  source: FragranceKnowledge,
  result: SimilarityResult
): string[] {
  const reasons: string[] = [];
  const f = result.fragrance;

  const sharedFamily = source.family.find((fam) => f.family.includes(fam));
  if (sharedFamily) reasons.push(`Shares ${sharedFamily.toLowerCase()} character`);

  if (source.scentCharacter === f.scentCharacter) {
    reasons.push("Matching scent character");
  }

  if (f.bestSeller) reasons.push("One of our most loved fragrances");

  if (source.season === f.season) {
    if (reasons.length < 2) reasons.push(`Ideal for ${f.season.toLowerCase()} wear`);
  }

  while (reasons.length < 2) {
    reasons.push("Carefully selected to complement your choice");
  }

  return reasons.slice(0, 3);
}

// ── Collection badge styles ───────────────────────────────────────────────────
const COLLECTION_STYLES: Record<string, { pill: string; label: string }> = {
  Skye:  { pill: "bg-blue-50 text-blue-600",    label: "Skye Collection"  },
  Rose:  { pill: "bg-pink-50 text-[#d89ca4]",   label: "Rose Collection"  },
  Elite: { pill: "bg-[#f3f0fa] text-[#9b7ce0]", label: "Elite Collection" },
};

// ── Discover More — static fallback (shown when Academy articles are not provided) ──
const DISCOVER_MORE_FALLBACK = [
  { key: "notes",    label: "Learn about fragrance notes"        },
  { key: "families", label: "Learn about fragrance families"     },
  { key: "perf",    label: "Why fragrances perform differently"  },
  { key: "apply",   label: "How to apply fragrance"             },
];

export interface DiscoverMoreArticle {
  slug: string;
  title: string;
  category: string;
  readTime: number;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ProductDetail({
  knowledge,
  discoverMoreArticles,
  similarFragrances,
}: {
  knowledge: FragranceKnowledge;
  discoverMoreArticles?: DiscoverMoreArticle[];
  similarFragrances?: SimilarityResult[];
}) {
  const [selectedSize, setSelectedSize] =
    useState<"5ml" | "10ml" | "30ml">("10ml");
  const [showStickyBar,   setShowStickyBar]   = useState(false);
  const [pyramidExpanded, setPyramidExpanded] = useState(false);

  const { addToCart }                                     = useCart();
  const { openCart, cartOpen }                            = useCartUI();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const favorite = isFavorite(knowledge.name);

  // Scroll listener — sticky mobile bar
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Recently viewed + product view analytics
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = existing.filter((item: { title: string }) => item.title !== knowledge.name);
    const entry = {
      title:    knowledge.name,
      subtitle: knowledge.subtitle,
      mood:     knowledge.mood,
      profile:  knowledge.profile,
      season:   knowledge.season,
      notes:    [...knowledge.notes.top, ...knowledge.notes.heart, ...knowledge.notes.base],
      prices:   knowledge.prices,
      images:   knowledge.images,
    };
    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify([entry, ...filtered].slice(0, 12))
    );
    trackProductView({ title: knowledge.name, collection: knowledge.collection });
  }, [knowledge.name]);

  // ── Commerce handlers ──────────────────────────────────────────────────────

  const handleAddToCart = () => {
    addToCart({
      id:       knowledge.id,
      title:    knowledge.name,
      price:    knowledge.prices[selectedSize],
      image:    knowledge.images[selectedSize],
      quantity: 1,
      size:     selectedSize,
    });
    trackAddToCart({
      title:  knowledge.name,
      size:   selectedSize,
      price:  knowledge.prices[selectedSize],
      source: "pdp",
    });
    if (!cartOpen) {
      openCart();
      trackCartOpened({ source: "post-add" });
    }
  };

  const handleBuyNow = () => {
    addToCart({
      id:       knowledge.id,
      title:    knowledge.name,
      price:    knowledge.prices[selectedSize],
      image:    knowledge.images[selectedSize],
      quantity: 1,
      size:     selectedSize,
    });
    trackAddToCart({
      title:  knowledge.name,
      size:   selectedSize,
      price:  knowledge.prices[selectedSize],
      source: "buy-now",
    });
    trackBuyNow({
      title:  knowledge.name,
      size:   selectedSize,
      price:  knowledge.prices[selectedSize],
      source: "buy-now",
    });

    const message = encodeURIComponent(
      `Hi Maison Skye & Rose! 👋\n\nI'd like to order the following:\n\n🧴 Fragrance: ${knowledge.name}\n📦 Size: ${selectedSize}\n🔢 Quantity: 1\n💰 Price: R${knowledge.prices[selectedSize]}\n\nPlease let me know the total including delivery and send me the payment details.\n\nThank you!`
    );
    window.open(`https://wa.me/${brand.social.whatsappNumber}?text=${message}`, "_blank");
  };

  const handleFavourite = useCallback(() => {
    if (favorite) {
      removeFromFavorites(knowledge.name);
      return;
    }
    addToFavorites({
      title:      knowledge.name,
      subtitle:   knowledge.subtitle,
      mood:       knowledge.mood,
      profile:    knowledge.profile,
      season:     knowledge.seasons,
      notes:      [...knowledge.notes.top, ...knowledge.notes.heart, ...knowledge.notes.base],
      prices:     knowledge.prices,
      images:     knowledge.images,
      image:      knowledge.images["10ml"],
      bestSeller: knowledge.bestSeller,
      newArrival: knowledge.newArrival,
    });
  }, [favorite, removeFromFavorites, addToFavorites, knowledge]);

  // ── Pre-computed display values ────────────────────────────────────────────

  const bullets  = useMemo(() => generateWhyYoullLikeIt(knowledge), [knowledge]);
  const allNotes = useMemo(
    () => [...knowledge.notes.top, ...knowledge.notes.heart, ...knowledge.notes.base].filter(Boolean),
    [knowledge]
  );
  const collStyle = COLLECTION_STYLES[knowledge.collection] ?? COLLECTION_STYLES.Skye;


  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pt-16 md:pt-28 pb-6">
        <div className="mx-auto max-w-7xl">

          {/* Breadcrumb */}
          <div className="hidden md:block mb-8">
            <p className="text-sm text-zinc-500">
              Shop / {knowledge.collection} / {knowledge.name}
            </p>
          </div>

          <div className="grid gap-6 md:p-8 lg:grid-cols-2">

            {/* Gallery */}
            <div className="flex flex-col items-center">
              <Image
                src={knowledge.images[selectedSize]}
                alt={knowledge.name}
                width={240}
                height={240}
                priority
                className="mx-auto max-w-[240px] rounded-3xl bg-white p-6 shadow-lg object-contain"
              />
              <div className="mt-4 flex gap-3">
                {(["5ml", "10ml", "30ml"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl border p-2 transition ${
                      selectedSize === size
                        ? "border-[#d89ca4] bg-[#fff7f8]"
                        : "border-[#efe8e1]"
                    }`}
                  >
                    <Image
                      src={knowledge.images[size]}
                      alt={size}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Identity + Commerce */}
            <div>
              {/* Collection badge */}
              <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${collStyle.pill}`}>
                {collStyle.label}
              </span>

              {/* Fragrance name */}
              <h1 className="mt-3 text-[1.8rem] leading-tight md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">
                {knowledge.name}
              </h1>

              {/* Inspired by / Subtitle */}
              {knowledge.subtitle && (
                <p className="mt-2 text-lg md:text-xl font-semibold text-[#b67d73]">
                  {knowledge.subtitle}
                </p>
              )}

              {/* Profile + Season chips */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium shadow-sm">
                  {knowledge.profile}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium shadow-sm">
                  {knowledge.season}
                </span>
                {knowledge.bestSeller && (
                  <span className="rounded-full bg-[#d89ca4] px-3 py-1.5 text-xs font-medium text-white">
                    Best Seller
                  </span>
                )}
                {knowledge.newArrival && (
                  <span className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white">
                    New Arrival
                  </span>
                )}
              </div>

              {/* Mood */}
              <p className="mt-4 text-sm text-zinc-600 leading-7 md:mt-6 md:text-base md:leading-8">
                {knowledge.mood}
              </p>

              {/* Price */}
              <div className="mt-3">
                <p className="text-2xl font-black text-[#4f4a52]">
                  R{knowledge.prices[selectedSize]}
                </p>
              </div>

              {/* Free sample banner */}
              <div className="mt-3 rounded-2xl border border-[#efe8e1] bg-white p-4 text-sm">
                🎁 Orders over R400 receive a FREE 5ml Sample
              </div>

              {/* Size selector */}
              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Select Size
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {(["5ml", "10ml", "30ml"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-full rounded-xl px-3 py-2 border transition-all font-semibold ${
                        selectedSize === size
                          ? "bg-[#d89ca4] text-white border-[#d89ca4] shadow-lg scale-[1.02]"
                          : "bg-white border-[#efe8e1] hover:border-[#d89ca4]"
                      }`}
                    >
                      <div className="font-bold">{size}</div>
                      <div className="text-xs opacity-90 mt-1">
                        {size === "5ml" && "Perfect for Trying"}
                        {size === "10ml" && (
                          <span className="inline-block rounded-full bg-white/20 px-2 py-0.5">
                            Most Popular
                          </span>
                        )}
                        {size === "30ml" && (
                          <span className="inline-block rounded-full bg-white/20 px-2 py-0.5">
                            Best Value
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold mt-2">
                        R{knowledge.prices[size]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust signals */}
              <div className="mt-4 space-y-2 text-sm text-zinc-600">
                <p>✓ Nationwide South African Delivery</p>
                <p>✓ 465+ Signature Fragrances Available</p>
                <p>✓ Secure Checkout</p>
                <p>✓ Luxury Inspired Fragrance Collection</p>
              </div>

              {/* Add to Cart + Favourite */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-2xl bg-[#d89ca4] py-3 font-bold text-white transition hover:opacity-90"
                >
                  Add To Cart
                </button>
                <button
                  onClick={handleFavourite}
                  aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#efe8e1] bg-white transition hover:border-[#d89ca4]"
                >
                  <Heart
                    className="h-5 w-5 text-[#d89ca4]"
                    fill={favorite ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="mt-3 w-full rounded-2xl border-2 border-[#d89ca4] bg-transparent py-3 font-bold text-[#d89ca4] transition hover:bg-[#fff7f8]"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Facts ──────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 md:p-10">
            <h2 className="text-2xl font-black text-[#4f4a52]">Quick Facts</h2>
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">

              {/* Family */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Family
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {knowledge.family.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-[#f5f1eb] px-2.5 py-1 text-[11px] font-semibold text-[#7b7480]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Character */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Character
                </p>
                <p className="mt-2.5 text-sm font-semibold text-[#4f4a52]">
                  {knowledge.scentCharacter}
                </p>
              </div>

              {/* Season */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Season
                </p>
                <p className="mt-2.5 text-sm font-semibold text-[#4f4a52]">
                  {knowledge.season}
                </p>
              </div>

              {/* Perfect For */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Perfect For
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {knowledge.occasions.map((o) => (
                    <span
                      key={o}
                      className="rounded-full bg-[#f5f1eb] px-2.5 py-1 text-[11px] font-semibold text-[#7b7480]"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Signature Notes ──────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 md:p-10">

            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-[#4f4a52]">Signature Notes</h2>
              <button
                onClick={() => setPyramidExpanded(!pyramidExpanded)}
                className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#d89ca4] transition hover:opacity-70"
              >
                {pyramidExpanded ? "Show Less" : "View Complete Note Pyramid"}
                {pyramidExpanded
                  ? <ChevronUp className="h-4 w-4" />
                  : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Curated notes — always visible */}
            <div className="mt-6 flex flex-wrap gap-2">
              {allNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-[#d89ca4]"
                >
                  {note}
                </span>
              ))}
            </div>

            {/* Complete note pyramid — expandable */}
            {pyramidExpanded && (
              <div className="mt-8 grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl bg-[#f9f7f4] p-5">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                    Top Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {knowledge.notes.top.map((note) => (
                      <span
                        key={note}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#4f4a52] shadow-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#f9f7f4] p-5">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                    Heart Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {knowledge.notes.heart.map((note) => (
                      <span
                        key={note}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#4f4a52] shadow-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#f9f7f4] p-5">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                    Base Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {knowledge.notes.base.map((note) => (
                      <span
                        key={note}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#4f4a52] shadow-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </section>

      {/* ── Why You'll Like It ───────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 md:p-10">
            <h2 className="text-2xl font-black text-[#4f4a52]">
              Why You&apos;ll Like It
            </h2>
            <ul className="mt-6 space-y-4">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-4">
                  <span className="mt-1 shrink-0 font-bold text-[#d89ca4]">✓</span>
                  <span className="text-base leading-7 text-zinc-600">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Fragrance Story — rendered only when description is present ────── */}
      {knowledge.description && (
        <section className="px-4 md:px-6 pb-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-white p-6 md:p-10">
              <h2 className="text-2xl font-black text-[#4f4a52]">Fragrance Story</h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-600">
                {knowledge.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Fragrance Personality ────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 md:p-10">
            <h2 className="text-2xl font-black text-[#4f4a52]">Fragrance Personality</h2>

            <div className="mt-8 space-y-7">

              {knowledge.recommendedFor.length > 0 && (
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    Recommended For
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {knowledge.recommendedFor.map((r) => (
                      <span
                        key={r}
                        className="rounded-full border border-[#ede8e1] bg-[#f9f7f4] px-3 py-1.5 text-xs font-semibold text-[#4f4a52]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {knowledge.signatureStyle.length > 0 && (
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    Signature Style
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {knowledge.signatureStyle.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-[#ede8e1] bg-[#f9f7f4] px-3 py-1.5 text-xs font-semibold text-[#4f4a52]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {knowledge.occasions.length > 0 && (
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    Occasions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {knowledge.occasions.map((o) => (
                      <span
                        key={o}
                        className="rounded-full border border-[#ede8e1] bg-[#f9f7f4] px-3 py-1.5 text-xs font-semibold text-[#4f4a52]"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── Discover More — Fragrance Academy ───────────────────────────────── */}
      <section className="px-4 md:px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 md:p-10">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#4f4a52]">Discover More</h2>
              {discoverMoreArticles && discoverMoreArticles.length > 0 ? (
                <span className="text-xs font-medium tracking-widest uppercase text-[#d89ca4]">
                  Fragrance Academy
                </span>
              ) : (
                <span className="rounded-full bg-[#f5f1eb] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Fragrance Academy — Coming Soon
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {discoverMoreArticles && discoverMoreArticles.length > 0
                ? discoverMoreArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/academy/${article.slug}`}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-[#ede8e1] bg-[#f9f7f4] px-5 py-4 transition-colors hover:border-[#d89ca4]/60 hover:bg-[#fdf6f7]"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-0.5">
                          {article.category}
                        </p>
                        <span className="text-sm font-semibold text-[#4f4a52]">
                          {article.title}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#d89ca4] mt-0.5">
                        →
                      </span>
                    </Link>
                  ))
                : DISCOVER_MORE_FALLBACK.map((card) => (
                    <div
                      key={card.key}
                      className="flex cursor-default items-center justify-between rounded-2xl border border-[#ede8e1] bg-[#f9f7f4] px-5 py-4"
                    >
                      <span className="text-sm font-semibold text-[#4f4a52]">
                        {card.label}
                      </span>
                      <span className="ml-4 shrink-0 text-sm font-bold text-[#d89ca4] opacity-30">
                        →
                      </span>
                    </div>
                  ))}
            </div>

            {discoverMoreArticles && discoverMoreArticles.length > 0 && (
              <div className="mt-5 text-right">
                <Link
                  href="/academy"
                  className="text-sm font-medium text-[#d89ca4] hover:underline"
                >
                  Explore the Fragrance Academy →
                </Link>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ── Related Fragrances — powered by Discovery similarity engine ──── */}
      {(similarFragrances ?? []).length > 0 && (
        <section className="px-4 md:px-6 pb-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-2xl md:text-3xl font-black text-[#4f4a52]">
              Related Fragrances
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {(similarFragrances ?? []).map((result) => (
                <RecommendationCard
                  key={result.fragrance.name}
                  title={result.fragrance.name}
                  profile={result.fragrance.profile}
                  mood={result.fragrance.mood}
                  notes={[
                    ...result.fragrance.notes.top,
                    ...result.fragrance.notes.heart,
                    ...result.fragrance.notes.base,
                  ]}
                  freshness={result.fragrance.freshness}
                  warmth={result.fragrance.warmth}
                  sweetness={result.fragrance.sweetness}
                  intensity={result.fragrance.intensity}
                  versatility={result.fragrance.versatility}
                  reasons={deriveSimilarityReasons(knowledge, result)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── You May Also Like ────────────────────────────────────────────────── */}
      {/* TODO: Replace collection matching with MKC similarity scoring.         */}
      <section className="px-4 md:px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl md:text-3xl font-black text-[#4f4a52]">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-4">
            {mkcCatalogue
              .filter((k) => k.collection === knowledge.collection && k.id !== knowledge.id)
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item.name}
                  href={`/product/${item.slug}`}
                  className="rounded-3xl bg-white p-4 md:p-6 transition hover:shadow-lg"
                >
                  <div className="relative h-24 md:h-40">
                    <Image
                      src={item.images["5ml"]}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="mt-4 font-bold text-sm md:text-base text-[#4f4a52]">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-zinc-500">
                    From R{item.prices["5ml"]}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── Customer Reviews ─────────────────────────────────────────────────── */}
      {/* Reserved: Customer Reviews — Coming Soon                               */}
      <section className="px-4 md:px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border-2 border-dashed border-[#ede8e1] bg-white p-8 text-center">
            <span className="inline-block rounded-full bg-[#f5f1eb] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Coming Soon
            </span>
            <h2 className="mt-3 text-2xl font-black text-[#4f4a52]">Customer Reviews</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Be the first to share your experience with {knowledge.name}.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ask Maison AI ────────────────────────────────────────────────────── */}
      {/* Reserved: Ask Maison AI — No implementation                            */}
      <section className="px-4 md:px-6 pb-52 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-[#ede8e1] bg-gradient-to-br from-[#f9f7f4] to-white p-8 text-center">
            <span className="inline-block rounded-full bg-[#f5f1eb] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Coming Soon
            </span>
            <h2 className="mt-3 text-2xl font-black text-[#4f4a52]">Ask Maison AI</h2>
            <p className="mt-2 max-w-sm mx-auto text-sm text-zinc-500">
              Your personal fragrance guide. Tell us your style and we&apos;ll match you to your perfect scent.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile bar ────────────────────────────────────────────────── */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#efe8e1] bg-white/90 backdrop-blur-xl shadow-2xl md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                {selectedSize} •{" "}
                {selectedSize === "10ml"
                  ? "Most Popular"
                  : selectedSize === "30ml"
                  ? "Best Value"
                  : "Starter Size"}
              </p>
              <h3 className="max-w-[120px] truncate font-bold text-[#4f4a52] leading-tight">
                {knowledge.name}
              </h3>
              <p className="font-black text-[#d89ca4]">
                R{knowledge.prices[selectedSize]}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="rounded-2xl bg-[#d89ca4] px-6 py-3 font-bold text-white whitespace-nowrap"
            >
              Add To Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
