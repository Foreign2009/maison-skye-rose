/**
 * Personalised Recommendation Engine — Recommendation Strategy
 *
 * Governs how the engine retrieves and scores candidates.
 * The strategy determines pool construction in RecommendationEngine.ts;
 * the pipeline's filter, scorer, ranker, and explainer operate within that pool.
 *
 * Strategies:
 *   "personalised"   — full catalogue, profile-weighted scoring (P6+)
 *   "similar"        — relationship graph pool (connected fragrances)
 *   "complementary"  — wardrobe partners + alternatives from graph
 *   "discovery"      — full catalogue, profile-unaware, emphasises exploration
 *   "trending"       — full catalogue, popularity-based, profile-unaware
 *
 * Integration points:
 *   RecommendationContext — carries the chosen strategy per call
 *   RecommendationEngine  — buildPool() dispatches by strategy
 *   RecommendationMetrics — strategy recorded in every run
 */

export type RecommendationStrategy =
  | "personalised"
  | "similar"
  | "complementary"
  | "discovery"
  | "trending";

export const RECOMMENDATION_STRATEGIES: readonly RecommendationStrategy[] = [
  "personalised",
  "similar",
  "complementary",
  "discovery",
  "trending",
] as const;

export const DEFAULT_RECOMMENDATION_LIMIT = 6;
