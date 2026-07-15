/**
 * Personalised Recommendation Engine — Recommendation Candidate
 *
 * Represents a fragrance under evaluation before it becomes a Recommendation.
 * Carries the KnowledgeSummary projection, a score (initially zero), and a
 * reasons array (initially empty).
 *
 * The pipeline advances candidates through each stage:
 *   retrieveCandidates → all candidates with createZeroScore() + reasons: []
 *   filter             → excluded candidates removed
 *   score              → RecommendationScore populated by scorer
 *   rank               → candidates sorted by score.total
 *   explain            → reasons populated by explainer, rank assigned → Recommendation
 *
 * Candidates are immutable — each pipeline stage returns new objects.
 *
 * Integration points:
 *   RecommendationEngine  — buildPool() produces the initial candidate set
 *   RecommendationFilter  — input and output type
 *   RecommendationScore   — scorer returns updated candidates
 *   RecommendationRanking — ranker sorts candidates
 *   RecommendationPipeline — flows through all stages
 *   Recommendation         — final output type (adds rank)
 */

import type { KnowledgeSummary }      from "../../intelligence/KnowledgeSummary";
import type { RecommendationScore }   from "./RecommendationScore";
import type { RecommendationReason }  from "./RecommendationReason";

export interface RecommendationCandidate {
  readonly slug:    string;
  readonly summary: KnowledgeSummary;
  readonly score:   RecommendationScore;
  readonly reasons: readonly RecommendationReason[];
}
