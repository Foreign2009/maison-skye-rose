import type { ExecutiveReportRatificationEntry } from "./ExecutiveReportRatificationTypes";

export type ExecutiveReportEndorsementState =
  | "endorsing"
  | "endorsed";

export interface ExecutiveReportEndorsementEntry {
  readonly ratification: ExecutiveReportRatificationEntry;
  readonly state:        ExecutiveReportEndorsementState;
  readonly generatedAt:  string;
}

export interface ExecutiveReportEndorsement {
  readonly records:     readonly ExecutiveReportEndorsementEntry[];
  readonly generatedAt: string;
}
