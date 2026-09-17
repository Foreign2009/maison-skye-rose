"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import AIHeroSection from "./components/AIHeroSection";
import LuxuryConfidenceBar from "./components/LuxuryConfidenceBar";
import BestSellers from "./components/BestSellers";
import Footer from "./components/Footer";
import QuickAddModal from "./components/QuickAddModal";
import { toDisplayFragrance } from "./lib/mkc/displayAdapter";
import { mkcCatalogue } from "./lib/mkc/catalogue";

// Derived from catalogue — stays authoritative when prices change (same pattern as MiniCart).
const _min5ml  = mkcCatalogue.length > 0 ? Math.min(...mkcCatalogue.map((k) => k.prices["5ml"]))  : 60;
const _min10ml = mkcCatalogue.length > 0 ? Math.min(...mkcCatalogue.map((k) => k.prices["10ml"])) : 100;
const _min30ml = mkcCatalogue.length > 0 ? Math.min(...mkcCatalogue.map((k) => k.prices["30ml"])) : 250;

export default function HomePage() {
  const [selectedFragrance, setSelectedFragrance] = useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#faf7f5] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <AIHeroSection />

      {/* ── TRUST ────────────────────────────────────────────────────────── */}
      <LuxuryConfidenceBar />

      {/* ── COLLECTIONS ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 md:mb-14 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              Our Collections
            </p>
            <h2 className="mt-3 text-2xl md:text-4xl font-black tracking-[-0.04em] text-[#4f4a52] leading-tight">
              Find Your Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
            <Link
              href="/collections/skye"
              className="group rounded-[24px] bg-[#f0f4f8] p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
            >
              <div className="relative h-44 w-44 mb-6">
                <Image
                  src="/images/blue-10ml.png"
                  alt="Skye Collection"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="176px"
                />
              </div>
              <h3 className="text-base font-black tracking-wide text-[#4f4a52]">Skye</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                Fresh, clean, and confidently modern
              </p>
              <span className="mt-5 inline-block rounded-full bg-[#4f4a52] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors group-hover:bg-black">
                Shop Skye
              </span>
            </Link>

            <Link
              href="/collections/rose"
              className="group rounded-[24px] bg-[#fdf4f5] p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
            >
              <div className="relative h-44 w-44 mb-6">
                <Image
                  src="/images/pink-10ml.png"
                  alt="Rose Collection"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="176px"
                />
              </div>
              <h3 className="text-base font-black tracking-wide text-[#4f4a52]">Rose</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                Warm, romantic, and quietly bold
              </p>
              <span className="mt-5 inline-block rounded-full bg-[#d89ca4] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors group-hover:bg-[#c78a92]">
                Shop Rose
              </span>
            </Link>

            <Link
              href="/collections/elite"
              className="group rounded-[24px] bg-[#f5f3f0] p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
            >
              <div className="relative h-44 w-44 mb-6">
                <Image
                  src="/images/glass-blue-30ml.png"
                  alt="Elite Collection"
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="176px"
                />
              </div>
              <h3 className="text-base font-black tracking-wide text-[#4f4a52]">Elite</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                Distinctive compositions to explore
              </p>
              <span className="mt-5 inline-block rounded-full bg-[#7a6e64] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors group-hover:bg-[#5e5249]">
                Shop Elite
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CURATED PRODUCTS ─────────────────────────────────────────────── */}
      <section className="bg-[#faf7f5]">
        <BestSellers
          onQuickAdd={(fragrance) => {
            setSelectedFragrance(fragrance);
            setQuickOpen(true);
          }}
        />
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              How It Works
            </p>
            <h2 className="mt-3 text-2xl md:text-4xl font-black tracking-[-0.04em] text-[#4f4a52] leading-tight">
              Three Sizes, One Journey
            </h2>
            <p className="mt-4 text-base text-[#7b7480] max-w-xl mx-auto leading-relaxed">
              Start small, discover what you love, then build your collection at your own pace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-[20px] bg-[#faf7f5] border border-[#f0ebe8] p-7 text-center">
              <p className="text-2xl font-black text-[#d89ca4]">5ml</p>
              <p className="mt-2 text-sm font-bold text-[#4f4a52]">Try It &middot; From R{_min5ml}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
                Discover a new scent before choosing a larger size.
              </p>
            </div>
            <div className="rounded-[20px] bg-[#faf7f5] border border-[#f0ebe8] p-7 text-center">
              <p className="text-2xl font-black text-[#d89ca4]">10ml</p>
              <p className="mt-2 text-sm font-bold text-[#4f4a52]">Own It &middot; From R{_min10ml}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
                Your daily signature. A generous size for a scent you have already fallen for.
              </p>
            </div>
            <div className="rounded-[20px] bg-[#faf7f5] border border-[#f0ebe8] p-7 text-center">
              <p className="text-2xl font-black text-[#d89ca4]">30ml</p>
              <p className="mt-2 text-sm font-bold text-[#4f4a52]">Live It &middot; From R{_min30ml}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
                For the fragrance you cannot imagine life without. A full wardrobe staple.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/academy"
              className="inline-flex items-center rounded-full border border-[#d89ca4] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[#d89ca4] transition-all duration-300 hover:bg-[#d89ca4]/5"
            >
              Learn About Fragrance
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full bg-[#4f4a52] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-black"
            >
              Shop All Fragrances
            </Link>
          </div>
        </div>
      </section>

      {/* ── BRAND STORY ──────────────────────────────────────────────────── */}
      <section className="bg-[#faf7f5] py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            About Maison
          </p>
          <h2 className="mt-4 text-2xl md:text-4xl font-black tracking-[-0.04em] text-[#4f4a52] leading-tight">
            Fragrance Belonging to Everyone
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-[#7b7480]">
            Maison Skye &amp; Rose was founded on a simple belief: every person deserves a
            fragrance that feels unmistakably theirs. We source fine fragrance oil and bottle
            it carefully — in sizes and at prices that make building a collection genuinely
            possible.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#7b7480]">
            Place your order online or over WhatsApp. We confirm every order personally,
            then deliver nationwide across South Africa. Free delivery on orders above R2&nbsp;000.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/discover"
              className="inline-flex items-center rounded-full border border-[#4f4a52] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[#4f4a52] transition-all duration-300 hover:bg-[#4f4a52] hover:text-white"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {selectedFragrance && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}

      <Footer />
    </main>
  );
}
