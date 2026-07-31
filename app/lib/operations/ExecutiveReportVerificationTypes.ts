import type { ExecutiveReportConfirmationEntry } from "./ExecutiveReportConfirmationTypes";

export type ExecutiveReportVerificationState =
  | "verifying"
  | "verified";

export interface ExecutiveReportVerificationEntry {
  readonly confirmation: ExecutiveReportConfirmationEntry;
  readonly state:        ExecutiveReportVerificationState;
  readonly generatedAt:  string;
}

export interface ExecutiveReportVerification {
  readonly records:     readonly ExecutiveReportVerificationEntry[];
  readonly generatedAt: string;
}
