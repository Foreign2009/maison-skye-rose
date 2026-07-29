import type { ExecutiveReportPublication } from "./ExecutiveReportPublicationTypes";
import type {
  ExecutiveReportDistribution,
  ExecutiveReportDistributionEntry,
  ExecutiveReportDistributionState,
} from "./ExecutiveReportDistributionTypes";

function classifyDistributionState(
  publicationState: "publishing" | "published",
): ExecutiveReportDistributionState {
  if (publicationState === "published") return "distributed";
  return "distributing";
}

export function buildExecutiveReportDistribution(
  publication: ExecutiveReportPublication,
): ExecutiveReportDistribution {
  const records: ExecutiveReportDistributionEntry[] = publication.records.map(
    (entry): ExecutiveReportDistributionEntry => ({
      publication: entry,
      state:       classifyDistributionState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
