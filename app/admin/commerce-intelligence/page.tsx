import type { Metadata }            from "next";
import { hasAdminSession }           from "@/app/lib/admin/session";
import { redirect }                  from "next/navigation";
import CommerceIntelligenceDashboard  from "@/app/admin/CommerceIntelligenceDashboard";
import { queryCommerceAnalytics }     from "@/app/lib/analytics/commerceAnalytics";
import { buildCommerceBehaviourReport }  from "@/app/lib/commerce/buildCommerceBehaviourReport";
import { buildCheckoutFunnelReport }     from "@/app/lib/commerce/CheckoutFunnelIntelligence";
import { buildProductPerformanceReport } from "@/app/lib/commerce/ProductPerformanceIntelligence";

export const metadata: Metadata = {
  title:  "Commerce Intelligence | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

export default async function CommerceIntelligencePage() {
  const isAuth      = await hasAdminSession();
  if (!isAuth) redirect("/admin");

  const analytics        = await queryCommerceAnalytics();
  const behaviourReport  = buildCommerceBehaviourReport(analytics);
  const funnelReport     = buildCheckoutFunnelReport(behaviourReport);
  const performanceReport = buildProductPerformanceReport(behaviourReport, funnelReport);

  return (
    <CommerceIntelligenceDashboard
      behaviourReport={behaviourReport}
      funnelReport={funnelReport}
      performanceReport={performanceReport}
    />
  );
}
