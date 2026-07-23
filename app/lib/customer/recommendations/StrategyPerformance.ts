/**
 * Recommendation Intelligence — Strategy Performance
 *
 * Aggregates recommendation quality metrics per strategy for the
 * engineering observatory (/admin/intelligence).
 *
 * Computed synchronously from RecommendationResult output.
 * Engagement metrics (CTR, save, cart) are reserved as null pending
 * EP23.5 analytics integration.
 *
 * Integration points:
 *   RecommendationEngine           — RecommendationResult input
 *   RecommendationReasonBuilder    — confidence/reasonCount via buildExplanation
 *   admin/intelligence/page.tsx    — builds snapshot from all strategy runs
 *   admin/IntelligenceDashboard    — renders StrategyPerformanceSection
 */

import type { RecommendationStrategy } from "./RecommendationStrategy";
import type { RecommendationResult }   from "./RecommendationResult";

// ── Types ─────────────────────────────────────────────────────────────────────

// Analytics overlay — supplied by recommendationAnalytics.ts at render time.
// All fields are optional and nullable so existing call sites remain unchanged.
export interface StrategyAnalyticsInput {
  readonly clickThroughRate?:        number | null;
  readonly saveRate?:                number | null;
  readonly addToCartRate?:           number | null;
  readonly checkoutAttributionRate?: number | null;
  readonly recommendationsShown?:    number | null;
}

export interface StrategyPerformanceSummary {
  readonly strategy:                RecommendationStrategy;
  readonly active:                  boolean;
  readonly poolSize:                number;
  readonly filteredSize:            number;
  readonly returnedSize:            number;
  readonly processingTimeMs:        number;
  readonly filterPassRate:          number;
  readonly avgScore:                number;
  readonly avgProfileScore:         number;
  readonly avgCatalogScore:         number;
  readonly avgRelationScore:        number;
  readonly avgDiscoveryScore:       number;
  readonly avgConfidence:           number;
  readonly avgReasonCount:          number;
  // Live analytics — populated by EP29-P1 via analyticsSnapshot in computePerformanceSummary opts
  readonly recommendationsShown:    number | null;
  readonly clickThroughRate:        number | null;
  readonly saveRate:                number | null;
  readonly addToCartRate:           number | null;
  readonly checkoutAttributionRate: number | null;
  // Pending EP24.1 / EP24.2 wiring
  readonly experimentId:            string | null;
  readonly variantKey:              string | null;
  readonly calibrationId:           string | null;
}

export interface StrategyPerformanceSnapshot {
  readonly generatedAt: string;
  readonly summaries:   readonly StrategyPerformanceSummary[];
}

// ── Private helpers ───────────────────────────────────────────────────────────

function avg(nums: readonly number[]): number {
  return nums.length === 0 ? 0 : nums.reduce((s, n) => s + n, 0) / nums.length;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function computePerformanceSummary(
  strategy:    RecommendationStrategy,
  active:      boolean,
  result:      RecommendationResult,
  confidences: readonly { score: number; reasonCount: number }[],
  opts?: {
    experimentId?:       string;
    variantKey?:         string;
    calibrationId?:      string;
    analyticsSnapshot?:  StrategyAnalyticsInput;
  },
): StrategyPerformanceSummary {
  const { poolSize, filteredSize, returnedSize, processingTimeMs } = result.metrics;
  const recs = result.success ? result.recommendations : [];

  return {
    strategy,
    active,
    poolSize,
    filteredSize,
    returnedSize,
    processingTimeMs,
    filterPassRate:        poolSize > 0 ? round3(filteredSize / poolSize) : 0,
    avgScore:              round3(avg(recs.map((r) => r.score.total))),
    avgProfileScore:       round3(avg(recs.map((r) => r.score.profile))),
    avgCatalogScore:       round3(avg(recs.map((r) => r.score.catalog))),
    avgRelationScore:      round3(avg(recs.map((r) => r.score.relation))),
    avgDiscoveryScore:     round3(avg(recs.map((r) => r.score.discovery))),
    avgConfidence:         round3(avg(confidences.map((c) => c.score))),
    avgReasonCount:        round3(avg(confidences.map((c) => c.reasonCount))),
    recommendationsShown:    opts?.analyticsSnapshot?.recommendationsShown    ?? null,
    clickThroughRate:        opts?.analyticsSnapshot?.clickThroughRate        ?? null,
    saveRate:                opts?.analyticsSnapshot?.saveRate                ?? null,
    addToCartRate:           opts?.analyticsSnapshot?.addToCartRate           ?? null,
    checkoutAttributionRate: opts?.analyticsSnapshot?.checkoutAttributionRate ?? null,
    experimentId:            opts?.experimentId  ?? null,
    variantKey:              opts?.variantKey    ?? null,
    calibrationId:           opts?.calibrationId ?? null,
  };
}

export function buildPerformanceSnapshot(
  summaries: readonly StrategyPerformanceSummary[],
): StrategyPerformanceSnapshot {
  return {
    generatedAt: new Date().toISOString(),
    summaries,
  };
}
