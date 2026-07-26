/**
 * Executive Operations — Cross-Domain Report Builder (EP33-P1)
 *
 * Pure function. Accepts all upstream intelligence reports and projects
 * them into a single ExecutiveOperationsReport. No new analytics queries.
 * No new calculations. No scoring algorithms. No thresholds.
 *
 * Status derivation rules:
 *
 *   Recommendation:
 *     "excellent" | "healthy"      → "operational"
 *     "needs-attention"            → "monitoring"
 *     "critical"                   → "attention-required"
 *     "insufficient-evidence"      → "offline"
 *
 *   Customer:
 *     !analyticsAvailable          → "offline"
 *     overallCompletionRate ≠ null → "operational"
 *     analytics present, rate null → "monitoring"
 *
 *   Commerce:
 *     "healthy"                    → "operational"
 *     "needs-attention"            → "monitoring"
 *     "insufficient-evidence"      → "offline"
 *
 *   Platform (categorical, no scoring):
 *     any "attention-required"     → "attention-required"
 *     all "offline"                → "offline"
 *     any "monitoring"             → "monitoring"
 *     all "operational"            → "operational"
 *
 * Integration points:
 *   ExecutiveOperationsTypes.ts    — output types
 *   RecommendationInsights.ts      — RecommendationInsightReport input
 *   CustomerBehaviourTypes.ts      — CustomerBehaviourReport input
 *   CustomerJourneyAnalytics.ts    — CustomerJourneyReport input
 *   CustomerSegmentation.ts        — CustomerSegmentReport input
 *   CommerceBehaviourTypes.ts      — CommerceBehaviourReport input
 *   CheckoutFunnelIntelligence.ts  — CheckoutFunnelReport input
 *   ProductPerformanceIntelligence — ProductPerformanceReport input
 */

import type {
  ExecutiveOperationsReport,
  ExecutiveSection,
  ExecutiveStatus,
  ExecutiveSummary,
} from "./ExecutiveOperationsTypes";
import type { RecommendationInsightReport } from "../customer/recommendations/RecommendationInsights";
import type { HealthStatus }                from "../customer/recommendations/RecommendationInsights";
import type { CustomerBehaviourReport }     from "../customer/behaviour/CustomerBehaviourTypes";
import type { CustomerJourneyReport }       from "../customer/behaviour/CustomerJourneyAnalytics";
import type {
  CustomerSegmentReport,
  CustomerSegment,
}                                           from "../customer/behaviour/CustomerSegmentation";
import type { CommerceBehaviourReport }     from "../commerce/CommerceBehaviourTypes";
import type {
  CheckoutFunnelReport,
  CheckoutStageKey,
}                                           from "../commerce/CheckoutFunnelIntelligence";
import type {
  ProductPerformanceReport,
  CommerceHealth,
}                                           from "../commerce/ProductPerformanceIntelligence";

// ── Label maps ────────────────────────────────────────────────────────────────

const SEGMENT_LABELS: Record<CustomerSegment, string> = {
  "explorer":              "Explorer",
  "researcher":            "Researcher",
  "engaged-shopper":       "Engaged Shopper",
  "purchase-oriented":     "Purchase-Oriented",
  "insufficient-evidence": "Insufficient Evidence",
};

const STAGE_LABELS: Record<CheckoutStageKey, string> = {
  "cart-opened":        "Cart Opened",
  "cart-addition":      "Cart Addition",
  "checkout-started":   "Checkout Started",
  "payment-started":    "Payment Started",
  "payment-successful": "Payment Successful",
};

const PLATFORM_HEADLINES: Record<ExecutiveStatus, string> = {
  "operational":        "All intelligence systems operational",
  "monitoring":         "Intelligence systems require monitoring",
  "attention-required": "Intelligence systems require attention",
  "offline":            "Analytics unavailable across all systems",
};

// ── Status derivation ─────────────────────────────────────────────────────────

function recommendationStatus(healthStatus: HealthStatus): ExecutiveStatus {
  switch (healthStatus) {
    case "excellent":
    case "healthy":               return "operational";
    case "needs-attention":       return "monitoring";
    case "critical":              return "attention-required";
    case "insufficient-evidence": return "offline";
  }
}

function customerStatus(
  analyticsAvailable:    boolean,
  overallCompletionRate: number | null,
): ExecutiveStatus {
  if (!analyticsAvailable)             return "offline";
  if (overallCompletionRate !== null)   return "operational";
  return "monitoring";
}

function commerceStatus(health: CommerceHealth): ExecutiveStatus {
  switch (health) {
    case "healthy":               return "operational";
    case "needs-attention":       return "monitoring";
    case "insufficient-evidence": return "offline";
  }
}

function platformStatus(statuses: readonly ExecutiveStatus[]): ExecutiveStatus {
  if (statuses.every((s) => s === "offline"))        return "offline";
  if (statuses.some((s) => s === "attention-required")) return "attention-required";
  if (statuses.some((s) => s === "monitoring"))      return "monitoring";
  return "operational";
}

// ── Key metric formatters ─────────────────────────────────────────────────────

function fmtRate(n: number | null): string {
  return n !== null ? (n * 100).toFixed(1) + "%" : null!;
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildExecutiveOperationsReport(
  insightReport:     RecommendationInsightReport,
  behaviourReport:   CustomerBehaviourReport,
  journeyReport:     CustomerJourneyReport,
  segmentReport:     CustomerSegmentReport,
  commerceReport:    CommerceBehaviourReport,
  funnelReport:      CheckoutFunnelReport,
  performanceReport: ProductPerformanceReport,
): ExecutiveOperationsReport {

  // ── Recommendation section ──────────────────────────────────────────────────
  const recStatus  = recommendationStatus(insightReport.executiveSummary.healthStatus);
  const recMetric  = insightReport.analyticsAvailable
    ? `${insightReport.executiveSummary.alertCount} alert${insightReport.executiveSummary.alertCount === 1 ? "" : "s"}`
    : "No analytics";
  const recSection: ExecutiveSection = {
    domain:             "Recommendation",
    status:             recStatus,
    headline:           insightReport.executiveSummary.headline,
    keyMetric:          recMetric,
    analyticsAvailable: insightReport.analyticsAvailable,
  };

  // ── Customer section ────────────────────────────────────────────────────────
  const custStatus  = customerStatus(
    journeyReport.analyticsAvailable,
    journeyReport.overallCompletionRate,
  );
  const dominantSeg = segmentReport.distribution.dominantSegment;
  const custHeadline = dominantSeg
    ? `Dominant segment: ${SEGMENT_LABELS[dominantSeg]}`
    : "Segment data unavailable";
  const custRate    = journeyReport.overallCompletionRate;
  const custMetric  = journeyReport.analyticsAvailable
    ? (custRate !== null ? `${fmtRate(custRate)} funnel completion` : "No funnel data")
    : "No analytics";
  const custSection: ExecutiveSection = {
    domain:             "Customer",
    status:             custStatus,
    headline:           custHeadline,
    keyMetric:          custMetric,
    analyticsAvailable: journeyReport.analyticsAvailable,
  };

  // ── Commerce section ────────────────────────────────────────────────────────
  const comStatus    = commerceStatus(performanceReport.overallCommerceHealth);
  const abandonStage = funnelReport.primaryAbandonStage;
  const comHeadline  = abandonStage
    ? `Primary drop-off: ${STAGE_LABELS[abandonStage]}`
    : "Commerce funnel operational";
  const comRate      = commerceReport.commerceMetrics.cartToOrderRate;
  const comMetric    = commerceReport.analyticsAvailable
    ? (comRate !== null ? `${fmtRate(comRate)} cart-to-order` : "No commerce data")
    : "No analytics";
  const comSection: ExecutiveSection = {
    domain:             "Commerce",
    status:             comStatus,
    headline:           comHeadline,
    keyMetric:          comMetric,
    analyticsAvailable: commerceReport.analyticsAvailable,
  };

  // ── Platform summary ────────────────────────────────────────────────────────
  const sections: readonly ExecutiveSection[] = [recSection, custSection, comSection];
  const allStatuses  = sections.map((s) => s.status);
  const platStatus   = platformStatus(allStatuses);
  const activeCount  = sections.filter((s) => s.analyticsAvailable).length;
  const anyAvailable = activeCount > 0;

  const summary: ExecutiveSummary = {
    platformStatus:     platStatus,
    activeIntelligence: activeCount,
    totalDomains:       3,
    headline:           PLATFORM_HEADLINES[platStatus],
    analyticsAvailable: anyAvailable,
  };

  return {
    sections,
    summary,
    generatedAt:        new Date().toISOString(),
    analyticsAvailable: anyAvailable,
  };
}
