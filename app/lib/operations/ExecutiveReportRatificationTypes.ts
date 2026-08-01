import type { ExecutiveReportAuthenticationEntry } from "./ExecutiveReportAuthenticationTypes";

export type ExecutiveReportRatificationState =
  | "ratifying"
  | "ratified";

export interface ExecutiveReportRatificationEntry {
  readonly authentication: ExecutiveReportAuthenticationEntry;
  readonly state:          ExecutiveReportRatificationState;
  readonly generatedAt:    string;
}

export interface ExecutiveReportRatification {
  readonly records:     readonly ExecutiveReportRatificationEntry[];
  readonly generatedAt: string;
}
