import type { ExecutiveReportAdoption } from "./ExecutiveReportAdoptionTypes";
import type {
  ExecutiveReportCommitment,
  ExecutiveReportCommitmentEntry,
  ExecutiveReportCommitmentState,
} from "./ExecutiveReportCommitmentTypes";

function classifyCommitmentState(
  adoptionState: "adopting" | "adopted",
): ExecutiveReportCommitmentState {
  if (adoptionState === "adopted") return "committed";
  return "committing";
}

export function buildExecutiveReportCommitment(
  adoption: ExecutiveReportAdoption,
): ExecutiveReportCommitment {
  const records: ExecutiveReportCommitmentEntry[] =
    adoption.records.map(
      (entry): ExecutiveReportCommitmentEntry => ({
        adoption:    entry,
        state:       classifyCommitmentState(entry.state),
        generatedAt: entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
