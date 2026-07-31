import type { ExecutiveReportVerificationEntry } from "./ExecutiveReportVerificationTypes";

export type ExecutiveReportValidationState =
  | "validating"
  | "validated";

export interface ExecutiveReportValidationEntry {
  readonly verification: ExecutiveReportVerificationEntry;
  readonly state:        ExecutiveReportValidationState;
  readonly generatedAt:  string;
}

export interface ExecutiveReportValidation {
  readonly records:     readonly ExecutiveReportValidationEntry[];
  readonly generatedAt: string;
}
