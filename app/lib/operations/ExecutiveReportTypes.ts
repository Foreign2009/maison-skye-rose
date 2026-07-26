/**
 * Executive Report — Canonical Types (EP36-P1)
 *
 * Defines the top-level executive reporting type model.
 * Consumes ExecutiveOperationsDigest only. Produces an immutable ExecutiveReport.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   ExecutiveReportBuilder.ts          — sole producer
 *   OperationsAlertTypes.ts            — AlertSeverity, AlertCategory imported
 *   ExecutiveOperationsDigestTypes.ts  — upstream digest
 */

import type { AlertCategory, AlertSeverity } from "./OperationsAlertTypes";

// ── Headline ──────────────────────────────────────────────────────────────────

export interface ExecutiveReportHeadline {
  readonly text:          string;
  readonly overallStatus: AlertSeverity;
}

// ── Section ───────────────────────────────────────────────────────────────────

export interface ExecutiveReportSection {
  readonly title:    string;
  readonly body:     string;
  readonly category: AlertCategory;
  readonly alertId:  string;
}

// ── Report ────────────────────────────────────────────────────────────────────

export interface ExecutiveReport {
  readonly headline:           ExecutiveReportHeadline;
  readonly overallStatus:      AlertSeverity;
  readonly executiveSummary:   string;
  readonly sections:           readonly ExecutiveReportSection[];
  readonly analyticsAvailable: boolean;
  readonly generatedAt:        string;
}
