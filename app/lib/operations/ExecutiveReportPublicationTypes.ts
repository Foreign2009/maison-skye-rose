import type { ExecutiveReportCompletionEntry } from "./ExecutiveReportCompletionTypes";

export type ExecutiveReportPublicationState = "publishing" | "published";

export interface ExecutiveReportPublicationEntry {
  readonly completion:  ExecutiveReportCompletionEntry;
  readonly state:       ExecutiveReportPublicationState;
  readonly generatedAt: string;
}

export interface ExecutiveReportPublication {
  readonly records:     readonly ExecutiveReportPublicationEntry[];
  readonly generatedAt: string;
}
