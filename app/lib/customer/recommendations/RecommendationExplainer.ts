/**
 * Personalised Recommendation Engine — Recommendation Explainer
 *
 * Generates human-readable reasons for each recommendation after ranking.
 * The explain stage is the final pipeline stage before result assembly.
 *
 * RecommendationExplainerContract:
 *   Accepts a single candidate and the call context.
 *   Returns a reasons array (may be empty).
 *   Must be pure — no side effects, no stored state.
 *
 * createNullExplainer() — the safe default (placeholder):
 *   Returns an empty reasons array for every candidate.
 *   Business-logic explanation rules are added in EP10.0-P6+ without
 *   touching the pipeline structure.
 *
 * Integration points:
 *   RecommendationPipeline — called per candidate in the explain step
 *   RecommendationCandidate — input to explain()
 *   RecommendationContext  — provides profile + strategy for reason generation
 *   RecommendationReason   — element type of the returned array
 *   Recommendation         — final output carries the reasons array
 */

import type { RecommendationCandidate } from "./RecommendationCandidate";
import type { RecommendationContext }   from "./RecommendationContext";
import type { RecommendationReason }    from "./RecommendationReason";

export interface RecommendationExplainerContract {
  explain(
    candidate: RecommendationCandidate,
    context:   RecommendationContext,
  ): readonly RecommendationReason[];
}

/** Placeholder explainer — returns empty reasons for every candidate. */
export function createNullExplainer(): RecommendationExplainerContract {
  return {
    explain: () => [],
  };
}
