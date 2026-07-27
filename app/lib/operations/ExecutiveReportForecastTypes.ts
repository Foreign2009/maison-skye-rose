import type { ExecutiveReportTrendEntry } from "./ExecutiveReportTrendTypes";

export type ExecutiveReportForecastState = "watch" | "steady" | "accelerating";

export interface ExecutiveReportForecastEntry {
  readonly trend:       ExecutiveReportTrendEntry;
  readonly state:       ExecutiveReportForecastState;
  readonly generatedAt: string;
}

export interface ExecutiveReportForecast {
  readonly records:     readonly ExecutiveReportForecastEntry[];
  readonly generatedAt: string;
}
