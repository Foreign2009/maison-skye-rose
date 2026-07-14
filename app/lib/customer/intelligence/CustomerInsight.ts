/**
 * Customer Intelligence — Customer Insight
 *
 * A single synthesised observation about the customer.
 * Insights are produced by the CustomerIntelligenceEngine from derived
 * sub-components (journey, statistics, confidence) — not raw signals.
 *
 * CustomerInsightType governs which class of observation is represented:
 *   journey_stage       — where the customer is in their discovery arc
 *   signal_richness     — how much signal data has been collected
 *   engagement_depth    — breadth of catalogue interaction
 *   preference_strength — strength of expressed preferences (EP10.0-P5+)
 *   collection_affinity — concentration of engagement in a collection (EP10.0-P5+)
 *
 * Integration points:
 *   CustomerInsights — included in the insights[] array
 *   CustomerIntelligenceEngine — deriveInsights() produces these
 */

import type { SignalConfidence } from "../signals/SignalConfidence";

export type CustomerInsightType =
  | "journey_stage"
  | "signal_richness"
  | "engagement_depth"
  | "preference_strength"
  | "collection_affinity";

export interface CustomerInsight {
  readonly type:                  CustomerInsightType;
  readonly description:           string;
  readonly confidence:            SignalConfidence;
  readonly supportingSignalCount: number;
}
