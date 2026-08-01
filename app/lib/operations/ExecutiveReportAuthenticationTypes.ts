import type { ExecutiveReportAuthorizationEntry } from "./ExecutiveReportAuthorizationTypes";

export type ExecutiveReportAuthenticationState =
  | "authenticating"
  | "authenticated";

export interface ExecutiveReportAuthenticationEntry {
  readonly authorization: ExecutiveReportAuthorizationEntry;
  readonly state:         ExecutiveReportAuthenticationState;
  readonly generatedAt:   string;
}

export interface ExecutiveReportAuthentication {
  readonly records:     readonly ExecutiveReportAuthenticationEntry[];
  readonly generatedAt: string;
}
