"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import QuickAddModal from "./QuickAddModal";
import { getCollection, generateCollection } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { CollectionSpec } from "../lib/discovery";
import type { FragranceKnowledge } from "../lib/mkc/types";
import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted, trackMomentSelected } from "../lib/analytics";

// ── Inline specs for moments without an existing named COLLECTION_SPEC ────────

const WINTER_WARMTH_SPEC: CollectionSpec = {
  id:          "winter-warmth",
  name:        "Winter Warmth",
  description: "Rich, warm fragrances for the colder months.",
  tags:        ["winter", "warm", "rich", "oud", "amber"],
  icon:        "",
  accentColor: "#9b7ce0",
  featured:    false,
  filters: [
    {
      type:  "anyOf",
      anyOf: [
        { type: "season",   value: "Winter" },
        { type: "occasion", value: "Winter Evenings" },
      ],
    },
  ],
  boosts: [
    { type: "scentCharacter", value: "Rich & Long Wearing", points: 20 },
    { type: "scentCharacter", value: "Deep & Intense",      points: 15 },
    { type: "family",         value: "Oud",                 points: 15 },
    { type: "family",         value: "Amber",               points: 12 },
    { type: "bestSeller",                                    points: 10 },
  ],
  maxItems: 4,
};

const SPECIAL_OCCASION_SPEC: CollectionSpec = {
  id:          "special-occasion",
  name:        "Special Occasion",
  description: "Exceptional fragrances for extraordinary moments.",
  tags:        ["special", "wedding", "occasion", "celebration"],
  icon:        "",
  accentColor: "#d89ca4",
  featured:    false,
  filters: [
    {
      type:  "anyOf",
      anyOf: [
        { type: "occasion", value: "Wedding" },
        { type: "occasion", value: "Date Night" },
      ],
    },
  ],
  boosts: [
    { type: "bestSeller",                                    points: 20 },
    { type: "projection",     value: "strong",               points: 15 },
    { type: "scentCharacter", value: "Rich & Long Wearing",  points: 12 },
    { type: "family",         value: "Floral",               points: 10 },
  ],
  maxItems: 4,
};

// ── Moment configuration ──────────────────────────────────────────────────────
// Editorial copy and discovery logic are kept separate.
// The Discovery Engine remains responsible only for selecting fragrances.

type MomentDef = {
  id:            string;
  label:         string;
  subtitle:      string;
  description:   string;
  why:           string;
  getFragrances: () => FragranceKnowledge[];
  academySlug?:  string;
  primary:       boolean;
};

const MOMENTS: MomentDef[] = [
  {
    id:          "everyday",
    label:       "Everyday Signature",
    subtitle:    "A reliable anchor for every day.",
    description:
      "Fragrances you'll reach for without thinking. Versatile, balanced, and quietly personal — worn from morning to evening, season after season.",
    why:
      "These fragrances are rated most versatile across all occasions, making them ideal daily companions.",
    getFragrances: () => getCollection("everyday-wear").slice(0, 4),
    academySlug:   "how-to-wear-fragrance",
    primary:       true,
  },
  {
    id:          "office",
    label:       "Office & Work",
    subtitle:    "Confident, considered, and professional.",
    description:
      "Clean, refined scents suited to shared environments. Present without being distracting — the kind of fragrance that earns quiet compliments.",
    why:
      "Curated for restrained projection and freshness. These fragrances make an impression without demanding attention.",
    getFragrances: () => getCollection("fresh-office").slice(0, 4),
    academySlug:   "guide-to-fragrance-families",
    primary:       true,
  },
  {
    id:          "date-night",
    label:       "Date Night",
    subtitle:    "Memorable from the first impression.",
    description:
      "Fragrances that stay close without overwhelming the evening. Deeper, richer, and built to linger — for the moments worth remembering.",
    why:
      "Selected for warmth, sillage, and the kind of character that lingers long after you leave.",
    getFragrances: () => getCollection("date-night").slice(0, 4),
    academySlug:   "the-note-pyramid-explained",
    primary:       true,
  },
  {
    id:          "summer",
    label:       "Summer Escape",
    subtitle:    "Light, bright, and made for warmth.",
    description:
      "Fresh and vibrant fragrances that perform beautifully in the heat. Crisp without fading — alive in the sun and effortless in the air.",
    why:
      "Elevated for warm weather: high freshness, light projection, and a seasonal brightness that holds through the day.",
    getFragrances: () => getCollection("summer-essentials").slice(0, 4),
    academySlug:   "guide-to-fragrance-families",
    primary:       true,
  },
  {
    id:          "first",
    label:       "First Signature Fragrance",
    subtitle:    "Where every collection begins.",
    description:
      "Beginning your fragrance journey? These are the most approachable, versatile, and widely loved fragrances in the Maison collection — chosen to build confidence, not complexity.",
    why:
      "Recommended for their ease of wear, broad appeal, and forgiving character. The ideal starting point for any wardrobe.",
    getFragrances: () => getCollection("beginner-friendly").slice(0, 4),
    academySlug:   "guide-to-fragrance-families",
    primary:       true,
  },
  {
    id:          "winter",
    label:       "Winter Warmth",
    subtitle:    "Rich, enveloping, season-defining.",
    description:
      "Fragrances built for the cold — warm base notes that wrap around you and endure from morning to evening. Deeper. Richer. Unmistakably winter.",
    why:
      "Curated for warmth, projection, and longevity — all of which intensify beautifully in cold air.",
    getFragrances: () => generateCollection(WINTER_WARMTH_SPEC),
    academySlug:   "the-note-pyramid-explained",
    primary:       false,
  },
  {
    id:          "special",
    label:       "Special Occasion",
    subtitle:    "For the days that deserve to be remembered.",
    description:
      "Weddings, milestones, celebrations — these are the fragrances you save for when it truly counts. Exceptional, intentional, and unforgettable.",
    why:
      "Selected for distinctiveness, quality, and the ability to mark a moment rather than simply accompany it.",
    getFragrances: () => generateCollection(SPECIAL_OCCASION_SPEC),
    academySlug:   "how-to-wear-fragrance",
    primary:       false,
  },
];

const PRIMARY_MOMENTS   = MOMENTS.filter((m) => m.primary);
const SECONDARY_MOMENTS = MOMENTS.filter((m) => !m.primary);

// ── Shared pill class helper ──────────────────────────────────────────────────

function pillClass(active: boolean): string {
  return active
    ? "inline-flex min-h-[44px] items-center rounded-full bg-[#4f4a52] px-5 py-2.5 text-sm font-bold text-white transition-colors"
    : "inline-flex min-h-[44px] items-center rounded-full border border-[#e8e2de] px-5 py-2.5 text-sm text-[#7b7480] transition-colors hover:border-[#4f4a52] hover:text-[#4f4a52]";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DiscoverByMoment() {
  const { openConcierge, conversationState } = useConcierge();
  const [selectedId,        setSelectedId]        = useState(MOMENTS[0].id);
  const [showAll,           setShowAll]           = useState(false);
  const [selectedFragrance, setSelectedFragrance] =
    useState<ReturnType<typeof toDisplayFragrance> | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const currentMoment = useMemo(
    () => MOMENTS.find((m) => m.id === selectedId) ?? MOMENTS[0],
    [selectedId]
  );

  const fragrances = useMemo(
    () => currentMoment.getFragrances().map(toDisplayFragrance),
    [currentMoment]
  );

  function handleMomentSelect(id: string) {
    setSelectedId(id);
    trackMomentSelected({ momentId: id });
  }

  function handleConciergeOpen() {
    openConcierge();
    trackAiChatStarted({ trigger: "moment-cta", sessionId: conversationState.sessionId });
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            Discover by Moment
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.05em] text-[#4f4a52] md:text-5xl">
            Find the Right Scent<br className="hidden md:block" /> for Every Occasion
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#7b7480]">
            Fragrance is most powerful when it matches the moment. Select a life
            occasion and discover fragrances curated specifically for that context.
          </p>
        </div>

        {/* ── Moment selector ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2.5">
          {PRIMARY_MOMENTS.map((moment) => (
            <button
              key={moment.id}
              onClick={() => handleMomentSelect(moment.id)}
              className={pillClass(selectedId === moment.id)}
            >
              {moment.label}
            </button>
          ))}

          {showAll &&
            SECONDARY_MOMENTS.map((moment) => (
              <button
                key={moment.id}
                onClick={() => handleMomentSelect(moment.id)}
                className={pillClass(selectedId === moment.id)}
              >
                {moment.label}
              </button>
            ))}

          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex min-h-[44px] items-center rounded-full border border-dashed border-[#d0c8c4] px-5 py-2.5 text-sm text-[#9b9298] transition-colors hover:border-[#7b7480] hover:text-[#7b7480]"
            >
              + {SECONDARY_MOMENTS.length} more occasions
            </button>
          )}
        </div>

        {/* ── Editorial content for selected moment ───────────────────────── */}
        <div className="mt-10 md:mt-12">
          <h3 className="text-xl font-black tracking-[-0.03em] text-[#4f4a52] md:text-2xl">
            {currentMoment.label}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#d89ca4]">
            {currentMoment.subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#7b7480] md:text-lg">
            {currentMoment.description}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-[#9b9298]">
            {currentMoment.why}
          </p>
        </div>

        {/* ── Fragrance recommendations ────────────────────────────────────── */}

        {/* Mobile: horizontal scroll */}
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:hidden">
          {fragrances.map((fragrance) => (
            <div key={fragrance.title} className="w-[210px] flex-shrink-0 snap-start">
              <ProductCard
                {...fragrance}
                source="homepage-moment"
                onQuickAdd={() => {
                  setSelectedFragrance(fragrance);
                  setQuickOpen(true);
                }}
              />
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden mt-8 gap-8 md:grid md:grid-cols-2 lg:grid-cols-4">
          {fragrances.map((fragrance, i) => (
            <ProductCard
              key={fragrance.title}
              {...fragrance}
              source="homepage-moment"
              rank={i + 1}
              onQuickAdd={() => {
                setSelectedFragrance(fragrance);
                setQuickOpen(true);
              }}
            />
          ))}
        </div>

        {/* ── Academy + Concierge footer ───────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-12">
          {currentMoment.academySlug && (
            <Link
              href={`/academy/${currentMoment.academySlug}`}
              className="text-sm font-semibold text-[#7b7480] underline-offset-4 transition-colors hover:text-[#4f4a52] hover:underline"
            >
              Learn about this fragrance style →
            </Link>
          )}
          <span aria-hidden="true" className="hidden h-4 w-px bg-[#e8e2de] md:block" />
          <button
            onClick={handleConciergeOpen}
            className="text-sm font-semibold text-[#d89ca4] transition-colors hover:text-[#c48898]"
          >
            Ask your Concierge for a personal recommendation
          </button>
        </div>

      </div>

      {/* QuickAdd modal */}
      {selectedFragrance && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selectedFragrance.title}
          images={selectedFragrance.images}
          prices={selectedFragrance.prices}
        />
      )}
    </section>
  );
}
