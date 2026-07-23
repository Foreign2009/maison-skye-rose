/**
 * Recommendation Analytics — Server-Side Metric Aggregation
 *
 * Queries PostHog for recommendation engagement metrics and aggregates
 * them to per-strategy rates that populate StrategyPerformanceSummary.
 *
 * Integration points:
 *   posthogQuery.ts                    — HogQL query execution
 *   StrategyPerformance.ts             — StrategyAnalyticsInput target type
 *   admin/intelligence/page.tsx        — called during server render
 *
 * Data flow:
 *   PostHog events → 5 HogQL queries → aggregation → per-strategy rates
 *
 * Impression counts per strategy are EXACT — the impression events
 * (experience_intelligence_shown, recommendation_set_shown) carry a
 * strategy field directly.
 *
 * Click / save / ATC / attribution rates are APPROXIMATE — those events
 * carry a surface identifier (source / recommendationSource), which is
 * mapped to its primary strategy via SURFACE_PRIMARY_STRATEGY below.
 * Where a surface can serve multiple strategies, the primary strategy is
 * used. This is acknowledged in the dashboard and benchmarking framework.
 *
 * Returns null per metric when impressions are zero for a strategy.
 * Returns null for the full result when PostHog is unreachable or env
 * vars are absent — nullable behaviour is fully preserved.
 */

import type { RecommendationStrategy } from "@/app/lib/customer/recommendations/RecommendationStrategy";
import type { StrategyAnalyticsInput } from "@/app/lib/customer/recommendations/StrategyPerformance";
import { queryHogQL }                  from "./posthogQuery";

// ── Surface → primary strategy mapping ───────────────────────────────────────
// Maps every recommendation-bearing AnalyticsSource to its primary strategy.
// Non-recommendation surfaces (shop-mode-*, quiz, recently-viewed) are absent
// from this map and are excluded from strategy-level aggregation.

const SURFACE_PRIMARY_STRATEGY: Readonly<Record<string, RecommendationStrategy>> = {
  // Personalised
  "profile-page-recommendation":     "personalised",
  "homepage-signature":              "personalised",
  "homepage-moment":                 "personalised",
  "homepage-curated":                "personalised",
  "favorites-recommendation":        "personalised",
  "recently-viewed-recommendation":  "personalised",
  "shop-recommendation":             "personalised",
  "collection-skye-recommendation":  "personalised",
  "collection-rose-recommendation":  "personalised",
  "collection-elite-recommendation": "personalised",
  "quiz-continuation":               "personalised",
  "character-journey-profile":       "personalised",
  "minicart-favorites":              "personalised",
  "minicart-recently-viewed":        "personalised",
  // Discovery
  "discover-intelligence":           "discovery",
  "academy-intelligence":            "discovery",
  "discover-collection":             "discovery",
  "discover-seasonal":               "discovery",
  "discover-hidden-gems":            "discovery",
  "homepage-new-arrivals":           "discovery",
  "homepage-hidden-gems":            "discovery",
  "homepage-seasonal":               "discovery",
  "new-arrivals-recommendation":     "discovery",
  // Trending
  "homepage-trending":               "trending",
  "best-sellers-recommendation":     "trending",
  // Similar
  "pdp-recommendation":              "similar",
  "pdp-collection":                  "similar",
  "compare-related":                 "similar",
  // Complementary
  "pdp-journey":                     "complementary",
  "minicart-complete-collection":    "complementary",
  "compare-post-decision":           "complementary",
};

// ── HogQL queries ─────────────────────────────────────────────────────────────

function impressionsByStrategyQuery(windowDays: number): string {
  return `
SELECT
  properties.strategy AS strategy,
  count() AS impressions
FROM events
WHERE (event = 'experience_intelligence_shown' OR event = 'recommendation_set_shown')
  AND timestamp >= now() - toIntervalDay(${windowDays})
  AND isNotNull(properties.strategy)
GROUP BY strategy
`.trim();
}

function clicksBySurfaceQuery(windowDays: number): string {
  return `
SELECT
  properties.source AS surface,
  count() AS clicks
FROM events
WHERE event = 'product_clicked'
  AND timestamp >= now() - toIntervalDay(${windowDays})
  AND isNotNull(properties.source)
GROUP BY surface
`.trim();
}

function savesBySurfaceQuery(windowDays: number): string {
  return `
SELECT
  properties.source AS surface,
  count() AS saves
FROM events
WHERE event = 'favourite_toggled'
  AND properties.action = 'add'
  AND timestamp >= now() - toIntervalDay(${windowDays})
  AND isNotNull(properties.source)
GROUP BY surface
`.trim();
}

function atcBySurfaceQuery(windowDays: number): string {
  return `
SELECT
  properties.recommendationSource AS surface,
  count() AS adds
FROM events
WHERE event = 'add_to_cart'
  AND timestamp >= now() - toIntervalDay(${windowDays})
  AND isNotNull(properties.recommendationSource)
GROUP BY surface
`.trim();
}

function attributionsBySurfaceQuery(windowDays: number): string {
  return `
SELECT
  properties.surface AS surface,
  count() AS attributions
FROM events
WHERE event = 'recommendation_checkout_attributed'
  AND timestamp >= now() - toIntervalDay(${windowDays})
  AND isNotNull(properties.surface)
GROUP BY surface
`.trim();
}

// ── Parsing ───────────────────────────────────────────────────────────────────

function parseStringNumberMap(
  columns: readonly string[],
  results: readonly (string | number | null)[][],
  keyCol:  string,
  valCol:  string,
): Map<string, number> {
  const ki  = columns.indexOf(keyCol);
  const vi  = columns.indexOf(valCol);
  const map = new Map<string, number>();
  if (ki < 0 || vi < 0) return map;
  for (const row of results) {
    const k = row[ki];
    const v = row[vi];
    if (typeof k === "string" && typeof v === "number") {
      map.set(k, (map.get(k) ?? 0) + v);
    }
  }
  return map;
}

// ── Surface → strategy aggregation ───────────────────────────────────────────

function aggregateToStrategy(
  surfaceMap: Map<string, number>,
): Partial<Record<RecommendationStrategy, number>> {
  const out: Partial<Record<RecommendationStrategy, number>> = {};
  for (const [surface, count] of surfaceMap) {
    const strategy = SURFACE_PRIMARY_STRATEGY[surface];
    if (strategy) {
      out[strategy] = (out[strategy] ?? 0) + count;
    }
  }
  return out;
}

// ── Rate computation ──────────────────────────────────────────────────────────

function safeRate(
  numerator:   number | undefined,
  denominator: number | undefined,
): number | null {
  if (!numerator || !denominator || denominator === 0) return null;
  return Math.round((numerator / denominator) * 10_000) / 10_000;
}

// ── Public result types ───────────────────────────────────────────────────────

export interface RecommendationAnalyticsResult {
  readonly byStrategy: Partial<Record<RecommendationStrategy, StrategyAnalyticsInput>>;
  readonly windowDays: number;
  readonly queriedAt:  string;
}

// ── Main query ────────────────────────────────────────────────────────────────

export async function queryRecommendationAnalytics(
  windowDays = 30,
): Promise<RecommendationAnalyticsResult | null> {
  const [
    impressionResult,
    clickResult,
    saveResult,
    atcResult,
    attributionResult,
  ] = await Promise.all([
    queryHogQL(impressionsByStrategyQuery(windowDays)),
    queryHogQL(clicksBySurfaceQuery(windowDays)),
    queryHogQL(savesBySurfaceQuery(windowDays)),
    queryHogQL(atcBySurfaceQuery(windowDays)),
    queryHogQL(attributionsBySurfaceQuery(windowDays)),
  ]);

  if (
    !impressionResult &&
    !clickResult &&
    !saveResult &&
    !atcResult &&
    !attributionResult
  ) {
    return null;
  }

  // Parse raw PostHog result sets into maps
  const impressionsByStrategy: Map<string, number> = impressionResult
    ? parseStringNumberMap(impressionResult.columns, impressionResult.results, "strategy",   "impressions")
    : new Map();

  const clicksBySurface: Map<string, number> = clickResult
    ? parseStringNumberMap(clickResult.columns, clickResult.results, "surface", "clicks")
    : new Map();

  const savesBySurface: Map<string, number> = saveResult
    ? parseStringNumberMap(saveResult.columns, saveResult.results, "surface", "saves")
    : new Map();

  const atcBySurface: Map<string, number> = atcResult
    ? parseStringNumberMap(atcResult.columns, atcResult.results, "surface", "adds")
    : new Map();

  const attributionsBySurface: Map<string, number> = attributionResult
    ? parseStringNumberMap(attributionResult.columns, attributionResult.results, "surface", "attributions")
    : new Map();

  // Aggregate surface-level counts to strategy level
  const clicksByStrategy        = aggregateToStrategy(clicksBySurface);
  const savesByStrategy         = aggregateToStrategy(savesBySurface);
  const atcByStrategy           = aggregateToStrategy(atcBySurface);
  const attributionsByStrategy  = aggregateToStrategy(attributionsBySurface);

  // Compute per-strategy rates
  const strategies: readonly RecommendationStrategy[] = [
    "personalised", "similar", "complementary", "discovery", "trending",
  ];

  const byStrategy: Partial<Record<RecommendationStrategy, StrategyAnalyticsInput>> = {};

  for (const strategy of strategies) {
    const impressions  = impressionsByStrategy.get(strategy);
    const clicks       = clicksByStrategy[strategy];
    const saves        = savesByStrategy[strategy];
    const atc          = atcByStrategy[strategy];
    const attributions = attributionsByStrategy[strategy];

    // Only populate the strategy entry if we have at least one data point
    if (impressions === undefined && !clicks && !saves && !atc && !attributions) {
      continue;
    }

    byStrategy[strategy] = {
      clickThroughRate:        safeRate(clicks,       impressions),
      saveRate:                safeRate(saves,        impressions),
      addToCartRate:           safeRate(atc,          impressions),
      checkoutAttributionRate: safeRate(attributions, atc),
    };
  }

  return {
    byStrategy,
    windowDays,
    queriedAt: new Date().toISOString(),
  };
}
