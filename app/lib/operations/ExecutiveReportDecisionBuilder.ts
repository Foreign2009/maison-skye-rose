import type { ExecutiveReportAction } from "./ExecutiveReportActionTypes";
import type {
  ExecutiveReportDecision,
  ExecutiveReportDecisionEntry,
  ExecutiveReportDecisionState,
} from "./ExecutiveReportDecisionTypes";

function classifyDecisionState(
  actionState: "plan" | "continue" | "execute",
): ExecutiveReportDecisionState {
  if (actionState === "plan")     return "pending";
  if (actionState === "continue") return "approved";
  return "implemented";
}

export function buildExecutiveReportDecision(
  action: ExecutiveReportAction,
): ExecutiveReportDecision {
  const records: ExecutiveReportDecisionEntry[] = action.records.map(
    (entry): ExecutiveReportDecisionEntry => ({
      action:      entry,
      state:       classifyDecisionState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
