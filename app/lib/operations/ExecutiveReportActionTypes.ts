import type { ExecutiveReportStrategyEntry } from "./ExecutiveReportStrategyTypes";

export type ExecutiveReportActionState = "plan" | "continue" | "execute";

export interface ExecutiveReportActionEntry {
  readonly strategy:    ExecutiveReportStrategyEntry;
  readonly state:       ExecutiveReportActionState;
  readonly generatedAt: string;
}

export interface ExecutiveReportAction {
  readonly records:     readonly ExecutiveReportActionEntry[];
  readonly generatedAt: string;
}
