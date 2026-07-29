import type { ExecutiveReportAcknowledgement } from "./ExecutiveReportAcknowledgementTypes";
import type {
  ExecutiveReportReceipt,
  ExecutiveReportReceiptEntry,
  ExecutiveReportReceiptState,
} from "./ExecutiveReportReceiptTypes";

function classifyReceiptState(
  acknowledgementState: "acknowledging" | "acknowledged",
): ExecutiveReportReceiptState {
  if (acknowledgementState === "acknowledged") return "received";
  return "receiving";
}

export function buildExecutiveReportReceipt(
  acknowledgement: ExecutiveReportAcknowledgement,
): ExecutiveReportReceipt {
  const records: ExecutiveReportReceiptEntry[] = acknowledgement.records.map(
    (entry): ExecutiveReportReceiptEntry => ({
      acknowledgement: entry,
      state:           classifyReceiptState(entry.state),
      generatedAt:     entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
