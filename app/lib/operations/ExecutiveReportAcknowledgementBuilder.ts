import type { ExecutiveReportDelivery } from "./ExecutiveReportDeliveryTypes";
import type {
  ExecutiveReportAcknowledgement,
  ExecutiveReportAcknowledgementEntry,
  ExecutiveReportAcknowledgementState,
} from "./ExecutiveReportAcknowledgementTypes";

function classifyAcknowledgementState(
  deliveryState: "delivering" | "delivered",
): ExecutiveReportAcknowledgementState {
  if (deliveryState === "delivered") return "acknowledged";
  return "acknowledging";
}

export function buildExecutiveReportAcknowledgement(
  delivery: ExecutiveReportDelivery,
): ExecutiveReportAcknowledgement {
  const records: ExecutiveReportAcknowledgementEntry[] = delivery.records.map(
    (entry): ExecutiveReportAcknowledgementEntry => ({
      delivery:    entry,
      state:       classifyAcknowledgementState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
