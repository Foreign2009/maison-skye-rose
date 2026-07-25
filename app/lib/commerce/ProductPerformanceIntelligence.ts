/**
 * Product Performance Intelligence — Commerce Category Rankings (EP32-P3)
 *
 * Pure projection over CommerceBehaviourReport and CheckoutFunnelReport.
 * Classifies four commerce categories (discovery, cart, checkout, payment)
 * with relative health rankings and derives an overall commerce health signal.
 *
 * No new analytics queries. No numeric thresholds. No scoring algorithms.
 * All conversionRate values are read directly from CommerceBehaviourReport.
 * overallCommerceHealth is derived from CheckoutFunnelReport.overallCompletionRate.
 *
 * Integration points:
 *   CommerceBehaviourTypes.ts       — CommerceBehaviourReport input
 *   CheckoutFunnelIntelligence.ts   — CheckoutFunnelReport input
 *   admin/commerce-intelligence     — consumer (EP32-P4)
 *
 * Category → count / conversionRate mapping (no recalculation):
 *   discovery  — cartMetrics.cartOpens          / cartMetrics.cartConversion
 *   cart       — cartMetrics.cartAdditions       / commerceMetrics.cartToCheckoutRate
 *   checkout   — checkoutMetrics.checkoutStarts  / checkoutMetrics.checkoutToPaymentRate
 *   payment    — checkoutMetrics.paymentStarts   / paymentMetrics.paymentSuccessRate
 *
 * Health classification rules:
 *   "strong"               — highest conversionRate among evidenced categories
 *   "weak"                 — lowest conversionRate among evidenced categories
 *   "moderate"             — evidenced but neither highest nor lowest
 *   "insufficient-evidence" — conversionRate is null
 *
 *   "strong" and "weak" are only assigned when ≥ 2 categories have evidence.
 *   With fewer than 2 evidenced categories all are "moderate" or "insufficient-evidence".
 *
 * overallCommerceHealth:
 *   "healthy"              — overallCompletionRate !== null (end-to-end measurable)
 *   "needs-attention"      — analytics available but overallCompletionRate is null
 *   "insufficient-evidence" — analytics unavailable
 */

import type { CommerceBehaviourReport } from "./CommerceBehaviourTypes";
import type { CheckoutFunnelReport }    from "./CheckoutFunnelIntelligence";

// ── Public types ──────────────────────────────────────────────────────────────

export type PerformanceCategory = "discovery" | "cart" | "checkout" | "payment";

export type PerformanceHealth =
  | "strong"
  | "moderate"
  | "weak"
  | "insufficient-evidence";

export type CommerceHealth =
  | "healthy"
  | "needs-attention"
  | "insufficient-evidence";

export interface PerformanceSummary {
  readonly category:       PerformanceCategory;
  readonly label:          string;
  readonly count:          number | null;
  readonly conversionRate: number | null;
  readonly health:         PerformanceHealth;
}

export interface ProductPerformanceReport {
  readonly categories:            readonly PerformanceSummary[];
  readonly strongestCategory:     PerformanceCategory | null;
  readonly weakestCategory:       PerformanceCategory | null;
  readonly overallCommerceHealth: CommerceHealth;
  readonly analyticsAvailable:    boolean;
  readonly generatedAt:           string;
}

// ── Internal: category definitions ───────────────────────────────────────────

interface CategoryDefinition {
  readonly category: PerformanceCategory;
  readonly label:    string;
  count(b: CommerceBehaviourReport): number | null;
  conversionRate(b: CommerceBehaviourReport): number | null;
}

const CATEGORY_DEFINITIONS: readonly CategoryDefinition[] = [
  {
    category:       "discovery",
    label:          "Discovery",
    count:          (b) => b.cartMetrics.cartOpens,
    conversionRate: (b) => b.cartMetrics.cartConversion,
  },
  {
    category:       "cart",
    label:          "Cart",
    count:          (b) => b.cartMetrics.cartAdditions,
    conversionRate: (b) => b.commerceMetrics.cartToCheckoutRate,
  },
  {
    category:       "checkout",
    label:          "Checkout",
    count:          (b) => b.checkoutMetrics.checkoutStarts,
    conversionRate: (b) => b.checkoutMetrics.checkoutToPaymentRate,
  },
  {
    category:       "payment",
    label:          "Payment",
    count:          (b) => b.checkoutMetrics.paymentStarts,
    conversionRate: (b) => b.paymentMetrics.paymentSuccessRate,
  },
];

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildProductPerformanceReport(
  behaviourReport: CommerceBehaviourReport,
  funnelReport:    CheckoutFunnelReport,
): ProductPerformanceReport {
  // Build raw summaries with health = "moderate" or "insufficient-evidence" initially
  const raw = CATEGORY_DEFINITIONS.map((def) => {
    const count          = def.count(behaviourReport);
    const conversionRate = def.conversionRate(behaviourReport);
    return {
      category:       def.category,
      label:          def.label,
      count,
      conversionRate,
      health:         (conversionRate !== null ? "moderate" : "insufficient-evidence") as PerformanceHealth,
    };
  });

  // Identify evidenced categories (conversionRate non-null)
  const evidenced = raw.filter((s) => s.conversionRate !== null);

  let strongestCategory: PerformanceCategory | null = null;
  let weakestCategory:   PerformanceCategory | null = null;

  // Only assign "strong" / "weak" labels when ≥ 2 categories have evidence
  if (evidenced.length >= 2) {
    let maxRate = -Infinity;
    let minRate =  Infinity;

    for (const s of evidenced) {
      if (s.conversionRate! > maxRate) { maxRate = s.conversionRate!; strongestCategory = s.category; }
      if (s.conversionRate! < minRate) { minRate = s.conversionRate!; weakestCategory   = s.category; }
    }
  }

  // Apply "strong" / "weak" labels to the matching category summaries
  const categories: readonly PerformanceSummary[] = raw.map((s) => {
    if (s.category === strongestCategory) return { ...s, health: "strong" as PerformanceHealth };
    if (s.category === weakestCategory)   return { ...s, health: "weak"   as PerformanceHealth };
    return s;
  });

  // Overall commerce health — threshold-free, derived from end-to-end measurability
  let overallCommerceHealth: CommerceHealth;
  if (!behaviourReport.analyticsAvailable) {
    overallCommerceHealth = "insufficient-evidence";
  } else if (funnelReport.overallCompletionRate !== null) {
    overallCommerceHealth = "healthy";
  } else {
    overallCommerceHealth = "needs-attention";
  }

  return {
    categories,
    strongestCategory,
    weakestCategory,
    overallCommerceHealth,
    analyticsAvailable: behaviourReport.analyticsAvailable,
    generatedAt:        new Date().toISOString(),
  };
}
