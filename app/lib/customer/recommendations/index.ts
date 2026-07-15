/**
 * Personalised Recommendation Engine — Public Surface
 *
 * Single import point for all Recommendation Engine consumers.
 *
 * Types:
 *   RecommendationStrategy      — "personalised" | "similar" | "complementary" | "discovery" | "trending"
 *   RecommendationReasonType    — reason classification enum
 *   RecommendationReason        — single human-readable explanation
 *   RecommendationScore         — composite score breakdown (profile/catalog/relation/discovery)
 *   RecommendationContext       — input: profile + strategy + limit + optional signals
 *   RecommendationCandidate     — in-flight candidate (pre-ranking)
 *   Recommendation              — final output: rank + summary + score + reasons
 *   RecommendationMetrics       — run metrics: pool size, filtered, returned, processing time
 *   RecommendationResult        — discriminated union: success | failure
 *   PipelineConfig              — injectable contracts for filter/scorer/ranker/explainer
 *   PipelineRunMetrics          — internal pipeline sizing metrics
 *   PipelineRunResult           — pipeline output before metrics assembly
 *
 * Contracts:
 *   RecommendationFilterContract   — filter(candidates, ctx): candidates
 *   RecommendationScorerContract   — score(candidates, ctx): candidates
 *   RecommendationRankingContract  — rank(candidates, ctx): candidates
 *   RecommendationExplainerContract — explain(candidate, ctx): reasons
 *
 * Default implementations:
 *   createExclusionFilter   — excludes currentSlug + excludeSlugs
 *   createUniformScorer     — placeholder: returns zero scores
 *   createScoreRanker       — sorts by score.total DESC, score.catalog DESC
 *   createNullExplainer     — placeholder: returns empty reasons
 *   createDefaultPipeline   — pre-wired with all four defaults
 *
 * Utilities:
 *   createZeroScore         — zero-value RecommendationScore
 *   createContext           — typed context factory with defaults
 *   createEmptyMetrics      — zero-value RecommendationMetrics
 *   buildMetrics            — metrics factory from run measurements
 *   RECOMMENDATION_STRATEGIES — runtime array of all strategies
 *   DEFAULT_RECOMMENDATION_LIMIT — 6
 *
 * Engine (public API):
 *   recommend(context)                           — primary entry point
 *   recommendForProfile(profile, limit?)         — "personalised" convenience
 *   recommendSimilar(slug, profile, limit?)      — "similar" convenience
 *   recommendComplementary(slug, profile, limit?) — "complementary" convenience
 *   recommendDiscovery(profile, limit?)          — "discovery" convenience
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type { RecommendationStrategy }     from "./RecommendationStrategy";
export type { RecommendationReasonType, RecommendationReason } from "./RecommendationReason";
export type { RecommendationScore }        from "./RecommendationScore";
export type { RecommendationContext }      from "./RecommendationContext";
export type { RecommendationCandidate }    from "./RecommendationCandidate";
export type { Recommendation }             from "./Recommendation";
export type { RecommendationMetrics }      from "./RecommendationMetrics";
export type { RecommendationResult }       from "./RecommendationResult";
export type {
  PipelineConfig,
  PipelineRunMetrics,
  PipelineRunResult,
}                                          from "./RecommendationPipeline";

// ── Contracts ─────────────────────────────────────────────────────────────────

export type { RecommendationFilterContract }    from "./RecommendationFilter";
export type { RecommendationScorerContract }    from "./RecommendationScore";
export type { RecommendationRankingContract }   from "./RecommendationRanking";
export type { RecommendationExplainerContract } from "./RecommendationExplainer";

// ── Default implementations ───────────────────────────────────────────────────

export { createExclusionFilter }   from "./RecommendationFilter";
export { createUniformScorer }     from "./RecommendationScore";
export { createScoreRanker }       from "./RecommendationRanking";
export { createNullExplainer }     from "./RecommendationExplainer";
export {
  RecommendationPipeline,
  createDefaultPipeline,
}                                  from "./RecommendationPipeline";

// ── Utilities ─────────────────────────────────────────────────────────────────

export { createZeroScore }         from "./RecommendationScore";
export { createContext }           from "./RecommendationContext";
export { createEmptyMetrics, buildMetrics } from "./RecommendationMetrics";
export {
  RECOMMENDATION_STRATEGIES,
  DEFAULT_RECOMMENDATION_LIMIT,
}                                  from "./RecommendationStrategy";

// ── Engine ────────────────────────────────────────────────────────────────────

export {
  recommend,
  recommendForProfile,
  recommendSimilar,
  recommendComplementary,
  recommendDiscovery,
}                                  from "./RecommendationEngine";
