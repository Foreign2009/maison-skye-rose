import type { Metadata }                   from "next";
import { hasAdminSession }                 from "@/app/lib/admin/session";
import { redirect }                        from "next/navigation";
import ExecutiveOperationsDigestDashboard  from "@/app/admin/ExecutiveOperationsDigestDashboard";
import { queryRecommendationAnalytics }    from "@/app/lib/analytics/recommendationAnalytics";
import { queryCustomerAnalytics }          from "@/app/lib/analytics/customerAnalytics";
import { queryCommerceAnalytics }          from "@/app/lib/analytics/commerceAnalytics";
import { buildExecutiveOperationsBundle }  from "@/app/lib/operations/ExecutiveOperationsPipeline";

export const metadata: Metadata = {
  title:  "Executive Operations Digest | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

export default async function ExecutiveDigestPage() {
  const isAuth      = await hasAdminSession();
  if (!isAuth) redirect("/admin");

  const [recAnalytics, custAnalytics, comAnalytics] = await Promise.all([
    queryRecommendationAnalytics(),
    queryCustomerAnalytics(),
    queryCommerceAnalytics(),
  ]);

  const bundle = buildExecutiveOperationsBundle(recAnalytics, custAnalytics, comAnalytics);

  return <ExecutiveOperationsDigestDashboard digest={bundle.digest} />;
}
