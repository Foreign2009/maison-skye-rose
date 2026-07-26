/**
 * Executive Report Comparison — Builder (EP39-P1)
 *
 * Pure function. Accepts ExecutiveReportHistory and projects each record into
 * an immutable ExecutiveReportComparisonEntry.
 * No analytics queries. No business calculations. No persistence. No side effects.
 *
 * Projection rules:
 *   current       ← history.records[i] (direct reference)
 *   previous      ← history.records[i - 1] | null (first record has no previous)
 *   isFirstRecord ← i === 0
 *   generatedAt   ← current.generatedAt
 *
 * Comparison.generatedAt is set to new Date().toISOString() at build time.
 *
 * Integration points:
 *   ExecutiveReportHistoryTypes.ts     — input type
 *   ExecutiveReportComparisonTypes.ts  — output types
 */

import type { ExecutiveReportHistory } from "./ExecutiveReportHistoryTypes";
import type {
  ExecutiveReportComparison,
  ExecutiveReportComparisonEntry,
} from "./ExecutiveReportComparisonTypes";

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveReportComparison(
  history: ExecutiveReportHistory,
): ExecutiveReportComparison {
  const records: ExecutiveReportComparisonEntry[] = history.records.map(
    (current, i): ExecutiveReportComparisonEntry => ({
      current,
      previous:      i === 0 ? null : history.records[i - 1],
      isFirstRecord: i === 0,
      generatedAt:   current.generatedAt,
    }),
  );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
