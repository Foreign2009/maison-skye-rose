/**
 * Checkout Funnel Intelligence — Ordered Funnel Projection (EP32-P2)
 *
 * Pure projection over CommerceBehaviourReport.
 * Assembles an ordered five-stage checkout funnel with per-stage entry,
 * completion, conversion, and drop-off data. No new analytics queries.
 * No new KPI thresholds. All values are read from or directly derived
 * from CommerceBehaviourReport fields.
 *
 * Integration points:
 *   CommerceBehaviourTypes.ts      — CommerceBehaviourReport input
 *   buildCommerceBehaviourReport.ts — sole producer of CommerceBehaviourReport
 *   admin/commerce-intelligence     — consumer (EP32-P3)
 *
 * Stage conversionRate sources (no recalculation):
 *   cart-opened       — null (top of funnel; no previous stage)
 *   cart-addition     — cartMetrics.cartConversion
 *   checkout-started  — commerceMetrics.cartToCheckoutRate
 *   payment-started   — checkoutMetrics.checkoutToPaymentRate
 *   payment-successful — paymentMetrics.paymentSuccessRate
 *
 * Stage dropOffRate sources:
 *   cart-opened       — null
 *   cart-addition     — 1 − cartConversion
 *   checkout-started  — 1 − cartToCheckoutRate
 *   payment-started   — checkoutMetrics.checkoutAbandonRate  (reused directly)
 *   payment-successful — paymentMetrics.paymentCancelRate    (reused directly)
 */

import type { CommerceBehaviourReport } from "./CommerceBehaviourTypes";

// ── Public types ──────────────────────────────────────────────────────────────

export type CheckoutStageKey =
  | "cart-opened"
  | "cart-addition"
  | "checkout-started"
  | "payment-started"
  | "payment-successful";

export interface CheckoutStage {
  readonly stage:          CheckoutStageKey;
  readonly label:          string;
  readonly count:          number | null;
  readonly entered:        boolean;         // count !== null && count > 0
  readonly completed:      boolean;         // conversionRate !== null
  readonly conversionRate: number | null;
  readonly dropOffRate:    number | null;
}

export interface PaymentSuccessSummary {
  readonly successfulPayments: number | null;
  readonly cancelledPayments:  number | null;
  readonly paymentSuccessRate: number | null;
  readonly paymentCancelRate:  number | null;
}

export interface CheckoutFunnelReport {
  readonly stages:                readonly CheckoutStage[];
  readonly overallCompletionRate: number | null;            // cartToOrderRate
  readonly primaryAbandonStage:   CheckoutStageKey | null;  // highest dropOffRate, stages 2–5
  readonly strongestStage:        CheckoutStageKey | null;  // highest conversionRate, stages 2–5
  readonly paymentSummary:        PaymentSuccessSummary;
  readonly analyticsAvailable:    boolean;
  readonly generatedAt:           string;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function complement(rate: number | null): number | null {
  if (rate === null) return null;
  return Math.round((1 - rate) * 10_000) / 10_000;
}

function makeStage(
  stage:          CheckoutStageKey,
  label:          string,
  count:          number | null,
  conversionRate: number | null,
  dropOffRate:    number | null,
): CheckoutStage {
  return {
    stage,
    label,
    count,
    entered:   count !== null && count > 0,
    completed: conversionRate !== null,
    conversionRate,
    dropOffRate,
  };
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildCheckoutFunnelReport(
  report: CommerceBehaviourReport,
): CheckoutFunnelReport {
  const { cartMetrics: c, checkoutMetrics: ch, paymentMetrics: p, commerceMetrics: cm } = report;

  const stages: readonly CheckoutStage[] = [
    makeStage(
      "cart-opened",
      "Cart Opened",
      c.cartOpens,
      null,
      null,
    ),
    makeStage(
      "cart-addition",
      "Cart Addition",
      c.cartAdditions,
      c.cartConversion,
      complement(c.cartConversion),
    ),
    makeStage(
      "checkout-started",
      "Checkout Started",
      ch.checkoutStarts,
      cm.cartToCheckoutRate,
      complement(cm.cartToCheckoutRate),
    ),
    makeStage(
      "payment-started",
      "Payment Started",
      ch.paymentStarts,
      ch.checkoutToPaymentRate,
      ch.checkoutAbandonRate,   // reused directly
    ),
    makeStage(
      "payment-successful",
      "Payment Successful",
      p.successfulPayments,
      p.paymentSuccessRate,
      p.paymentCancelRate,      // reused directly
    ),
  ];

  // Scan stages 2–5 (index ≥ 1); stage 1 has no conversion or drop-off
  const comparableStages = stages.slice(1);

  let primaryAbandonStage: CheckoutStageKey | null = null;
  let maxDropOff = -Infinity;
  for (const s of comparableStages) {
    if (s.dropOffRate !== null && s.dropOffRate > maxDropOff) {
      maxDropOff          = s.dropOffRate;
      primaryAbandonStage = s.stage;
    }
  }

  let strongestStage: CheckoutStageKey | null = null;
  let maxConversion = -Infinity;
  for (const s of comparableStages) {
    if (s.conversionRate !== null && s.conversionRate > maxConversion) {
      maxConversion  = s.conversionRate;
      strongestStage = s.stage;
    }
  }

  const paymentSummary: PaymentSuccessSummary = {
    successfulPayments: p.successfulPayments,
    cancelledPayments:  p.cancelledPayments,
    paymentSuccessRate: p.paymentSuccessRate,
    paymentCancelRate:  p.paymentCancelRate,
  };

  return {
    stages,
    overallCompletionRate: cm.cartToOrderRate,
    primaryAbandonStage,
    strongestStage,
    paymentSummary,
    analyticsAvailable: report.analyticsAvailable,
    generatedAt:        new Date().toISOString(),
  };
}
