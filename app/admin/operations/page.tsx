import type { Metadata }                   from "next";
import { hasAdminSession }                 from "@/app/lib/admin/session";
import { redirect }                        from "next/navigation";
import UnifiedOperationsConsole            from "@/app/admin/UnifiedOperationsConsole";
import { queryRecommendationAnalytics }    from "@/app/lib/analytics/recommendationAnalytics";
import { queryCustomerAnalytics }          from "@/app/lib/analytics/customerAnalytics";
import { queryCommerceAnalytics }          from "@/app/lib/analytics/commerceAnalytics";
import { buildExecutiveOperationsBundle }  from "@/app/lib/operations/ExecutiveOperationsPipeline";

export const metadata: Metadata = {
  title:  "Unified Operations Console | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

export default async function UnifiedOperationsPage() {
  const isAuth      = await hasAdminSession();
  if (!isAuth) redirect("/admin");

  const [recAnalytics, custAnalytics, comAnalytics] = await Promise.all([
    queryRecommendationAnalytics(),
    queryCustomerAnalytics(),
    queryCommerceAnalytics(),
  ]);

  const bundle = buildExecutiveOperationsBundle(recAnalytics, custAnalytics, comAnalytics);

  return <UnifiedOperationsConsole operations={bundle.operations} briefing={bundle.execBriefing} />;
}
