/**
 * Executive Operations — Canonical Cross-Domain Types (EP33-P1)
 *
 * Defines the canonical type model for the Executive Operations layer.
 * Aggregates platform health across Recommendation, Customer, and Commerce
 * intelligence domains into a single operational report.
 *
 * No imports from intelligence modules. No analytics queries.
 * All status values are categorical — no numeric thresholds.
 *
 * Integration points:
 *   ExecutiveOperationsBuilder.ts — sole producer
 *   admin/ExecutiveOperationsDashboard — sole consumer (EP33-P2)
 *
 * Naming note:
 *   ExecutiveSummary here is the operations-layer type.
 *   RecommendationInsights.ts exports its own ExecutiveSummary for the
 *   recommendation domain — the two are unrelated and in separate modules.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type ExecutiveStatus =
  | "operational"
  | "monitoring"
  | "attention-required"
  | "offline";

// ── Section ───────────────────────────────────────────────────────────────────

export interface ExecutiveSection {
  readonly domain:             string;
  readonly status:             ExecutiveStatus;
  readonly headline:           string;
  readonly keyMetric:          string;
  readonly analyticsAvailable: boolean;
}

// ── Summary ───────────────────────────────────────────────────────────────────

export interface ExecutiveSummary {
  readonly platformStatus:     ExecutiveStatus;
  readonly activeIntelligence: number;   // domains where analyticsAvailable = true
  readonly totalDomains:       number;   // always 3
  readonly headline:           string;
  readonly analyticsAvailable: boolean;
}

// ── Report ────────────────────────────────────────────────────────────────────

export interface ExecutiveOperationsReport {
  readonly sections:           readonly ExecutiveSection[];
  readonly summary:            ExecutiveSummary;
  readonly generatedAt:        string;
  readonly analyticsAvailable: boolean;
}
