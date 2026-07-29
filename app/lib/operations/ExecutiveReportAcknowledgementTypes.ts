import type { ExecutiveReportDeliveryEntry } from "./ExecutiveReportDeliveryTypes";

export type ExecutiveReportAcknowledgementState = "acknowledging" | "acknowledged";

export interface ExecutiveReportAcknowledgementEntry {
  readonly delivery:    ExecutiveReportDeliveryEntry;
  readonly state:       ExecutiveReportAcknowledgementState;
  readonly generatedAt: string;
}

export interface ExecutiveReportAcknowledgement {
  readonly records:     readonly ExecutiveReportAcknowledgementEntry[];
  readonly generatedAt: string;
}
