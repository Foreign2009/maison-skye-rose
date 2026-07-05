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
// Editorial copy (story, insight, academyCopy, conciergeCopy) is kept entirely
// separate from recommendation logic. The Discovery Engine remains responsible
// only for selecting fragrances.

type MomentDef = {
  id:            string;
  label:         string;
  subtitle:      string;
  story:         string;
  insight:       string;
  academyCopy:   string;
  conciergeCopy: string;
  getFragrances: () => FragranceKnowledge[];
  academySlug?:  string;
  primary:       boolean;
};

const MOMENTS: MomentDef[] = [
  {
    id:       "everyday",
    label:    "Everyday Signature",
    subtitle: "A reliable anchor for every day.",
    story:
      "The fragrances we reach for every morning shape how the day begins. An everyday signature does not announce itself — it becomes part of who you are. Over time, it is the scent others associate with you without ever naming it.",
    insight:
      "Versatility is not a limitation. It is the mark of a fragrance confident enough to work everywhere.",
    academyCopy:
      "Learn how application and layering build all-day presence",
    conciergeCopy:
      "Your Concierge can help build your daily fragrance rotation based on your lifestyle",
    getFragrances: () => getCollection("everyday-wear").slice(0, 4),
    academySlug:   "how-to-wear-fragrance",
    primary:       true,
  },
  {
    id:       "office",
    label:    "Office & Work",
    subtitle: "Confident, considered, and professional.",
    story:
      "A workplace fragrance walks a careful line — it must project enough to feel intentional, yet not so much that it commands the room. The best office fragrances are the ones that make someone lean in slightly and quietly wonder.",
    insight:
      "Freshness and restraint are not compromises. They are the craft of choosing a fragrance for shared spaces.",
    academyCopy:
      "Discover which fragrance families perform best in professional environments",
    conciergeCopy:
      "Describe your workplace — your Concierge will suggest the right balance of presence and restraint",
    getFragrances: () => getCollection("fresh-office").slice(0, 4),
    academySlug:   "guide-to-fragrance-families",
    primary:       true,
  },
  {
    id:       "date-night",
    label:    "Date Night",
    subtitle: "Memorable from the first impression.",
    story:
      "An evening fragrance is part of the first impression, even before you speak. Worn well, it creates a peripheral awareness — a lingering presence that suggests confidence without demanding attention. These are fragrances that stay close.",
    insight:
      "The best evening fragrances are not loud. They are deep. Character, not volume, is what lingers.",
    academyCopy:
      "Discover how top, heart, and base notes unfold over the course of an evening",
    conciergeCopy:
      "Describe your evening — your Concierge will find your perfect match for the occasion",
    getFragrances: () => getCollection("date-night").slice(0, 4),
    academySlug:   "the-note-pyramid-explained",
    primary:       true,
  },
  {
    id:       "summer",
    label:    "Summer Escape",
    subtitle: "Light, bright, and made for warmth.",
    story:
      "Summer changes how fragrance behaves. Warmth intensifies projection and accelerates the drydown — what works in winter can feel overwhelming in the sun. The right summer fragrance is alive in the heat, light on the air, and effortless to wear from morning through to evening.",
    insight:
      "In summer, freshness is not just a note. It is a performance requirement.",
    academyCopy:
      "Learn how temperature affects fragrance families and why season matters in selection",
    conciergeCopy:
      "Tell your Concierge where you're headed this season and discover fragrances made for the journey",
    getFragrances: () => getCollection("summer-essentials").slice(0, 4),
    academySlug:   "guide-to-fragrance-families",
    primary:       true,
  },
  {
    id:       "first",
    label:    "First Signature Fragrance",
    subtitle: "Where every collection begins.",
    story:
      "Every fragrance wardrobe begins somewhere. The first signature is rarely the boldest or most complex — it is the one that feels right without needing to understand why. These are fragrances that welcome you into the practice of fragrance without overwhelming you with it.",
    insight:
      "The most approachable fragrances are not the least interesting. They are the most considered.",
    academyCopy:
      "Start with the fundamentals — discover the fragrance families that will guide your entire journey",
    conciergeCopy:
      "Your Concierge specialises in first signatures — share your instincts and let the journey begin",
    getFragrances: () => getCollection("beginner-friendly").slice(0, 4),
    academySlug:   "guide-to-fragrance-families",
    primary:       true,
  },
  {
    id:       "winter",
    label:    "Winter Warmth",
    subtitle: "Rich, enveloping, season-defining.",
    story:
      "Cold air is fragrance's most generous companion. In winter, base notes deepen, warmth amplifies, and the body's natural heat draws out a fragrance's fullest character. These are the scents built for that relationship — rich, enveloping, and made to endure.",
    insight:
      "Oud, amber, and warm woods are not trends. They are winter's native language.",
    academyCopy:
      "Understand how base notes define winter fragrances and why longevity matters in the cold",
    conciergeCopy:
      "Your Concierge can match you with a winter warmth that suits your character precisely",
    getFragrances: () => generateCollection(WINTER_WARMTH_SPEC),
    academySlug:   "the-note-pyramid-explained",
    primary:       false,
  },
  {
    id:       "special",
    label:    "Special Occasion",
    subtitle: "For the days that deserve to be remembered.",
    story:
      "Some fragrances are worn every day. Others are chosen for a single, specific day. A special occasion fragrance carries the weight of what it marks — it should feel exceptional, considered, and worthy of the moment it accompanies.",
    insight:
      "A fragrance worn on a meaningful day becomes permanently woven into the memory of that day.",
    academyCopy:
      "Explore what makes a fragrance truly exceptional and how to wear it for lasting impact",
    conciergeCopy:
      "Share your occasion with your Concierge — they will help you select a fragrance you'll remember",
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

        {/* ── Editorial story for selected moment ─────────────────────────── */}
        <div className="mt-10 md:mt-12">

          {/* Title + subtitle */}
          <h3 className="text-xl font-black tracking-[-0.03em] text-[#4f4a52] md:text-2xl">
            {currentMoment.label}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#d89ca4]">
            {currentMoment.subtitle}
          </p>

          {/* Story — editorial narrative */}
          <p className="mt-6 max-w-2xl text-base leading-[1.85] text-[#7b7480] md:text-lg">
            {currentMoment.story}
          </p>

          {/* Maison Insight — accent callout */}
          <div className="mt-6 max-w-xl border-l-2 border-[#d89ca4] pl-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d89ca4]">
              Maison Insight
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
              {currentMoment.insight}
            </p>
          </div>

        </div>

        {/* ── Fragrance recommendations ────────────────────────────────────── */}

        {/* Mobile: horizontal scroll */}
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:hidden">
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
        <div className="hidden mt-10 gap-8 md:grid md:grid-cols-2 lg:grid-cols-4">
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
              {currentMoment.academyCopy} →
            </Link>
          )}
          <span aria-hidden="true" className="hidden h-4 w-px bg-[#e8e2de] md:block" />
          <button
            onClick={handleConciergeOpen}
            className="text-sm font-semibold text-[#d89ca4] transition-colors hover:text-[#c48898]"
          >
            {currentMoment.conciergeCopy}
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
