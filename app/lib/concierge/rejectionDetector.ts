/**
 * Maison Concierge — Rejection Detector (EP-AI-C3)
 *
 * Detects explicitly rejected fragrance slugs from a guest message and
 * merges them with any existing session rejections in the profile.
 *
 * Two detection mechanisms:
 *
 * 1. "None of those" / "none of these" — rejects the entire set presented
 *    in the immediately preceding assistant recommendation turn.
 *
 * 2. Named-product rejection — detects a fragrance name with negation context
 *    (e.g., "I don't like Sauvage") and rejects its slug.
 *
 * Rules:
 * - Returned array is the MERGED set: existing profile rejections + newly detected.
 * - Only products with deterministic catalogue matches are rejected — ambiguous
 *   references ("not that one") are NOT resolved here.
 * - Rejection is a hard exclusion: rejected slugs are filtered by planRetrieval
 *   even when the broad catalogue fallback is active.
 */

import { catalogueMaps } from "../discovery";
import type { ConversationProfile } from "./types";

// ── "None of those" signals ────────────────────────────────────────────────────

export const NONE_OF_THOSE_SIGNALS = [
  "none of those",
  "none of these",
  "not those",
  "not any of those",
  "not any of these",
  "none of them",
];

// ── Slug-level rejection triggers ─────────────────────────────────────────────
// Only phrases that clearly express rejection of a specific named product.
// Short negative prefixes ("no") are intentionally excluded to avoid
// false positives in phrases like "no occasion needed" near a product name.

const SLUG_REJECTION_TRIGGERS = [
  "don't like", "dont like", "do not like",
  "doesn't like", "doesnt like",
  "don't want", "dont want", "not that",
  "hate ", "dislike", "remove ", "skip ",
  "not ", "avoid ",
  "i don't", "i dont",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isWordBoundary(s: string, start: number, end: number): boolean {
  const before = start > 0            ? s[start - 1]   : " ";
  const after  = end   < s.length    ? s[end]         : " ";
  return !/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after);
}

function hasRejectionContext(q: string, nameIdx: number): boolean {
  // Look up to 60 characters before the name for a rejection trigger
  const ctx = q.slice(Math.max(0, nameIdx - 60), nameIdx);
  return SLUG_REJECTION_TRIGGERS.some((t) => ctx.includes(t));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Detects explicitly rejected fragrance slugs from `message` and merges them
 * with any slugs already in `profile.rejectedSlugs`.
 *
 * @param message                 The current guest message.
 * @param profile                 Accumulated ConversationProfile (may be undefined).
 * @param lastRecommendationSlugs Slugs presented in the immediately preceding
 *                                assistant turn — used for "none of those" detection.
 * @returns Merged list of all session-rejected slugs (existing + newly detected).
 *          Returns an empty array when no rejections are found or carried.
 */
export function detectRejections(
  message:                 string,
  profile:                 ConversationProfile | undefined,
  lastRecommendationSlugs?: string[],
): string[] {
  const q             = message.toLowerCase();
  const rejected      = new Set<string>(profile?.rejectedSlugs ?? []);

  // ── 1. "None of those" — reject the entire previous recommendation set ────────
  if (
    NONE_OF_THOSE_SIGNALS.some((p) => q.includes(p)) &&
    lastRecommendationSlugs &&
    lastRecommendationSlugs.length > 0
  ) {
    for (const slug of lastRecommendationSlugs) {
      rejected.add(slug);
    }
    return [...rejected];
  }

  // ── 2. Named-product rejection ────────────────────────────────────────────────
  // Iterate over every known fragrance slug. For each, check whether the
  // fragrance's full display name OR its base name (without " Inspired") appears
  // in the message with a rejection trigger in the preceding context.
  for (const [slug, k] of catalogueMaps.bySlug) {
    if (rejected.has(slug)) continue; // already rejected — skip

    const nameLower = k.name.toLowerCase();
    // Base name: e.g. "Sauvage Inspired" → "sauvage" (min 4 chars to avoid noise)
    const baseLower = nameLower.replace(/ inspired$/, "").trim();

    // Check full name first, then base name (longer match takes priority)
    const targets = [nameLower];
    if (baseLower.length >= 4 && baseLower !== nameLower) targets.push(baseLower);

    let matched = false;

    for (const target of targets) {
      let offset = 0;
      while (true) {
        const idx = q.indexOf(target, offset);
        if (idx === -1) break;
        offset = idx + 1;

        if (!isWordBoundary(q, idx, idx + target.length)) continue;
        if (hasRejectionContext(q, idx)) {
          rejected.add(slug);
          matched = true;
          break;
        }
      }
      if (matched) break;
    }
  }

  return [...rejected];
}
