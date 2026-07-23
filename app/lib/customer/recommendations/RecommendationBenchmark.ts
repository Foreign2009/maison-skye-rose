/**
 * Recommendation Intelligence — Strategy Benchmarking Framework
 *
 * Defines how recommendation strategies are compared using quality metrics
 * and experiment definitions already present in the repository.
 *
 * All functions are pure and deterministic. No live analytics are queried.
 * Analytics values are supplied by callers from PostHog query results.
 * When analytics are absent, benchmarks report "awaiting-analytics" or
 * "not-ready" — no values are fabricated.
 *
 * Integration points:
 *   RecommendationQuality.ts     — canonical KPI thresholds
 *   RecommendationExperiments.ts — experiment definitions and success criteria
 *   ExperimentPromotion.ts       — lifecycle stage (drives readiness derivation)
 *   admin/RecommendationPerformanceDashboard — benchmark display
 *
 * Adding a new benchmark:
 *   Register the experiment in RecommendationExperiments.ts. A benchmark is
 *   automatically derived from every registered experiment with success criteria.
 *   No changes to this module are required.
 */

import type { ExperimentLifecycleStage } from "./ExperimentPromotion";
import type { RecommendationStrategy }   from "./RecommendationStrategy";
import {
  QUALITY_THRESHOLDS,
  classifyBand,
  type QualityMetricKey,
  type QualityBand,
} from "./RecommendationQuality";
import {
  listExperiments,
  getExperiment,
  type RecommendationExperiment,
  type ExperimentSuccessCriterion,
} from "./RecommendationExperiments";

// ── Analytics input ───────────────────────────────────────────────────────────
// Callers supply this from PostHog query results.
// All metric fields are nullable — null means the value is not yet available.

export interface StrategyAnalyticsSnapshot {
  readonly strategy:               RecommendationStrategy;
  readonly surface?:               string;
  readonly ctr?:                   number | null;
  readonly favouriteRate?:         number | null;
  readonly addToCartRate?:         number | null;
  readonly checkoutAttributionRate?: number | null;
  readonly sampleSize?:            number;
  readonly periodDays?:            number;
}

function getSnapshotValue(
  snapshot: StrategyAnalyticsSnapshot | null | undefined,
  metric:   QualityMetricKey,
): number | null {
  if (!snapshot) return null;
  switch (metric) {
    case "ctr":                      return snapshot.ctr                      ?? null;
    case "favouriteRate":            return snapshot.favouriteRate            ?? null;
    case "addToCartRate":            return snapshot.addToCartRate            ?? null;
    case "checkoutAttributionRate":  return snapshot.checkoutAttributionRate  ?? null;
    case "coverage":                 return null;
  }
}

// ── Readiness ─────────────────────────────────────────────────────────────────

export type BenchmarkReadinessState =
  | "not-ready"           // experiment not yet authorized for traffic
  | "awaiting-analytics"  // experiment active; data collection in progress
  | "ready-to-evaluate"   // analytics available; comparison can be run
  | "completed";          // experiment concluded (promoted or archived)

export interface BenchmarkReadiness {
  readonly state:    BenchmarkReadinessState;
  readonly reason:   string;
  readonly blockers: readonly string[];
  readonly nextStep: string;
}

function deriveReadiness(
  experiment:    RecommendationExperiment,
  hasBaseline:   boolean,
  hasCandidate:  boolean,
): BenchmarkReadiness {
  const { status } = experiment;

  if (status === "draft") {
    return {
      state:    "not-ready",
      reason:   "Experiment is in draft status — not yet authorized for traffic routing.",
      blockers: [
        `Experiment status is "${status}" — transition to "active" to begin data collection`,
        "Live analytics not yet available — pending EP23.5 analytics integration",
      ],
      nextStep: "Authorize the experiment in EXPERIMENT_REGISTRY, implement traffic routing at the call site, then run HogQL queries once the observation window completes.",
    };
  }

  if (status === "promoted" || status === "archived") {
    return {
      state:    "completed",
      reason:   `Experiment concluded with status "${status}".`,
      blockers: [],
      nextStep: "Review historical results. Archive final analytics snapshots.",
    };
  }

  const missing: string[] = [];
  if (!hasBaseline)  missing.push(`baseline analytics for "${experiment.baselineStrategy}" strategy`);
  if (!hasCandidate) missing.push(`candidate analytics for "${experiment.candidateStrategy}" strategy`);

  if (missing.length > 0) {
    return {
      state:    "awaiting-analytics",
      reason:   `Experiment is ${status} — waiting for analytics data.`,
      blockers: missing.map((m) => `Missing: ${m}`),
      nextStep: `Run the PostHog HogQL queries in the Performance dashboard to compute analytics for both strategies, then supply results to compareStrategies().`,
    };
  }

  return {
    state:    "ready-to-evaluate",
    reason:   "Analytics available for both strategies. Comparison can be executed.",
    blockers: [],
    nextStep: "Call compareStrategies() with baseline and candidate analytics snapshots to produce a benchmark result.",
  };
}

// ── KPI comparison ────────────────────────────────────────────────────────────

export type BenchmarkVerdict =
  | "candidate-wins"
  | "baseline-wins"
  | "inconclusive"
  | "pending";

export interface BenchmarkKPIComparison {
  readonly metric:         QualityMetricKey;
  readonly label:          string;
  readonly formula:        string;
  readonly threshold:      number;
  readonly targetBand:     "Excellent" | "Healthy";
  readonly baselineValue:  number | null;
  readonly candidateValue: number | null;
  readonly baselineBand:   QualityBand | "Pending";
  readonly candidateBand:  QualityBand | "Pending";
  readonly delta:          number | null;
  readonly verdict:        BenchmarkVerdict;
  readonly criterionMet:   boolean;
}

function buildKPIComparison(
  criterion:  ExperimentSuccessCriterion,
  baseline:   StrategyAnalyticsSnapshot | null | undefined,
  candidate:  StrategyAnalyticsSnapshot | null | undefined,
): BenchmarkKPIComparison {
  const t              = QUALITY_THRESHOLDS[criterion.metric];
  const baselineValue  = getSnapshotValue(baseline,  criterion.metric);
  const candidateValue = getSnapshotValue(candidate, criterion.metric);

  const baselineBand:  QualityBand | "Pending" = baselineValue  !== null ? classifyBand(criterion.metric, baselineValue)  : "Pending";
  const candidateBand: QualityBand | "Pending" = candidateValue !== null ? classifyBand(criterion.metric, candidateValue) : "Pending";

  const delta = (baselineValue !== null && candidateValue !== null)
    ? candidateValue - baselineValue
    : null;

  let verdict: BenchmarkVerdict = "pending";
  let criterionMet              = false;

  if (baselineValue !== null && candidateValue !== null) {
    criterionMet = candidateValue >= criterion.threshold;
    if (criterionMet && candidateValue > baselineValue) {
      verdict = "candidate-wins";
    } else if (!criterionMet && candidateValue < baselineValue) {
      verdict = "baseline-wins";
    } else {
      verdict = "inconclusive";
    }
  }

  return {
    metric:         criterion.metric,
    label:          t.label,
    formula:        t.formula,
    threshold:      criterion.threshold,
    targetBand:     criterion.targetBand,
    baselineValue,
    candidateValue,
    baselineBand,
    candidateBand,
    delta,
    verdict,
    criterionMet,
  };
}

// ── Confidence ────────────────────────────────────────────────────────────────

export type BenchmarkConfidence = "high" | "medium" | "low" | "insufficient";

function deriveConfidence(
  comparisons: readonly BenchmarkKPIComparison[],
  baseline?:   StrategyAnalyticsSnapshot,
  candidate?:  StrategyAnalyticsSnapshot,
): BenchmarkConfidence {
  if (comparisons.every((c) => c.verdict === "pending")) return "insufficient";
  const sampleSize = Math.min(
    baseline?.sampleSize  ?? 0,
    candidate?.sampleSize ?? 0,
  );
  const periodDays = Math.min(
    baseline?.periodDays  ?? 0,
    candidate?.periodDays ?? 0,
  );
  if (sampleSize >= 1000 && periodDays >= 14) return "high";
  if (sampleSize >= 300  && periodDays >= 7)  return "medium";
  if (sampleSize > 0)                          return "low";
  return "insufficient";
}

// ── Overall result ────────────────────────────────────────────────────────────

export interface BenchmarkResult {
  readonly overallVerdict:    BenchmarkVerdict;
  readonly confidence:        BenchmarkConfidence;
  readonly criteriaMetCount:  number;
  readonly criteriaTotal:     number;
  readonly recommendation:    string;
}

function buildResult(
  comparisons: readonly BenchmarkKPIComparison[],
  baseline?:   StrategyAnalyticsSnapshot,
  candidate?:  StrategyAnalyticsSnapshot,
): BenchmarkResult {
  const criteriaMetCount = comparisons.filter((c) => c.criterionMet).length;
  const criteriaTotal    = comparisons.length;
  const confidence       = deriveConfidence(comparisons, baseline, candidate);

  if (comparisons.every((c) => c.verdict === "pending")) {
    return {
      overallVerdict:   "pending",
      confidence:       "insufficient",
      criteriaMetCount: 0,
      criteriaTotal,
      recommendation:   "Awaiting live analytics. Run PostHog HogQL queries for both strategies, then re-evaluate.",
    };
  }

  const allMet     = criteriaMetCount === criteriaTotal;
  const noneMet    = criteriaMetCount === 0;
  const anyWins    = comparisons.some((c) => c.verdict === "candidate-wins");
  const anyLosses  = comparisons.some((c) => c.verdict === "baseline-wins");

  let overallVerdict: BenchmarkVerdict;
  let recommendation: string;

  if (allMet && anyWins && !anyLosses) {
    overallVerdict = "candidate-wins";
    recommendation = `All ${criteriaTotal} success criteria met. Candidate strategy is ready for promotion review.`;
  } else if (noneMet && anyLosses && !anyWins) {
    overallVerdict = "baseline-wins";
    recommendation = "Candidate does not meet success criteria. Continue evaluating or consider archiving this experiment.";
  } else {
    overallVerdict = "inconclusive";
    recommendation = `${criteriaMetCount}/${criteriaTotal} criteria met. Extend the observation window or review per-surface analytics before deciding.`;
  }

  return { overallVerdict, confidence, criteriaMetCount, criteriaTotal, recommendation };
}

// ── Full benchmark ────────────────────────────────────────────────────────────

export interface BenchmarkComparison {
  readonly experimentId:      string;
  readonly displayName:       string;
  readonly baselineStrategy:  RecommendationStrategy;
  readonly candidateStrategy: RecommendationStrategy;
  readonly targetSurfaces:    readonly string[];
  readonly lifecycleStatus:   ExperimentLifecycleStage;
  readonly kpiComparisons:    readonly BenchmarkKPIComparison[];
  readonly readiness:         BenchmarkReadiness;
  readonly result:            BenchmarkResult;
  readonly methodology:       string;
}

function buildBenchmarkComparison(
  experiment: RecommendationExperiment,
  baseline?:  StrategyAnalyticsSnapshot,
  candidate?: StrategyAnalyticsSnapshot,
): BenchmarkComparison {
  const hasBaseline  = !!baseline  && experiment.successCriteria.some((c) => getSnapshotValue(baseline,  c.metric) !== null);
  const hasCandidate = !!candidate && experiment.successCriteria.some((c) => getSnapshotValue(candidate, c.metric) !== null);

  const readiness      = deriveReadiness(experiment, hasBaseline, hasCandidate);
  const kpiComparisons = experiment.successCriteria.map((c) =>
    buildKPIComparison(c, baseline, candidate),
  );
  const result = buildResult(kpiComparisons, baseline, candidate);

  const criteriaLabels = experiment.successCriteria
    .map((c) => QUALITY_THRESHOLDS[c.metric].label)
    .join(", ");

  const methodology = [
    `Compare ${experiment.baselineStrategy} (baseline) against ${experiment.candidateStrategy} (candidate)`,
    `on surfaces: ${experiment.targetSurfaces.join(", ")}.`,
    `Primary metrics: ${criteriaLabels}.`,
    `Candidate wins when all success criteria thresholds are reached and candidate outperforms baseline.`,
    experiment.notes ? `Observation guidance: ${experiment.notes}` : "",
  ].filter(Boolean).join(" ");

  return {
    experimentId:      experiment.id,
    displayName:       experiment.displayName,
    baselineStrategy:  experiment.baselineStrategy,
    candidateStrategy: experiment.candidateStrategy,
    targetSurfaces:    experiment.targetSurfaces,
    lifecycleStatus:   experiment.status,
    kpiComparisons,
    readiness,
    result,
    methodology,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function listBenchmarks(
  analyticsMap?: ReadonlyMap<string, { baseline?: StrategyAnalyticsSnapshot; candidate?: StrategyAnalyticsSnapshot }>,
): readonly BenchmarkComparison[] {
  return listExperiments()
    .filter((e) => e.successCriteria.length > 0)
    .map((e) => {
      const entry = analyticsMap?.get(e.id);
      return buildBenchmarkComparison(e, entry?.baseline, entry?.candidate);
    });
}

export function getBenchmark(
  experimentId: string,
  baseline?:    StrategyAnalyticsSnapshot,
  candidate?:   StrategyAnalyticsSnapshot,
): BenchmarkComparison | null {
  const experiment = getExperiment(experimentId);
  if (!experiment) return null;
  return buildBenchmarkComparison(experiment, baseline, candidate);
}

export function evaluateReadiness(
  experimentId:  string,
  hasBaseline?:  boolean,
  hasCandidate?: boolean,
): BenchmarkReadiness {
  const experiment = getExperiment(experimentId);
  if (!experiment) {
    return {
      state:    "not-ready",
      reason:   `Experiment "${experimentId}" not found in registry.`,
      blockers: ["Experiment not registered"],
      nextStep: "Register the experiment in RecommendationExperiments.ts.",
    };
  }
  return deriveReadiness(experiment, hasBaseline ?? false, hasCandidate ?? false);
}

export function compareStrategies(
  experimentId: string,
  baseline?:    StrategyAnalyticsSnapshot,
  candidate?:   StrategyAnalyticsSnapshot,
): BenchmarkResult {
  const experiment = getExperiment(experimentId);
  if (!experiment) {
    return {
      overallVerdict:   "pending",
      confidence:       "insufficient",
      criteriaMetCount: 0,
      criteriaTotal:    0,
      recommendation:   `Experiment "${experimentId}" not found in registry.`,
    };
  }
  const comparisons = experiment.successCriteria.map((c) =>
    buildKPIComparison(c, baseline, candidate),
  );
  return buildResult(comparisons, baseline, candidate);
}

export function listBenchmarkCandidates(): readonly RecommendationExperiment[] {
  return listExperiments().filter((e) => e.successCriteria.length > 0);
}
