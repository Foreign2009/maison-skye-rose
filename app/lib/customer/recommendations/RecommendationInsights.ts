/**
 * Recommendation Insights — Intelligence Synthesis Layer (EP30)
 *
 * Derives ranked, actionable insights from existing analytics and benchmark
 * outputs. All insight logic is a pure projection over existing module outputs.
 * No new arithmetic, no new thresholds, no duplicate calculations.
 *
 * Integration points:
 *   recommendationAnalytics.ts    — RecommendationAnalyticsResult (analytics input)
 *   SignalCalibration.ts          — SignalCalibrationReport (signal health)
 *   RecommendationBenchmark.ts    — listBenchmarks, listBenchmarkCandidates
 *   RecommendationQuality.ts      — classifyBand, QUALITY_THRESHOLDS (canonical KPIs)
 *   RecommendationExperiments.ts  — listActiveExperiments, listExperiments
 *   StrategyPerformance.ts        — StrategyAnalyticsInput (field names)
 *   admin/RecommendationPerformanceDashboard — four new insight sections
 *
 * Absorbed from EP29-P3:
 *   Internal toSnapshot() translates StrategyAnalyticsInput field names
 *   (clickThroughRate, saveRate, recommendationsShown) to StrategyAnalyticsSnapshot
 *   fields (ctr, favouriteRate, sampleSize) so listBenchmarks() can consume them.
 *
 * Field name mapping (StrategyAnalyticsInput → StrategyAnalyticsSnapshot):
 *   clickThroughRate        → ctr
 *   saveRate                → favouriteRate
 *   addToCartRate           → addToCartRate  (same)
 *   checkoutAttributionRate → checkoutAttributionRate  (same)
 *   recommendationsShown    → sampleSize
 */

import type { RecommendationAnalyticsResult } from "../../analytics/recommendationAnalytics";
import type { StrategyAnalyticsInput }         from "./StrategyPerformance";
import type { SignalCalibrationReport }         from "../signals/SignalCalibration";
import type { RecommendationStrategy }          from "./RecommendationStrategy";
import {
  listBenchmarks,
  listBenchmarkCandidates,
  type StrategyAnalyticsSnapshot,
} from "./RecommendationBenchmark";
import {
  classifyBand,
  QUALITY_THRESHOLDS,
  type QualityBand,
} from "./RecommendationQuality";
import {
  listActiveExperiments,
  listExperiments,
} from "./RecommendationExperiments";

// ── Public types ───────────────────────────────────────────────────────────────

export type InsightStatus =
  | "strongest"
  | "healthy"
  | "needs-attention"
  | "weakest"
  | "insufficient-evidence";

export interface StrategyInsight {
  readonly strategy:          RecommendationStrategy;
  readonly status:            InsightStatus;
  readonly headline:          string;
  readonly detail:            string;
  readonly ctrBand:           QualityBand | "Pending";
  readonly atcBand:           QualityBand | "Pending";
  readonly ctrValue:          number | null;
  readonly atcValue:          number | null;
  readonly evidenceAvailable: boolean;
}

export type AlertSeverity = "high" | "medium" | "low";

export type AlertType =
  | "low-ctr"
  | "poor-save-rate"
  | "poor-add-to-cart"
  | "benchmark-regression"
  | "benchmark-improvement";

export interface OpportunityAlert {
  readonly type:     AlertType;
  readonly severity: AlertSeverity;
  readonly strategy: RecommendationStrategy;
  readonly headline: string;
  readonly detail:   string;
  readonly evidence: string;
  readonly guidance: string;
}

export type GuidancePriority = "high" | "medium" | "low";
export type GuidanceCategory =
  | "evidence-collection"
  | "experiment"
  | "benchmark"
  | "signal"
  | "infrastructure";

export interface OperationalRecommendation {
  readonly priority: GuidancePriority;
  readonly category: GuidanceCategory;
  readonly headline: string;
  readonly detail:   string;
  readonly source:   string;
}

export type HealthStatus =
  | "excellent"
  | "healthy"
  | "needs-attention"
  | "critical"
  | "insufficient-evidence";

export interface ExecutiveSummary {
  readonly healthStatus:        HealthStatus;
  readonly headline:            string;
  readonly summary:             string;
  readonly keyStrengths:        readonly string[];
  readonly keyRisks:            readonly string[];
  readonly priorityAction:      string;
  readonly strategiesAnalyzed:  number;
  readonly alertCount:          number;
  readonly evidenceAvailable:   boolean;
}

export interface RecommendationInsightReport {
  readonly insights:            readonly StrategyInsight[];
  readonly opportunities:       readonly OpportunityAlert[];
  readonly guidance:            readonly OperationalRecommendation[];
  readonly executiveSummary:    ExecutiveSummary;
  readonly generatedAt:         string;
  readonly analyticsAvailable:  boolean;
  readonly analyticsWindowDays: number | null;
}

// ── Internal: field-name translation (EP29-P3 absorbed) ───────────────────────

function toSnapshot(
  strategy:  RecommendationStrategy,
  input:     StrategyAnalyticsInput,
  windowDays: number,
): StrategyAnalyticsSnapshot {
  return {
    strategy,
    ctr:                     input.clickThroughRate        ?? null,
    favouriteRate:           input.saveRate                ?? null,
    addToCartRate:           input.addToCartRate           ?? null,
    checkoutAttributionRate: input.checkoutAttributionRate ?? null,
    sampleSize:              input.recommendationsShown    ?? undefined,
    periodDays:              windowDays,
  };
}

// ── Internal: strategy insights ───────────────────────────────────────────────

const ALL_STRATEGIES: readonly RecommendationStrategy[] = [
  "personalised", "similar", "complementary", "discovery", "trending",
];

function buildStrategyInsights(
  analytics: RecommendationAnalyticsResult | null,
): readonly StrategyInsight[] {
  const windowDays = analytics?.windowDays ?? 30;

  // Build per-strategy snapshot map for ranking
  const snapshotByStrategy = new Map<RecommendationStrategy, StrategyAnalyticsSnapshot>();
  if (analytics) {
    for (const strategy of ALL_STRATEGIES) {
      const input = analytics.byStrategy[strategy];
      if (input) {
        snapshotByStrategy.set(strategy, toSnapshot(strategy, input, windowDays));
      }
    }
  }

  // Rank by CTR (primary conversion signal) for strongest/weakest labelling
  const ranked = [...snapshotByStrategy.entries()]
    .filter(([, snap]) => snap.ctr !== null && snap.ctr !== undefined)
    .sort(([, a], [, b]) => (b.ctr ?? 0) - (a.ctr ?? 0));

  // Only apply strongest/weakest when at least 2 strategies have evidence
  const canRank = ranked.length >= 2;
  const strongestStrategy = canRank ? ranked[0][0]  : null;
  const weakestStrategy   = canRank ? ranked[ranked.length - 1][0] : null;

  return ALL_STRATEGIES.map((strategy) => {
    const snap = snapshotByStrategy.get(strategy);
    const evidenceAvailable = !!snap && (snap.ctr !== null || snap.addToCartRate !== null);

    if (!evidenceAvailable) {
      return {
        strategy,
        status:           "insufficient-evidence" as InsightStatus,
        headline:         `${capitalise(strategy)}: awaiting analytics`,
        detail:           "No engagement data available. Configure PostHog env vars and allow an observation window to accumulate.",
        ctrBand:          "Pending" as const,
        atcBand:          "Pending" as const,
        ctrValue:         null,
        atcValue:         null,
        evidenceAvailable: false,
      };
    }

    const ctrValue  = snap.ctr          ?? null;
    const atcValue  = snap.addToCartRate ?? null;
    const ctrBand:  QualityBand | "Pending" = ctrValue  !== null ? classifyBand("ctr",          ctrValue)  : "Pending";
    const atcBand:  QualityBand | "Pending" = atcValue  !== null ? classifyBand("addToCartRate", atcValue)  : "Pending";

    let status: InsightStatus;
    if (strategy === strongestStrategy) {
      status = "strongest";
    } else if (strategy === weakestStrategy) {
      status = "weakest";
    } else if (ctrBand === "Excellent" || ctrBand === "Healthy") {
      status = "healthy";
    } else {
      status = "needs-attention";
    }

    const ctrLabel = ctrValue !== null ? `CTR ${pct(ctrValue)} (${ctrBand})` : "CTR pending";
    const atcLabel = atcValue !== null ? `ATC ${pct(atcValue)} (${atcBand})` : "ATC pending";

    const headline = `${capitalise(strategy)}: ${statusHeadline(status, ctrBand)}`;
    const detail   = `${ctrLabel} · ${atcLabel}. ${strategyDetail(strategy, status)}`;

    return {
      strategy,
      status,
      headline,
      detail,
      ctrBand,
      atcBand,
      ctrValue,
      atcValue,
      evidenceAvailable: true,
    };
  });
}

// ── Internal: opportunity alerts ──────────────────────────────────────────────

function buildOpportunityAlerts(
  analytics: RecommendationAnalyticsResult | null,
): readonly OpportunityAlert[] {
  if (!analytics) return [];

  const windowDays = analytics.windowDays;
  const alerts: OpportunityAlert[] = [];
  const ctrThreshold  = QUALITY_THRESHOLDS.ctr;
  const atcThreshold  = QUALITY_THRESHOLDS.addToCartRate;
  const saveThreshold = QUALITY_THRESHOLDS.favouriteRate;

  for (const strategy of ALL_STRATEGIES) {
    const input = analytics.byStrategy[strategy];
    if (!input) continue;

    const ctr  = input.clickThroughRate ?? null;
    const atc  = input.addToCartRate    ?? null;
    const save = input.saveRate         ?? null;

    if (ctr !== null) {
      const band = classifyBand("ctr", ctr);
      if (band === "Critical" || band === "Needs Attention") {
        alerts.push({
          type:     "low-ctr",
          severity: band === "Critical" ? "high" : "medium",
          strategy,
          headline: `Low CTR on ${capitalise(strategy)} strategy`,
          detail:   `Click-through rate is ${pct(ctr)}, below the ${pct(ctrThreshold.healthy)} Healthy threshold.`,
          evidence: `CTR ${pct(ctr)} vs threshold ${pct(ctrThreshold.healthy)} (${windowDays}-day window)`,
          guidance: `Review surface placement and recommendation relevance for ${strategy} surfaces. Consider running an A/B experiment with an alternative strategy.`,
        });
      }
    }

    if (atc !== null) {
      const band = classifyBand("addToCartRate", atc);
      if (band === "Critical" || band === "Needs Attention") {
        alerts.push({
          type:     "poor-add-to-cart",
          severity: band === "Critical" ? "high" : "medium",
          strategy,
          headline: `Low Add-to-Cart Rate on ${capitalise(strategy)} strategy`,
          detail:   `Add-to-cart rate is ${pct(atc)}, below the ${pct(atcThreshold.healthy)} Healthy threshold.`,
          evidence: `ATC ${pct(atc)} vs threshold ${pct(atcThreshold.healthy)} (${windowDays}-day window)`,
          guidance: `Inspect recommendation reasons for ${strategy}. Higher-intent surfaces may benefit from complementary or personalised strategies.`,
        });
      }
    }

    if (save !== null) {
      const band = classifyBand("favouriteRate", save);
      if (band === "Critical") {
        alerts.push({
          type:     "poor-save-rate",
          severity: "low",
          strategy,
          headline: `Low Favourite Rate on ${capitalise(strategy)} strategy`,
          detail:   `Favourite rate is ${pct(save)}, below the ${pct(saveThreshold.healthy)} Healthy threshold.`,
          evidence: `Favourite rate ${pct(save)} vs threshold ${pct(saveThreshold.healthy)} (${windowDays}-day window)`,
          guidance: `Investigate recommendation diversity and relevance. Low save rate may indicate poor long-term intent signal quality.`,
        });
      }
    }
  }

  // Benchmark-based alerts (regression / improvement from experiments)
  const benchmarks = listBenchmarks();
  for (const benchmark of benchmarks) {
    if (benchmark.result.overallVerdict === "candidate-wins") {
      alerts.push({
        type:     "benchmark-improvement",
        severity: "medium",
        strategy: benchmark.candidateStrategy,
        headline: `Experiment "${benchmark.displayName}" shows candidate improvement`,
        detail:   `Candidate strategy (${benchmark.candidateStrategy}) outperforms baseline (${benchmark.baselineStrategy}) — ${benchmark.result.criteriaMetCount}/${benchmark.result.criteriaTotal} criteria met.`,
        evidence: benchmark.result.recommendation,
        guidance: `Review promotion checklist for experiment ${benchmark.experimentId} and consider advancing lifecycle stage.`,
      });
    }
    if (benchmark.result.overallVerdict === "baseline-wins") {
      alerts.push({
        type:     "benchmark-regression",
        severity: "medium",
        strategy: benchmark.candidateStrategy,
        headline: `Experiment "${benchmark.displayName}" shows baseline advantage`,
        detail:   `Baseline strategy (${benchmark.baselineStrategy}) outperforms candidate (${benchmark.candidateStrategy}).`,
        evidence: benchmark.result.recommendation,
        guidance: `Consider archiving experiment ${benchmark.experimentId} or adjusting the candidate strategy configuration.`,
      });
    }
  }

  return alerts.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));
}

// ── Internal: operational guidance ───────────────────────────────────────────

function buildOperationalGuidance(
  analytics: RecommendationAnalyticsResult | null,
  signals:   SignalCalibrationReport,
): readonly OperationalRecommendation[] {
  const guidance: OperationalRecommendation[] = [];

  // Analytics availability
  if (!analytics) {
    guidance.push({
      priority: "high",
      category: "evidence-collection",
      headline: "Configure PostHog analytics to unlock live insights",
      detail:   "Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID environment variables. All insight sections require analytics data.",
      source:   "analytics-availability",
    });
  }

  // Signal health: dead types that reduce recommendation quality
  if (signals.deadTypes.length > 0) {
    guidance.push({
      priority: "medium",
      category: "signal",
      headline: `${signals.deadTypes.length} signal type(s) captured but unused`,
      detail:   `Dead signal types: ${signals.deadTypes.join(", ")}. These are emitted but have no scoring or reason path, reducing profile richness.`,
      source:   "signal-calibration",
    });
  }

  // Signal health: unused sources
  const unusedCount = signals.sourceHealth.filter(
    (s) => !s.usedInScoring && !s.usedInReasons,
  ).length;
  if (unusedCount > 0) {
    guidance.push({
      priority: "low",
      category: "signal",
      headline: `${unusedCount} signal source(s) reserved but not yet active`,
      detail:   "Sources like purchase, concierge, and discovery are reserved but have no emission path. Activating them will enrich personalisation.",
      source:   "signal-calibration",
    });
  }

  // Experiments: all in draft
  const allExperiments   = listExperiments();
  const activeExps       = listActiveExperiments();
  const draftExps        = allExperiments.filter((e) => e.status === "draft");

  if (draftExps.length > 0 && activeExps.length === 0) {
    guidance.push({
      priority: "high",
      category: "experiment",
      headline: `${draftExps.length} experiment(s) ready to activate`,
      detail:   `All experiments are in draft status: ${draftExps.map((e) => e.displayName).join(", ")}. Activate one to begin controlled A/B evaluation.`,
      source:   "experiment-registry",
    });
  }

  // Benchmark candidates awaiting analytics
  const candidates = listBenchmarkCandidates();
  const awaitingAnalytics = candidates.filter(
    (e) => e.status !== "draft" && e.status !== "promoted" && e.status !== "archived",
  );
  if (awaitingAnalytics.length > 0 && !analytics) {
    guidance.push({
      priority: "medium",
      category: "benchmark",
      headline: "Active experiments cannot be evaluated without analytics",
      detail:   "Benchmark comparisons require live PostHog data for both baseline and candidate strategies.",
      source:   "benchmark-readiness",
    });
  }

  // Observation window reminder when analytics available but window is short
  if (analytics && analytics.windowDays < 14) {
    guidance.push({
      priority: "low",
      category: "evidence-collection",
      headline: "Analytics window is shorter than the recommended 14-day minimum",
      detail:   `Current window: ${analytics.windowDays} days. Experiment observation guidelines require at least 14 days for reliable conclusions.`,
      source:   "analytics-window",
    });
  }

  return guidance.sort((a, b) => guidancePriorityOrder(a.priority) - guidancePriorityOrder(b.priority));
}

// ── Internal: executive summary ───────────────────────────────────────────────

function buildExecutiveSummary(
  insights:      readonly StrategyInsight[],
  opportunities: readonly OpportunityAlert[],
  analytics:     RecommendationAnalyticsResult | null,
): ExecutiveSummary {
  const evidenceAvailable = analytics !== null &&
    Object.keys(analytics.byStrategy).length > 0;

  const strategiesAnalyzed = insights.filter((i) => i.evidenceAvailable).length;
  const alertCount         = opportunities.length;

  if (!evidenceAvailable) {
    return {
      healthStatus:       "insufficient-evidence",
      headline:           "Recommendation system operational — analytics pending",
      summary:            "The recommendation platform is running. No PostHog analytics are available yet. Configure analytics environment variables to unlock insight evaluation.",
      keyStrengths:       ["Strategy resolver active across all surfaces", "Experiment registry configured with 2 experiments", "Signal calibration reporting available"],
      keyRisks:           ["No live engagement data — strategy effectiveness unverified", "All experiments in draft — no A/B data collected"],
      priorityAction:     "Configure POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to begin data collection.",
      strategiesAnalyzed: 0,
      alertCount:         0,
      evidenceAvailable:  false,
    };
  }

  const highAlerts   = opportunities.filter((o) => o.severity === "high");
  const mediumAlerts = opportunities.filter((o) => o.severity === "medium");
  const strongest    = insights.find((i) => i.status === "strongest");
  const weakest      = insights.find((i) => i.status === "weakest");

  let healthStatus: HealthStatus;
  if (highAlerts.length >= 2)        healthStatus = "critical";
  else if (highAlerts.length === 1)  healthStatus = "needs-attention";
  else if (mediumAlerts.length >= 2) healthStatus = "needs-attention";
  else if (strategiesAnalyzed >= 3)  healthStatus = "healthy";
  else                               healthStatus = "insufficient-evidence";

  const keyStrengths: string[] = [];
  const keyRisks:     string[] = [];

  if (strongest) {
    keyStrengths.push(`${capitalise(strongest.strategy)} strategy leads on CTR${strongest.ctrValue !== null ? ` (${pct(strongest.ctrValue)})` : ""}`);
  }
  const excellentInsights = insights.filter((i) => i.ctrBand === "Excellent" || i.atcBand === "Excellent");
  if (excellentInsights.length > 0) {
    keyStrengths.push(`${excellentInsights.length} strategy surface(s) in Excellent quality band`);
  }
  if (listActiveExperiments().length > 0) {
    keyStrengths.push("A/B experiments active — controlled optimisation underway");
  }
  if (keyStrengths.length === 0) {
    keyStrengths.push("Recommendation platform fully operational");
  }

  for (const alert of highAlerts) {
    keyRisks.push(alert.headline);
  }
  if (weakest && weakest.ctrBand !== "Pending") {
    keyRisks.push(`${capitalise(weakest.strategy)} strategy underperforming — ${weakest.ctrBand} CTR band`);
  }
  if (keyRisks.length === 0 && mediumAlerts.length > 0) {
    keyRisks.push(mediumAlerts[0].headline);
  }

  const priorityAction = highAlerts.length > 0
    ? highAlerts[0].guidance
    : mediumAlerts.length > 0
    ? mediumAlerts[0].guidance
    : "Continue monitoring. No immediate action required.";

  const headline = healthStatus === "critical"
    ? `${highAlerts.length} high-severity alert(s) require attention`
    : healthStatus === "needs-attention"
    ? "Recommendation system needs attention on select strategies"
    : `Recommendation system healthy — ${strategiesAnalyzed} strategies with evidence`;

  const summary = `Analysed ${strategiesAnalyzed} of ${ALL_STRATEGIES.length} strategies over ${analytics.windowDays} days. ` +
    `${alertCount > 0 ? `${alertCount} alert(s) detected. ` : "No alerts. "}` +
    `${listActiveExperiments().length > 0 ? `${listActiveExperiments().length} experiment(s) active.` : "All experiments in draft."}`;

  return {
    healthStatus,
    headline,
    summary,
    keyStrengths,
    keyRisks,
    priorityAction,
    strategiesAnalyzed,
    alertCount,
    evidenceAvailable: true,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildRecommendationInsights(
  analytics: RecommendationAnalyticsResult | null,
  signals:   SignalCalibrationReport,
): RecommendationInsightReport {
  const insights      = buildStrategyInsights(analytics);
  const opportunities = buildOpportunityAlerts(analytics);
  const guidance      = buildOperationalGuidance(analytics, signals);
  const executiveSummary = buildExecutiveSummary(insights, opportunities, analytics);

  return {
    insights,
    opportunities,
    guidance,
    executiveSummary,
    generatedAt:         new Date().toISOString(),
    analyticsAvailable:  analytics !== null,
    analyticsWindowDays: analytics?.windowDays ?? null,
  };
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function statusHeadline(status: InsightStatus, ctrBand: QualityBand | "Pending"): string {
  switch (status) {
    case "strongest":            return "top performer";
    case "healthy":              return "healthy";
    case "needs-attention":      return "needs attention";
    case "weakest":              return "lowest engagement";
    case "insufficient-evidence": return "awaiting data";
  }
}

function strategyDetail(strategy: RecommendationStrategy, status: InsightStatus): string {
  if (status === "insufficient-evidence") return "Await analytics data before drawing conclusions.";
  switch (strategy) {
    case "personalised":   return "Personalised recommendations rely on quiz, save, and view signals. Strong performance indicates good profile depth.";
    case "similar":        return "Similar strategy targets PDP surfaces. High CTR validates catalogue-similarity scoring.";
    case "complementary":  return "Complementary strategy targets cart and cross-sell surfaces. ATC is the primary success metric.";
    case "discovery":      return "Discovery strategy serves cold-start visitors. Engagement reflects catalogue diversity and surface placement.";
    case "trending":       return "Trending strategy leverages social proof. High CTR indicates popularity signals are resonating.";
  }
}

function severityOrder(s: AlertSeverity): number {
  return s === "high" ? 0 : s === "medium" ? 1 : 2;
}

function guidancePriorityOrder(p: GuidancePriority): number {
  return p === "high" ? 0 : p === "medium" ? 1 : 2;
}
