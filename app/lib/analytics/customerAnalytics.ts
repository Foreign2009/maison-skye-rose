/**
 * Customer Analytics — Server-Side Behaviour Metric Aggregation (EP31-P1)
 *
 * Queries PostHog for population-level customer behaviour events and returns
 * raw counts that the customer behaviour report builder can derive funnel
 * metrics from.
 *
 * Integration points:
 *   posthogQuery.ts                               — HogQL query execution
 *   CustomerBehaviourTypes.ts                     — CustomerAnalyticsResult target type
 *   buildCustomerBehaviourReport.ts               — sole consumer of this module
 *   admin/customer-intelligence/page.tsx          — called during server render (EP31-P4)
 *
 * Data flow:
 *   PostHog events → 8 HogQL count queries → raw count map → CustomerAnalyticsResult
 *
 * All event names are canonical — sourced directly from app/lib/analytics.ts
 * track function call sites. No event name is guessed.
 *
 * Returns null when PostHog credentials are absent or all queries fail.
 * Individual counts are null when their specific query returns no rows.
 * Callers must handle null gracefully — nullable behaviour is fully preserved.
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

// ── Discovery mode breakdown ──────────────────────────────────────────────────
// discovery_mode events carry a `mode` field: 0=browse, 1=AI, 2=character
// Returns per-mode counts as three separate total values.

function discoveryModeBreakdownQuery(windowDays: number): string {
  return `
SELECT
  properties.mode   AS mode,
  count()           AS event_count
FROM events
WHERE event = 'discovery_mode'
  AND timestamp >= now() - toIntervalDay(${windowDays})
  AND isNotNull(properties.mode)
GROUP BY mode
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

function parseDiscoveryModeBreakdown(
  columns: readonly string[],
  results: readonly (string | number | null)[][],
): { mode0: number | null; mode1: number | null; mode2: number | null } {
  const mi = columns.indexOf("mode");
  const ci = columns.indexOf("event_count");
  if (mi < 0 || ci < 0) return { mode0: null, mode1: null, mode2: null };

  let mode0: number | null = null;
  let mode1: number | null = null;
  let mode2: number | null = null;

  for (const row of results) {
    const mode  = row[mi];
    const count = row[ci];
    if (typeof count !== "number") continue;
    if (mode === 0 || mode === "0") mode0 = (mode0 ?? 0) + count;
    if (mode === 1 || mode === "1") mode1 = (mode1 ?? 0) + count;
    if (mode === 2 || mode === "2") mode2 = (mode2 ?? 0) + count;
  }

  return { mode0, mode1, mode2 };
}

// ── Public result type ────────────────────────────────────────────────────────

export interface CustomerAnalyticsResult {
  readonly productDetailViews:    number | null;
  readonly quizCompletions:       number | null;
  readonly favouritesAdded:       number | null;
  readonly cartAdds:              number | null;
  readonly checkoutsStarted:      number | null;
  readonly purchaseCompletions:   number | null;
  readonly aiChatSessions:        number | null;
  readonly discoveryModeBrowse:   number | null;   // mode = 0
  readonly discoveryModeAI:       number | null;   // mode = 1
  readonly discoveryModeCharacter: number | null;  // mode = 2
  readonly windowDays:            number;
  readonly queriedAt:             string;
}

// ── Main query ────────────────────────────────────────────────────────────────

async function _queryCustomerAnalytics(
  windowDays = 30,
): Promise<CustomerAnalyticsResult | null> {
  const [
    pdvResult,
    quizResult,
    favResult,
    atcResult,
    checkoutResult,
    purchaseResult,
    aiResult,
    discoveryResult,
  ] = await Promise.all([
    queryHogQL(countQuery("product_detail_viewed",   windowDays)),
    queryHogQL(countQuery("quiz_completed",          windowDays)),
    queryHogQL(countQuery("favourite_toggled",       windowDays, "properties.action = 'add'")),
    queryHogQL(countQuery("add_to_cart",             windowDays)),
    queryHogQL(countQuery("checkout_started",        windowDays)),
    queryHogQL(countQuery("payment_return_success",  windowDays)),
    queryHogQL(countQuery("ai_chat_started",         windowDays)),
    queryHogQL(discoveryModeBreakdownQuery(windowDays)),
  ]);

  // Return null only if every single query failed
  const anyResult = [
    pdvResult, quizResult, favResult, atcResult,
    checkoutResult, purchaseResult, aiResult, discoveryResult,
  ].some((r) => r !== null);

  if (!anyResult) return null;

  const discovery = discoveryResult
    ? parseDiscoveryModeBreakdown(discoveryResult.columns, discoveryResult.results)
    : { mode0: null, mode1: null, mode2: null };

  return {
    productDetailViews:     pdvResult      ? parseSingleCount(pdvResult.columns,      pdvResult.results)      : null,
    quizCompletions:        quizResult     ? parseSingleCount(quizResult.columns,     quizResult.results)     : null,
    favouritesAdded:        favResult      ? parseSingleCount(favResult.columns,      favResult.results)      : null,
    cartAdds:               atcResult      ? parseSingleCount(atcResult.columns,      atcResult.results)      : null,
    checkoutsStarted:       checkoutResult ? parseSingleCount(checkoutResult.columns, checkoutResult.results) : null,
    purchaseCompletions:    purchaseResult ? parseSingleCount(purchaseResult.columns, purchaseResult.results) : null,
    aiChatSessions:         aiResult       ? parseSingleCount(aiResult.columns,       aiResult.results)       : null,
    discoveryModeBrowse:    discovery.mode0,
    discoveryModeAI:        discovery.mode1,
    discoveryModeCharacter: discovery.mode2,
    windowDays,
    queriedAt: new Date().toISOString(),
  };
}

export const queryCustomerAnalytics = unstable_cache(
  _queryCustomerAnalytics,
  ["customer-analytics"],
  { revalidate: 300 },
);
