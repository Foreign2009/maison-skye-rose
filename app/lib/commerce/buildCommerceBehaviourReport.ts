/**
 * Commerce Behaviour — Report Builder (EP32-P1)
 *
 * Pure function. Accepts CommerceAnalyticsResult | null and returns a
 * CommerceBehaviourReport. All rate fields are derived from the raw counts
 * supplied by commerceAnalytics.ts. No new queries. No new thresholds.
 * No business logic beyond rate derivation.
 *
 * Integration points:
 *   commerceAnalytics.ts          — CommerceAnalyticsResult input
 *   CommerceBehaviourTypes.ts     — output types
 *   admin/commerce-intelligence   — consumed via page.tsx (EP32-P2)
 */

import type { CommerceAnalyticsResult } from "../analytics/commerceAnalytics";
import type {
  CartMetrics,
  CheckoutMetrics,
  PaymentMetrics,
  CommerceMetrics,
  CommerceBehaviourReport,
} from "./CommerceBehaviourTypes";

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeRate(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator === 0) return null;
  return Math.round((numerator / denominator) * 10_000) / 10_000;
}

// ── Null report ───────────────────────────────────────────────────────────────

const NULL_CART_METRICS: CartMetrics = {
  cartOpens:      null,
  cartAdditions:  null,
  cartConversion: null,
};

const NULL_CHECKOUT_METRICS: CheckoutMetrics = {
  checkoutStarts:        null,
  paymentStarts:         null,
  checkoutToPaymentRate: null,
  checkoutAbandonRate:   null,
};

const NULL_PAYMENT_METRICS: PaymentMetrics = {
  successfulPayments: null,
  cancelledPayments:  null,
  paymentSuccessRate: null,
  paymentCancelRate:  null,
};

const NULL_COMMERCE_METRICS: CommerceMetrics = {
  cartToCheckoutRate:  null,
  checkoutToOrderRate: null,
  cartToOrderRate:     null,
};

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildCommerceBehaviourReport(
  analytics: CommerceAnalyticsResult | null,
): CommerceBehaviourReport {
  if (!analytics) {
    return {
      cartMetrics:         NULL_CART_METRICS,
      checkoutMetrics:     NULL_CHECKOUT_METRICS,
      paymentMetrics:      NULL_PAYMENT_METRICS,
      commerceMetrics:     NULL_COMMERCE_METRICS,
      analyticsAvailable:  false,
      analyticsWindowDays: 30,
      generatedAt:         new Date().toISOString(),
    };
  }

  const {
    cartOpens,
    cartAdditions,
    checkoutStarts,
    paymentStarts,
    successfulPayments,
    cancelledPayments,
    windowDays,
  } = analytics;

  // Cart
  const cartConversion = safeRate(cartAdditions, cartOpens);

  // Checkout
  const checkoutToPaymentRate = safeRate(paymentStarts, checkoutStarts);
  const checkoutAbandonRate   = checkoutToPaymentRate !== null
    ? Math.round((1 - checkoutToPaymentRate) * 10_000) / 10_000
    : null;

  // Payment — denominator is total payment attempts (successful + cancelled)
  const totalPaymentAttempts = successfulPayments !== null && cancelledPayments !== null
    ? successfulPayments + cancelledPayments
    : null;
  const paymentSuccessRate = safeRate(successfulPayments, totalPaymentAttempts);
  const paymentCancelRate  = paymentSuccessRate !== null
    ? Math.round((1 - paymentSuccessRate) * 10_000) / 10_000
    : null;

  // End-to-end commerce rates
  const cartToCheckoutRate  = safeRate(checkoutStarts,     cartAdditions);
  const checkoutToOrderRate = safeRate(successfulPayments, checkoutStarts);
  const cartToOrderRate     = safeRate(successfulPayments, cartAdditions);

  return {
    cartMetrics: {
      cartOpens,
      cartAdditions,
      cartConversion,
    },
    checkoutMetrics: {
      checkoutStarts,
      paymentStarts,
      checkoutToPaymentRate,
      checkoutAbandonRate,
    },
    paymentMetrics: {
      successfulPayments,
      cancelledPayments,
      paymentSuccessRate,
      paymentCancelRate,
    },
    commerceMetrics: {
      cartToCheckoutRate,
      checkoutToOrderRate,
      cartToOrderRate,
    },
    analyticsAvailable:  true,
    analyticsWindowDays: windowDays,
    generatedAt:         new Date().toISOString(),
  };
}
