/**
 * Recommendation Quality — Canonical KPI Framework
 *
 * Defines quality metrics, thresholds, and band classifications for every
 * recommendation surface across the Maison Skye & Rose recommendation system.
 *
 * All functions are pure. No imports from the RE engine, analytics service,
 * or PostHog. Values are supplied by callers from PostHog query results.
 *
 * Integration points:
 *   admin/RecommendationPerformanceDashboard — quality framework display
 *   admin/IntelligenceDashboard             — quality bands in StrategyPerformanceSection
 *
 * Adding a new metric:
 *   1. Add its key to QualityMetricKey.
 *   2. Add its entry to QUALITY_THRESHOLDS.
 *   3. All classification logic is inherited automatically via classifyBand().
 */

// ── Quality bands ─────────────────────────────────────────────────────────────

export type QualityBand = "Excellent" | "Healthy" | "Needs Attention" | "Critical";

export const QUALITY_BAND_COLORS: Record<QualityBand, string> = {
  "Excellent":       "#16a34a",
  "Healthy":         "#2563eb",
  "Needs Attention": "#d97706",
  "Critical":        "#dc2626",
};

export const QUALITY_BAND_BG: Record<QualityBand, string> = {
  "Excellent":       "bg-green-50  text-green-700  border-green-100",
  "Healthy":         "bg-blue-50   text-blue-700   border-blue-100",
  "Needs Attention": "bg-amber-50  text-amber-700  border-amber-100",
  "Critical":        "bg-red-50    text-red-700    border-red-100",
};

export const QUALITY_BAND_DESCRIPTIONS: Record<QualityBand, string> = {
  "Excellent":       "Exceeds target. Sustained performance expected.",
  "Healthy":         "Within acceptable range. Monitor for drift.",
  "Needs Attention": "Below target. Investigate surface performance.",
  "Critical":        "Significantly underperforming. Immediate review required.",
};

// ── Metric keys ───────────────────────────────────────────────────────────────

export type QualityMetricKey =
  | "ctr"
  | "favouriteRate"
  | "addToCartRate"
  | "checkoutAttributionRate"
  | "coverage";

// ── Threshold model ───────────────────────────────────────────────────────────

export interface QualityThreshold {
  readonly metric:          QualityMetricKey;
  readonly label:           string;
  readonly formula:         string;
  readonly excellent:       number;   // value >= excellent       → Excellent
  readonly healthy:         number;   // value >= healthy         → Healthy
  readonly needsAttention:  number;   // value >= needsAttention  → Needs Attention
                                      // value < needsAttention   → Critical
  readonly interpretation:  string;
}

// ── Centralized thresholds ────────────────────────────────────────────────────
// These are the single canonical definitions for every recommendation KPI.
// All dashboards and future optimisation work must import from here.

export const QUALITY_THRESHOLDS: Record<QualityMetricKey, QualityThreshold> = {
  ctr: {
    metric:         "ctr",
    label:          "Click-Through Rate",
    formula:        "clicks ÷ impressions",
    excellent:      0.15,
    healthy:        0.08,
    needsAttention: 0.03,
    interpretation: "Share of recommendation impressions that resulted in a product click. Higher CTR indicates relevant recommendations and effective surface placement.",
  },
  favouriteRate: {
    metric:         "favouriteRate",
    label:          "Favourite Rate",
    formula:        "favourite_toggled (action = 'add') ÷ impressions",
    excellent:      0.08,
    healthy:        0.04,
    needsAttention: 0.01,
    interpretation: "Share of impressions where a customer saved the recommended product. Measures long-term intent signal quality and recommendation relevance.",
  },
  addToCartRate: {
    metric:         "addToCartRate",
    label:          "Add-to-Cart Rate",
    formula:        "add_to_cart (recommendationSource set) ÷ impressions",
    excellent:      0.06,
    healthy:        0.03,
    needsAttention: 0.01,
    interpretation: "Share of impressions that converted to a cart add. Primary commercial conversion signal for all recommendation surfaces.",
  },
  checkoutAttributionRate: {
    metric:         "checkoutAttributionRate",
    label:          "Checkout Attribution Rate",
    formula:        "recommendation_checkout_attributed ÷ add_to_cart (recommendationSource set)",
    excellent:      0.50,
    healthy:        0.30,
    needsAttention: 0.15,
    interpretation: "Share of recommendation-driven cart adds that proceeded to checkout. Measures downstream revenue impact of the recommendation system.",
  },
  coverage: {
    metric:         "coverage",
    label:          "Recommendation Coverage",
    formula:        "instrumented surfaces ÷ total recommendation surfaces",
    excellent:      1.00,
    healthy:        0.80,
    needsAttention: 0.60,
    interpretation: "Fraction of recommendation surfaces that have at least one analytics event instrumented. 100% indicates complete observability across all engines.",
  },
};

// ── Classification ────────────────────────────────────────────────────────────

export function classifyBand(metric: QualityMetricKey, value: number): QualityBand {
  const t = QUALITY_THRESHOLDS[metric];
  if (value >= t.excellent)      return "Excellent";
  if (value >= t.healthy)        return "Healthy";
  if (value >= t.needsAttention) return "Needs Attention";
  return "Critical";
}

// ── Quality result ────────────────────────────────────────────────────────────

export interface QualityResult {
  readonly metric:    QualityMetricKey;
  readonly value:     number | null;
  readonly band:      QualityBand | "Pending";
  readonly threshold: QualityThreshold;
}

export function computeQuality(
  metric:      QualityMetricKey,
  numerator:   number | null,
  denominator: number | null,
): QualityResult {
  const threshold = QUALITY_THRESHOLDS[metric];
  if (numerator === null || denominator === null || denominator === 0) {
    return { metric, value: null, band: "Pending", threshold };
  }
  const value = numerator / denominator;
  return { metric, value, band: classifyBand(metric, value), threshold };
}

// ── Coverage (computable without PostHog) ─────────────────────────────────────
// Derived from the analytics taxonomy defined in EP28-P1.
// Update TRACKED_RECOMMENDATION_SURFACES when new surfaces are instrumented.

export const TOTAL_RECOMMENDATION_SURFACES      = 20 as const;
export const TRACKED_RECOMMENDATION_SURFACES    = 20 as const;

export function computeCoverage(): QualityResult {
  return computeQuality(
    "coverage",
    TRACKED_RECOMMENDATION_SURFACES,
    TOTAL_RECOMMENDATION_SURFACES,
  );
}

// ── Formatting helpers ────────────────────────────────────────────────────────

export function formatRate(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatThresholdRange(t: QualityThreshold): string {
  return `≥${formatRate(t.excellent)} Excellent · ≥${formatRate(t.healthy)} Healthy · ≥${formatRate(t.needsAttention)} OK`;
}
