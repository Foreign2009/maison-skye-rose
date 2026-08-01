import type { ExecutiveReportEndorsement } from "./ExecutiveReportEndorsementTypes";
import type {
  ExecutiveReportAcceptance,
  ExecutiveReportAcceptanceEntry,
  ExecutiveReportAcceptanceState,
} from "./ExecutiveReportAcceptanceTypes";

function classifyAcceptanceState(
  endorsementState: "endorsing" | "endorsed",
): ExecutiveReportAcceptanceState {
  if (endorsementState === "endorsed") return "accepted";
  return "accepting";
}

export function buildExecutiveReportAcceptance(
  endorsement: ExecutiveReportEndorsement,
): ExecutiveReportAcceptance {
  const records: ExecutiveReportAcceptanceEntry[] =
    endorsement.records.map(
      (entry): ExecutiveReportAcceptanceEntry => ({
        endorsement: entry,
        state:       classifyAcceptanceState(entry.state),
        generatedAt: entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
