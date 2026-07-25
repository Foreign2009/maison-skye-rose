import type { Metadata }            from "next";
import { cookies }                   from "next/headers";
import { createHash }                from "crypto";
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

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

export default async function CommerceIntelligencePage() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();
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
