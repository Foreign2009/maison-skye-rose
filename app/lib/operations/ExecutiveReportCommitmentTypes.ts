import type { ExecutiveReportAdoptionEntry } from "./ExecutiveReportAdoptionTypes";

export type ExecutiveReportCommitmentState =
  | "committing"
  | "committed";

export interface ExecutiveReportCommitmentEntry {
  readonly adoption:    ExecutiveReportAdoptionEntry;
  readonly state:       ExecutiveReportCommitmentState;
  readonly generatedAt: string;
}

export interface ExecutiveReportCommitment {
  readonly records:     readonly ExecutiveReportCommitmentEntry[];
  readonly generatedAt: string;
}
