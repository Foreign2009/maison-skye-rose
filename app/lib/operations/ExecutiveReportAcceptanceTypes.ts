import type { ExecutiveReportEndorsementEntry } from "./ExecutiveReportEndorsementTypes";

export type ExecutiveReportAcceptanceState =
  | "accepting"
  | "accepted";

export interface ExecutiveReportAcceptanceEntry {
  readonly endorsement: ExecutiveReportEndorsementEntry;
  readonly state:       ExecutiveReportAcceptanceState;
  readonly generatedAt: string;
}

export interface ExecutiveReportAcceptance {
  readonly records:     readonly ExecutiveReportAcceptanceEntry[];
  readonly generatedAt: string;
}
