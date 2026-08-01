import type { ExecutiveReportRatification } from "./ExecutiveReportRatificationTypes";
import type {
  ExecutiveReportEndorsement,
  ExecutiveReportEndorsementEntry,
  ExecutiveReportEndorsementState,
} from "./ExecutiveReportEndorsementTypes";

function classifyEndorsementState(
  ratificationState: "ratifying" | "ratified",
): ExecutiveReportEndorsementState {
  if (ratificationState === "ratified") return "endorsed";
  return "endorsing";
}

export function buildExecutiveReportEndorsement(
  ratification: ExecutiveReportRatification,
): ExecutiveReportEndorsement {
  const records: ExecutiveReportEndorsementEntry[] =
    ratification.records.map(
      (entry): ExecutiveReportEndorsementEntry => ({
        ratification: entry,
        state:        classifyEndorsementState(entry.state),
        generatedAt:  entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
