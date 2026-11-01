import type { Metadata }           from "next";
import { hasAdminSession }          from "@/app/lib/admin/session";
import { redirect }                 from "next/navigation";
import CustomerIntelligenceDashboard from "@/app/admin/CustomerIntelligenceDashboard";
import { queryCustomerAnalytics }    from "@/app/lib/analytics/customerAnalytics";
import { buildSignalCalibrationReport } from "@/app/lib/customer/signals/SignalCalibration";
import { buildCustomerBehaviourReport } from "@/app/lib/customer/behaviour/buildCustomerBehaviourReport";
import { buildCustomerJourneyReport }   from "@/app/lib/customer/behaviour/CustomerJourneyAnalytics";
import { buildCustomerSegmentReport }   from "@/app/lib/customer/behaviour/CustomerSegmentation";

export const metadata: Metadata = {
  title:  "Customer Intelligence | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

export default async function CustomerIntelligencePage() {
  const isAuth      = await hasAdminSession();
  if (!isAuth) redirect("/admin");

  const analytics      = await queryCustomerAnalytics();
  const signals        = buildSignalCalibrationReport();
  const behaviourReport = buildCustomerBehaviourReport(analytics, signals);
  const journeyReport   = buildCustomerJourneyReport(behaviourReport);
  const segmentReport   = buildCustomerSegmentReport(behaviourReport, journeyReport);

  return (
    <CustomerIntelligenceDashboard
      behaviourReport={behaviourReport}
      journeyReport={journeyReport}
      segmentReport={segmentReport}
    />
  );
}
