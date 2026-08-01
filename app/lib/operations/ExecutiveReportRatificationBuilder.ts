import type { ExecutiveReportAuthentication } from "./ExecutiveReportAuthenticationTypes";
import type {
  ExecutiveReportRatification,
  ExecutiveReportRatificationEntry,
  ExecutiveReportRatificationState,
} from "./ExecutiveReportRatificationTypes";

function classifyRatificationState(
  authenticationState: "authenticating" | "authenticated",
): ExecutiveReportRatificationState {
  if (authenticationState === "authenticated") return "ratified";
  return "ratifying";
}

export function buildExecutiveReportRatification(
  authentication: ExecutiveReportAuthentication,
): ExecutiveReportRatification {
  const records: ExecutiveReportRatificationEntry[] =
    authentication.records.map(
      (entry): ExecutiveReportRatificationEntry => ({
        authentication: entry,
        state:          classifyRatificationState(entry.state),
        generatedAt:    entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
