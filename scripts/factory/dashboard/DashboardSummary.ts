/**
 * Knowledge Operations Dashboard — Summary Computations
 *
 * Derives all computed/aggregate metrics from raw subsystem data.
 * No I/O here — pure functions over data already read by DashboardService.
 *
 * Responsibilities:
 *   - Producer success rates (from factory-log stage entries)
 *   - Token totals and cost estimate (batch-log + factory-log merge messages)
 *   - Average runtime across all runs
 *   - Health indicators for every subsystem
 *   - ASCII progress bars
 */

import type { FactoryLogEntry, StageEntry } from "../types";
import type { BatchLogEntry }               from "../batch/BatchLogger";
import type {
  HealthStatus, HealthIndicator, SystemHealth,
  ProducerSuccessRate, OperationsMetrics, ProgressBar,
  ReviewMetrics, PromotionMetrics, ValidationMetrics, CoverageMetrics,
} from "./DashboardMetrics";

// ── Constants ─────────────────────────────────────────────────────────────────

const PRODUCER_STAGES = ["composition", "editorial", "relationships", "education", "discovery"] as const;
const INPUT_COST_PER_M  = 0.80;
const OUTPUT_COST_PER_M = 4.00;
const PROMPT_RATIO      = 0.80;   // estimated prompt/total split for single runs

// ── Producer success rates ────────────────────────────────────────────────────

export function computeProducerRates(runs: FactoryLogEntry[]): ProducerSuccessRate[] {
  const accum: Record<string, { pass: number; degraded: number; fail: number; skip: number }> = {};
  for (const stage of PRODUCER_STAGES) {
    accum[stage] = { pass: 0, degraded: 0, fail: 0, skip: 0 };
  }

  for (const run of runs) {
    for (const stage of run.stages) {
      if (!(stage.stage in accum)) continue;
      const a = accum[stage.stage];
      if (stage.status === "pass")     a.pass++;
      else if (stage.status === "degraded") a.degraded++;
      else if (stage.status === "fail") a.fail++;
      else                              a.skip++;
    }
  }

  return PRODUCER_STAGES.map(name => {
    const a     = accum[name];
    const total = a.pass + a.degraded + a.fail + a.skip;
    return {
      name,
      total,
      pass:        a.pass,
      degraded:    a.degraded,
      fail:        a.fail,
      successRate: total > 0 ? (a.pass + a.degraded) / total : 0,
    };
  });
}

// ── Token totals and cost ─────────────────────────────────────────────────────

function parseMergeTokens(stages: StageEntry[]): number {
  const merge = stages.find(s => s.stage === "merge");
  if (!merge?.message) return 0;
  const m = merge.message.match(/(\d[\d,]*)\s+tokens/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

export function computeOperationsMetrics(
  runs:    FactoryLogEntry[],
  batches: BatchLogEntry[],
): OperationsMetrics {
  // Batch totals (exact)
  let batchTokens  = 0;
  let batchCostUsd = 0;
  for (const b of batches) {
    batchTokens  += b.report.tokenUsage?.totalTokens  ?? 0;
    batchCostUsd += b.report.estimatedCostUsd         ?? 0;
  }

  // Single-run totals (parsed from merge stage)
  let singleTokens  = 0;
  let totalDurationMs = 0;

  for (const run of runs) {
    const total = parseMergeTokens(run.stages);
    singleTokens  += total;
    const start = new Date(run.startedAt).getTime();
    const end   = new Date(run.completedAt).getTime();
    if (!isNaN(start) && !isNaN(end)) totalDurationMs += (end - start);
  }

  // Estimate cost for single runs using prompt/completion ratio assumption
  const singlePromptTok     = Math.round(singleTokens * PROMPT_RATIO);
  const singleCompletionTok = singleTokens - singlePromptTok;
  const singleCostUsd = (
    singlePromptTok     * INPUT_COST_PER_M  +
    singleCompletionTok * OUTPUT_COST_PER_M
  ) / 1_000_000;

  const totalTokens         = batchTokens + singleTokens;
  const totalEstimatedCostUsd = batchCostUsd + singleCostUsd;
  const runCount            = runs.length;

  return {
    averageRuntimeMs:       runCount > 0 ? totalDurationMs / runCount : null,
    averageTotalTokens:     runCount > 0 ? singleTokens / runCount    : null,
    totalEstimatedCostUsd,
    totalTokens,
    producerRates:          computeProducerRates(runs),
  };
}

// ── Progress bars ─────────────────────────────────────────────────────────────

const BAR_WIDTH = 28;

function makeBar(current: number, total: number): string {
  if (total <= 0) return `[${"░".repeat(BAR_WIDTH)}]`;
  const filled = Math.round((current / total) * BAR_WIDTH);
  const empty  = BAR_WIDTH - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
}

export function buildProgressBars(
  coverage:  CoverageMetrics,
  promotion: PromotionMetrics,
): ProgressBar[] {
  const nativePct   = coverage.totalSupplier > 0
    ? (coverage.nativeRecords / coverage.totalSupplier) * 100 : 0;
  const promoPct    = (coverage.nativeRecords + promotion.ready) > 0
    ? (promotion.promoted / Math.max(coverage.nativeRecords, 1)) * 100 : 0;
  const remainingPct = coverage.totalSupplier > 0
    ? (coverage.remaining / coverage.totalSupplier) * 100 : 0;

  return [
    {
      label:   "Native Coverage",
      current: coverage.nativeRecords,
      total:   coverage.totalSupplier,
      pct:     nativePct,
      bar:     makeBar(coverage.nativeRecords, coverage.totalSupplier),
    },
    {
      label:   "Remaining Supplier",
      current: coverage.remaining,
      total:   coverage.totalSupplier,
      pct:     remainingPct,
      bar:     makeBar(coverage.remaining, coverage.totalSupplier),
    },
    {
      label:   "Promotion Progress",
      current: promotion.promoted,
      total:   Math.max(coverage.nativeRecords, 1),
      pct:     promoPct,
      bar:     makeBar(promotion.promoted, coverage.nativeRecords),
    },
  ];
}

// ── Health computation ────────────────────────────────────────────────────────

function indicator(
  status:  HealthStatus,
  label:   string,
  reasons: string[],
): HealthIndicator {
  return { status, label, reasons };
}

export function computeFactoryHealth(
  runs:       FactoryLogEntry[],
  validation: ValidationMetrics,
): HealthIndicator {
  const reasons: string[] = [];

  if (runs.length === 0) {
    return indicator("critical", "Factory", ["No factory runs recorded"]);
  }

  if (validation.fail > 0) {
    reasons.push(`${validation.fail} native record(s) failing validation`);
  }
  if (validation.passWithWarnings > 0) {
    reasons.push(`${validation.passWithWarnings} native record(s) have warnings`);
  }

  const lastRun   = new Date(runs[0].completedAt).getTime();
  const ageMs     = Date.now() - lastRun;
  const ageDays   = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays > 30) {
    reasons.push(`Last factory run was ${Math.floor(ageDays)} days ago`);
  }

  const status: HealthStatus = validation.fail > 0 ? "critical"
    : reasons.length > 0     ? "warning"
    : "healthy";

  return indicator(status, "Factory", reasons);
}

export function computeReviewHealth(review: ReviewMetrics): HealthIndicator {
  const reasons: string[] = [];

  if (review.needsRegeneration > 0) {
    reasons.push(`${review.needsRegeneration} record(s) need regeneration`);
  }
  if (review.rejected > 0) {
    reasons.push(`${review.rejected} record(s) rejected`);
  }
  if (review.pending > 5) {
    reasons.push(`${review.pending} records pending review`);
  }
  if (review.withOpenNotes > 0) {
    reasons.push(`${review.withOpenNotes} record(s) have unresolved notes`);
  }

  const status: HealthStatus = review.needsRegeneration > 0 ? "critical"
    : reasons.length > 0                                     ? "warning"
    : "healthy";

  return indicator(status, "Review", reasons);
}

export function computePromotionHealth(promotion: PromotionMetrics): HealthIndicator {
  const reasons: string[] = [];

  if (promotion.failed > 0) {
    reasons.push(`${promotion.failed} promotion(s) failed`);
  }
  if (promotion.rolledBack > 0) {
    reasons.push(`${promotion.rolledBack} promotion(s) rolled back`);
  }
  if (promotion.ready > 0) {
    reasons.push(`${promotion.ready} approved record(s) awaiting promotion`);
  }

  const status: HealthStatus = promotion.failed > 0 ? "critical"
    : reasons.length > 0                            ? "warning"
    : "healthy";

  return indicator(status, "Promotion", reasons);
}

export function computeRepositoryHealth(validation: ValidationMetrics): HealthIndicator {
  const reasons: string[] = [];

  if (validation.fail > 0) {
    reasons.push(`${validation.fail} record(s) failing validation`);
  }
  if (validation.passWithWarnings > 0) {
    reasons.push(`${validation.passWithWarnings} record(s) have warnings`);
  }

  const status: HealthStatus = validation.fail > 0         ? "critical"
    : validation.passWithWarnings > 0                      ? "warning"
    : "healthy";

  return indicator(status, "Repository", reasons);
}

export function computeSystemHealth(
  factory:    HealthIndicator,
  review:     HealthIndicator,
  promotion:  HealthIndicator,
  repository: HealthIndicator,
): SystemHealth {
  const all    = [factory, review, promotion, repository];
  const worst  = all.some(h => h.status === "critical") ? "critical"
    : all.some(h => h.status === "warning")             ? "warning"
    : "healthy" as HealthStatus;

  const overallReasons = all
    .filter(h => h.status !== "healthy")
    .map(h => `${h.label}: ${h.reasons[0] ?? "issue detected"}`);

  return {
    factory,
    review,
    promotion,
    repository,
    overall: indicator(worst, "Overall", overallReasons),
  };
}
