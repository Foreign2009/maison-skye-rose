import type { ExecutiveReportApproval } from "./ExecutiveReportApprovalTypes";
import type {
  ExecutiveReportExecution,
  ExecutiveReportExecutionEntry,
  ExecutiveReportExecutionState,
} from "./ExecutiveReportExecutionTypes";

function classifyExecutionState(
  approvalState: "awaiting" | "approved" | "completed",
): ExecutiveReportExecutionState {
  if (approvalState === "awaiting")  return "queued";
  if (approvalState === "approved")  return "executing";
  return "executed";
}

export function buildExecutiveReportExecution(
  approval: ExecutiveReportApproval,
): ExecutiveReportExecution {
  const records: ExecutiveReportExecutionEntry[] = approval.records.map(
    (entry): ExecutiveReportExecutionEntry => ({
      approval:    entry,
      state:       classifyExecutionState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
