import type { ExecutiveReportCompletion } from "./ExecutiveReportCompletionTypes";
import type {
  ExecutiveReportPublication,
  ExecutiveReportPublicationEntry,
  ExecutiveReportPublicationState,
} from "./ExecutiveReportPublicationTypes";

function classifyPublicationState(
  completionState: "scheduled" | "completing" | "completed",
): ExecutiveReportPublicationState {
  if (completionState === "completed") return "published";
  return "publishing";
}

export function buildExecutiveReportPublication(
  completion: ExecutiveReportCompletion,
): ExecutiveReportPublication {
  const records: ExecutiveReportPublicationEntry[] = completion.records.map(
    (entry): ExecutiveReportPublicationEntry => ({
      completion:  entry,
      state:       classifyPublicationState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
