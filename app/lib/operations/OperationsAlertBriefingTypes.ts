/**
 * Operations Alert Briefing — Canonical Types (EP34-P4)
 *
 * Defines the executive summary type model for the Operations Alert Engine.
 * Consumes OperationsAlertReport. Produces an immutable AlertBriefing.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   OperationsAlertBriefingBuilder.ts — sole producer
 *   OperationsAlertTypes.ts           — AlertSeverity, AlertCategory imported
 */

import type { AlertCategory, AlertSeverity } from "./OperationsAlertTypes";

// ── Headline ──────────────────────────────────────────────────────────────────

export interface AlertHeadline {
  readonly text:   string;
  readonly status: AlertSeverity;
}

// ── Observation ───────────────────────────────────────────────────────────────

export interface AlertObservation {
  readonly text:     string;
  readonly category: AlertCategory;
  readonly alertId:  string;
}

// ── Briefing ──────────────────────────────────────────────────────────────────

export interface AlertBriefing {
  readonly headline:           AlertHeadline;
  readonly overallStatus:      AlertSeverity;
  readonly activeAlerts:       number;
  readonly criticalAlerts:     number;
  readonly observations:       readonly AlertObservation[];
  readonly analyticsAvailable: boolean;
  readonly generatedAt:        string;
}
