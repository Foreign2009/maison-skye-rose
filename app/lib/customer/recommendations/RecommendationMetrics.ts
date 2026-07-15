/**
 * Personalised Recommendation Engine — Recommendation Metrics
 *
 * Measurement data produced on every recommend() call.
 * Included in RecommendationResult regardless of success or failure.
 *
 * Fields:
 *   strategy         — which strategy was requested
 *   poolSize         — candidates entering the filter stage
 *   filteredSize     — candidates entering the score stage
 *   returnedSize     — recommendations in the final result
 *   processingTimeMs — wall time from recommend() entry to result return
 *
 * Integration points:
 *   RecommendationResult  — included in both success and failure variants
 *   RecommendationPipeline — built and returned by pipeline.run()
 *   RecommendationEngine  — captures processingTimeMs around the pipeline call
 */

import type { RecommendationStrategy } from "./RecommendationStrategy";

export interface RecommendationMetrics {
  readonly strategy:          RecommendationStrategy;
  readonly poolSize:          number;
  readonly filteredSize:      number;
  readonly returnedSize:      number;
  readonly processingTimeMs:  number;
}

export function createEmptyMetrics(strategy: RecommendationStrategy): RecommendationMetrics {
  return {
    strategy,
    poolSize:         0,
    filteredSize:     0,
    returnedSize:     0,
    processingTimeMs: 0,
  };
}

export function buildMetrics(
  strategy:         RecommendationStrategy,
  startTime:        number,
  poolSize:         number,
  filteredSize:     number,
  returnedSize:     number,
): RecommendationMetrics {
  return {
    strategy,
    poolSize,
    filteredSize,
    returnedSize,
    processingTimeMs: Date.now() - startTime,
  };
}
