import type { ExecutiveReportDistributionEntry } from "./ExecutiveReportDistributionTypes";

export type ExecutiveReportDeliveryState = "delivering" | "delivered";

export interface ExecutiveReportDeliveryEntry {
  readonly distribution: ExecutiveReportDistributionEntry;
  readonly state:        ExecutiveReportDeliveryState;
  readonly generatedAt:  string;
}

export interface ExecutiveReportDelivery {
  readonly records:     readonly ExecutiveReportDeliveryEntry[];
  readonly generatedAt: string;
}
