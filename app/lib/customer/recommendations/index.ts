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
 * Intelligence types (EP10.0-P6):
 *   PreferenceProfile       — derived family/occasion/season/gender preferences
 *   ConnectionSets          — pre-computed relationship graph sets
 *   ConfidenceLevel         — "HIGH" | "MEDIUM" | "LOW"
 *   RecommendationConfidence — confidence score + level + reason
 *   RecommendationTrace     — diagnostic scoring record
 *   RecommendationExplanation — full explanation: confidence + reasons + trace + humanText
 *
 * Contracts:
 *   RecommendationFilterContract   — filter(candidates, ctx): candidates
 *   RecommendationScorerContract   — score(candidates, ctx): candidates
 *   RecommendationRankingContract  — rank(candidates, ctx): candidates
 *   RecommendationExplainerContract — explain(candidate, ctx): reasons
 *
 * Default implementations:
 *   createExclusionFilter   — excludes currentSlug + excludeSlugs
 *   createWeightedScorer    — real intelligence: preference + catalog + relation + discovery
 *   createScoreRanker       — sorts by score.total DESC, score.catalog DESC
 *   createReasonBuilder     — real intelligence: deterministic rule-based reasons
 *   createDefaultPipeline   — pre-wired with real implementations
 *   createUniformScorer     — placeholder (preserved for override/testing)
 *   createNullExplainer     — placeholder (preserved for override/testing)
 *
 * Intelligence API (EP10.0-P6):
 *   buildPreferenceProfile  — derive customer preferences from profile signals
 *   scoreProfile            — score a candidate against a preference profile
 *   buildConnectionSets     — pre-compute graph connection sets for scoring
 *   scoreRelation           — score a candidate against connection sets
 *   scoreDiscovery          — score a candidate's discovery readiness
 *   calculateConfidence     — compute confidence level for a recommendation
 *   buildTrace              — build diagnostic trace for a candidate
 *   buildExplanation        — build full explanation (confidence + reasons + trace + humanText)
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
export { createWeightedScorer }    from "./WeightedRecommendationScorer";
export { createReasonBuilder, buildExplanation } from "./RecommendationReasonBuilder";
export {
  RecommendationPipeline,
  createDefaultPipeline,
}                                  from "./RecommendationPipeline";

// ── Intelligence types (EP10.0-P6) ────────────────────────────────────────────

export type { PreferenceProfile }        from "./PreferenceScorer";
export type { ConnectionSets }           from "./RelationshipScorer";
export type { ConfidenceLevel, RecommendationConfidence } from "./RecommendationConfidence";
export type { RecommendationTrace }      from "./RecommendationTrace";
export type { RecommendationExplanation } from "./RecommendationExplanation";

// ── Intelligence API (EP10.0-P6) ──────────────────────────────────────────────

export { buildPreferenceProfile, scoreProfile, getSummaryForSlug } from "./PreferenceScorer";
export { buildConnectionSets, scoreRelation }   from "./RelationshipScorer";
export { scoreDiscovery }                        from "./DiscoveryScorer";
export { calculateConfidence }                   from "./RecommendationConfidence";
export { buildTrace }                            from "./RecommendationTrace";

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
