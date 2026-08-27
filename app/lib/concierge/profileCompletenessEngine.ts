/**
 * Maison Concierge — Profile Completeness Engine (EP-AI-C5)
 *
 * Determines how much useful preference information has been accumulated for a
 * given consultation session, and selects the single highest-value clarifying
 * question when more information is genuinely needed.
 *
 * IMPORTANT: Profile completeness governs question-selection only.
 * It is NOT candidate match confidence — that is the fit score in
 * retrievalPlanner.ts. A guest with two strong preferences can receive a
 * STRONG_MATCH recommendation even when completeness is LOW.
 *
 * High-value question selection uses the current eligible catalogue pool where
 * practical to compute how much each missing dimension would actually partition
 * the candidates — not hard-coded static weights.
 */

import type { ConversationProfile } from "./types";
import { mkcCatalogue } from "../mkc/catalogue";
import type { FragranceKnowledge } from "../mkc/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CompletenessLevel = "LOW" | "MEDIUM" | "HIGH";

export type MissingDimensionKey =
  | "gender"
  | "recipientGender"
  | "family"
  | "occasion"
  | "notes"
  | "season";

export interface MissingDimension {
  key:                 MissingDimensionKey;
  label:               string;   // Human-readable question label for context
  discriminatingPower: number;   // 0–1, computed from pool distribution
}

export interface ProfileCompletenessResult {
  score:              number;          // 0–100
  level:              CompletenessLevel;
  missingDimensions:  MissingDimension[];
  clarificationFocus: string | null;   // Highest-value question label, null if not needed
}

// ── Score thresholds ──────────────────────────────────────────────────────────

const THRESHOLD_LOW    = 40;
const THRESHOLD_MEDIUM = 70;

// ── Score computation ─────────────────────────────────────────────────────────

function computeScore(profile: ConversationProfile): number {
  let score = 0;
  if (profile.preferredGender?.value) score += 25;
  if ((profile.preferredFamilies?.value.length ?? 0) > 0) score += 25;
  if ((profile.preferredOccasions?.value.length ?? 0) > 0) score += 20;
  // Gift completion: recipientGender counts for 15 pts when shoppingIntent = gift
  if (profile.shoppingIntent?.value === "gift" && profile.recipientGender?.value) {
    score += 15;
  }
  if ((profile.preferredNotes?.value.length ?? 0) > 0) score += 10;
  if ((profile.preferredSeasons?.value.length ?? 0) > 0) score += 5;
  return Math.min(score, 100);
}

// ── Pool discrimination computation ──────────────────────────────────────────
// Measures how much a missing dimension would actually partition the current
// eligible pool. Higher = asking about this dimension narrows candidates more.

function computePoolDiscrimination(
  key:  MissingDimensionKey,
  pool: FragranceKnowledge[],
): number {
  if (pool.length === 0) return 0;

  switch (key) {
    case "gender":
    case "recipientGender": {
      const counts: Record<string, number> = { male: 0, female: 0, unisex: 0 };
      for (const k of pool) counts[k.gender] = (counts[k.gender] ?? 0) + 1;
      const total = pool.length;
      // Simpson's diversity index: 1 − Σ(pᵢ²). Maximised at equal split.
      const diversity = 1 - Object.values(counts).reduce((s, c) => s + (c / total) * (c / total), 0);
      return Math.round(diversity * 100) / 100;
    }
    case "family": {
      const primaryFamilies = new Set(pool.map((k) => (k.family[0] ?? "other").toLowerCase()));
      // Normalise against 8 distinct families ≈ high-diversity catalogue
      return Math.min(primaryFamilies.size / 8, 1.0);
    }
    case "occasion": {
      const allOccasions = new Set(pool.flatMap((k) => k.occasions.map((o) => o.toLowerCase())));
      return Math.min(allOccasions.size / 10, 1.0);
    }
    case "season": {
      const seasons = new Set(pool.map((k) => k.season?.toLowerCase() ?? "all season"));
      return Math.min((seasons.size - 1) / 3, 1.0);
    }
    case "notes": {
      // Notes are plentiful across the catalogue; discrimination value is lower
      // but non-zero — specific note aversions narrow the pool meaningfully.
      return 0.25;
    }
    default:
      return 0;
  }
}

// ── Eligible pool builder ─────────────────────────────────────────────────────
// Derives the pool the guest would receive with their current constraints.
// Used to compute real discrimination power for each missing dimension.

function buildEligiblePool(profile: ConversationProfile): FragranceKnowledge[] {
  const avoidedFamilies = (profile.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
  const avoidedNotes    = (profile.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());
  const rejectedSlugs   = new Set(profile.rejectedSlugs ?? []);

  // Apply existing gender constraint so discrimination reflects the real pool
  let genderConstraint: "male" | "female" | null = null;
  if (profile.shoppingIntent?.value === "gift" && profile.recipientGender?.value) {
    const g = profile.recipientGender.value;
    if (g === "male" || g === "female") genderConstraint = g;
  } else if (profile.preferredGender?.value) {
    const g = profile.preferredGender.value;
    if (g === "male" || g === "female") genderConstraint = g;
  }

  return mkcCatalogue.filter((k) => {
    if (rejectedSlugs.has(k.slug)) return false;
    if (genderConstraint && k.gender !== genderConstraint && k.gender !== "unisex") return false;
    if (avoidedFamilies.some((af) =>
      k.family.some((f) => f.toLowerCase().includes(af) || af.includes(f.toLowerCase()))
    )) return false;
    if (avoidedNotes.some((an) =>
      [...k.notes.top, ...k.notes.heart, ...k.notes.base]
        .some((n) => n.toLowerCase().includes(an) || an.includes(n.toLowerCase()))
    )) return false;
    return true;
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

export function computeProfileCompleteness(
  profile: ConversationProfile | undefined,
): ProfileCompletenessResult {
  if (!profile) {
    return {
      score:             0,
      level:             "LOW",
      missingDimensions: [
        { key: "gender",   label: "Are you shopping for yourself, or is this a gift?",                          discriminatingPower: 0.80 },
        { key: "family",   label: "Do you lean toward fresh, woody, floral, or oriental fragrances?",           discriminatingPower: 0.70 },
        { key: "occasion", label: "When do you plan to wear this most — daily, evenings, or weekends?",         discriminatingPower: 0.50 },
      ],
      clarificationFocus: "Are you shopping for yourself, or is this a gift?",
    };
  }

  const score  = computeScore(profile);
  const level: CompletenessLevel =
    score >= THRESHOLD_MEDIUM ? "HIGH" :
    score >= THRESHOLD_LOW    ? "MEDIUM" :
    "LOW";

  // Build the eligible pool once for discrimination computation
  const eligiblePool = buildEligiblePool(profile);
  const isGift       = profile.shoppingIntent?.value === "gift";
  const missing: MissingDimension[] = [];

  if (!profile.preferredGender?.value && !isGift) {
    missing.push({
      key:                 "gender",
      label:               "Are you shopping for yourself, and if so, do you prefer men's, women's, or unisex fragrances?",
      discriminatingPower: computePoolDiscrimination("gender", eligiblePool),
    });
  }
  if (isGift && !profile.recipientGender?.value) {
    missing.push({
      key:                 "recipientGender",
      label:               "Is this gift for a man or a woman?",
      discriminatingPower: computePoolDiscrimination("recipientGender", eligiblePool),
    });
  }
  if ((profile.preferredFamilies?.value.length ?? 0) === 0) {
    missing.push({
      key:                 "family",
      label:               "Do you lean toward fresh, woody, floral, or oriental fragrances?",
      discriminatingPower: computePoolDiscrimination("family", eligiblePool),
    });
  }
  if ((profile.preferredOccasions?.value.length ?? 0) === 0) {
    missing.push({
      key:                 "occasion",
      label:               "When do you plan to wear this most — daily, evenings, or weekends?",
      discriminatingPower: computePoolDiscrimination("occasion", eligiblePool),
    });
  }
  if ((profile.preferredNotes?.value.length ?? 0) === 0) {
    missing.push({
      key:                 "notes",
      label:               "Are there any specific notes you love — like bergamot, sandalwood, or rose?",
      discriminatingPower: computePoolDiscrimination("notes", eligiblePool),
    });
  }
  if ((profile.preferredSeasons?.value.length ?? 0) === 0) {
    missing.push({
      key:                 "season",
      label:               "Is there a particular season you have in mind?",
      discriminatingPower: computePoolDiscrimination("season", eligiblePool),
    });
  }

  // Sort by discriminating power descending — highest-value question first
  missing.sort((a, b) => b.discriminatingPower - a.discriminatingPower);

  const clarificationFocus = level === "LOW" && missing.length > 0
    ? missing[0].label
    : null;

  return { score, level, missingDimensions: missing, clarificationFocus };
}
