/**
 * Executive Operations Pipeline — Shared Builder Orchestration (EP100-P5)
 *
 * Single entry point for the executive dashboard builder cascade.
 * Accepts the three analytics query results, runs the complete builder
 * sequence once, and returns a bundle containing every report object
 * required by the six cascade admin dashboards.
 *
 * Builder execution order is identical to the per-page sequence it replaces.
 * All KPI calculations remain in their original builder files.
 * This module introduces no new business logic or type definitions.
 *
 * Integration points:
 *   admin/executive-operations/page.tsx — bundle.operations
 *   admin/operations/page.tsx           — bundle.operations + bundle.execBriefing
 *   admin/alerts/page.tsx               — bundle.alertReport
 *   admin/alert-center/page.tsx         — bundle.alertReport
 *   admin/executive-digest/page.tsx     — bundle.digest
 *   admin/executive-report/page.tsx     — bundle.report
 */

import type { RecommendationAnalyticsResult } from "../analytics/recommendationAnalytics";
import type { CustomerAnalyticsResult }        from "../analytics/customerAnalytics";
import type { CommerceAnalyticsResult }         from "../analytics/commerceAnalytics";
import type { ExecutiveOperationsReport }       from "./ExecutiveOperationsTypes";
import type { ExecutiveBriefing }              from "./ExecutiveBriefingTypes";
import type { OperationsAlertReport }          from "./OperationsAlertTypes";
import type { ExecutiveOperationsDigest }      from "./ExecutiveOperationsDigestTypes";
import type { ExecutiveReport }               from "./ExecutiveReportTypes";

import { buildSignalCalibrationReport }    from "../customer/signals/SignalCalibration";
import { buildRecommendationInsights }     from "../customer/recommendations/RecommendationInsights";
import { buildCustomerBehaviourReport }    from "../customer/behaviour/buildCustomerBehaviourReport";
import { buildCustomerJourneyReport }      from "../customer/behaviour/CustomerJourneyAnalytics";
import { buildCustomerSegmentReport }      from "../customer/behaviour/CustomerSegmentation";
import { buildCommerceBehaviourReport }    from "../commerce/buildCommerceBehaviourReport";
import { buildCheckoutFunnelReport }       from "../commerce/CheckoutFunnelIntelligence";
import { buildProductPerformanceReport }   from "../commerce/ProductPerformanceIntelligence";
import { buildExecutiveOperationsReport }  from "./ExecutiveOperationsBuilder";
import { buildExecutiveBriefing }          from "./ExecutiveBriefingBuilder";
import { buildOperationsAlertReport }      from "./OperationsAlertBuilder";
import { buildOperationsAlertBriefing }    from "./OperationsAlertBriefingBuilder";
import { buildExecutiveOperationsDigest }  from "./ExecutiveOperationsDigestBuilder";
import { buildExecutiveReport }            from "./ExecutiveReportBuilder";

// ── Bundle ────────────────────────────────────────────────────────────────────

export interface ExecutiveOperationsBundle {
  readonly operations:   ExecutiveOperationsReport;    // admin/executive-operations
  readonly execBriefing: ExecutiveBriefing;             // admin/operations
  readonly alertReport:  OperationsAlertReport;         // admin/alerts, admin/alert-center
  readonly digest:       ExecutiveOperationsDigest;     // admin/executive-digest
  readonly report:       ExecutiveReport;               // admin/executive-report
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

export function buildExecutiveOperationsBundle(
  recAnalytics:  RecommendationAnalyticsResult | null,
  custAnalytics: CustomerAnalyticsResult | null,
  comAnalytics:  CommerceAnalyticsResult | null,
): ExecutiveOperationsBundle {

  // ── Signal calibration ─────────────────────────────────────────────────────
  const signals = buildSignalCalibrationReport();

  // ── Domain intelligence ────────────────────────────────────────────────────
  const insightReport     = buildRecommendationInsights(recAnalytics, signals);
  const behaviourReport   = buildCustomerBehaviourReport(custAnalytics, signals);
  const journeyReport     = buildCustomerJourneyReport(behaviourReport);
  const segmentReport     = buildCustomerSegmentReport(behaviourReport, journeyReport);
  const commerceReport    = buildCommerceBehaviourReport(comAnalytics);
  const funnelReport      = buildCheckoutFunnelReport(commerceReport);
  const performanceReport = buildProductPerformanceReport(commerceReport, funnelReport);

  // ── Cross-domain executive layer ───────────────────────────────────────────
  const operations = buildExecutiveOperationsReport(
    insightReport,
    behaviourReport,
    journeyReport,
    segmentReport,
    commerceReport,
    funnelReport,
    performanceReport,
  );

  // ── Extension cascade ──────────────────────────────────────────────────────
  const execBriefing = buildExecutiveBriefing(operations);
  const alertReport  = buildOperationsAlertReport(operations);
  const briefing     = buildOperationsAlertBriefing(alertReport);
  const digest       = buildExecutiveOperationsDigest(briefing);
  const report       = buildExecutiveReport(digest);

  return { operations, execBriefing, alertReport, digest, report };
}
