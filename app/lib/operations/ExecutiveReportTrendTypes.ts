/**
 * Executive Report Trend — Canonical Types (EP42-P1)
 *
 * Defines the immutable trend type model.
 * Consumes ExecutiveReportInsight only. Produces an immutable ExecutiveReportTrend.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   ExecutiveReportTrendBuilder.ts  — sole producer
 *   ExecutiveReportInsightTypes.ts  — ExecutiveReportInsightEntry imported
 */

import type { ExecutiveReportInsightEntry } from "./ExecutiveReportInsightTypes";

// ── Trend State ───────────────────────────────────────────────────────────────

export type ExecutiveReportTrendState = "emerging" | "stable" | "improving";

// ── Trend Entry ───────────────────────────────────────────────────────────────

export interface ExecutiveReportTrendEntry {
  readonly insight:     ExecutiveReportInsightEntry;
  readonly state:       ExecutiveReportTrendState;
  readonly generatedAt: string;
}

// ── Trend ─────────────────────────────────────────────────────────────────────

export interface ExecutiveReportTrend {
  readonly records:     readonly ExecutiveReportTrendEntry[];
  readonly generatedAt: string;
}
