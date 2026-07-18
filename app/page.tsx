"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import AIHeroSection from "./components/AIHeroSection";
import LuxuryConfidenceBar from "./components/LuxuryConfidenceBar";
import BestSellers from "./components/BestSellers";
import DiscoverByMoment from "./components/DiscoverByMoment";
import LatestAdditions from "./components/LatestAdditions";
import ShopByPersonality from "./components/ShopByPersonality";
import Testimonials from "./components/Testimonials";
import MaisonCompanion from "./components/MaisonCompanion";
import YourFragranceJourney from "./components/YourFragranceJourney";
import SeasonalStory from "./components/SeasonalStory";
import Footer from "./components/Footer";
import QuickAddModal from "./components/QuickAddModal";
import { mkcCatalogue } from "./lib/mkc/catalogue";
import { toDisplayFragrance } from "./lib/mkc/displayAdapter";
import { getCollection } from "./lib/discovery";
import { getSeasonConfig, getSeasonalAcademyTeasers } from "./lib/editorial/seasonConfig";
import { useConcierge } from "./context/ConciergeContext";
import { trackAiChatStarted } from "./lib/analytics";
import CuratedForYou from "./components/CuratedForYou";

// ── Featured fragrance — first Skye best seller ───────────────────────────────
const featuredKnowledge =
  mkcCatalogue.find((k) => k.collection === "Skye" && k.bestSeller) ??
  mkcCatalogue[0];
const featuredFragrance = toDisplayFragrance(featuredKnowledge);

// ── Seasonal editorial config ─────────────────────────────────────────────────
const seasonConfig   = getSeasonConfig();
const seasonalPicks  = getCollection(seasonConfig.collectionId).map(toDisplayFragrance);
const academyTeaser  = getSeasonalAcademyTeasers(seasonConfig);

// ── Wardrobe roles ────────────────────────────────────────────────────────────
const WARDROBE_ROLES = [
  { role: "Everyday", description: "A reliable signature that works from morning to night." },
  { role: "Office", description: "Clean, confident, and considered for the workplace." },
  { role: "Evening", description: "Deeper, richer — for the moments that matter." },
  { role: "Summer", description: "Fresh and light, made for warm weather." },
  { role: "Winter", description: "Warm, enveloping, and season-defining." },
  { role: "Special Occasions", description: "The fragrance you reach for when it counts." },
];

export default function HomePage() {
  const router = useRouter();
  const { openConcierge, conversationState } = useConcierge();
  const [selectedFragrance, setSelectedFragrance] = useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const seasonalDisplay = useMemo(() => seasonalPicks, []);

  const featuredMood =
    featuredFragrance.mood ||
    "A captivating blend crafted for those who leave an impression.";

  function handleConciergeOpen() {
    openConcierge(seasonConfig.conciergeContext);
    trackAiChatStarted({ trigger: "hero-cta", sessionId: conversationState.sessionId });
  }

  return (
    <main className="min-h-screen bg-[#faf7f5] overflow-x-hidden">
      <Navbar />

      {/* ── WELCOME ────────────────────────────────────────────────────────── */}
      <AIHeroSection />

      {/* ── WHY MAISON ─────────────────────────────────────────────────────── */}
      <LuxuryConfidenceBar />

      {/* ── A FEATURED CREATION ────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="bg-[#faf7f5] rounded-[32px] md:rounded-[40px] p-6 md:p-16 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative h-[240px] md:h-[480px] w-full flex items-center justify-center rounded-[24px] bg-gradient-to-br from-[#faf7f5] via-white to-[#fdf8f6]">
              <Image
                src={featuredFragrance.images?.["10ml"] || "/placeholder-perfume.png"}
                alt={featuredFragrance.title || "Signature Scent"}
                fill
                className="object-contain p-6 transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 480px"
                priority
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#d89ca4]">
                  Featured Creation
                </span>
                {featuredFragrance.bestSeller && (
                  <span className="rounded-full border border-[#4f4a52]/20 bg-[#4f4a52]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4f4a52]">
                    Most Loved
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
                {featuredFragrance.title}
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#d89ca4]">
                {featuredFragrance.subtitle || "Signature Fragrance"}
              </p>
              {featuredFragrance.collection && (
                <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#9b9298]">
                  {featuredFragrance.collection} Collection
                </p>
              )}
              <p className="mt-5 text-sm md:text-base leading-7 text-[#7b7480] max-w-[520px]">
                {featuredMood}
              </p>
              {featuredFragrance.notes && (
                <div className="flex mt-6 flex-wrap gap-2">
                  {featuredFragrance.notes.slice(0, 3).map((note: string) => (
                    <span
                      key={note}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#d89ca4] border border-[#f0e8e8]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-6 text-2xl font-black text-[#4f4a52]">
                From R{featuredFragrance.prices["5ml"]}
              </p>
              <button
                onClick={() => router.push(`/product/${featuredKnowledge.slug}`)}
                className="mt-5 rounded-full bg-[#4f4a52] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-black hover:scale-[1.02] w-full sm:w-auto text-center"
              >
                Discover This Scent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE MAISON METHOD ──────────────────────────────────────────────── */}
      <section className="bg-[#faf7f5] py-16 md:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              The Maison Method
            </p>
            <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
              Build Your Fragrance Wardrobe
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed text-[#7b7480]">
              Just as you dress intentionally for each occasion, a fragrance wardrobe gives every moment its own signature. One bottle is a start. A wardrobe is a practice.
            </p>
            <div className="mt-6 border-l-2 border-[#d89ca4] pl-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d89ca4]">
                {seasonConfig.wardrobeHeadline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                {seasonConfig.wardrobeGuidance}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {WARDROBE_ROLES.map(({ role, description }) => (
              <div
                key={role}
                className="rounded-[20px] bg-white border border-[#f0ebe8] p-6 md:p-8"
              >
                <p className="text-sm font-black text-[#4f4a52]">{role}</p>
                <p className="mt-2 text-xs md:text-sm leading-relaxed text-[#7b7480]">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-12">
            <button
              onClick={handleConciergeOpen}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#4f4a52] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#4f4a52] transition-all duration-300 hover:bg-[#4f4a52] hover:text-white"
            >
              <Sparkles size={15} />
              Let&apos;s discover together
            </button>
          </div>
        </div>
      </section>

      {/* ── DISCOVER BY MOMENT ─────────────────────────────────────────────── */}
      <DiscoverByMoment />

      {/* ── CURATED DISCOVERY ──────────────────────────────────────────────── */}
      <section className="bg-white">
        <BestSellers
          onQuickAdd={(fragrance) => {
            setSelectedFragrance(fragrance);
            setQuickOpen(true);
          }}
        />
      </section>

      {/* ── CURATED FOR YOU ────────────────────────────────────────────────── */}
      <CuratedForYou />

      {/* ── CONTINUE LEARNING ──────────────────────────────────────────────── */}
      <section className="bg-[#faf7f5] py-16 md:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              Maison Academy
            </p>
            <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight">
              Build Your Fragrance Knowledge
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#7b7480]">
              Understanding fragrance transforms every choice from a guess into an intention. Learn at your own pace.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {academyTeaser.map(({ slug, title, excerpt, readTime }) => (
              <Link
                key={slug}
                href={`/academy/${slug}`}
                className="group block rounded-[20px] bg-white border border-[#f0ebe8] p-7 transition-all duration-300 hover:border-[#d89ca4] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d89ca4]">
                  {readTime} min read
                </p>
                <h3 className="mt-3 text-base font-black text-[#4f4a52] leading-snug">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
                  {excerpt}
                </p>
                <p className="mt-5 text-sm font-bold text-[#d89ca4]">
                  Read more →
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/academy"
              className="inline-flex items-center rounded-full border border-[#d89ca4] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#d89ca4] transition-all duration-300 hover:bg-[#d89ca4]/5"
            >
              Visit the Academy
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEED GUIDANCE? ─────────────────────────────────────────────────── */}
      <section className="bg-white">
        <ShopByPersonality />
      </section>

      {/* ── THE MAISON COMMUNITY ───────────────────────────────────────────── */}
      <section className="bg-[#faf7f5]">
        <Testimonials />
      </section>

      {/* ── CONTINUE EXPLORING ─────────────────────────────────────────────── */}
      <section className="bg-white">
        <LatestAdditions />
      </section>

      {seasonalDisplay.length > 0 && (
        <SeasonalStory
          config={seasonConfig}
          fragrances={seasonalDisplay}
          onQuickAdd={(fragrance) => {
            setSelectedFragrance(fragrance);
            setQuickOpen(true);
          }}
        />
      )}

      {/* ── A NOTE FROM MAISON ─────────────────────────────────────────────── */}
      <MaisonCompanion />

      {/* ── YOUR FRAGRANCE JOURNEY ─────────────────────────────────────────── */}
      <YourFragranceJourney />

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
