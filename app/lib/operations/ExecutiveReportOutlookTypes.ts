import type { ExecutiveReportForecastEntry } from "./ExecutiveReportForecastTypes";

export type ExecutiveReportOutlookState = "monitor" | "healthy" | "expanding";

export interface ExecutiveReportOutlookEntry {
  readonly forecast:    ExecutiveReportForecastEntry;
  readonly state:       ExecutiveReportOutlookState;
  readonly generatedAt: string;
}

export interface ExecutiveReportOutlook {
  readonly records:     readonly ExecutiveReportOutlookEntry[];
  readonly generatedAt: string;
}
