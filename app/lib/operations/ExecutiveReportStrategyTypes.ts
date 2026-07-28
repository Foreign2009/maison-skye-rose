import type { ExecutiveReportOutlookEntry } from "./ExecutiveReportOutlookTypes";

export type ExecutiveReportStrategyState = "evaluate" | "maintain" | "scale";

export interface ExecutiveReportStrategyEntry {
  readonly outlook:     ExecutiveReportOutlookEntry;
  readonly state:       ExecutiveReportStrategyState;
  readonly generatedAt: string;
}

export interface ExecutiveReportStrategy {
  readonly records:     readonly ExecutiveReportStrategyEntry[];
  readonly generatedAt: string;
}
