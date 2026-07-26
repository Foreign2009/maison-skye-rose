/**
 * Executive Report History — Canonical Types (EP38-P1)
 *
 * Defines the immutable history type model.
 * Consumes ExecutiveReportArchive only. Produces an immutable ExecutiveReportHistory.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   ExecutiveReportHistoryBuilder.ts — sole producer
 *   ExecutiveReportArchiveTypes.ts   — ExecutiveReportArchive imported
 *   ExecutiveReportTypes.ts          — ExecutiveReportHeadline imported
 *   OperationsAlertTypes.ts          — AlertSeverity imported
 */

import type { AlertSeverity }          from "./OperationsAlertTypes";
import type { ExecutiveReportHeadline } from "./ExecutiveReportTypes";
import type { ExecutiveReportArchive }  from "./ExecutiveReportArchiveTypes";

// ── History Entry ─────────────────────────────────────────────────────────────

export interface ExecutiveReportHistoryEntry {
  readonly headline:         ExecutiveReportHeadline;
  readonly overallStatus:    AlertSeverity;
  readonly executiveSummary: string;
  readonly generatedAt:      string;
  readonly entryCount:       number;
  readonly archive:          ExecutiveReportArchive;
}

// ── History ───────────────────────────────────────────────────────────────────

export interface ExecutiveReportHistory {
  readonly records:     readonly ExecutiveReportHistoryEntry[];
  readonly generatedAt: string;
}
