import type { ExecutiveReportReceiptEntry } from "./ExecutiveReportReceiptTypes";

export type ExecutiveReportConfirmationState = "confirming" | "confirmed";

export interface ExecutiveReportConfirmationEntry {
  readonly receipt:     ExecutiveReportReceiptEntry;
  readonly state:       ExecutiveReportConfirmationState;
  readonly generatedAt: string;
}

export interface ExecutiveReportConfirmation {
  readonly records:     readonly ExecutiveReportConfirmationEntry[];
  readonly generatedAt: string;
}
