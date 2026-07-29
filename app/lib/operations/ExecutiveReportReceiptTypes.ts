import type { ExecutiveReportAcknowledgementEntry } from "./ExecutiveReportAcknowledgementTypes";

export type ExecutiveReportReceiptState = "receiving" | "received";

export interface ExecutiveReportReceiptEntry {
  readonly acknowledgement: ExecutiveReportAcknowledgementEntry;
  readonly state:           ExecutiveReportReceiptState;
  readonly generatedAt:     string;
}

export interface ExecutiveReportReceipt {
  readonly records:     readonly ExecutiveReportReceiptEntry[];
  readonly generatedAt: string;
}
