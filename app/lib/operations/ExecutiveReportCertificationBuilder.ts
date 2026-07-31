import type { ExecutiveReportValidation } from "./ExecutiveReportValidationTypes";
import type {
  ExecutiveReportCertification,
  ExecutiveReportCertificationEntry,
  ExecutiveReportCertificationState,
} from "./ExecutiveReportCertificationTypes";

function classifyCertificationState(
  validationState: "validating" | "validated",
): ExecutiveReportCertificationState {
  if (validationState === "validated") return "certified";
  return "certifying";
}

export function buildExecutiveReportCertification(
  validation: ExecutiveReportValidation,
): ExecutiveReportCertification {
  const records: ExecutiveReportCertificationEntry[] =
    validation.records.map(
      (entry): ExecutiveReportCertificationEntry => ({
        validation:  entry,
        state:       classifyCertificationState(entry.state),
        generatedAt: entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
