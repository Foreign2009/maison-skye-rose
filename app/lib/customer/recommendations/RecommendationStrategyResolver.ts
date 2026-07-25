/**
 * Recommendation Strategy Resolver
 *
 * Canonical strategy selection service for the Recommendation Platform.
 * All production strategy selection passes through resolveRecommendationStrategy().
 *
 * Consults RecommendationExperiments to check whether any active experiment
 * overrides the default strategy for the given surface. When no experiment
 * is active (current state: all in "draft"), returns the default strategy
 * unchanged — behaviour is identical to direct strategy assignment.
 *
 * Purely deterministic: no randomness, no traffic splitting, no user
 * segmentation. Same input always produces the same output.
 *
 * Integration points:
 *   RecommendationExperiments.ts            — listActiveExperiments, isExperimentEnabled
 *   ExperienceIntelligence.ts               — replaces private resolveStrategy()
 *   CartRecommendationStrategy.ts           — replaces hardcoded "complementary"
 *   admin/RecommendationPerformanceDashboard — strategy resolution section
 */

import { listActiveExperiments, isExperimentEnabled } from "./RecommendationExperiments";
import type { RecommendationStrategy } from "./RecommendationStrategy";

// ── Types ─────────────────────────────────────────────────────────────────────

export type StrategySelectionSource =
  | "default"              // no active experiment; baseline strategy used
  | "experiment-override"; // active experiment's candidate strategy substituted

export interface RecommendationStrategySelection {
  readonly strategy:          RecommendationStrategy;          // strategy to execute
  readonly baselineStrategy:  RecommendationStrategy;          // default without experiment
  readonly candidateStrategy: RecommendationStrategy | null;   // experiment candidate (null if baseline)
  readonly experimentId:      string | null;                   // active experiment id (null if baseline)
  readonly selectionSource:   StrategySelectionSource;
  readonly reason:            string;
}

// ── Resolver ──────────────────────────────────────────────────────────────────

/**
 * Resolves the recommendation strategy to execute for a surface.
 *
 * Accepts the default strategy the caller would normally use, checks whether
 * any active experiment overrides it for the given surface, and returns a
 * RecommendationStrategySelection describing the resolved strategy and its
 * provenance.
 *
 * surfaceId is optional. When provided, only experiments that target the
 * given surface can override the default. When omitted, any active experiment
 * whose baselineStrategy matches can override.
 *
 * Current behaviour: all experiments are in "draft" status, so
 * listActiveExperiments() returns [] and this function always returns
 * selectionSource "default" with strategy === defaultStrategy.
 */
export function resolveRecommendationStrategy(
  defaultStrategy: RecommendationStrategy,
  options?: {
    surfaceId?: string;
  },
): RecommendationStrategySelection {
  const activeExperiments = listActiveExperiments();

  for (const experiment of activeExperiments) {
    if (!isExperimentEnabled(experiment.id)) continue;
    if (experiment.baselineStrategy !== defaultStrategy) continue;

    if (
      options?.surfaceId !== undefined &&
      !experiment.targetSurfaces.includes(options.surfaceId)
    ) continue;

    return {
      strategy:          experiment.candidateStrategy,
      baselineStrategy:  defaultStrategy,
      candidateStrategy: experiment.candidateStrategy,
      experimentId:      experiment.id,
      selectionSource:   "experiment-override",
      reason:            `Experiment ${experiment.id} overrides ${defaultStrategy} → ${experiment.candidateStrategy}`,
    };
  }

  return {
    strategy:          defaultStrategy,
    baselineStrategy:  defaultStrategy,
    candidateStrategy: null,
    experimentId:      null,
    selectionSource:   "default",
    reason:            `Baseline: no active experiment overrides ${defaultStrategy}`,
  };
}
