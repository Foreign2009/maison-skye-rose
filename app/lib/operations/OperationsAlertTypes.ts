/**
 * Operations Alert Engine — Canonical Types (EP34-P1)
 *
 * Defines the standardized alert type model for the operations platform.
 * All alerts are derived from ExecutiveOperationsReport only.
 *
 * No analytics queries. No business calculations. No side effects.
 *
 * Severity derivation (categorical, no scoring):
 *   "attention-required" → "critical"
 *   "offline"            → "high"
 *   "monitoring"         → "medium"
 *   "operational"        → "low"
 *
 * Alert status derivation (metadata only, no persistence):
 *   "attention-required" → "active"
 *   "offline"            → "active"
 *   "monitoring"         → "monitoring"
 *   "operational"        → "resolved"
 *
 * Integration points:
 *   OperationsAlertBuilder.ts — sole producer
 */

// ── Severity ──────────────────────────────────────────────────────────────────

export type AlertSeverity = "critical" | "high" | "medium" | "low";

// ── Category ──────────────────────────────────────────────────────────────────

export type AlertCategory =
  | "platform"
  | "recommendation"
  | "customer"
  | "commerce"
  | "operations";

// ── Status ────────────────────────────────────────────────────────────────────

export type AlertStatus = "active" | "monitoring" | "resolved";

// ── Alert ─────────────────────────────────────────────────────────────────────

export interface OperationsAlert {
  readonly id:          string;
  readonly title:       string;
  readonly summary:     string;
  readonly severity:    AlertSeverity;
  readonly category:    AlertCategory;
  readonly origin:      string;
  readonly status:      AlertStatus;
  readonly generatedAt: string;
}

// ── Report ────────────────────────────────────────────────────────────────────

export interface OperationsAlertReport {
  readonly alerts:             readonly OperationsAlert[];
  readonly activeCount:        number;
  readonly criticalCount:      number;
  readonly analyticsAvailable: boolean;
  readonly generatedAt:        string;
}
