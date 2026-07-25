/**
 * Customer Segmentation — Population-Level Behavioural Archetypes (EP31-P3)
 *
 * Pure projection over CustomerBehaviourReport and CustomerJourneyReport.
 * Derives a CustomerSegmentReport that classifies the customer base into
 * behavioural archetypes using funnel counts as evidence.
 *
 * Proxy counts are aggregate event counts — not distinct user counts.
 * True per-user segmentation requires session-level analytics not available
 * in the current data layer. Each SegmentSummary.reason makes the evidence
 * basis explicit so the dashboard can surface this caveat.
 *
 * No new queries. No new KPI thresholds. No recommendation logic.
 * All evidence is read from CustomerBehaviourReport and CustomerJourneyReport.
 *
 * Integration points:
 *   CustomerBehaviourTypes.ts           — CustomerBehaviourReport input
 *   CustomerJourneyAnalytics.ts         — CustomerJourneyReport input
 *   admin/CustomerIntelligenceDashboard — consumer (EP31-P4)
 *
 * Segmentation rules:
 *   explorer          — proxy: productDetailViews       (widest discovery)
 *   researcher        — proxy: quizCompletions          (deep discovery tool)
 *   engaged-shopper   — proxy: favouritesAdded          (intent without purchase)
 *   purchase-oriented — proxy: purchaseCompletions      (commercial outcome)
 *   insufficient-evidence — always present; dominant when analytics unavailable
 */

import type { CustomerBehaviourReport } from "./CustomerBehaviourTypes";
import type { CustomerJourneyReport }   from "./CustomerJourneyAnalytics";

// ── Public types ──────────────────────────────────────────────────────────────

export type CustomerSegment =
  | "explorer"
  | "researcher"
  | "engaged-shopper"
  | "purchase-oriented"
  | "insufficient-evidence";

export type SegmentConfidence = "high" | "medium" | "low" | "none";

export interface SegmentSummary {
  readonly segment:    CustomerSegment;
  readonly label:      string;
  readonly confidence: SegmentConfidence;
  readonly reason:     string;
  readonly count:      number | null;
  readonly present:    boolean;
}

export interface SegmentDistribution {
  readonly countsBySegment: Readonly<Record<CustomerSegment, number | null>>;
  readonly dominantSegment: CustomerSegment | null;
}

export interface CustomerSegmentReport {
  readonly segments:           readonly SegmentSummary[];
  readonly distribution:       SegmentDistribution;
  readonly analyticsAvailable: boolean;
  readonly generatedAt:        string;
}

// ── Internal: segment definitions ────────────────────────────────────────────

interface SegmentDefinition {
  readonly segment: CustomerSegment;
  readonly label:   string;
  readonly reason:  string;
  count(b: CustomerBehaviourReport): number | null;
  confidence(count: number | null): SegmentConfidence;
}

const SEGMENT_DEFINITIONS: readonly SegmentDefinition[] = [
  {
    segment:    "explorer",
    label:      "Explorer",
    reason:     "Customers who viewed product pages — widest discovery activity in the funnel.",
    count:      (b) => b.discoveryBreakdown.productDetailViews,
    confidence: (c) => (c !== null && c > 0 ? "high" : "low"),
  },
  {
    segment:    "researcher",
    label:      "Researcher",
    reason:     "Customers who completed the fragrance quiz — high engagement with discovery tools.",
    count:      (b) => b.engagementMetrics.quizCompletions,
    confidence: (c) => (c !== null && c > 0 ? "high" : "none"),
  },
  {
    segment:    "engaged-shopper",
    label:      "Engaged Shopper",
    reason:     "Customers who saved fragrances — expressing clear intent without committing to purchase.",
    count:      (b) => b.engagementMetrics.favouritesAdded,
    confidence: (c) => (c !== null && c > 0 ? "high" : "none"),
  },
  {
    segment:    "purchase-oriented",
    label:      "Purchase-Oriented",
    reason:     "Customers who completed a purchase — the primary commercial outcome.",
    count:      (b) => b.engagementMetrics.purchaseCompletions,
    confidence: (c) => (c !== null && c > 0 ? "high" : "none"),
  },
];

const INSUFFICIENT_EVIDENCE: SegmentSummary = {
  segment:    "insufficient-evidence",
  label:      "Insufficient Evidence",
  confidence: "none",
  reason:     "Analytics unavailable — configure PostHog environment variables to enable segmentation.",
  count:      null,
  present:    false,
};

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildCustomerSegmentReport(
  behaviourReport: CustomerBehaviourReport,
  journeyReport:   CustomerJourneyReport,
): CustomerSegmentReport {
  // Suppress unused-variable lint — journeyReport is available for future
  // enrichment (e.g. using overallCompletionRate to boost purchase-oriented
  // confidence) without requiring a new module or breaking change.
  void journeyReport;

  if (!behaviourReport.analyticsAvailable) {
    const counts: Record<CustomerSegment, number | null> = {
      "explorer":              null,
      "researcher":            null,
      "engaged-shopper":       null,
      "purchase-oriented":     null,
      "insufficient-evidence": null,
    };
    return {
      segments: [
        { ...INSUFFICIENT_EVIDENCE, confidence: "none" },
      ],
      distribution: { countsBySegment: counts, dominantSegment: null },
      analyticsAvailable: false,
      generatedAt:        new Date().toISOString(),
    };
  }

  // Build one SegmentSummary per defined segment
  const summaries: SegmentSummary[] = SEGMENT_DEFINITIONS.map((def) => {
    const count = def.count(behaviourReport);
    return {
      segment:    def.segment,
      label:      def.label,
      confidence: def.confidence(count),
      reason:     def.reason,
      count,
      present:    count !== null && count > 0,
    };
  });

  // Always append insufficient-evidence (present = false when data is available)
  summaries.push(INSUFFICIENT_EVIDENCE);

  // Build countsBySegment map
  const countsBySegment: Record<CustomerSegment, number | null> = {
    "explorer":              null,
    "researcher":            null,
    "engaged-shopper":       null,
    "purchase-oriented":     null,
    "insufficient-evidence": null,
  };
  for (const s of summaries) {
    countsBySegment[s.segment] = s.count;
  }

  // Dominant segment — highest proxy count, excluding insufficient-evidence
  let dominantSegment: CustomerSegment | null = null;
  let maxCount = -Infinity;
  for (const s of summaries) {
    if (s.segment === "insufficient-evidence") continue;
    if (s.count !== null && s.count > maxCount) {
      maxCount         = s.count;
      dominantSegment  = s.segment;
    }
  }

  return {
    segments:           summaries,
    distribution:       { countsBySegment, dominantSegment },
    analyticsAvailable: true,
    generatedAt:        new Date().toISOString(),
  };
}
