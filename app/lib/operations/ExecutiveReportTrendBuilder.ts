/**
 * Executive Report Trend — Builder (EP42-P1)
 *
 * Pure function. Accepts ExecutiveReportInsight and classifies each entry
 * into an immutable ExecutiveReportTrendEntry.
 * No analytics queries. No business calculations. No persistence. No side effects.
 *
 * Classification rules:
 *   insight.state === "new"     → state = "emerging"
 *   insight.state === "stable"  → state = "stable"
 *   insight.state === "updated" → state = "improving"
 *
 *   entry.generatedAt ← insight entry generatedAt
 *   Trend.generatedAt ← new Date().toISOString()
 *
 * Integration points:
 *   ExecutiveReportInsightTypes.ts — input types
 *   ExecutiveReportTrendTypes.ts   — output types
 */

import type { ExecutiveReportInsight } from "./ExecutiveReportInsightTypes";
import type {
  ExecutiveReportTrend,
  ExecutiveReportTrendEntry,
  ExecutiveReportTrendState,
} from "./ExecutiveReportTrendTypes";

// ── Classifier ────────────────────────────────────────────────────────────────

function classifyTrendState(
  insightState: "new" | "stable" | "updated",
): ExecutiveReportTrendState {
  if (insightState === "new")    return "emerging";
  if (insightState === "stable") return "stable";
  return "improving";
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveReportTrend(
  insight: ExecutiveReportInsight,
): ExecutiveReportTrend {
  const records: ExecutiveReportTrendEntry[] = insight.records.map(
    (entry): ExecutiveReportTrendEntry => ({
      insight:     entry,
      state:       classifyTrendState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
