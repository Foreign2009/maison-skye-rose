/**
 * Commerce Analytics — Server-Side Commerce Event Aggregation (EP32-P1)
 *
 * Queries PostHog for population-level commerce events and returns raw
 * counts that the commerce behaviour report builder can derive conversion
 * and abandonment metrics from.
 *
 * Integration points:
 *   posthogQuery.ts                          — HogQL query execution
 *   app/lib/commerce/CommerceBehaviourTypes  — CommerceAnalyticsResult target type
 *   buildCommerceBehaviourReport.ts          — sole consumer of this module
 *   admin/commerce-intelligence/page.tsx     — called during server render (EP32-P2)
 *
 * Data flow:
 *   PostHog events → 6 HogQL count queries → raw count map → CommerceAnalyticsResult
 *
 * All event names are canonical — sourced directly from app/lib/analytics.ts
 * track function call sites. No event name is guessed.
 *
 * Returns null when PostHog credentials are absent or all queries fail.
 * Individual counts are null when their specific query returns no rows.
 * Callers must handle null gracefully.
 */

import { unstable_cache } from "next/cache";
import { queryHogQL }     from "./posthogQuery";

// ── Count query builder ───────────────────────────────────────────────────────

function countQuery(event: string, windowDays: number, where?: string): string {
  return `
SELECT count() AS event_count
FROM events
WHERE event = '${event}'
  AND timestamp >= now() - toIntervalDay(${windowDays})
  ${where ? `AND ${where}` : ""}
`.trim();
}

// ── Parsing ───────────────────────────────────────────────────────────────────

function parseSingleCount(
  columns: readonly string[],
  results: readonly (string | number | null)[][],
): number | null {
  const ci = columns.indexOf("event_count");
  if (ci < 0 || results.length === 0) return null;
  const v = results[0][ci];
  return typeof v === "number" ? v : null;
}

// ── Public result type ────────────────────────────────────────────────────────

export interface CommerceAnalyticsResult {
  readonly cartOpens:           number | null;
  readonly cartAdditions:       number | null;
  readonly checkoutStarts:      number | null;
  readonly paymentStarts:       number | null;
  readonly successfulPayments:  number | null;
  readonly cancelledPayments:   number | null;
  readonly windowDays:          number;
  readonly queriedAt:           string;
}

// ── Main query ────────────────────────────────────────────────────────────────

async function _queryCommerceAnalytics(
  windowDays = 30,
): Promise<CommerceAnalyticsResult | null> {
  const [
    cartOpensResult,
    cartAdditionsResult,
    checkoutStartsResult,
    paymentStartsResult,
    successResult,
    cancelledResult,
  ] = await Promise.all([
    queryHogQL(countQuery("cart_opened",              windowDays)),
    queryHogQL(countQuery("add_to_cart",              windowDays)),
    queryHogQL(countQuery("checkout_started",         windowDays)),
    queryHogQL(countQuery("payment_started",          windowDays)),
    queryHogQL(countQuery("payment_return_success",   windowDays)),
    queryHogQL(countQuery("payment_return_cancelled", windowDays)),
  ]);

  // Return null only if every single query failed
  const anyResult = [
    cartOpensResult, cartAdditionsResult, checkoutStartsResult,
    paymentStartsResult, successResult, cancelledResult,
  ].some((r) => r !== null);

  if (!anyResult) return null;

  return {
    cartOpens:          cartOpensResult       ? parseSingleCount(cartOpensResult.columns,       cartOpensResult.results)       : null,
    cartAdditions:      cartAdditionsResult   ? parseSingleCount(cartAdditionsResult.columns,   cartAdditionsResult.results)   : null,
    checkoutStarts:     checkoutStartsResult  ? parseSingleCount(checkoutStartsResult.columns,  checkoutStartsResult.results)  : null,
    paymentStarts:      paymentStartsResult   ? parseSingleCount(paymentStartsResult.columns,   paymentStartsResult.results)   : null,
    successfulPayments: successResult         ? parseSingleCount(successResult.columns,         successResult.results)         : null,
    cancelledPayments:  cancelledResult       ? parseSingleCount(cancelledResult.columns,       cancelledResult.results)       : null,
    windowDays,
    queriedAt: new Date().toISOString(),
  };
}

export const queryCommerceAnalytics = unstable_cache(
  _queryCommerceAnalytics,
  ["commerce-analytics"],
  { revalidate: 300 },
);
