import type { ExecutiveReportCertification } from "./ExecutiveReportCertificationTypes";
import type {
  ExecutiveReportAuthorization,
  ExecutiveReportAuthorizationEntry,
  ExecutiveReportAuthorizationState,
} from "./ExecutiveReportAuthorizationTypes";

function classifyAuthorizationState(
  certificationState: "certifying" | "certified",
): ExecutiveReportAuthorizationState {
  if (certificationState === "certified") return "authorized";
  return "authorizing";
}

export function buildExecutiveReportAuthorization(
  certification: ExecutiveReportCertification,
): ExecutiveReportAuthorization {
  const records: ExecutiveReportAuthorizationEntry[] =
    certification.records.map(
      (entry): ExecutiveReportAuthorizationEntry => ({
        certification: entry,
        state:         classifyAuthorizationState(entry.state),
        generatedAt:   entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
