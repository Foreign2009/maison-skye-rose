import type { Metadata }                   from "next";
import { cookies }                         from "next/headers";
import { createHash }                      from "crypto";
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

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

export default async function ExecutiveDigestPage() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();
  if (!isAuth) redirect("/admin");

  const [recAnalytics, custAnalytics, comAnalytics] = await Promise.all([
    queryRecommendationAnalytics(),
    queryCustomerAnalytics(),
    queryCommerceAnalytics(),
  ]);

  const bundle = buildExecutiveOperationsBundle(recAnalytics, custAnalytics, comAnalytics);

  return <ExecutiveOperationsDigestDashboard digest={bundle.digest} />;
}
