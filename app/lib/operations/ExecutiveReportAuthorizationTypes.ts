import type { ExecutiveReportCertificationEntry } from "./ExecutiveReportCertificationTypes";

export type ExecutiveReportAuthorizationState =
  | "authorizing"
  | "authorized";

export interface ExecutiveReportAuthorizationEntry {
  readonly certification: ExecutiveReportCertificationEntry;
  readonly state:         ExecutiveReportAuthorizationState;
  readonly generatedAt:   string;
}

export interface ExecutiveReportAuthorization {
  readonly records:     readonly ExecutiveReportAuthorizationEntry[];
  readonly generatedAt: string;
}
