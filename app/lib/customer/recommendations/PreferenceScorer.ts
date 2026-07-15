/**
 * Recommendation Intelligence — Preference Scorer
 *
 * Computes the profile dimension score for a recommendation candidate.
 * Score range: 0–1. Zero for cold-start customers with no behavioural signals.
 *
 * Signal derivation:
 *   preferredFamilies  — fragrance families across savedSlugs + lastQuizSlugs + recentlyViewed
 *   preferredOccasions — occasions across savedSlugs + lastQuizSlugs (intent signals)
 *   preferredSeasons   — seasons across savedSlugs + lastQuizSlugs
 *   dominantGender     — most frequent gender among savedSlugs + lastQuizSlugs
 *
 * Scoring formula:
 *   family overlap   — +0.20 per match, max 0.45  (strongest preference signal)
 *   gender match     — +0.25 (explicit gender match) or +0.10 (unisex neutral)
 *   occasion overlap — +0.08 per match, max 0.20
 *   season overlap   — +0.05 per match, max 0.10
 *   total max:         1.0 (clamped)
 *
 * PreferenceProfile is computed once per recommend() call by WeightedRecommendationScorer
 * and passed to scoreProfile() for each candidate — no redundant derivation.
 *
 * Integration points:
 *   WeightedRecommendationScorer — calls buildPreferenceProfile() + scoreProfile()
 *   RecommendationReasonBuilder  — calls buildPreferenceProfile() for reason derivation
 *   mkcCatalogue / KnowledgeSummary — source for saved/viewed fragrance attribute lookups
 */

import { mkcCatalogue }          from "../../mkc/catalogue";
import { buildKnowledgeSummary } from "../../intelligence/KnowledgeSummary";
import type { KnowledgeSummary } from "../../intelligence/KnowledgeSummary";
import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";

// ── Module-level summary map (O(n) once) ──────────────────────────────────────

const SUMMARY_MAP = new Map<string, KnowledgeSummary>(
  mkcCatalogue.map((r) => [r.slug, buildKnowledgeSummary(r)]),
);

// ── Signal collection helpers ─────────────────────────────────────────────────

function collectFamilies(slugs: readonly string[]): Set<string> {
  const result = new Set<string>();
  for (const slug of slugs) {
    const s = SUMMARY_MAP.get(slug);
    if (s) for (const f of s.family) result.add(f);
  }
  return result;
}

function collectOccasions(slugs: readonly string[]): Set<string> {
  const result = new Set<string>();
  for (const slug of slugs) {
    const s = SUMMARY_MAP.get(slug);
    if (s) for (const o of s.occasions) result.add(o);
  }
  return result;
}

function collectSeasons(slugs: readonly string[]): Set<string> {
  const result = new Set<string>();
  for (const slug of slugs) {
    const s = SUMMARY_MAP.get(slug);
    if (s) for (const se of s.seasons) result.add(se);
  }
  return result;
}

function deriveDominantGender(slugs: readonly string[]): string | null {
  const counts = new Map<string, number>();
  for (const slug of slugs) {
    const s = SUMMARY_MAP.get(slug);
    if (s) counts.set(s.gender, (counts.get(s.gender) ?? 0) + 1);
  }
  let max = 0;
  let dominant: string | null = null;
  for (const [g, c] of counts) {
    if (c > max) { max = c; dominant = g; }
  }
  return dominant;
}

// ── Public types ──────────────────────────────────────────────────────────────

export interface PreferenceProfile {
  readonly preferredFamilies:  ReadonlySet<string>;
  readonly preferredOccasions: ReadonlySet<string>;
  readonly preferredSeasons:   ReadonlySet<string>;
  readonly dominantGender:     string | null;
  readonly hasSignals:         boolean;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildPreferenceProfile(context: RecommendationContext): PreferenceProfile {
  const { profile } = context;

  // Intent signals: saves + quiz results carry stronger preference intent
  const intentSlugs    = [...profile.savedSlugs, ...profile.lastQuizSlugs];
  // Broad signals: viewed slugs supplement family coverage
  const broadSlugs     = [...intentSlugs, ...profile.recentlyViewed];

  const hasSignals = broadSlugs.length > 0;

  return {
    preferredFamilies:  collectFamilies(broadSlugs),
    preferredOccasions: collectOccasions(intentSlugs),
    preferredSeasons:   collectSeasons(intentSlugs),
    dominantGender:     deriveDominantGender(intentSlugs),
    hasSignals,
  };
}

export function scoreProfile(
  candidate:    RecommendationCandidate,
  prefProfile:  PreferenceProfile,
): number {
  if (!prefProfile.hasSignals) return 0;

  const { summary } = candidate;
  let score = 0;

  // Family overlap — strongest preference signal (max 0.45)
  const familyMatches = summary.family.filter((f) => prefProfile.preferredFamilies.has(f)).length;
  score += Math.min(familyMatches * 0.20, 0.45);

  // Gender alignment (max 0.25)
  if (prefProfile.dominantGender && summary.gender === prefProfile.dominantGender) {
    score += 0.25;
  } else if (summary.gender === "unisex") {
    score += 0.08; // neutral credit
  }

  // Occasion overlap (max 0.20)
  const occasionMatches = summary.occasions.filter((o) => prefProfile.preferredOccasions.has(o)).length;
  score += Math.min(occasionMatches * 0.08, 0.20);

  // Season overlap (max 0.10)
  const seasonMatches = summary.seasons.filter((s) => prefProfile.preferredSeasons.has(s)).length;
  score += Math.min(seasonMatches * 0.05, 0.10);

  return Math.min(score, 1.0);
}

// ── Summary map accessor (used by RecommendationReasonBuilder) ────────────────

export function getSummaryForSlug(slug: string): KnowledgeSummary | undefined {
  return SUMMARY_MAP.get(slug);
}
