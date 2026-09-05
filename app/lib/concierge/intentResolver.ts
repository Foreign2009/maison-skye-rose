/**
 * Maison Concierge — Intent Resolver
 *
 * Classifies free-text customer messages into one of 8 supported intents
 * and extracts entity references (fragrance slugs, collection hints) using
 * the catalogueMaps from the discovery layer.
 */

import { parseIntent } from "../intentParser";
import { catalogueMaps } from "../discovery";
import type { ConversationIntent, ConversationContext } from "./types";
import type { IntentSignals } from "../intentParser";

// ── Intent trigger phrases ────────────────────────────────────────────────────

const COMPARISON_TRIGGERS  = [" vs ", " versus ", "compare", "difference between", "vs.", "which is better", "which one"];
const EDUCATION_TRIGGERS   = ["what is ", "what are ", "what notes", "explain ", "teach me", "how does", "why does", "tell me about", "how do", "what makes", "what's the difference between"];
// "friend" as a bare substring matches inside "travel-friendly"; use specific
// phrase forms so the trigger requires the word to appear as part of gift language.
const GIFT_TRIGGERS        = ["gift", "present", "for my ", "someone else", "for her", "for him", "for them", "buying for", "mother", "father", "partner", "for a friend", "my friend", "a friend", "friend's"];
const SIMILAR_TRIGGERS     = ["similar to", "like ", "reminds me of", "same as", "alternatives to", "dupe for", "smells like", "something like"];
const SEASONAL_TRIGGERS    = ["in summer", "for summer", "in winter", "for winter", "in spring", "for spring", "in autumn", "for autumn", "summer ", "winter ", "autumn ", "spring "];

// ── Public types ──────────────────────────────────────────────────────────────

export interface ResolvedIntent {
  intent:      ConversationIntent;
  signals:     IntentSignals;
  entitySlug?: string;
  compareSlug: string[];
}

// ── Entity extraction ─────────────────────────────────────────────────────────

// Suffixes Maison appends to inspired products in canonical names.
// Stripping these reveals the natural product name a guest would use.
const MAISON_PRODUCT_SUFFIXES = [" Inspired", " Eau de Parfum", " EDP", " Eau de Toilette", " EDT"];

function stripMaisonSuffix(name: string): string {
  for (const suffix of MAISON_PRODUCT_SUFFIXES) {
    if (name.endsWith(suffix)) return name.slice(0, -suffix.length);
  }
  return name;
}

// Normalizes user-input punctuation for entity matching.
// Periods are replaced with spaces so "No. 5" and "No.5" both match bare key "No 5".
// Apostrophes, hyphens, and other identity-significant characters are preserved.
function normalizeInputForEntityMatch(s: string): string {
  return s.replace(/\./g, " ").replace(/\s+/g, " ").trim();
}

// Very short entity keys (≤ 2 chars, e.g. "y" from "Y Inspired") match as a plain
// substring inside common words ("cozy", "woody") creating ghost entity matches.
// Require a word boundary for short keys so "y" is only resolved when it appears
// as a standalone token. Longer keys keep the existing substring check.
function entityKeyFoundInQuery(key: string, qNorm: string): boolean {
  if (key.length <= 2) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`).test(qNorm);
  }
  return qNorm.includes(key);
}

function extractFragranceSlugs(q: string): string[] {
  // Build a combined lookup: full canonical names + bare names (Maison suffix stripped).
  // Sorting longest-first ensures specific flanker names ("Sauvage Elixir") are matched
  // before their shorter prefixes ("Sauvage"), preventing phantom disambiguation.
  type Entry = { key: string; slug: string };
  const seenKeys = new Set<string>();
  const entries: Entry[] = [];

  for (const [name, frag] of catalogueMaps.byName) {
    const fullKey = name.toLowerCase();
    if (!seenKeys.has(fullKey)) {
      entries.push({ key: fullKey, slug: frag.slug });
      seenKeys.add(fullKey);
    }
    const bare = stripMaisonSuffix(name);
    if (bare !== name) {
      const bareKey = bare.toLowerCase();
      if (!seenKeys.has(bareKey)) {
        entries.push({ key: bareKey, slug: frag.slug });
        seenKeys.add(bareKey);
      }
    }
  }

  entries.sort((a, b) => b.key.length - a.key.length);

  const qNorm = normalizeInputForEntityMatch(q);
  const found: string[] = [];
  const matchedKeys: string[] = [];

  for (const { key, slug } of entries) {
    if (!entityKeyFoundInQuery(key, qNorm)) continue;
    if (found.includes(slug)) continue;
    // Flanker safety: if a longer already-matched key starts with this key,
    // this is a prefix-overlap — skip to prevent collapsing distinct flankers.
    if (matchedKeys.some((mk) => mk.startsWith(key) && mk.length > key.length)) continue;
    found.push(slug);
    matchedKeys.push(key);
  }

  return found;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function resolveIntent(message: string, context: ConversationContext): ResolvedIntent {
  const q       = message.toLowerCase();
  const signals = parseIntent(q);

  // 1. Resolve fragrance entities from message text
  const mentionedSlugs = extractFragranceSlugs(q);
  let entitySlug: string | undefined;
  let compareSlug: string[] = [];
  let entityFromMessage = false; // true when entity resolved from current message, not context fallback

  if (mentionedSlugs.length === 1) {
    entitySlug = mentionedSlugs[0];
    entityFromMessage = true;
  } else if (mentionedSlugs.length >= 2) {
    compareSlug  = mentionedSlugs.slice(0, 2);
    [entitySlug] = compareSlug;
    entityFromMessage = true;
  }

  // Fall back to context entity if none found in this message
  if (!entitySlug && context.mentionedSlug) {
    entitySlug = context.mentionedSlug;
  }

  // 2. Classify intent

  if (compareSlug.length >= 2 || COMPARISON_TRIGGERS.some((t) => q.includes(t))) {
    return { intent: "comparison", signals, entitySlug, compareSlug };
  }

  if (EDUCATION_TRIGGERS.some((t) => q.includes(t))) {
    return { intent: "education", signals, entitySlug, compareSlug: [] };
  }

  if (GIFT_TRIGGERS.some((t) => q.includes(t))) {
    return { intent: "gift", signals, entitySlug, compareSlug: [] };
  }

  if (SIMILAR_TRIGGERS.some((t) => q.includes(t)) && entitySlug) {
    return { intent: "similar_to", signals, entitySlug, compareSlug: [] };
  }

  // Gender target pivot guard: when entitySlug comes only from context.mentionedSlug (not the
  // current message) and the message is a clear gender target pivot ("and female", "for women
  // instead", "and male"), the implicit PDP anchor must NOT force similar_to. Clear the
  // context-inherited entitySlug so routing falls through to seasonal or general_discovery.
  // Explicit fragrance names in the message retain full entity authority.
  const isGenderPivotOnly = !entityFromMessage && /\b(and female|and male|for women|for men|for female|for male|female fragrances?|male fragrances?|what about female|what about male|show me (?:the )?(?:female|male|women'?s|men'?s))\b/.test(q);
  if (entitySlug && !signals.occasion && !signals.family) {
    if (isGenderPivotOnly) {
      entitySlug = undefined; // release context anchor — fall through to seasonal/discovery
    } else {
      return { intent: "similar_to", signals, entitySlug, compareSlug: [] };
    }
  }

  if (SEASONAL_TRIGGERS.some((t) => q.includes(t)) || signals.occasion?.match(/summer|winter|spring|autumn/i)) {
    return { intent: "seasonal", signals, entitySlug, compareSlug: [] };
  }

  if (signals.occasion) {
    return { intent: "occasion_search", signals, entitySlug, compareSlug: [] };
  }

  // Very short message with no signals → ask for clarification
  if (q.split(" ").length <= 3 && !signals.family && !signals.vibe) {
    return { intent: "clarification", signals, entitySlug, compareSlug: [] };
  }

  return { intent: "general_discovery", signals, entitySlug, compareSlug: [] };
}
