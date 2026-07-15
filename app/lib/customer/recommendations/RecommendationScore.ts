/**
 * Personalised Recommendation Engine — Recommendation Score
 *
 * Composite scoring model for a single recommendation candidate.
 * Scores decompose into four signal dimensions so future heuristics can be
 * added per dimension without touching the pipeline structure.
 *
 * Dimensions:
 *   profile   — customer preference signals (family, occasion, gender, etc.)
 *   catalog   — catalogue-level signals (popularity, quality tier, discovery readiness)
 *   relation  — relationship graph signals (graph distance, wardrobe partners)
 *   discovery — discovery collection signals (collection affinity, pathways)
 *   total     — sum of all dimensions (primary sort key for ranking)
 *
 * All scores are in [0, 1] per dimension. total may exceed 1 (additive composite).
 * createZeroScore() returns the starting state for every candidate.
 *
 * RecommendationScorerContract:
 *   score() accepts candidates with zero scores and returns candidates with
 *   computed scores. Placeholder: createUniformScorer() returns zero scores.
 *   Business heuristics are added in EP10.0-P6+.
 *
 * Integration points:
 *   RecommendationCandidate — carries score before ranking
 *   Recommendation          — carries score in final output
 *   RecommendationPipeline  — calls scorer between filter and rank steps
 *   RecommendationRanking   — sorts by score.total
 */

import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";

export interface RecommendationScore {
  readonly total:     number;
  readonly profile:   number;
  readonly catalog:   number;
  readonly relation:  number;
  readonly discovery: number;
}

export function createZeroScore(): RecommendationScore {
  return { total: 0, profile: 0, catalog: 0, relation: 0, discovery: 0 };
}

// ── Scorer contract ───────────────────────────────────────────────────────────

export interface RecommendationScorerContract {
  score(
    candidates: readonly RecommendationCandidate[],
    context:    RecommendationContext,
  ): readonly RecommendationCandidate[];
}

/** Placeholder scorer — returns all candidates with zero scores unchanged. */
export function createUniformScorer(): RecommendationScorerContract {
  return {
    score: (candidates) => candidates,
  };
}
