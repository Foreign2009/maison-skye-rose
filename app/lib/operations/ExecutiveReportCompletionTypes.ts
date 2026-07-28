import type { ExecutiveReportExecutionEntry } from "./ExecutiveReportExecutionTypes";

export type ExecutiveReportCompletionState = "scheduled" | "completing" | "completed";

export interface ExecutiveReportCompletionEntry {
  readonly execution:   ExecutiveReportExecutionEntry;
  readonly state:       ExecutiveReportCompletionState;
  readonly generatedAt: string;
}

export interface ExecutiveReportCompletion {
  readonly records:     readonly ExecutiveReportCompletionEntry[];
  readonly generatedAt: string;
}
