/**
 * Customer Intelligence — Learning Result
 *
 * Discriminated union result from a LearningEngine run.
 *
 *   success: true  — candidates and metrics are present
 *   success: false — error description and metrics are present
 *
 * Callers narrow by result.success before accessing candidates.
 *
 * Integration points:
 *   LearningEngine      — returns LearningResult from run()
 *   PreferenceCandidate — the resolved output carried in the success branch
 *   LearningMetrics     — present in both branches for diagnostics
 */

import type { PreferenceCandidate } from "./PreferenceCandidate";
import type { LearningMetrics }     from "./LearningMetrics";

export type LearningResult =
  | {
      readonly success:    true;
      readonly candidates: readonly PreferenceCandidate[];
      readonly metrics:    LearningMetrics;
    }
  | {
      readonly success: false;
      readonly error:   string;
      readonly metrics: LearningMetrics;
    };
