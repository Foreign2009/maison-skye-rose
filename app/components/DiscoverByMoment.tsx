"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import QuickAddModal from "./QuickAddModal";
import { getCollection } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { FragranceKnowledge } from "../lib/mkc/types";
import type { ConversationContext } from "../lib/concierge/types";
import { getMomentContent } from "../lib/discovery/momentContent";
import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted, trackMomentSelected } from "../lib/analytics";

// ── Moment configuration ──────────────────────────────────────────────────────
// Editorial copy lives in app/lib/discovery/momentContent.ts.
// Inline CollectionSpecs for Winter Warmth and Special Occasion are now
// canonical entries in app/lib/discovery/collectionEngine.ts.

type MomentDef = {
  id:               string;
  label:            string;
  subtitle:         string;
  story:            string;
  insight:          string;
  academyCopy:      string;
  conciergeCopy:    string;
  conciergeContext: Partial<ConversationContext>;
  getFragrances:    () => FragranceKnowledge[];
  academySlug?:     string;
  primary:          boolean;
};

const MOMENT_PRIMARIES = [
  { id: "everyday-wear",     primary: true  },
  { id: "fresh-office",      primary: true  },
  { id: "date-night",        primary: true  },
  { id: "summer-essentials", primary: true  },
  { id: "beginner-friendly", primary: true  },
  { id: "winter-warmth",     primary: false },
  { id: "special-occasion",  primary: false },
] as const;

const MOMENTS: MomentDef[] = MOMENT_PRIMARIES.map(({ id, primary }) => {
  const c = getMomentContent(id)!;
  return {
    id,
    label:            c.label,
    subtitle:         c.subtitle,
    story:            c.story,
    insight:          c.insight,
    academyCopy:      c.academyCopy,
    conciergeCopy:    c.conciergeCopy,
    conciergeContext: c.conciergeContext,
    academySlug:      c.academySlug,
    getFragrances:    () => getCollection(id).slice(0, 4),
    primary,
  };
});

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
    openConcierge(currentMoment.conciergeContext);
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

        {/* ── Academy + Concierge + Discover footer ───────────────────────── */}
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
          <span aria-hidden="true" className="hidden h-4 w-px bg-[#e8e2de] md:block" />
          <Link
            href={`/discover/${currentMoment.id}`}
            className="text-sm font-semibold text-[#7b7480] underline-offset-4 transition-colors hover:text-[#4f4a52] hover:underline"
          >
            Explore the full {currentMoment.label} collection →
          </Link>
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
