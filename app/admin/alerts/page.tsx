import type { Metadata }                   from "next";
import { hasAdminSession }                 from "@/app/lib/admin/session";
import { redirect }                        from "next/navigation";
import OperationsAlertDashboard            from "@/app/admin/OperationsAlertDashboard";
import { queryRecommendationAnalytics }    from "@/app/lib/analytics/recommendationAnalytics";
import { queryCustomerAnalytics }          from "@/app/lib/analytics/customerAnalytics";
import { queryCommerceAnalytics }          from "@/app/lib/analytics/commerceAnalytics";
import { buildExecutiveOperationsBundle }  from "@/app/lib/operations/ExecutiveOperationsPipeline";

export const metadata: Metadata = {
  title:  "Operations Alerts | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

export default async function OperationsAlertsPage() {
  const isAuth      = await hasAdminSession();
  if (!isAuth) redirect("/admin");

  const [recAnalytics, custAnalytics, comAnalytics] = await Promise.all([
    queryRecommendationAnalytics(),
    queryCustomerAnalytics(),
    queryCommerceAnalytics(),
  ]);

  const bundle = buildExecutiveOperationsBundle(recAnalytics, custAnalytics, comAnalytics);

  return <OperationsAlertDashboard report={bundle.alertReport} />;
}
