/**
 * EP6-P5E-R — Deterministic Fragrance Comparison Utility
 *
 * Pure function. Compares two FragranceKnowledge records field-by-field.
 * Returns a typed summary of shared and differing characteristics.
 *
 * CONSTRAINTS:
 *   - No side effects. No mutations. No I/O.
 *   - No persistence imports. No queue. No ledger. No service.
 *   - No editorial decision vocabulary. No guidance output. No editorial judgment.
 *   - No AI imports. No external API calls.
 *   - Same inputs always produce the same output.
 *
 * This utility surfaces what Maison currently records for two fragrances.
 * It does NOT determine editorial correctness or Maison positioning.
 * Evidence informs. The founder decides.
 */

import type { FragranceKnowledge } from "@/app/lib/mkc/types";

// ── Intelligence attributes ────────────────────────────────────────────────────

export type IntelligenceAttributes = {
  readonly sweetness: number;
  readonly freshness: number;
  readonly warmth:    number;
  readonly intensity: number;
};

// ── Comparison summary type ────────────────────────────────────────────────────

export type RelationshipComparisonSummary = {
  // Classification
  readonly genderA:             FragranceKnowledge["gender"];
  readonly genderB:             FragranceKnowledge["gender"];
  readonly genderMatch:         boolean;
  readonly collectionA:         FragranceKnowledge["collection"];
  readonly collectionB:         FragranceKnowledge["collection"];
  readonly collectionMatch:     boolean;
  readonly scentCharacterA:     FragranceKnowledge["scentCharacter"];
  readonly scentCharacterB:     FragranceKnowledge["scentCharacter"];
  readonly scentCharacterMatch: boolean;
  readonly projectionA:         FragranceKnowledge["projection"];
  readonly projectionB:         FragranceKnowledge["projection"];
  readonly profileA:            string;
  readonly profileB:            string;
  // Family
  readonly sharedFamilies:      readonly string[];
  readonly uniqueFamiliesA:     readonly string[];
  readonly uniqueFamiliesB:     readonly string[];
  // Notes
  readonly sharedTopNotes:      readonly string[];
  readonly uniqueTopNotesA:     readonly string[];
  readonly uniqueTopNotesB:     readonly string[];
  readonly sharedHeartNotes:    readonly string[];
  readonly uniqueHeartNotesA:   readonly string[];
  readonly uniqueHeartNotesB:   readonly string[];
  readonly sharedBaseNotes:     readonly string[];
  readonly uniqueBaseNotesA:    readonly string[];
  readonly uniqueBaseNotesB:    readonly string[];
  // Occasions
  readonly sharedOccasions:     readonly string[];
  readonly uniqueOccasionsA:    readonly string[];
  readonly uniqueOccasionsB:    readonly string[];
  // Vibes
  readonly sharedVibes:         readonly string[];
  readonly uniqueVibesA:        readonly string[];
  readonly uniqueVibesB:        readonly string[];
  // Seasons
  readonly sharedSeasons:       readonly string[];
  readonly uniqueSeasonsA:      readonly string[];
  readonly uniqueSeasonsB:      readonly string[];
  // Intelligence — raw recorded values only, no interpretation
  readonly attributesA:         IntelligenceAttributes;
  readonly attributesB:         IntelligenceAttributes;
};

// ── Private set helpers ────────────────────────────────────────────────────────

function intersect(a: readonly string[], b: readonly string[]): readonly string[] {
  const setB = new Set(b);
  return a.filter(v => setB.has(v));
}

function difference(a: readonly string[], b: readonly string[]): readonly string[] {
  const setB = new Set(b);
  return a.filter(v => !setB.has(v));
}

// ── Comparison entry point ─────────────────────────────────────────────────────

/**
 * Compares two FragranceKnowledge records deterministically.
 * Neither input record is mutated.
 * Returns a read-only summary of shared and distinct characteristics.
 */
export function compareFragrances(
  a: FragranceKnowledge,
  b: FragranceKnowledge,
): RelationshipComparisonSummary {
  return {
    // Classification
    genderA:             a.gender,
    genderB:             b.gender,
    genderMatch:         a.gender === b.gender,
    collectionA:         a.collection,
    collectionB:         b.collection,
    collectionMatch:     a.collection === b.collection,
    scentCharacterA:     a.scentCharacter,
    scentCharacterB:     b.scentCharacter,
    scentCharacterMatch: a.scentCharacter === b.scentCharacter,
    projectionA:         a.projection,
    projectionB:         b.projection,
    profileA:            a.profile,
    profileB:            b.profile,
    // Family
    sharedFamilies:  intersect(a.family, b.family),
    uniqueFamiliesA: difference(a.family, b.family),
    uniqueFamiliesB: difference(b.family, a.family),
    // Notes
    sharedTopNotes:   intersect(a.notes.top, b.notes.top),
    uniqueTopNotesA:  difference(a.notes.top, b.notes.top),
    uniqueTopNotesB:  difference(b.notes.top, a.notes.top),
    sharedHeartNotes:  intersect(a.notes.heart, b.notes.heart),
    uniqueHeartNotesA: difference(a.notes.heart, b.notes.heart),
    uniqueHeartNotesB: difference(b.notes.heart, a.notes.heart),
    sharedBaseNotes:  intersect(a.notes.base, b.notes.base),
    uniqueBaseNotesA: difference(a.notes.base, b.notes.base),
    uniqueBaseNotesB: difference(b.notes.base, a.notes.base),
    // Occasions
    sharedOccasions:  intersect(a.occasions, b.occasions),
    uniqueOccasionsA: difference(a.occasions, b.occasions),
    uniqueOccasionsB: difference(b.occasions, a.occasions),
    // Vibes
    sharedVibes:  intersect(a.vibe, b.vibe),
    uniqueVibesA: difference(a.vibe, b.vibe),
    uniqueVibesB: difference(b.vibe, a.vibe),
    // Seasons
    sharedSeasons:  intersect(a.seasons, b.seasons),
    uniqueSeasonsA: difference(a.seasons, b.seasons),
    uniqueSeasonsB: difference(b.seasons, a.seasons),
    // Intelligence — raw values
    attributesA: {
      sweetness: a.sweetness,
      freshness: a.freshness,
      warmth:    a.warmth,
      intensity: a.intensity,
    },
    attributesB: {
      sweetness: b.sweetness,
      freshness: b.freshness,
      warmth:    b.warmth,
      intensity: b.intensity,
    },
  };
}
