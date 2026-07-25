/**
 * Commerce Behaviour — Canonical Population-Level Types (EP32-P1)
 *
 * Defines the canonical type model for population-level commerce analytics.
 * All types represent aggregated event counts and derived conversion metrics
 * across the customer base — not per-customer data.
 *
 * Integration points:
 *   commerceAnalytics.ts              — analytics input (CommerceAnalyticsResult)
 *   buildCommerceBehaviourReport.ts   — report builder (sole producer)
 *   admin/commerce-intelligence       — sole consumer (EP32-P2)
 *
 * Null semantics:
 *   Count fields are null when analytics are unavailable for that metric.
 *   Rate fields are null when either operand is null or the denominator is zero.
 *   No values are fabricated.
 */

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartMetrics {
  readonly cartOpens:      number | null;
  readonly cartAdditions:  number | null;
  readonly cartConversion: number | null;  // cartAdditions ÷ cartOpens
}

// ── Checkout ──────────────────────────────────────────────────────────────────

export interface CheckoutMetrics {
  readonly checkoutStarts:        number | null;
  readonly paymentStarts:         number | null;
  readonly checkoutToPaymentRate: number | null;  // paymentStarts ÷ checkoutStarts
  readonly checkoutAbandonRate:   number | null;  // 1 − checkoutToPaymentRate
}

// ── Payment ───────────────────────────────────────────────────────────────────

export interface PaymentMetrics {
  readonly successfulPayments: number | null;
  readonly cancelledPayments:  number | null;
  readonly paymentSuccessRate: number | null;  // successfulPayments ÷ (successful + cancelled)
  readonly paymentCancelRate:  number | null;  // 1 − paymentSuccessRate
}

// ── End-to-end commerce rates ─────────────────────────────────────────────────

export interface CommerceMetrics {
  readonly cartToCheckoutRate:  number | null;  // checkoutStarts ÷ cartAdditions
  readonly checkoutToOrderRate: number | null;  // successfulPayments ÷ checkoutStarts
  readonly cartToOrderRate:     number | null;  // successfulPayments ÷ cartAdditions
}

// ── Full report ───────────────────────────────────────────────────────────────

export interface CommerceBehaviourReport {
  readonly cartMetrics:         CartMetrics;
  readonly checkoutMetrics:     CheckoutMetrics;
  readonly paymentMetrics:      PaymentMetrics;
  readonly commerceMetrics:     CommerceMetrics;
  readonly analyticsAvailable:  boolean;
  readonly analyticsWindowDays: number;
  readonly generatedAt:         string;
}
