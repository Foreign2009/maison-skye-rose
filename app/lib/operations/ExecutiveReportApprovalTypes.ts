import type { ExecutiveReportDecisionEntry } from "./ExecutiveReportDecisionTypes";

export type ExecutiveReportApprovalState = "awaiting" | "approved" | "completed";

export interface ExecutiveReportApprovalEntry {
  readonly decision:    ExecutiveReportDecisionEntry;
  readonly state:       ExecutiveReportApprovalState;
  readonly generatedAt: string;
}

export interface ExecutiveReportApproval {
  readonly records:     readonly ExecutiveReportApprovalEntry[];
  readonly generatedAt: string;
}
