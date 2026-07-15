/**
 * Knowledge Intelligence Engine — Knowledge Recommendations
 *
 * Compatibility adapter between the KIE quiz-signal interface and the
 * Customer Recommendation Engine (RE).
 *
 * Architectural role:
 *   This module receives raw quiz answers (string signals) and produces a
 *   KnowledgeRecommendationResult keyed to existing KIE output types.
 *   All scoring is delegated to the RE — no scoring logic lives here.
 *
 * Bridge strategy:
 *   Quiz answers cannot drive the RE directly because the RE's PreferenceScorer
 *   derives preferences from fragrance slugs (savedSlugs / lastQuizSlugs), not
 *   from CustomerSignal payloads. The bridge is:
 *     quiz answers → field-filter on mkcCatalogue → seed slugs
 *     → lastQuizSlugs in UnifiedCustomerProfile → RE scores all candidates
 *   The RE then extracts real fragrance attributes (family, occasion, season,
 *   gender) from those seed records and scores the full catalogue.
 *
 * Output slot mapping from RE results (ordered by score):
 *   bestMatch     — rank 1
 *   similar       — ranks 2-4 (excluding luxury/hidden slots)
 *   luxuryUpgrade — first Elite collection result after rank 1
 *   hiddenGem     — first newArrival result after rank 1, non-Elite
 *
 * Integration points:
 *   recommendForProfile          — RE entry point (personalised strategy)
 *   UnifiedCustomerProfile       — synthetic profile carrying quiz seed slugs
 *   createProfileMetadata        — profile metadata factory
 *   KnowledgeIntelligence        — sole public consumer of this module
 *   quizSignalFactory.QuizAnswers — shared quiz answer type
 */

import type { FragranceKnowledge }  from "../mkc/types";
import { mkcCatalogue }              from "../mkc/catalogue";
import { recommendForProfile }       from "../customer/recommendations";
import { createProfileMetadata }     from "../customer/profile/ProfileMetadata";
import type { UnifiedCustomerProfile } from "../customer/profile/UnifiedCustomerProfile";
import type { KnowledgeSummary }     from "./KnowledgeSummary";
import type { QuizAnswers }          from "../customer/quiz/quizSignalFactory";

// ── Public types ──────────────────────────────────────────────────────────────

export type RecommendationOptions = QuizAnswers;

export interface KnowledgeRecommendationResult {
  readonly bestMatch:     KnowledgeSummary | null;
  readonly similar:       readonly KnowledgeSummary[];
  readonly luxuryUpgrade: KnowledgeSummary | null;
  readonly hiddenGem:     KnowledgeSummary | null;
}

// ── Seed filter ───────────────────────────────────────────────────────────────
// Produces a small set of quiz-relevant slugs without the legacy scoring engine.
// Gender is the only hard filter (matches RE gender scoring weight of 0.25).
// Family, occasion, character, and vibe are soft-scored as a tiebreaker.
// Result slugs become lastQuizSlugs in the synthetic UnifiedCustomerProfile,
// from which the RE's PreferenceScorer extracts real fragrance attributes.

const SEED_LIMIT = 5;

function getQuizSeeds(options: RecommendationOptions): readonly string[] {
  type Scored = { slug: string; score: number };

  const scored: Scored[] = mkcCatalogue
    .filter((k: FragranceKnowledge) =>
      !options.gender || k.gender === options.gender.toLowerCase(),
    )
    .map((k: FragranceKnowledge) => {
      let score = k.popularity * 0.01; // tiebreaker
      if (options.family) {
        const lc = options.family.toLowerCase();
        if (k.family.some((f) => f.toLowerCase().includes(lc) || lc.includes(f.toLowerCase()))) {
          score += 2;
        }
      }
      if (options.occasion && k.occasions.includes(options.occasion)) score += 1;
      if (options.character && k.scentCharacter === options.character)  score += 1;
      if (options.vibe) {
        const lc = options.vibe.toLowerCase();
        if (k.vibe.some((v) => v.toLowerCase() === lc)) score += 0.5;
      }
      return { slug: k.slug, score };
    });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, SEED_LIMIT)
    .map((item) => item.slug);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildKnowledgeRecommendations(
  options: RecommendationOptions,
): KnowledgeRecommendationResult {
  const seeds = getQuizSeeds(options);

  const profile: UnifiedCustomerProfile = {
    tier:           "unified",
    identity:       {},
    metadata:       createProfileMetadata(),
    signals:        [],
    savedSlugs:     [],
    recentlyViewed: [],
    lastQuizSlugs:  seeds,
    lastActiveAt:   null,
  };

  const result = recommendForProfile(profile, 12);

  if (!result.success || result.recommendations.length === 0) {
    return { bestMatch: null, similar: [], luxuryUpgrade: null, hiddenGem: null };
  }

  const recs = result.recommendations;
  const bestMatch = recs[0].summary;

  // luxuryUpgrade — first Elite result after rank 1
  const luxuryUpgrade =
    recs.slice(1).find((r) => r.summary.collection === "Elite")?.summary ?? null;

  // hiddenGem — first newArrival result after rank 1, non-Elite, not already luxuryUpgrade
  const hiddenGem =
    recs.slice(1).find(
      (r) =>
        r.summary.newArrival &&
        r.summary.collection !== "Elite" &&
        r.summary.slug !== luxuryUpgrade?.slug,
    )?.summary ?? null;

  // similar — up to 3 non-bestMatch results, excluding the special slots
  const excluded = new Set<string>([
    bestMatch.slug,
    ...(luxuryUpgrade ? [luxuryUpgrade.slug] : []),
    ...(hiddenGem     ? [hiddenGem.slug]      : []),
  ]);

  const similar = recs
    .slice(1)
    .filter((r) => !excluded.has(r.summary.slug))
    .slice(0, 3)
    .map((r) => r.summary);

  return { bestMatch, similar, luxuryUpgrade, hiddenGem };
}
