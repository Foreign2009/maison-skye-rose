/**
 * Personalised Recommendation Engine — Recommendation Filter
 *
 * Removes ineligible candidates before scoring and ranking.
 * The filter stage is the first stage in the pipeline after pool retrieval.
 *
 * RecommendationFilterContract:
 *   Accepts the full candidate pool and the call context.
 *   Returns only eligible candidates.
 *   Must be pure — no side effects, no stored state.
 *
 * createExclusionFilter() — the safe default:
 *   Excludes context.currentSlug (the currently viewed fragrance).
 *   Excludes any slug in context.excludeSlugs.
 *   Passes all remaining candidates through unchanged.
 *   No profile-aware filtering — that belongs to EP10.0-P6+ scorers.
 *
 * Integration points:
 *   RecommendationPipeline — called as the first pipeline stage
 *   RecommendationContext  — reads excludeSlugs + currentSlug
 *   RecommendationCandidate — input and output element type
 */

import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";

export interface RecommendationFilterContract {
  filter(
    candidates: readonly RecommendationCandidate[],
    context:    RecommendationContext,
  ): readonly RecommendationCandidate[];
}

/** Excludes currentSlug and any explicit excludeSlugs; passes all others through. */
export function createExclusionFilter(): RecommendationFilterContract {
  return {
    filter(
      candidates: readonly RecommendationCandidate[],
      context:    RecommendationContext,
    ): readonly RecommendationCandidate[] {
      const excluded = new Set<string>(context.excludeSlugs ?? []);
      if (context.currentSlug) excluded.add(context.currentSlug);
      if (excluded.size === 0) return candidates;
      return candidates.filter((c) => !excluded.has(c.slug));
    },
  };
}
