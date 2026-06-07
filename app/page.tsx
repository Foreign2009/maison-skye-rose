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
import Footer from "./components/Footer";
import { fragrances } from "./data/fragrances";

export default function HomePage() {
  const [selectedFragrance, setSelectedFragrance] = useState<any>(null);

  // Core fragrance array pass-through to ensure fast initial page loads
  const displayProducts = fragrances;

  // Single-pass signature lookup tailored for the editorial block
  const featuredFragrance = fragrances.find((f) => f.collection === "Skye" && f.bestSeller) || fragrances[0];

  // Safeguard content boundaries by formatting descriptions cleanly
  const rawMood = featuredFragrance?.mood || "A captivating blend crafted for those who leave an impression. Experience a masterfully balanced trail of rare modern accords designed to linger gracefully.";
  const featuredDescription = rawMood.length > 120 ? `${rawMood.slice(0, 120)}...` : rawMood;

  return (
    <main className="min-h-screen bg-[#faf7f5] overflow-x-hidden">
      <Navbar />
      <AnnouncementBar />
      <AIHeroSection />
      <TrustBar />

      {/* 1. Featured Fragrance Block (Refined Luxury Editorial Layout) */}
      <section className="mx-auto max-w-7xl px-4 md:px-5 py-10 md:py-24">
        <div className="bg-white rounded-[40px] p-6 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.04)] grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative h-[220px] md:h-[480px] w-full flex items-center justify-center rounded-[32px] bg-gradient-to-br from-pink-50 to-blue-50 p-6">
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
            <span className="text-xs font-bold tracking-[0.45em] text-[#d89ca4] uppercase mb-3">
              Signature Scent
            </span>
            <h2 className="text-2xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
              {featuredFragrance?.title || "Maison Skye & Rose"}
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#d89ca4]">
              {featuredFragrance?.subtitle || "Extrait de Parfum"}
            </p>
            {/* Elegant character-limited description keeping vertical blocks balanced across devices */}
            <p className="mt-4 text-sm md:text-base leading-relaxed text-[#7b7480]">
              {featuredDescription}
            </p>
            
            {/* Note chips hidden on mobile to align with strict editorial luxury constraints */}
            {featuredFragrance?.notes && (
              <div className="hidden md:flex mt-6 flex-wrap gap-2">
                {featuredFragrance.notes.slice(0, 3).map((note: string) => (
                  <span key={note} className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#d89ca4]">
                    {note}
                  </span>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setSelectedFragrance(featuredFragrance)}
              className="mt-8 rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800 hover:scale-105 w-full sm:w-auto text-center"
            >
              Discover
            </button>
          </div>
        </div>
      </section>

      {/* 2. Best Sellers */}
      <BestSellers onQuickAdd={(fragrance) => setSelectedFragrance(fragrance)} />

      {/* 3. Latest Additions */}
      <LatestAdditions />
      
      {/* 4. Signature Collection */}
      <section className="mx-auto max-w-7xl px-4 md:px-5 py-10 md:py-24">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">Explore Signature Collection</p>
          <h2 className="mt-2 text-2xl md:text-5xl font-black tracking-[-0.06em] text-[#4f4a52]">Inspired Scent Journeys</h2>
        </div>

        {/* Locked sweet spot mobile width implementation to keep layout structure premium without card crunching */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {displayProducts.slice(0, 16).map((fragrance) => (
            <div
              key={fragrance.title}
              className="w-[180px] flex-shrink-0 snap-start"
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
          {displayProducts.slice(0, 16).map((fragrance) => (
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

      {/* 5. Discovery Sets */}
      <DiscoverySets />

      {/* 6. Quiz / Personality Alignment */}
      <ShopByPersonality />

      {/* 7. Testimonials */}
      <Testimonials />
      
      {/* 8. Luxury Target Footer */}
      <Footer />

      {selectedFragrance && (
        <QuickAddModal open={true} onClose={() => setSelectedFragrance(null)} {...selectedFragrance} />
      )}
    </main>
  );
}