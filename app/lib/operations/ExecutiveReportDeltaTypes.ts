/**
 * Executive Report Delta — Canonical Types (EP40-P1)
 *
 * Defines the immutable delta type model.
 * Consumes ExecutiveReportComparison only. Produces an immutable ExecutiveReportDelta.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   ExecutiveReportDeltaBuilder.ts    — sole producer
 *   ExecutiveReportComparisonTypes.ts — ExecutiveReportComparisonEntry imported
 */

import type { ExecutiveReportComparisonEntry } from "./ExecutiveReportComparisonTypes";

// ── Delta State ───────────────────────────────────────────────────────────────

export type ExecutiveReportDeltaState = "initial" | "unchanged" | "changed";

// ── Delta Entry ───────────────────────────────────────────────────────────────

export interface ExecutiveReportDeltaEntry {
  readonly comparison:  ExecutiveReportComparisonEntry;
  readonly state:       ExecutiveReportDeltaState;
  readonly generatedAt: string;
}

// ── Delta ─────────────────────────────────────────────────────────────────────

export interface ExecutiveReportDelta {
  readonly records:     readonly ExecutiveReportDeltaEntry[];
  readonly generatedAt: string;
}
