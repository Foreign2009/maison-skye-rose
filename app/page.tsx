"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";
import ProductCard from "./components/ProductCard";
import AIHeroSection from "./components/AIHeroSection";
import TrustBar from "./components/TrustBar";
import BestSellers from "./components/BestSellers";
import LatestAdditions from "./components/LatestAdditions";
import DiscoverySets from "./components/DiscoverySets";
import ShopByPersonality from "./components/ShopByPersonality";
import QuickAddModal from "./components/QuickAddModal";
import Testimonials from "./components/Testimonials";
import RecentlyViewedHome from "./components/RecentlyViewedHome";
import FavoritesHome from "./components/FavoritesHome";
import Footer from "./components/Footer";
import { fragrances } from "./data/fragrances";

export default function HomePage() {
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  // Core fragrance array pass-through to ensure fast initial page loads
  const displayProducts = fragrances;

  // Single-pass signature lookup tailored for the editorial block
  const featuredFragrance = fragrances.find((f) => f.collection === "Skye" && f.bestSeller) || fragrances[0];

  // Confident luxury fallback text if the fragrance object lacks a mood string
  const featuredMood = featuredFragrance?.mood || "A captivating blend crafted for those who leave an impression. Experience a masterfully balanced trail of rare modern accords designed to linger gracefully.";

  return (
    <main className="min-h-screen bg-[#faf7f5] overflow-x-hidden">
      <Navbar />
      <AnnouncementBar />

      <section className="bg-[#b67d73] py-3">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-white">
            🎁 Free 5ml Sample On Orders Over R400
          </p>

          <p className="mt-1 text-[11px] md:text-xs text-white/90">
            Unlock up to 3 free samples and a Discovery Set as your order grows
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-[#efe8e1]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <div className="py-4 text-center">
              <p className="text-lg font-black text-[#4f4a52]">
                50+
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7b7480]">
                Fragrances
              </p>
            </div>

            <div className="py-4 text-center">
              <p className="text-lg font-black text-[#4f4a52]">
                R400+
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7b7480]">
                Free Sample
              </p>
            </div>

            <div className="py-4 text-center">
              <p className="text-lg font-black text-[#4f4a52]">
                Fast
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7b7480]">
                WhatsApp Orders
              </p>
            </div>

            <div className="py-4 text-center">
              <p className="text-lg font-black text-[#4f4a52]">
                SA
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7b7480]">
                Nationwide Delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      <AIHeroSection />
      <TrustBar />

      {/* 1. Featured Fragrance Block (Refined Luxury Editorial Layout) - bg-white */}
      <section className="bg-white py-8 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-5">
          <div className="bg-[#faf7f5] rounded-[32px] md:rounded-[40px] p-5 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.02)] grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Added a subtle gradient to replace the flat white background */}
            <div className="relative h-[240px] md:h-[480px] w-full flex items-center justify-center rounded-[32px] bg-gradient-to-br from-[#faf7f5] via-white to-[#fdf8f6] p-6">
              <Image
                src={featuredFragrance?.images?.["10ml"] || "/placeholder-perfume.png"}
                alt={featuredFragrance?.title || "Signature Scent"}
                fill
                className="object-contain p-6 transform transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 480px"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#d89ca4]">
                  Featured Creation
                </span>

                {featuredFragrance?.bestSeller && (
                  <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Best Seller
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.06em] text-[#4f4a52] leading-tight">
                {featuredFragrance?.title || "Maison Skye & Rose"}
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#d89ca4]">
                {featuredFragrance?.subtitle || "Extrait de Parfum"}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#7b7480]">
                One of our most requested fragrances
              </p>
              
              {/* Subtle collection tag added below subtitle for strict editorial structure */}
              {featuredFragrance?.collection && (
                <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-[#7b7480]">
                  {featuredFragrance.collection} Collection
                </p>
              )}
              
              <p className="mt-5 text-sm md:text-base leading-7 text-[#7b7480] max-w-[520px]">
                {featuredMood}
              </p>
              
              {/* Note chips hidden on mobile to align with strict editorial luxury constraints */}
              {featuredFragrance?.notes && (
                <div className="hidden md:flex mt-6 flex-wrap gap-2">
                  {featuredFragrance.notes.slice(0, 3).map((note: string) => (
                    <span key={note} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#d89ca4] border border-pink-50">
                      {note}
                    </span>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setSelectedFragrance(featuredFragrance)}
                className="mt-6 rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800 hover:scale-105 w-full sm:w-auto text-center"
              >
                Discover
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Statement Divider (Repositioned away from price conversation) */}
      <section className="bg-white py-12 md:py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] text-[#d89ca4]">
            The Maison Standard
          </p>
          <h3 className="mt-4 text-2xl md:text-4xl font-black text-[#4f4a52]">
            Craft Crafted For Every Occasion
          </h3>
          <p className="mt-5 text-[#7b7480] leading-7 text-sm md:text-base">
            Modern fragrances inspired by the world's most iconic scent journeys,
            thoughtfully curated for everyday luxury.
          </p>
        </div>
      </section>

      {/* 2. Best Sellers - bg-[#faf7f5] */}
      <section className="bg-[#faf7f5]">
        <BestSellers onQuickAdd={(fragrance) => setSelectedFragrance(fragrance)} />
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#d89ca4]">
            Most Loved Fragrances
          </p>

          <h3 className="mt-4 text-2xl md:text-4xl font-black text-[#4f4a52]">
            Trusted By Fragrance Lovers Across South Africa
          </h3>

          <p className="mt-5 text-sm md:text-base text-[#7b7480] max-w-2xl mx-auto">
            Discover the fragrances our customers return for again and again.
            Carefully selected inspirations designed for everyday luxury.
          </p>
        </div>
      </section>

      {/* 3. Discovery Sets - bg-white */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 pt-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#d89ca4]">
            Discovery Journey
          </p>

          <h3 className="mt-4 text-2xl md:text-4xl font-black text-[#4f4a52]">
            Build Your Collection
          </h3>

          <p className="mt-5 text-sm md:text-base text-[#7b7480] max-w-2xl mx-auto">
            Most customers begin with 5ml fragrances to discover their favourites
            before building a full collection.
          </p>

          <div className="mt-6 inline-flex rounded-full bg-[#faf7f5] px-5 py-3 text-sm font-semibold text-[#b67d73]">
            🎁 Orders over R400 receive a FREE 5ml sample
          </div>
        </div>

        <DiscoverySets />
      </section>

      {/* 4. Wholesale Opportunities - bg-[#faf7f5] */}
      <section className="bg-[#faf7f5] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="rounded-[40px] bg-white p-8 md:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
            <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
              Wholesale Opportunities
            </p>

            <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#4f4a52]">
              Become A Maison Stockist
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-[#7b7480]">
              Mix and match any fragrances and bottle sizes.
              Wholesale pricing starts from only 10 units.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <span className="rounded-full bg-[#faf7f5] px-6 py-3 font-medium text-sm text-[#4f4a52]">
                5ml • R48
              </span>

              <span className="rounded-full bg-[#faf7f5] px-6 py-3 font-medium text-sm text-[#4f4a52]">
                10ml • R77
              </span>

              <span className="rounded-full bg-[#faf7f5] px-6 py-3 font-medium text-sm text-[#4f4a52]">
                30ml • R180
              </span>
            </div>

            <Link
              href="/wholesale"
              className="mt-10 inline-flex rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Latest Additions - bg-[#faf7f5] */}
      <section className="bg-[#faf7f5]">
        <LatestAdditions />
      </section>
      
      {/* 6. Signature Collection - bg-white */}
      <section className="bg-white mx-auto max-w-7xl px-4 md:px-5 py-8 md:py-24">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">Explore Signature Collection</p>
          <h2 className="mt-2 text-xl md:text-5xl font-black tracking-[-0.06em] text-[#4f4a52]">Signature Fragrances</h2>
        </div>

        {/* Premium swipe implementation using 195px to keep fragrance bottles looking expensive */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {displayProducts.slice(0, 8).map((fragrance) => (
            <div
              key={fragrance.title}
              className="w-[195px] flex-shrink-0 snap-start"
            >
              <ProductCard
                {...fragrance}
                onQuickAdd={() => setSelectedFragrance(fragrance)}
              />
            </div>
          ))}
        </div>

        {/* Balanced Desktop Grid Variant */}
        <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.slice(0, 8).map((fragrance) => (
            <ProductCard 
              key={fragrance.title} 
              {...fragrance} 
              onQuickAdd={() => setSelectedFragrance(fragrance)} 
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
          >
            View Full Collection
          </Link>
        </div>
      </section>

      {/* 7. Quiz / Personality Alignment - bg-[#faf7f5] */}
      <section className="bg-[#faf7f5]">
        <ShopByPersonality />
      </section>

      {/* 8. Testimonials - bg-white */}
      <section className="bg-white">
        <Testimonials />
      </section>

      <section className="bg-white">
        <FavoritesHome />
      </section>

      <section className="bg-white">
        <RecentlyViewedHome />
      </section>
      
      {/* 9. Luxury Target Footer */}
      <Footer />

      {selectedFragrance && (
        <QuickAddModal open={true} onClose={() => setSelectedFragrance(null)} {...selectedFragrance} />
      )}
    </main>
  );
}