import type { ExecutiveReportOutlook } from "./ExecutiveReportOutlookTypes";
import type {
  ExecutiveReportStrategy,
  ExecutiveReportStrategyEntry,
  ExecutiveReportStrategyState,
} from "./ExecutiveReportStrategyTypes";

function classifyStrategyState(
  outlookState: "monitor" | "healthy" | "expanding",
): ExecutiveReportStrategyState {
  if (outlookState === "monitor")  return "evaluate";
  if (outlookState === "healthy")  return "maintain";
  return "scale";
}

export function buildExecutiveReportStrategy(
  outlook: ExecutiveReportOutlook,
): ExecutiveReportStrategy {
  const records: ExecutiveReportStrategyEntry[] = outlook.records.map(
    (entry): ExecutiveReportStrategyEntry => ({
      outlook:     entry,
      state:       classifyStrategyState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
