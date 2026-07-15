/**
 * Recommendation Intelligence — Recommendation Explanation
 *
 * Full explanation object for a single recommendation.
 * Richer than the reasons[] array on Recommendation — includes confidence,
 * a diagnostic trace, and a primary human-readable sentence.
 *
 * RecommendationExplanation is produced by buildExplanation() in
 * RecommendationReasonBuilder. It is NOT part of the pipeline's output
 * path — callers that need it must call buildExplanation() directly.
 * The pipeline's explain stage returns only RecommendationReason[].
 *
 * humanText is derived from the highest-weight reason. When no reasons
 * exist (cold-start), it falls back to a catalogue-quality description.
 *
 * Integration points:
 *   RecommendationReasonBuilder — produced by buildExplanation()
 *   RecommendationConfidence    — embedded as sub-component
 *   RecommendationReason        — the reasons[] array
 *   RecommendationTrace         — embedded diagnostic record
 */

import type { RecommendationReason }     from "./RecommendationReason";
import type { RecommendationConfidence } from "./RecommendationConfidence";
import type { RecommendationTrace }      from "./RecommendationTrace";

export interface RecommendationExplanation {
  readonly confidence: RecommendationConfidence;
  readonly reasons:    readonly RecommendationReason[];
  readonly trace:      RecommendationTrace;
  readonly humanText:  string;
}
