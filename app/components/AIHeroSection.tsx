"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted } from "../lib/analytics";

export default function AIHeroSection() {
  const { openConcierge, conversationState } = useConcierge();

  function handleDiscoverClick() {
    openConcierge();
    trackAiChatStarted({ trigger: "hero-cta", sessionId: conversationState.sessionId });
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf9f7] via-[#faf7f5] to-[#f5ede8] py-20 md:py-32">
      {/* Atmospheric vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 90% 10%, #f3dede28, transparent)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Editorial copy */}
          <div className="max-w-xl animate-fade-in-up">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
              A Digital Fragrance House
            </p>

            <h1 className="mt-5 text-[2rem] font-black leading-[1.05] tracking-[-0.04em] text-[#4f4a52] md:text-[3.5rem] lg:text-[2.75rem] xl:text-[4rem]">
              Find Your<br />
              Signature Scent
            </h1>

            <p className="mt-6 max-w-[460px] text-base leading-relaxed text-[#7b7480] md:text-lg">
              Not a catalogue — a curated fragrance experience. Your personal
              Concierge guides you through 93 carefully chosen scents to build
              a collection that&apos;s unmistakably yours.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={handleDiscoverClick}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#4f4a52] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black"
              >
                <Sparkles size={16} />
                Discover Your Scent
              </button>

              <Link
                href="/shop"
                className="inline-flex items-center rounded-full border border-[#d89ca4] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#d89ca4] transition-all duration-300 hover:bg-[#d89ca4]/5"
              >
                Explore the Collection
              </Link>
            </div>

            <p className="mt-8 text-[11px] text-[#9b9298]">
              Start with 5ml &middot; Build your collection &middot; Nationwide delivery
            </p>
          </div>

          {/* Bottle showcase */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[340px] animate-float motion-reduce:animate-none md:max-w-[440px]">
              {/* Ambient glow */}
              <div
                aria-hidden="true"
                className="absolute inset-[10%] rounded-full bg-[#f3dede] opacity-30 blur-3xl pointer-events-none"
              />
              <Image
                src="/images/glass-pink-30ml.png"
                alt="Maison Skye & Rose signature 30ml fragrance bottle"
                fill
                priority
                className="relative object-contain"
                sizes="(max-width: 768px) 340px, 440px"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
