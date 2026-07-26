/**
 * Executive Operations Digest — Canonical Types (EP35-P1)
 *
 * Defines the executive communication type model for the operations platform.
 * Consumes AlertBriefing only. Produces an immutable ExecutiveOperationsDigest.
 *
 * No analytics queries. No business calculations. No persistence.
 *
 * Integration points:
 *   ExecutiveOperationsDigestBuilder.ts — sole producer
 *   OperationsAlertTypes.ts             — AlertSeverity, AlertCategory imported
 */

import type { AlertCategory, AlertSeverity } from "./OperationsAlertTypes";

// ── Headline ──────────────────────────────────────────────────────────────────

export interface ExecutiveDigestHeadline {
  readonly text:          string;
  readonly overallStatus: AlertSeverity;
}

// ── Section ───────────────────────────────────────────────────────────────────

export interface ExecutiveDigestSection {
  readonly title:    string;
  readonly body:     string;
  readonly category: AlertCategory;
  readonly alertId:  string;
}

// ── Digest ────────────────────────────────────────────────────────────────────

export interface ExecutiveOperationsDigest {
  readonly headline:           ExecutiveDigestHeadline;
  readonly overallStatus:      AlertSeverity;
  readonly summary:            string;
  readonly keyObservations:    readonly ExecutiveDigestSection[];
  readonly analyticsAvailable: boolean;
  readonly generatedAt:        string;
}
