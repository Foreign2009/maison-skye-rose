import type { ExecutiveReportExecution } from "./ExecutiveReportExecutionTypes";
import type {
  ExecutiveReportCompletion,
  ExecutiveReportCompletionEntry,
  ExecutiveReportCompletionState,
} from "./ExecutiveReportCompletionTypes";

function classifyCompletionState(
  executionState: "queued" | "executing" | "executed",
): ExecutiveReportCompletionState {
  if (executionState === "queued")    return "scheduled";
  if (executionState === "executing") return "completing";
  return "completed";
}

export function buildExecutiveReportCompletion(
  execution: ExecutiveReportExecution,
): ExecutiveReportCompletion {
  const records: ExecutiveReportCompletionEntry[] = execution.records.map(
    (entry): ExecutiveReportCompletionEntry => ({
      execution:   entry,
      state:       classifyCompletionState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
