/**
 * Customer Behaviour — Canonical Population-Level Types (EP31-P1)
 *
 * Defines the canonical type model for population-level customer behaviour
 * analytics. All types in this module represent aggregated metrics across
 * the customer base — not per-customer data.
 *
 * Contrast with app/lib/customer/intelligence/ which handles per-customer
 * intelligence. These types are orthogonal and independent.
 *
 * Integration points:
 *   customerAnalytics.ts            — analytics input (CustomerAnalyticsResult)
 *   buildCustomerBehaviourReport.ts — report builder (sole producer)
 *   SignalCalibration.ts            — SignalCalibrationReport (signal health input)
 *   admin/CustomerIntelligenceDashboard — sole consumer (EP31-P4)
 *
 * Null semantics:
 *   count fields are null when analytics are unavailable for that metric.
 *   Derived fields (conversionFromPrevious, dropOffRate) are null when
 *   either operand is null. No values are fabricated.
 */

import type { SignalCalibrationReport } from "../signals/SignalCalibration";

// ── Funnel ────────────────────────────────────────────────────────────────────

export type FunnelStageKey =
  | "discovery"
  | "quiz"
  | "favourited"
  | "cart"
  | "checkout"
  | "purchase";

export interface FunnelStep {
  readonly stage:                  FunnelStageKey;
  readonly label:                  string;
  readonly description:            string;
  readonly event:                  string;
  readonly count:                  number | null;
  readonly conversionFromPrevious: number | null;
  readonly dropOffRate:            number | null;
}

// ── Discovery breakdown ───────────────────────────────────────────────────────

export interface DiscoveryBreakdown {
  readonly productDetailViews:    number | null;
  readonly quizCompletions:       number | null;
  readonly aiChatSessions:        number | null;
  readonly discoveryModeBrowse:   number | null;
  readonly discoveryModeAI:       number | null;
  readonly discoveryModeCharacter: number | null;
  readonly totalDiscoveryEvents:  number | null;
}

// ── Engagement metrics ────────────────────────────────────────────────────────

export interface EngagementMetrics {
  readonly favouritesAdded:     number | null;
  readonly cartAdds:            number | null;
  readonly checkoutsStarted:    number | null;
  readonly purchaseCompletions: number | null;
  readonly quizCompletions:     number | null;
}

// ── Full report ───────────────────────────────────────────────────────────────

export interface CustomerBehaviourReport {
  readonly funnelSteps:         readonly FunnelStep[];
  readonly discoveryBreakdown:  DiscoveryBreakdown;
  readonly engagementMetrics:   EngagementMetrics;
  readonly signalHealth:        SignalCalibrationReport;
  readonly analyticsAvailable:  boolean;
  readonly analyticsWindowDays: number;
  readonly generatedAt:         string;
}
