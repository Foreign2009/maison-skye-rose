import type { ExecutiveReportReceipt } from "./ExecutiveReportReceiptTypes";
import type {
  ExecutiveReportConfirmation,
  ExecutiveReportConfirmationEntry,
  ExecutiveReportConfirmationState,
} from "./ExecutiveReportConfirmationTypes";

function classifyConfirmationState(
  receiptState: "receiving" | "received",
): ExecutiveReportConfirmationState {
  if (receiptState === "received") return "confirmed";
  return "confirming";
}

export function buildExecutiveReportConfirmation(
  receipt: ExecutiveReportReceipt,
): ExecutiveReportConfirmation {
  const records: ExecutiveReportConfirmationEntry[] = receipt.records.map(
    (entry): ExecutiveReportConfirmationEntry => ({
      receipt:     entry,
      state:       classifyConfirmationState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
