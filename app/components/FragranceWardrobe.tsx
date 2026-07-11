"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted } from "../lib/analytics";
import { computeWardrobe } from "../lib/mkc/wardrobeEngine";
import type { FragranceKnowledge } from "../lib/mkc/types";
import type { SimilarityResult } from "../lib/discovery/types";
import { NoteChip } from "./knowledge/NoteChip";
import { KnowledgeChip } from "./knowledge/KnowledgeChip";

// ── Helpers ───────────────────────────────────────────────────────────────────

function wardrobeNote(
  current:   FragranceKnowledge,
  companion: FragranceKnowledge,
): string {
  if (companion.scentCharacter !== current.scentCharacter) {
    const map: Partial<Record<FragranceKnowledge["scentCharacter"], string>> = {
      "Fresh & Light":       "A lighter contrast for daytime",
      "Balanced Signature":  "An everyday alternative",
      "Rich & Long Wearing": "A richer option for evenings",
      "Deep & Intense":      "A deeper statement for special occasions",
    };
    return map[companion.scentCharacter] ?? "A complementary wardrobe addition";
  }
  if (companion.season !== current.season) {
    return `A ${companion.season.toLowerCase()} companion`;
  }
  return "A natural everyday companion";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FragranceWardrobe({
  knowledge,
  companions,
}: {
  knowledge:  FragranceKnowledge;
  companions: SimilarityResult[];
}) {
  const wardrobe = useMemo(() => computeWardrobe(knowledge), [knowledge]);
  const { openConcierge, conversationState } = useConcierge();

  const validCompanions = companions.slice(0, 2);

  return (
    <div className="rounded-3xl bg-white p-6 md:p-10">
      <h2 className="text-2xl font-black text-[#4f4a52]">Wardrobe Foundations</h2>

      <div className="mt-8 space-y-8">

        {/* 1 · Best For ──────────────────────────────────────────────────────── */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
            Best For
          </p>
          <div className="flex flex-wrap gap-2">
            {wardrobe.bestFor.map((o) => (
              <KnowledgeChip key={o} label={o} variant="bordered" />
            ))}
          </div>
        </div>

        {/* 2 · Wardrobe Role ─────────────────────────────────────────────────── */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
            Wardrobe Role
          </p>
          <p className="text-base font-black text-[#4f4a52]">{wardrobe.wardrobeRole}</p>
          <p className="mt-2 text-sm leading-7 text-zinc-600">{wardrobe.roleDescription}</p>
        </div>

        {/* 3 · Personality — conditional on vibe ────────────────────────────── */}
        {wardrobe.personality.length > 0 && (
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
              Personality
            </p>
            <div className="flex flex-wrap gap-2">
              {wardrobe.personality.map((v) => (
                <NoteChip key={v} note={v} />
              ))}
            </div>
          </div>
        )}

        {/* 4 · Works Well With ───────────────────────────────────────────────── */}
        {validCompanions.length > 0 && (
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
              Works Well With
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {validCompanions.map((result) => (
                <Link
                  key={result.fragrance.slug}
                  href={`/product/${result.fragrance.slug}`}
                  className="rounded-2xl border border-[#ede8e1] bg-[#f9f7f4] px-5 py-4 transition-colors hover:border-[#d89ca4]/60 hover:bg-[#fdf6f7]"
                >
                  <p className="text-sm font-bold text-[#4f4a52]">{result.fragrance.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{result.fragrance.profile}</p>
                  <p className="mt-2 text-[11px] font-semibold text-[#d89ca4]">
                    {wardrobeNote(knowledge, result.fragrance)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 5 · Your Collection Journey ───────────────────────────────────────── */}
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
            Your Collection Journey
          </p>
          <p className="text-sm leading-7 text-zinc-600">{wardrobe.journey.editorial}</p>
          {wardrobe.journey.nextLabel && (
            <Link
              href="/quiz"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#d89ca4] transition hover:opacity-70"
            >
              {wardrobe.journey.nextLabel} →
            </Link>
          )}
        </div>

        {/* 6 · Concierge CTA ─────────────────────────────────────────────────── */}
        <div className="border-t border-[#f0ebe5] pt-6">
          <button
            onClick={() => {
              openConcierge({
                mentionedSlug:   knowledge.slug,
                preferredFamily: knowledge.family,
                occasion:        knowledge.occasions[0],
              });
              trackAiChatStarted({
                trigger:   "wardrobe",
                sessionId: conversationState.sessionId,
              });
            }}
            className="w-full rounded-2xl border border-[#efe8e1] bg-white py-3 text-sm font-semibold text-[#4f4a52] transition hover:border-[#d89ca4] hover:text-[#d89ca4]"
          >
            ✦ Build My Wardrobe with the Concierge
          </button>
        </div>

      </div>
    </div>
  );
}
