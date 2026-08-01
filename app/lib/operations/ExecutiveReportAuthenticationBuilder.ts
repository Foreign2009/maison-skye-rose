import type { ExecutiveReportAuthorization } from "./ExecutiveReportAuthorizationTypes";
import type {
  ExecutiveReportAuthentication,
  ExecutiveReportAuthenticationEntry,
  ExecutiveReportAuthenticationState,
} from "./ExecutiveReportAuthenticationTypes";

function classifyAuthenticationState(
  authorizationState: "authorizing" | "authorized",
): ExecutiveReportAuthenticationState {
  if (authorizationState === "authorized") return "authenticated";
  return "authenticating";
}

export function buildExecutiveReportAuthentication(
  authorization: ExecutiveReportAuthorization,
): ExecutiveReportAuthentication {
  const records: ExecutiveReportAuthenticationEntry[] =
    authorization.records.map(
      (entry): ExecutiveReportAuthenticationEntry => ({
        authorization: entry,
        state:         classifyAuthenticationState(entry.state),
        generatedAt:   entry.generatedAt,
      }),
    );

  return {
    records,
    generatedAt: new Date().toISOString(),
  };
}
