import type { ExecutiveReportDistribution } from "./ExecutiveReportDistributionTypes";
import type {
  ExecutiveReportDelivery,
  ExecutiveReportDeliveryEntry,
  ExecutiveReportDeliveryState,
} from "./ExecutiveReportDeliveryTypes";

function classifyDeliveryState(
  distributionState: "distributing" | "distributed",
): ExecutiveReportDeliveryState {
  if (distributionState === "distributed") return "delivered";
  return "delivering";
}

export function buildExecutiveReportDelivery(
  distribution: ExecutiveReportDistribution,
): ExecutiveReportDelivery {
  const records: ExecutiveReportDeliveryEntry[] = distribution.records.map(
    (entry): ExecutiveReportDeliveryEntry => ({
      distribution: entry,
      state:        classifyDeliveryState(entry.state),
      generatedAt:  entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
