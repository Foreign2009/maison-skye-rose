import type { ExecutiveReportVerification } from "./ExecutiveReportVerificationTypes";
import type {
  ExecutiveReportValidation,
  ExecutiveReportValidationEntry,
  ExecutiveReportValidationState,
} from "./ExecutiveReportValidationTypes";

function classifyValidationState(
  verificationState: "verifying" | "verified",
): ExecutiveReportValidationState {
  if (verificationState === "verified") return "validated";
  return "validating";
}

export function buildExecutiveReportValidation(
  verification: ExecutiveReportVerification,
): ExecutiveReportValidation {
  const records: ExecutiveReportValidationEntry[] =
    verification.records.map(
      (entry): ExecutiveReportValidationEntry => ({
        verification: entry,
        state:        classifyValidationState(entry.state),
        generatedAt:  entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
