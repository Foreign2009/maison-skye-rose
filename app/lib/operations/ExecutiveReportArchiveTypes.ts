/**
 * Executive Report Archive — Canonical Types (EP37-P1)
 *
 * Defines the immutable historical reporting type model.
 * Consumes ExecutiveReport only. Produces an immutable ExecutiveReportArchive.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   ExecutiveReportArchiveBuilder.ts — sole producer
 *   ExecutiveReportTypes.ts          — ExecutiveReportHeadline imported
 *   OperationsAlertTypes.ts          — AlertSeverity, AlertCategory imported
 */

import type { AlertCategory, AlertSeverity } from "./OperationsAlertTypes";
import type { ExecutiveReportHeadline }       from "./ExecutiveReportTypes";

// ── Archive Entry ─────────────────────────────────────────────────────────────

export interface ExecutiveReportArchiveEntry {
  readonly title:    string;
  readonly body:     string;
  readonly category: AlertCategory;
  readonly alertId:  string;
  readonly sequence: number;
}

// ── Archive ───────────────────────────────────────────────────────────────────

export interface ExecutiveReportArchive {
  readonly headline:           ExecutiveReportHeadline;
  readonly overallStatus:      AlertSeverity;
  readonly executiveSummary:   string;
  readonly entries:            readonly ExecutiveReportArchiveEntry[];
  readonly analyticsAvailable: boolean;
  readonly generatedAt:        string;
}
