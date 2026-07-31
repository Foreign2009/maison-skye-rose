import type { ExecutiveReportValidationEntry } from "./ExecutiveReportValidationTypes";

export type ExecutiveReportCertificationState =
  | "certifying"
  | "certified";

export interface ExecutiveReportCertificationEntry {
  readonly validation:  ExecutiveReportValidationEntry;
  readonly state:       ExecutiveReportCertificationState;
  readonly generatedAt: string;
}

export interface ExecutiveReportCertification {
  readonly records:     readonly ExecutiveReportCertificationEntry[];
  readonly generatedAt: string;
}
