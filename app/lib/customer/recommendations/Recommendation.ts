/**
 * Personalised Recommendation Engine — Recommendation
 *
 * The final output type for a single recommended fragrance.
 * Produced from a RecommendationCandidate after all pipeline stages complete.
 *
 * rank    — 1-based position in the ordered result set
 * slug    — canonical fragrance identifier
 * summary — full KnowledgeSummary projection (prices, images, family, etc.)
 * score   — composite scoring breakdown for observability and future A/B testing
 * reasons — human-readable explanation for why this fragrance was recommended
 *           (empty until EP10.0-P6+ explainer rules are implemented)
 *
 * Integration points:
 *   RecommendationResult  — included in the recommendations[] array
 *   RecommendationPipeline — produced in the explain + assign-rank step
 *   RecommendationEngine  — final output of all public functions
 *   Experience surfaces   — primary consumption target (product cards, etc.)
 */

import type { KnowledgeSummary }          from "../../intelligence/KnowledgeSummary";
import type { RecommendationScore }        from "./RecommendationScore";
import type { RecommendationReason }       from "./RecommendationReason";
import type { RecommendationConfidence }   from "./RecommendationConfidence";

export interface Recommendation {
  readonly rank:       number;
  readonly slug:       string;
  readonly summary:    KnowledgeSummary;
  readonly score:      RecommendationScore;
  readonly reasons:    readonly RecommendationReason[];
  readonly confidence: RecommendationConfidence;
}
