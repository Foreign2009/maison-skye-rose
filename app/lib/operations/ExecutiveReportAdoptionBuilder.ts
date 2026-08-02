import type { ExecutiveReportAcceptance } from "./ExecutiveReportAcceptanceTypes";
import type {
  ExecutiveReportAdoption,
  ExecutiveReportAdoptionEntry,
  ExecutiveReportAdoptionState,
} from "./ExecutiveReportAdoptionTypes";

function classifyAdoptionState(
  acceptanceState: "accepting" | "accepted",
): ExecutiveReportAdoptionState {
  if (acceptanceState === "accepted") return "adopted";
  return "adopting";
}

export function buildExecutiveReportAdoption(
  acceptance: ExecutiveReportAcceptance,
): ExecutiveReportAdoption {
  const records: ExecutiveReportAdoptionEntry[] =
    acceptance.records.map(
      (entry): ExecutiveReportAdoptionEntry => ({
        acceptance:  entry,
        state:       classifyAdoptionState(entry.state),
        generatedAt: entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
