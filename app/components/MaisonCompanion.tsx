"use client";

import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useConcierge } from "../context/ConciergeContext";
import { catalogueMaps } from "../lib/discovery";
import { trackAiChatStarted } from "../lib/analytics";
import type { FragranceKnowledge } from "../lib/mkc/types";
import type { ConversationContext } from "../lib/concierge/types";

// ── Pattern types ─────────────────────────────────────────────────────────────

type Pattern =
  | { type: "family";    value: string; count: number }
  | { type: "season";    value: string; count: number }
  | { type: "character"; value: string; count: number };

// ── Editorial observation library ─────────────────────────────────────────────
// Each observation names the pattern and explains the why — transparent,
// not algorithmic.

const FAMILY_OBSERVATIONS: Record<string, string> = {
  "Oud":
    "There is a clear warmth and depth running through your taste. Oud-forward fragrances reward those who wear them with patience — they reveal themselves slowly, becoming more personal over the course of a day.",
  "Fresh":
    "Your selections lean toward freshness — clean, open fragrances that feel effortless rather than deliberate. These are among the most versatile in any wardrobe.",
  "Floral":
    "Florals appear consistently in what you've been exploring. At their best, they carry real character — not decorative, but deeply personal.",
  "Amber":
    "A pattern of warmth and richness runs through your choices. Amber fragrances tend to be the ones that linger longest in memory — the kind people notice without quite knowing why.",
  "Woody":
    "Woody fragrances keep appearing in your exploration — grounded, confident, and rarely in need of announcement. They form the backbone of many of the most enduring signatures.",
  "Citrus":
    "Freshness and brightness characterise your selections. Citrus fragrances perform beautifully in warmth and as everyday signatures — immediate and honest.",
  "Aquatic":
    "Your taste runs toward clean, open fragrances. Aquatic compositions have a particular quality — they feel like breathing room, which makes them among the most wearable.",
  "Spicy":
    "Spice appears consistently in your exploration — fragrances with edge and presence, but without the weight that comes from heavier compositions.",
  "Gourmand":
    "A warmth and sweetness runs through your selections. Gourmand fragrances are among the most personal — the ones people remember long after you've left.",
  "Vanilla":
    "Your choices share a softness and comfort. Vanilla-forward fragrances become more yours over time — they settle into skin chemistry in a way that feels genuinely individual.",
  "Rose":
    "Rose appears across your taste — an ingredient that has outlasted every trend precisely because it is never just one thing. It can be delicate, assertive, or quietly powerful.",
  "Musk":
    "There is a quiet intimacy to what you've been exploring. Musk fragrances project softly but stay close — personal, not performed.",
};

const SEASON_OBSERVATIONS: Record<string, string> = {
  "Winter":
    "Your saved fragrances lean toward winter wear — rich, enveloping compositions that reward cold air and evening contexts. Base notes deepen in winter in a way that changes the entire experience.",
  "Summer":
    "A clear freshness runs through your selections. These are fragrances that perform best in warmth — light enough for the heat, but with enough character to hold through the day.",
  "Autumn":
    "Your taste runs toward the transitional warmth of autumn — spice, woods, and a quieter kind of richness that sits differently on skin as the air cools.",
  "Spring":
    "Spring fragrances appear consistently in what you've been exploring — fresh, floral, and confident without heaviness. The kind of fragrance that feels like the right choice the moment you put it on.",
};

const CHARACTER_OBSERVATIONS: Record<string, string> = {
  "Fresh & Light":
    "You're drawn to fragrances that wear easily and never overstate. Fresh and light compositions are the most forgiving in any wardrobe — they work in almost any context and for almost any mood.",
  "Rich & Long Wearing":
    "Your taste runs toward fragrances that last. Rich, long-wearing compositions reward patience — they give more over time, not less, and tend to be the ones that make the strongest impression by the end of the day.",
  "Deep & Intense":
    "There is depth in what you've been exploring. Intense fragrances require a considered wearer — someone who understands that a measured application, well placed, is more powerful than a generous one.",
  "Balanced Signature":
    "You're exploring balanced fragrances — the kind that work everywhere without ever feeling generic. These are built to become signatures, not statements.",
  "Bold & Distinctive":
    "A boldness runs through your selections. These are fragrances for someone who knows what they want — they project confidently and stay memorable without asking for attention.",
  "Soft & Sensual":
    "Your choices share a softness and warmth. These fragrances stay close rather than projecting — intimate, not performed. The kind noticed by the person standing next to you, not the room.",
};

// ── Pattern extraction ────────────────────────────────────────────────────────

function extractPatterns(items: FragranceKnowledge[]): Pattern[] {
  if (items.length < 2) return [];

  const familyCount   = new Map<string, number>();
  const seasonCount   = new Map<string, number>();
  const charCount     = new Map<string, number>();

  for (const k of items) {
    for (const fam of k.family) {
      familyCount.set(fam, (familyCount.get(fam) ?? 0) + 1);
    }
    if (k.season !== "All Season") {
      seasonCount.set(k.season, (seasonCount.get(k.season) ?? 0) + 1);
    }
    charCount.set(k.scentCharacter, (charCount.get(k.scentCharacter) ?? 0) + 1);
  }

  const patterns: Pattern[] = [];

  const topFamily = [...familyCount.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topFamily && topFamily[1] >= 2) {
    patterns.push({ type: "family", value: topFamily[0], count: topFamily[1] });
  }

  const topSeason = [...seasonCount.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topSeason && topSeason[1] >= 2) {
    patterns.push({ type: "season", value: topSeason[0], count: topSeason[1] });
  }

  const topChar = [...charCount.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topChar && topChar[1] >= 2) {
    patterns.push({ type: "character", value: topChar[0], count: topChar[1] });
  }

  return patterns;
}

function buildObservation(pattern: Pattern): string {
  switch (pattern.type) {
    case "family":
      return (
        FAMILY_OBSERVATIONS[pattern.value] ??
        `Your taste leans consistently toward ${pattern.value.toLowerCase()} fragrances — a clear thread running through what you've been exploring.`
      );
    case "season":
      return (
        SEASON_OBSERVATIONS[pattern.value] ??
        `Your selections lean toward ${pattern.value.toLowerCase()} fragrances — a seasonal preference that shapes which compositions will feel most right for you.`
      );
    case "character":
      return (
        CHARACTER_OBSERVATIONS[pattern.value] ??
        `A consistent character runs through your taste — ${pattern.value.toLowerCase()} fragrances appear across both what you've saved and what you've been exploring.`
      );
  }
}

function buildConciergeContext(patterns: Pattern[]): Partial<ConversationContext> {
  const ctx: Partial<ConversationContext> = {};
  const familyPattern = patterns.find((p) => p.type === "family");
  const seasonPattern = patterns.find((p) => p.type === "season");
  if (familyPattern) ctx.preferredFamily = [familyPattern.value];
  if (seasonPattern) ctx.season = seasonPattern.value;
  return ctx;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MaisonCompanion() {
  const { favorites } = useFavorites();
  const { openConcierge, conversationState } = useConcierge();
  const [recentTitles, setRecentTitles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(
        localStorage.getItem("recentlyViewed") ?? "[]"
      ) as Array<{ title: string }>;
      setRecentTitles(raw.map((r) => r.title));
    } catch {
      // localStorage unavailable or malformed — render nothing
    }
  }, []);

  const favoriteKnowledge = useMemo(
    () =>
      favorites
        .map((f) => catalogueMaps.byName.get(f.title))
        .filter((k): k is FragranceKnowledge => k !== undefined),
    [favorites]
  );

  const recentKnowledge = useMemo(
    () =>
      recentTitles
        .map((title) => catalogueMaps.byName.get(title))
        .filter((k): k is FragranceKnowledge => k !== undefined),
    [recentTitles]
  );

  // Combined unique set — deduped by slug, favorites first
  const allKnowledge = useMemo(() => {
    const seen = new Set<string>();
    const combined: FragranceKnowledge[] = [];
    for (const k of [...favoriteKnowledge, ...recentKnowledge]) {
      if (!seen.has(k.slug)) {
        seen.add(k.slug);
        combined.push(k);
      }
    }
    return combined;
  }, [favoriteKnowledge, recentKnowledge]);

  const patterns     = useMemo(() => extractPatterns(allKnowledge), [allKnowledge]);
  const observations = useMemo(() => patterns.slice(0, 2).map(buildObservation), [patterns]);
  const conciergeCtx = useMemo(() => buildConciergeContext(patterns), [patterns]);

  // Render nothing for visitors with insufficient signal
  if (allKnowledge.length < 2 || patterns.length === 0) return null;

  function handleConciergeOpen() {
    openConcierge(conciergeCtx);
    trackAiChatStarted({ trigger: "companion-cta", sessionId: conversationState.sessionId });
  }

  const familyPattern = patterns.find((p) => p.type === "family");
  const footerCopy = familyPattern
    ? `Your Concierge can take this further — exploring ${familyPattern.value.toLowerCase()} fragrances in more depth and helping you find the ones that suit your character most precisely.`
    : "Your Concierge can help you explore what this tells you about your fragrance personality — and where to go from here.";

  return (
    <section className="bg-white py-16 px-5 md:py-24">
      <div className="mx-auto max-w-2xl">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
          A Note from Maison
        </p>
        <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-3xl">
          What we&apos;ve noticed about your taste
        </h2>

        {/* ── Observations ──────────────────────────────────────────────── */}
        <div className="mt-8 space-y-6">
          {observations.map((obs, i) => (
            <div key={i} className="border-l-2 border-[#d89ca4] pl-5">
              <p className="text-base leading-[1.85] text-[#7b7480]">
                {obs}
              </p>
            </div>
          ))}
        </div>

        {/* ── Concierge continuation ─────────────────────────────────────── */}
        <div className="mt-10 border-t border-[#f0ebe8] pt-8">
          <p className="text-sm leading-relaxed text-[#7b7480]">
            {footerCopy}
          </p>
          <button
            onClick={handleConciergeOpen}
            className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-[#4f4a52] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-black hover:scale-[1.02]"
          >
            ✦ Continue with your Concierge
          </button>
        </div>

      </div>
    </section>
  );
}
