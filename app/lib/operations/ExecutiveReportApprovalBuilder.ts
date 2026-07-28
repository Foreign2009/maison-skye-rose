import type { ExecutiveReportDecision } from "./ExecutiveReportDecisionTypes";
import type {
  ExecutiveReportApproval,
  ExecutiveReportApprovalEntry,
  ExecutiveReportApprovalState,
} from "./ExecutiveReportApprovalTypes";

function classifyApprovalState(
  decisionState: "pending" | "approved" | "implemented",
): ExecutiveReportApprovalState {
  if (decisionState === "pending")     return "awaiting";
  if (decisionState === "approved")    return "approved";
  return "completed";
}

export function buildExecutiveReportApproval(
  decision: ExecutiveReportDecision,
): ExecutiveReportApproval {
  const records: ExecutiveReportApprovalEntry[] = decision.records.map(
    (entry): ExecutiveReportApprovalEntry => ({
      decision:    entry,
      state:       classifyApprovalState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
