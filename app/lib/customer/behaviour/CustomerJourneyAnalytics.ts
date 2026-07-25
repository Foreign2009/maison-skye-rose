/**
 * Customer Journey Analytics — Population-Level Journey Report (EP31-P2)
 *
 * Pure projection over CustomerBehaviourReport.funnelSteps.
 * Derives a CustomerJourneyReport that names the strongest and weakest
 * funnel stages, computes end-to-end completion rate, and exposes
 * per-stage entered/completed flags for dashboard consumption.
 *
 * No new analytics queries. No new thresholds. No new KPI definitions.
 * All values are read from or directly derived from funnelSteps.
 *
 * Contrast with app/lib/customer/intelligence/CustomerJourney.ts which
 * classifies a single customer's journey stage. This module describes
 * the population — how the customer base moves through the funnel
 * collectively.
 *
 * Integration points:
 *   CustomerBehaviourTypes.ts            — CustomerBehaviourReport input + FunnelStageKey
 *   buildCustomerBehaviourReport.ts      — sole producer of CustomerBehaviourReport
 *   admin/CustomerIntelligenceDashboard  — consumer (EP31-P4)
 *
 * Derivation rules:
 *   entered              = count !== null && count > 0
 *   completed            = conversionFromPrevious !== null
 *   conversionRate       = FunnelStep.conversionFromPrevious (direct read)
 *   dropOffRate          = FunnelStep.dropOffRate (direct read)
 *   overallCompletionRate = purchase.count / discovery.count
 *   highestDropOffStage  = stage with largest dropOffRate  (steps 2–6 only)
 *   strongestStage       = stage with highest conversionRate (steps 2–6 only)
 */

import type {
  CustomerBehaviourReport,
  FunnelStep,
  FunnelStageKey,
} from "./CustomerBehaviourTypes";

// ── Public types ──────────────────────────────────────────────────────────────

export interface CustomerJourneyStage {
  readonly stage:          FunnelStageKey;
  readonly label:          string;
  readonly count:          number | null;
  readonly entered:        boolean;         // count is present and non-zero
  readonly completed:      boolean;         // transition from previous step is measured
  readonly conversionRate: number | null;   // FunnelStep.conversionFromPrevious
  readonly dropOffRate:    number | null;   // FunnelStep.dropOffRate
}

export interface CustomerJourneyReport {
  readonly stages:                readonly CustomerJourneyStage[];
  readonly overallCompletionRate: number | null;
  readonly highestDropOffStage:   FunnelStageKey | null;
  readonly strongestStage:        FunnelStageKey | null;
  readonly analyticsAvailable:    boolean;
  readonly generatedAt:           string;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function safeRate(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator === 0) return null;
  return Math.round((numerator / denominator) * 10_000) / 10_000;
}

function toJourneyStage(step: FunnelStep): CustomerJourneyStage {
  return {
    stage:          step.stage,
    label:          step.label,
    count:          step.count,
    entered:        step.count !== null && step.count > 0,
    completed:      step.conversionFromPrevious !== null,
    conversionRate: step.conversionFromPrevious,
    dropOffRate:    step.dropOffRate,
  };
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildCustomerJourneyReport(
  report: CustomerBehaviourReport,
): CustomerJourneyReport {
  const stages = report.funnelSteps.map(toJourneyStage);

  // Overall completion: purchase events ÷ discovery events
  const firstStep = report.funnelSteps[0] ?? null;
  const lastStep  = report.funnelSteps[report.funnelSteps.length - 1] ?? null;
  const overallCompletionRate = safeRate(
    lastStep?.count  ?? null,
    firstStep?.count ?? null,
  );

  // Steps 2–N only (index ≥ 1): first step has no previous so no conversion/drop-off
  const comparableStages = stages.slice(1);

  let highestDropOffStage: FunnelStageKey | null = null;
  let maxDropOff = -Infinity;
  for (const s of comparableStages) {
    if (s.dropOffRate !== null && s.dropOffRate > maxDropOff) {
      maxDropOff          = s.dropOffRate;
      highestDropOffStage = s.stage;
    }
  }

  let strongestStage: FunnelStageKey | null = null;
  let maxConversion = -Infinity;
  for (const s of comparableStages) {
    if (s.conversionRate !== null && s.conversionRate > maxConversion) {
      maxConversion  = s.conversionRate;
      strongestStage = s.stage;
    }
  }

  return {
    stages,
    overallCompletionRate,
    highestDropOffStage,
    strongestStage,
    analyticsAvailable: report.analyticsAvailable,
    generatedAt:        new Date().toISOString(),
  };
}
