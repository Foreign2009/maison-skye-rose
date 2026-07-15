/**
 * Personalised Recommendation Engine — Recommendation Ranking
 *
 * Sorts scored candidates into the final presentation order.
 * The ranking stage operates after scoring and before explanation.
 *
 * RecommendationRankingContract:
 *   Accepts scored candidates and the call context.
 *   Returns candidates in the desired presentation order.
 *   Must be pure — no side effects, no stored state.
 *   Must NOT slice to limit — slicing is the pipeline's responsibility.
 *
 * createScoreRanker() — the default:
 *   Sorts by score.total descending.
 *   Ties broken by score.catalog descending (discovery readiness proxy).
 *   Stable within a tie: preserves pool retrieval order.
 *   Placeholder: since all scores are zero today, order equals pool order.
 *   When EP10.0-P6+ scorers produce real scores, this ranker will work correctly
 *   without modification.
 *
 * Integration points:
 *   RecommendationPipeline — called as the third pipeline stage (after scorer)
 *   RecommendationScore    — reads score.total and score.catalog for sort keys
 *   RecommendationContext  — available for strategy-aware sort variations (future)
 */

import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";

export interface RecommendationRankingContract {
  rank(
    candidates: readonly RecommendationCandidate[],
    context:    RecommendationContext,
  ): readonly RecommendationCandidate[];
}

/** Sorts by score.total DESC, then score.catalog DESC. Stable within ties. */
export function createScoreRanker(): RecommendationRankingContract {
  return {
    rank(
      candidates: readonly RecommendationCandidate[],
      _context:   RecommendationContext,
    ): readonly RecommendationCandidate[] {
      return [...candidates].sort((a, b) => {
        const totalDiff = b.score.total - a.score.total;
        if (totalDiff !== 0) return totalDiff;
        return b.score.catalog - a.score.catalog;
      });
    },
  };
}
