/**
 * Recommendation Intelligence — Experiment Promotion Workflow
 *
 * Defines the lifecycle model, readiness criteria, and promotion decision
 * for recommendation experiments. All functions are pure and deterministic.
 *
 * Evaluation draws evidence from:
 *   StrategyPerformanceSnapshot — strategy quality metrics
 *   SignalCalibrationReport     — signal architecture health
 *   ExperimentStatusSummary     — experiment framework state
 *   CalibrationStatusSummary    — calibration framework state
 *
 * Integration points:
 *   admin/intelligence/page.tsx     — calls evaluatePromotionReadiness
 *   admin/IntelligenceDashboard     — renders promotion sections
 *
 * Promotion decisions are informational only. No experiments are
 * activated, modified, or promoted automatically.
 */

import type { StrategyPerformanceSnapshot } from "./StrategyPerformance";
import type { SignalCalibrationReport }     from "@/app/lib/customer/signals/SignalCalibration";

// ── Lifecycle ─────────────────────────────────────────────────────────────────

export type ExperimentLifecycleStage =
  | "draft"        // framework not implemented; no active experiment
  | "active"       // framework implemented; experiment running; data accumulating
  | "evaluating"   // evaluation period reached; metrics under review
  | "ready"        // all criteria met; ready for promotion decision
  | "promoted"     // variant accepted into production
  | "archived";    // experiment concluded without promotion

// ── Input summaries ───────────────────────────────────────────────────────────
// Canonical home for these types. IntelligenceDashboard imports them from here.

export interface ExperimentStatusSummary {
  frameworkImplemented: boolean;
  activeExperiments:    readonly string[];
  baselineMode:         boolean;
}

export interface CalibrationStatusSummary {
  frameworkImplemented: boolean;
  activeCalibrationId:  string;
  registeredCount:      number;
  strategyWeights:      Readonly<Record<string, {
    profile:   number;
    catalog:   number;
    relation:  number;
    discovery: number;
  }>>;
}

// ── Promotion model ───────────────────────────────────────────────────────────

export interface PromotionCriteria {
  readonly minimumRunDays:               number;
  readonly minimumActiveStrategies:      number;
  readonly signalHealthMinSources:       number;
  readonly requiresEngagementMetrics:    boolean;
  readonly requiresExperimentFramework:  boolean;
  readonly requiresCalibrationFramework: boolean;
}

export interface PromotionCriterionResult {
  readonly criterion: string;
  readonly met:       boolean;
  readonly value:     string;
  readonly required:  string;
  readonly source:    string;
}

export interface PromotionReadiness {
  readonly stage:        ExperimentLifecycleStage;
  readonly overallReady: boolean;
  readonly criteria:     readonly PromotionCriterionResult[];
  readonly blockers:     readonly string[];
  readonly observations: readonly string[];
}

export interface PromotionRecommendation {
  readonly action:     "promote" | "continue_evaluating" | "archive" | "await_framework";
  readonly confidence: "high" | "medium" | "low";
  readonly summary:    string;
}

export interface PromotionDecision {
  readonly experimentId:   string;
  readonly variantKey:     string | null;
  readonly calibrationId:  string;
  readonly stage:          ExperimentLifecycleStage;
  readonly ready:          boolean;
  readonly readiness:      PromotionReadiness;
  readonly recommendation: PromotionRecommendation;
  readonly rationale:      string;
  readonly followUpWork:   readonly string[];
}

// ── Baseline (current production state) ──────────────────────────────────────

export interface CurrentBaseline {
  readonly strategyCount:        number;
  readonly activeStrategyCount:  number;
  readonly avgScoreAcrossActive: number;
  readonly signalSourcesActive:  number;
  readonly signalSourcesTotal:   number;
  readonly calibrationId:        string;
  readonly experimentMode:       "baseline" | "active";
}

// ── Promotion history ─────────────────────────────────────────────────────────

export interface PromotionHistoryEntry {
  readonly experimentId: string;
  readonly variantKey:   string;
  readonly promotedAt:   string | null;
  readonly outcome:      "promoted" | "archived" | "pending";
}

// ── Full report ───────────────────────────────────────────────────────────────

export interface PromotionReport {
  readonly generatedAt:     string;
  readonly currentBaseline: CurrentBaseline;
  readonly decision:        PromotionDecision;
  readonly history:         readonly PromotionHistoryEntry[];
}

// ── Default criteria ──────────────────────────────────────────────────────────

const DEFAULT_PROMOTION_CRITERIA: PromotionCriteria = {
  minimumRunDays:               7,
  minimumActiveStrategies:      3,
  signalHealthMinSources:       2,
  requiresEngagementMetrics:    true,
  requiresExperimentFramework:  true,
  requiresCalibrationFramework: true,
};

// ── Stage derivation ──────────────────────────────────────────────────────────

function deriveStage(
  experiment:  ExperimentStatusSummary,
  calibration: CalibrationStatusSummary,
): ExperimentLifecycleStage {
  if (!experiment.frameworkImplemented) return "draft";
  if (experiment.baselineMode || experiment.activeExperiments.length === 0) return "draft";
  if (!calibration.frameworkImplemented) return "active";
  return "active";
}

// ── Criteria evaluation ───────────────────────────────────────────────────────

function evaluateCriteria(
  experiment:  ExperimentStatusSummary,
  calibration: CalibrationStatusSummary,
  performance: StrategyPerformanceSnapshot,
  signals:     SignalCalibrationReport,
  criteria:    PromotionCriteria,
): readonly PromotionCriterionResult[] {
  const activeStrategies      = performance.summaries.filter((s) => s.active).length;
  const hasEngagementMetrics  = performance.summaries.some((s) => s.clickThroughRate !== null);
  const hasPerformanceData    = performance.summaries.length > 0;

  return [
    {
      criterion: "Experiment framework",
      met:       experiment.frameworkImplemented || !criteria.requiresExperimentFramework,
      value:     experiment.frameworkImplemented ? "Implemented" : "Pending EP24.1",
      required:  "Implemented",
      source:    "Experiment Status",
    },
    {
      criterion: "Calibration framework",
      met:       calibration.frameworkImplemented || !criteria.requiresCalibrationFramework,
      value:     calibration.frameworkImplemented ? "Implemented" : "Pending EP24.2",
      required:  "Implemented",
      source:    "Calibration Status",
    },
    {
      criterion: "Active experiment",
      met:       !experiment.baselineMode && experiment.activeExperiments.length > 0,
      value:     experiment.activeExperiments.length === 0
        ? "None"
        : experiment.activeExperiments.join(", "),
      required:  "At least 1",
      source:    "Experiment Status",
    },
    {
      criterion: "Active strategies",
      met:       activeStrategies >= criteria.minimumActiveStrategies,
      value:     String(activeStrategies),
      required:  `≥ ${criteria.minimumActiveStrategies}`,
      source:    "Strategy Performance",
    },
    {
      criterion: "Signal health",
      met:       signals.activeSources.length >= criteria.signalHealthMinSources,
      value:     `${signals.activeSources.length} of ${signals.sourceHealth.length}`,
      required:  `≥ ${criteria.signalHealthMinSources} active sources`,
      source:    "Signal Intelligence",
    },
    {
      criterion: "Strategy performance data",
      met:       hasPerformanceData,
      value:     `${performance.summaries.length} strategies`,
      required:  "≥ 1 strategy",
      source:    "Strategy Performance",
    },
    {
      criterion: "Engagement metrics",
      met:       hasEngagementMetrics || !criteria.requiresEngagementMetrics,
      value:     hasEngagementMetrics ? "Available" : "Pending EP23.5",
      required:  "CTR, Save Rate, Cart Rate",
      source:    "Strategy Performance",
    },
  ];
}

// ── Blockers ──────────────────────────────────────────────────────────────────

function deriveBlockers(criteria: readonly PromotionCriterionResult[]): readonly string[] {
  return criteria
    .filter((c) => !c.met)
    .map((c) => `${c.criterion}: ${c.value} (required: ${c.required})`);
}

// ── Observations ──────────────────────────────────────────────────────────────

function deriveObservations(
  performance: StrategyPerformanceSnapshot,
  signals:     SignalCalibrationReport,
): readonly string[] {
  const active = performance.summaries.filter((s) => s.active);
  const obs: string[] = [
    `Strategy performance data available for ${performance.summaries.length} strategies (${active.length} active)`,
    `Signal health: ${signals.activeSources.length} of ${signals.sourceHealth.length} sources active`,
  ];
  if (!signals.confidenceWeightUsed) {
    obs.push("CONFIDENCE_WEIGHT not applied — experiment impact limited to equal-weight slug scoring");
  }
  if (!signals.signalsArrayConsumed) {
    obs.push("profile.signals[] not consumed by PreferenceScorer — experiments cannot yet leverage structured signal data");
  }
  if (signals.deadTypes.length > 0) {
    obs.push(`${signals.deadTypes.length} signal types are captured but have no scoring path`);
  }
  return obs;
}

// ── Recommendation ────────────────────────────────────────────────────────────

function deriveRecommendation(
  stage:      ExperimentLifecycleStage,
  unmetCount: number,
): PromotionRecommendation {
  if (stage === "draft") {
    return {
      action:     "await_framework",
      confidence: "high",
      summary:    "Implement EP24.1 (experiment framework) before running experiments. EP24.2 (calibration framework) recommended before evaluation.",
    };
  }
  if (stage === "ready" || stage === "promoted") {
    return {
      action:     "promote",
      confidence: "high",
      summary:    "All promotion criteria met. Variant is ready for production.",
    };
  }
  if (stage === "archived") {
    return {
      action:     "archive",
      confidence: "high",
      summary:    "Experiment concluded without promotion.",
    };
  }
  return {
    action:     "continue_evaluating",
    confidence: "high",
    summary:    `${unmetCount} criterion${unmetCount !== 1 ? "a" : "ion"} not yet met. Continue evaluating.`,
  };
}

// ── Follow-up work ────────────────────────────────────────────────────────────

function deriveFollowUpWork(
  experiment:  ExperimentStatusSummary,
  calibration: CalibrationStatusSummary,
  performance: StrategyPerformanceSnapshot,
): readonly string[] {
  const work: string[] = [];
  if (!experiment.frameworkImplemented) {
    work.push("Implement EP24.1 — Recommendation Experiment Framework");
  }
  if (!calibration.frameworkImplemented) {
    work.push("Implement EP24.2 — Score Calibration Framework");
  }
  if (!performance.summaries.some((s) => s.clickThroughRate !== null)) {
    work.push("Implement EP23.5 — analytics integration for engagement metrics (CTR, save rate, cart rate)");
  }
  if (experiment.baselineMode) {
    work.push("Define and register an experiment in ACTIVE_EXPERIMENTS to begin variant assignment");
  }
  return work;
}

// ── Rationale ─────────────────────────────────────────────────────────────────

function deriveRationale(
  stage:      ExperimentLifecycleStage,
  blockers:   readonly string[],
): string {
  if (stage === "draft") {
    return "No experiment framework is implemented. All promotion decisions require EP24.1 to be operational before a variant can enter the active lifecycle.";
  }
  if (stage === "ready" || stage === "promoted") {
    return "All criteria met. Variant is ready for production promotion.";
  }
  if (stage === "archived") {
    return "Experiment concluded without promotion.";
  }
  return `Lifecycle stage: ${stage}. ${blockers.length} criterion${blockers.length !== 1 ? "a" : "ion"} block promotion.`;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function evaluatePromotionReadiness(
  experiment:  ExperimentStatusSummary,
  calibration: CalibrationStatusSummary,
  performance: StrategyPerformanceSnapshot,
  signals:     SignalCalibrationReport,
  criteria:    PromotionCriteria = DEFAULT_PROMOTION_CRITERIA,
): PromotionDecision {
  const stage        = deriveStage(experiment, calibration);
  const evaluated    = evaluateCriteria(experiment, calibration, performance, signals, criteria);
  const blockers     = deriveBlockers(evaluated);
  const observations = deriveObservations(performance, signals);
  const overallReady = stage === "ready" || stage === "promoted";

  return {
    experimentId:  experiment.activeExperiments[0] ?? "none",
    variantKey:    null,
    calibrationId: calibration.activeCalibrationId,
    stage,
    ready:         overallReady,
    readiness: {
      stage,
      overallReady,
      criteria:  evaluated,
      blockers,
      observations,
    },
    recommendation: deriveRecommendation(stage, blockers.length),
    rationale:      deriveRationale(stage, blockers),
    followUpWork:   deriveFollowUpWork(experiment, calibration, performance),
  };
}

export function buildCurrentBaseline(
  performance: StrategyPerformanceSnapshot,
  signals:     SignalCalibrationReport,
  calibration: CalibrationStatusSummary,
  experiment:  ExperimentStatusSummary,
): CurrentBaseline {
  const active   = performance.summaries.filter((s) => s.active);
  const avgScore = active.length === 0
    ? 0
    : active.reduce((s, x) => s + x.avgScore, 0) / active.length;

  return {
    strategyCount:        performance.summaries.length,
    activeStrategyCount:  active.length,
    avgScoreAcrossActive: Math.round(avgScore * 1000) / 1000,
    signalSourcesActive:  signals.activeSources.length,
    signalSourcesTotal:   signals.sourceHealth.length,
    calibrationId:        calibration.activeCalibrationId,
    experimentMode:       experiment.baselineMode ? "baseline" : "active",
  };
}
