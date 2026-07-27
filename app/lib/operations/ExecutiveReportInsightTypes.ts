/**
 * Executive Report Insight — Canonical Types (EP41-P1)
 *
 * Defines the immutable insight type model.
 * Consumes ExecutiveReportDelta only. Produces an immutable ExecutiveReportInsight.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   ExecutiveReportInsightBuilder.ts — sole producer
 *   ExecutiveReportDeltaTypes.ts     — ExecutiveReportDeltaEntry imported
 */

import type { ExecutiveReportDeltaEntry } from "./ExecutiveReportDeltaTypes";

// ── Insight State ─────────────────────────────────────────────────────────────

export type ExecutiveReportInsightState = "new" | "stable" | "updated";

// ── Insight Entry ─────────────────────────────────────────────────────────────

export interface ExecutiveReportInsightEntry {
  readonly delta:       ExecutiveReportDeltaEntry;
  readonly state:       ExecutiveReportInsightState;
  readonly generatedAt: string;
}

// ── Insight ───────────────────────────────────────────────────────────────────

export interface ExecutiveReportInsight {
  readonly records:     readonly ExecutiveReportInsightEntry[];
  readonly generatedAt: string;
}
