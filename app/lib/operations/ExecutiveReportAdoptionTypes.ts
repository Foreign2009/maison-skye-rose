import type { ExecutiveReportAcceptanceEntry } from "./ExecutiveReportAcceptanceTypes";

export type ExecutiveReportAdoptionState =
  | "adopting"
  | "adopted";

export interface ExecutiveReportAdoptionEntry {
  readonly acceptance:  ExecutiveReportAcceptanceEntry;
  readonly state:       ExecutiveReportAdoptionState;
  readonly generatedAt: string;
}

export interface ExecutiveReportAdoption {
  readonly records:     readonly ExecutiveReportAdoptionEntry[];
  readonly generatedAt: string;
}
