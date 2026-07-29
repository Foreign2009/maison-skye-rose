import type { ExecutiveReportPublicationEntry } from "./ExecutiveReportPublicationTypes";

export type ExecutiveReportDistributionState = "distributing" | "distributed";

export interface ExecutiveReportDistributionEntry {
  readonly publication: ExecutiveReportPublicationEntry;
  readonly state:       ExecutiveReportDistributionState;
  readonly generatedAt: string;
}

export interface ExecutiveReportDistribution {
  readonly records:     readonly ExecutiveReportDistributionEntry[];
  readonly generatedAt: string;
}
