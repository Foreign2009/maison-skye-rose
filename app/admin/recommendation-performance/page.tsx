import type { Metadata } from "next";
import { hasAdminSession } from "@/app/lib/admin/session";
import { redirect }      from "next/navigation";
import RecommendationPerformanceDashboard from "@/app/admin/RecommendationPerformanceDashboard";
import { queryRecommendationAnalytics }   from "@/app/lib/analytics/recommendationAnalytics";
import { buildSignalCalibrationReport }   from "@/app/lib/customer/signals/SignalCalibration";
import { buildRecommendationInsights }    from "@/app/lib/customer/recommendations/RecommendationInsights";

export const metadata: Metadata = {
  title:  "Recommendation Performance | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

export default async function RecommendationPerformancePage() {
  const isAuth      = await hasAdminSession();
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
