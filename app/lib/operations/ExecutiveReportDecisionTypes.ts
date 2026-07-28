import type { ExecutiveReportActionEntry } from "./ExecutiveReportActionTypes";

export type ExecutiveReportDecisionState = "pending" | "approved" | "implemented";

export interface ExecutiveReportDecisionEntry {
  readonly action:      ExecutiveReportActionEntry;
  readonly state:       ExecutiveReportDecisionState;
  readonly generatedAt: string;
}

export interface ExecutiveReportDecision {
  readonly records:     readonly ExecutiveReportDecisionEntry[];
  readonly generatedAt: string;
}
