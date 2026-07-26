/**
 * Executive Briefing — Canonical Types (EP33-P3)
 *
 * Defines the output type model for the Executive Briefing Generator.
 * Consumes ExecutiveOperationsReport. Produces an immutable ExecutiveBriefing.
 *
 * No analytics queries. No business logic. No duplicated calculations.
 *
 * Integration points:
 *   ExecutiveBriefingBuilder.ts — sole producer
 *   ExecutiveOperationsTypes.ts — ExecutiveStatus imported
 */

import type { ExecutiveStatus } from "./ExecutiveOperationsTypes";

// ── Observation ───────────────────────────────────────────────────────────────

export type ObservationPriority = "high" | "medium" | "low";

export interface ExecutiveObservation {
  readonly text:     string;
  readonly priority: ObservationPriority;
}

// ── Section ───────────────────────────────────────────────────────────────────

export interface ExecutiveBriefingSection {
  readonly domain:             string;
  readonly status:             ExecutiveStatus;
  readonly headline:           string;
  readonly keyMetric:          string;
  readonly analyticsAvailable: boolean;
}

// ── Briefing ──────────────────────────────────────────────────────────────────

export interface ExecutiveBriefing {
  readonly platformStatus:     ExecutiveStatus;
  readonly platformHeadline:   string;
  readonly activeIntelligence: number;
  readonly totalDomains:       number;
  readonly sections:           readonly ExecutiveBriefingSection[];
  readonly observations:       readonly ExecutiveObservation[];
  readonly analyticsAvailable: boolean;
  readonly generatedAt:        string;
}
