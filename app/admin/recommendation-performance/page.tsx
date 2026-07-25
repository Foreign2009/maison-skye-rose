import type { Metadata } from "next";
import { cookies }       from "next/headers";
import { createHash }    from "crypto";
import { redirect }      from "next/navigation";
import RecommendationPerformanceDashboard from "@/app/admin/RecommendationPerformanceDashboard";
import { queryRecommendationAnalytics }   from "@/app/lib/analytics/recommendationAnalytics";
import { buildSignalCalibrationReport }   from "@/app/lib/customer/signals/SignalCalibration";
import { buildRecommendationInsights }    from "@/app/lib/customer/recommendations/RecommendationInsights";

export const metadata: Metadata = {
  title:  "Recommendation Performance | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

export default async function RecommendationPerformancePage() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();
  if (!isAuth) redirect("/admin");

  const analytics    = await queryRecommendationAnalytics();
  const signals      = buildSignalCalibrationReport();
  const insightReport = buildRecommendationInsights(analytics, signals);

  return (
    <RecommendationPerformanceDashboard
      generatedAt={new Date().toISOString()}
      insightReport={insightReport}
    />
  );
}
