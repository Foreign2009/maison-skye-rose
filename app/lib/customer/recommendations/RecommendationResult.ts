/**
 * Personalised Recommendation Engine — Recommendation Result
 *
 * Discriminated union returned by all public engine functions.
 * Mirrors the LearningResult pattern from the Preference Learning Framework.
 *
 * success:true  — recommendations[] carries the ordered result set;
 *                 metrics reflects the full pipeline run
 * success:false — error carries a diagnostic message;
 *                 metrics reflects whatever was measured before failure
 *
 * Callers must narrow on success before accessing recommendations[].
 *
 * Integration points:
 *   RecommendationEngine — return type of recommend() and all convenience functions
 *   Recommendation       — items in the recommendations array
 *   RecommendationMetrics — included in both variants for observability
 */

import type { Recommendation }       from "./Recommendation";
import type { RecommendationMetrics } from "./RecommendationMetrics";

export type RecommendationResult =
  | {
      readonly success:         true;
      readonly recommendations: readonly Recommendation[];
      readonly metrics:         RecommendationMetrics;
    }
  | {
      readonly success: false;
      readonly error:   string;
      readonly metrics: RecommendationMetrics;
    };
