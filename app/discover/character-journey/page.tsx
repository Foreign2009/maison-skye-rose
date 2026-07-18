import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DiscoverCollectionGrid from "../../components/DiscoverCollectionGrid";
import MomentConciergeButton from "../../components/MomentConciergeButton";
import { CHARACTER_STAGES } from "../../lib/mkc/wardrobeEngine";
import { generateCollection } from "../../lib/discovery";
import { toDisplayFragrance } from "../../lib/mkc/displayAdapter";
import type { CollectionSpec } from "../../lib/discovery/types";

export const metadata: Metadata = {
  title: "Build Your Fragrance Wardrobe | Maison Skye & Rose",
  description:
    "A guided journey through four scent character stages — from Fresh & Light to Deep & Intense. Discover your fragrance identity and build a considered wardrobe.",
  alternates: { canonical: "/discover/character-journey" },
  openGraph: {
    title: "Build Your Fragrance Wardrobe | Maison Skye & Rose",
    description:
      "A guided journey through four scent character stages — from Fresh & Light to Deep & Intense.",
    url: "/discover/character-journey",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Fragrance Wardrobe | Maison Skye & Rose",
    description:
      "A guided journey through four scent character stages — from Fresh & Light to Deep & Intense.",
  },
};

// ── Accent colours sourced from existing COLLECTION_SPECS.accentColor values ──

const CHARACTER_ACCENTS: Record<string, string> = {
  "Fresh & Light":       "#7a8fa3", // fresh-office
  "Balanced Signature":  "#6aaa8a", // everyday-wear
  "Rich & Long Wearing": "#c4935a", // vanilla-lovers
  "Deep & Intense":      "#9b7ce0", // luxury-picks
};

// ── Pre-compute stage fragrances at build time ────────────────────────────────

const stageData = CHARACTER_STAGES.map((stage) => {
  const spec: CollectionSpec = {
    id:          `character-${stage.character.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name:        stage.character,
    description: stage.description,
    tags:        [],
    icon:        "",
    accentColor: CHARACTER_ACCENTS[stage.character] ?? "#d89ca4",
    featured:    false,
    filters:     [{ type: "scentCharacter", value: stage.character }],
    boosts:      [
      { type: "bestSeller", points: 20 },
      { type: "popularity", points:  8 },
    ],
    maxItems:    8,
  };

  const products = generateCollection(spec).map((k) => ({
    ...toDisplayFragrance(k),
    scentCharacter: k.scentCharacter,
  }));

  return {
    stage,
    accent:   CHARACTER_ACCENTS[stage.character] ?? "#d89ca4",
    products,
  };
});

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CharacterJourneyPage() {
  return (
    <>
      <main className="min-h-screen bg-[#faf7f5]">
        <Navbar />

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="pt-32 md:pt-40 pb-4 px-4">
          <ol className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-[#7b7480]">
            <li>
              <Link href="/" className="hover:text-[#d89ca4] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/discover" className="hover:text-[#d89ca4] transition-colors">
                Discover
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-[#4f4a52]">Character Journey</li>
          </ol>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="px-4 pb-12 md:pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[32px] bg-white p-8 md:p-16">
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                  Maison Wardrobe Intelligence
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight md:text-6xl">
                  Build Your Fragrance Wardrobe
                </h1>

                {/* Stage quick-nav */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {CHARACTER_STAGES.map((stage, i) => (
                    <a
                      key={stage.character}
                      href={`#stage-${i + 1}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[#ede8e1] bg-[#faf7f5] px-3 py-1.5 text-[11px] font-semibold text-[#4f4a52] transition-colors hover:border-[#d89ca4] hover:text-[#d89ca4]"
                    >
                      <span className="text-[10px] text-zinc-400">Stage {i + 1}</span>
                      <span>{stage.character}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stages ──────────────────────────────────────────────────────── */}
        {stageData.map(({ stage, accent, products }, i) => (
          <Fragment key={stage.character}>

            {/* Stage section */}
            <section
              id={`stage-${i + 1}`}
              className="px-4 pb-12 md:pb-20 scroll-mt-32"
            >
              <div className="mx-auto max-w-7xl">

                {/* Stage header card */}
                <div
                  className="rounded-[24px] p-6 md:p-10 mb-8"
                  style={{ backgroundColor: `${accent}10` }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-black"
                      style={{ backgroundColor: `${accent}20`, color: accent }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-2xl font-black tracking-[-0.03em] text-[#4f4a52] md:text-3xl">
                        {stage.character}
                      </h2>
                      <p className="mt-1 text-base font-semibold" style={{ color: accent }}>
                        {stage.role}
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-[#7b7480] max-w-2xl">
                    {stage.description}
                  </p>

                  <div className="mt-5 border-l-2 pl-5" style={{ borderColor: accent }}>
                    <p className="text-sm leading-relaxed text-[#7b7480]">
                      {stage.editorial}
                    </p>
                  </div>
                </div>

                {/* Fragrance grid */}
                {products.length > 0 && (
                  <DiscoverCollectionGrid
                    fragrances={products}
                    source="discover-collection"
                    columns={4}
                  />
                )}

              </div>
            </section>

            {/* Connector to next stage */}
            {stage.nextLabel && (
              <div className="px-4 pb-10">
                <div className="mx-auto max-w-7xl">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#ede8e1]" />
                    <a
                      href={`#stage-${i + 2}`}
                      className="flex items-center gap-2 rounded-full border border-[#ede8e1] bg-white px-5 py-2.5 text-sm font-bold text-[#4f4a52] transition-all hover:border-[#d89ca4] hover:text-[#d89ca4]"
                    >
                      {stage.nextLabel} <span aria-hidden="true">↓</span>
                    </a>
                    <div className="h-px flex-1 bg-[#ede8e1]" />
                  </div>
                </div>
              </div>
            )}

          </Fragment>
        ))}

        {/* ── Concierge CTA ───────────────────────────────────────────────── */}
        <section className="bg-white py-16 px-4 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
                Your Personal Concierge
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
                Not sure which one is right for you?
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#7b7480]">
                {CHARACTER_STAGES[0].editorial}
              </p>
              <div className="mt-6">
                <MomentConciergeButton
                  context={{ occasion: "Daily Wear" }}
                  label="Help Me Build My Wardrobe"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Continue exploring ───────────────────────────────────────────── */}
        <section className="py-12 px-4 text-center">
          <div className="mx-auto max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#d89ca4]">
              Continue Exploring
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link
                href="/discover"
                className="rounded-full border border-[#ede8e1] bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#4f4a52] transition hover:border-[#d89ca4]"
              >
                All Collections
              </Link>
              <Link
                href="/shop"
                className="rounded-full bg-black px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
              >
                Browse All Fragrances
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
