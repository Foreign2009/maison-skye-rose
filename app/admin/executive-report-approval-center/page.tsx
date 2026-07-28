import type { Metadata }                     from "next";
import { cookies }                           from "next/headers";
import { createHash }                        from "crypto";
import { redirect }                          from "next/navigation";
import ExecutiveReportApprovalCenter         from "@/app/admin/ExecutiveReportApprovalCenter";
import { queryRecommendationAnalytics }      from "@/app/lib/analytics/recommendationAnalytics";
import { queryCustomerAnalytics }            from "@/app/lib/analytics/customerAnalytics";
import { queryCommerceAnalytics }            from "@/app/lib/analytics/commerceAnalytics";
import { buildSignalCalibrationReport }      from "@/app/lib/customer/signals/SignalCalibration";
import { buildRecommendationInsights }       from "@/app/lib/customer/recommendations/RecommendationInsights";
import { buildCustomerBehaviourReport }      from "@/app/lib/customer/behaviour/buildCustomerBehaviourReport";
import { buildCustomerJourneyReport }        from "@/app/lib/customer/behaviour/CustomerJourneyAnalytics";
import { buildCustomerSegmentReport }        from "@/app/lib/customer/behaviour/CustomerSegmentation";
import { buildCommerceBehaviourReport }      from "@/app/lib/commerce/buildCommerceBehaviourReport";
import { buildCheckoutFunnelReport }         from "@/app/lib/commerce/CheckoutFunnelIntelligence";
import { buildProductPerformanceReport }     from "@/app/lib/commerce/ProductPerformanceIntelligence";
import { buildExecutiveOperationsReport }    from "@/app/lib/operations/ExecutiveOperationsBuilder";
import { buildOperationsAlertReport }        from "@/app/lib/operations/OperationsAlertBuilder";
import { buildOperationsAlertBriefing }      from "@/app/lib/operations/OperationsAlertBriefingBuilder";
import { buildExecutiveOperationsDigest }    from "@/app/lib/operations/ExecutiveOperationsDigestBuilder";
import { buildExecutiveReport }              from "@/app/lib/operations/ExecutiveReportBuilder";
import { buildExecutiveReportArchive }       from "@/app/lib/operations/ExecutiveReportArchiveBuilder";
import { buildExecutiveReportHistory }       from "@/app/lib/operations/ExecutiveReportHistoryBuilder";
import { buildExecutiveReportComparison }    from "@/app/lib/operations/ExecutiveReportComparisonBuilder";
import { buildExecutiveReportDelta }         from "@/app/lib/operations/ExecutiveReportDeltaBuilder";
import { buildExecutiveReportInsight }       from "@/app/lib/operations/ExecutiveReportInsightBuilder";
import { buildExecutiveReportTrend }         from "@/app/lib/operations/ExecutiveReportTrendBuilder";
import { buildExecutiveReportForecast }      from "@/app/lib/operations/ExecutiveReportForecastBuilder";
import { buildExecutiveReportOutlook }       from "@/app/lib/operations/ExecutiveReportOutlookBuilder";
import { buildExecutiveReportStrategy }      from "@/app/lib/operations/ExecutiveReportStrategyBuilder";
import { buildExecutiveReportAction }        from "@/app/lib/operations/ExecutiveReportActionBuilder";
import { buildExecutiveReportDecision }      from "@/app/lib/operations/ExecutiveReportDecisionBuilder";
import { buildExecutiveReportApproval }      from "@/app/lib/operations/ExecutiveReportApprovalBuilder";

export const metadata: Metadata = {
  title:  "Executive Report Approval Center | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

export default async function ExecutiveReportApprovalCenterPage() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();
  if (!isAuth) redirect("/admin");

  const [recAnalytics, custAnalytics, comAnalytics] = await Promise.all([
    queryRecommendationAnalytics(),
    queryCustomerAnalytics(),
    queryCommerceAnalytics(),
  ]);

  const signals           = buildSignalCalibrationReport();
  const insightReport     = buildRecommendationInsights(recAnalytics, signals);
  const behaviourReport   = buildCustomerBehaviourReport(custAnalytics, signals);
  const journeyReport     = buildCustomerJourneyReport(behaviourReport);
  const segmentReport     = buildCustomerSegmentReport(behaviourReport, journeyReport);
  const commerceReport    = buildCommerceBehaviourReport(comAnalytics);
  const funnelReport      = buildCheckoutFunnelReport(commerceReport);
  const performanceReport = buildProductPerformanceReport(commerceReport, funnelReport);

  const operations  = buildExecutiveOperationsReport(
    insightReport, behaviourReport, journeyReport, segmentReport,
    commerceReport, funnelReport, performanceReport,
  );
  const alertReport = buildOperationsAlertReport(operations);
  const briefing    = buildOperationsAlertBriefing(alertReport);
  const digest      = buildExecutiveOperationsDigest(briefing);
  const report      = buildExecutiveReport(digest);
  const archive     = buildExecutiveReportArchive(report);
  const history     = buildExecutiveReportHistory([archive]);
  const comparison  = buildExecutiveReportComparison(history);
  const delta       = buildExecutiveReportDelta(comparison);
  const insight     = buildExecutiveReportInsight(delta);
  const trend       = buildExecutiveReportTrend(insight);
  const forecast    = buildExecutiveReportForecast(trend);
  const outlook     = buildExecutiveReportOutlook(forecast);
  const strategy    = buildExecutiveReportStrategy(outlook);
  const action      = buildExecutiveReportAction(strategy);
  const decision    = buildExecutiveReportDecision(action);
  const approval    = buildExecutiveReportApproval(decision);

  return <ExecutiveReportApprovalCenter approval={approval} />;
}
