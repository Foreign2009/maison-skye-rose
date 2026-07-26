/**
 * Executive Report Comparison — Canonical Types (EP39-P1)
 *
 * Defines the immutable comparison type model.
 * Consumes ExecutiveReportHistory only. Produces an immutable ExecutiveReportComparison.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   ExecutiveReportComparisonBuilder.ts — sole producer
 *   ExecutiveReportHistoryTypes.ts      — ExecutiveReportHistoryEntry imported
 */

import type { ExecutiveReportHistoryEntry } from "./ExecutiveReportHistoryTypes";

// ── Comparison Entry ──────────────────────────────────────────────────────────

export interface ExecutiveReportComparisonEntry {
  readonly current:       ExecutiveReportHistoryEntry;
  readonly previous:      ExecutiveReportHistoryEntry | null;
  readonly isFirstRecord: boolean;
  readonly generatedAt:   string;
}

// ── Comparison ────────────────────────────────────────────────────────────────

export interface ExecutiveReportComparison {
  readonly records:     readonly ExecutiveReportComparisonEntry[];
  readonly generatedAt: string;
}
