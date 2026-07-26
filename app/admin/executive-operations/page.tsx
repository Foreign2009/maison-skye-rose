import type { Metadata }                from "next";
import { cookies }                      from "next/headers";
import { createHash }                   from "crypto";
import { redirect }                     from "next/navigation";
import ExecutiveOperationsDashboard      from "@/app/admin/ExecutiveOperationsDashboard";
import { queryRecommendationAnalytics }  from "@/app/lib/analytics/recommendationAnalytics";
import { queryCustomerAnalytics }        from "@/app/lib/analytics/customerAnalytics";
import { queryCommerceAnalytics }        from "@/app/lib/analytics/commerceAnalytics";
import { buildSignalCalibrationReport }  from "@/app/lib/customer/signals/SignalCalibration";
import { buildRecommendationInsights }   from "@/app/lib/customer/recommendations/RecommendationInsights";
import { buildCustomerBehaviourReport }  from "@/app/lib/customer/behaviour/buildCustomerBehaviourReport";
import { buildCustomerJourneyReport }    from "@/app/lib/customer/behaviour/CustomerJourneyAnalytics";
import { buildCustomerSegmentReport }    from "@/app/lib/customer/behaviour/CustomerSegmentation";
import { buildCommerceBehaviourReport }  from "@/app/lib/commerce/buildCommerceBehaviourReport";
import { buildCheckoutFunnelReport }     from "@/app/lib/commerce/CheckoutFunnelIntelligence";
import { buildProductPerformanceReport } from "@/app/lib/commerce/ProductPerformanceIntelligence";
import { buildExecutiveOperationsReport } from "@/app/lib/operations/ExecutiveOperationsBuilder";

export const metadata: Metadata = {
  title:  "Executive Operations | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

export default async function ExecutiveOperationsPage() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();
  if (!isAuth) redirect("/admin");

  // Parallelise the three analytics queries
  const [recAnalytics, custAnalytics, comAnalytics] = await Promise.all([
    queryRecommendationAnalytics(),
    queryCustomerAnalytics(),
    queryCommerceAnalytics(),
  ]);

  // Synchronous builder cascade
  const signals          = buildSignalCalibrationReport();
  const insightReport    = buildRecommendationInsights(recAnalytics, signals);
  const behaviourReport  = buildCustomerBehaviourReport(custAnalytics, signals);
  const journeyReport    = buildCustomerJourneyReport(behaviourReport);
  const segmentReport    = buildCustomerSegmentReport(behaviourReport, journeyReport);
  const commerceReport   = buildCommerceBehaviourReport(comAnalytics);
  const funnelReport     = buildCheckoutFunnelReport(commerceReport);
  const performanceReport = buildProductPerformanceReport(commerceReport, funnelReport);

  const report = buildExecutiveOperationsReport(
    insightReport,
    behaviourReport,
    journeyReport,
    segmentReport,
    commerceReport,
    funnelReport,
    performanceReport,
  );

  return <ExecutiveOperationsDashboard report={report} />;
}
