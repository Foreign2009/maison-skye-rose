import type { ExecutiveReportApprovalEntry } from "./ExecutiveReportApprovalTypes";

export type ExecutiveReportExecutionState = "queued" | "executing" | "executed";

export interface ExecutiveReportExecutionEntry {
  readonly approval:    ExecutiveReportApprovalEntry;
  readonly state:       ExecutiveReportExecutionState;
  readonly generatedAt: string;
}

export interface ExecutiveReportExecution {
  readonly records:     readonly ExecutiveReportExecutionEntry[];
  readonly generatedAt: string;
}
