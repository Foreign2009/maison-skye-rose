import type { ExecutiveReportConfirmation } from "./ExecutiveReportConfirmationTypes";
import type {
  ExecutiveReportVerification,
  ExecutiveReportVerificationEntry,
  ExecutiveReportVerificationState,
} from "./ExecutiveReportVerificationTypes";

function classifyVerificationState(
  confirmationState: "confirming" | "confirmed",
): ExecutiveReportVerificationState {
  if (confirmationState === "confirmed") return "verified";
  return "verifying";
}

export function buildExecutiveReportVerification(
  confirmation: ExecutiveReportConfirmation,
): ExecutiveReportVerification {
  const records: ExecutiveReportVerificationEntry[] =
    confirmation.records.map(
      (entry): ExecutiveReportVerificationEntry => ({
        confirmation: entry,
        state:        classifyVerificationState(entry.state),
        generatedAt:  entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
