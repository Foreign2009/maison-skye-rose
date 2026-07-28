import type { ExecutiveReportStrategy } from "./ExecutiveReportStrategyTypes";
import type {
  ExecutiveReportAction,
  ExecutiveReportActionEntry,
  ExecutiveReportActionState,
} from "./ExecutiveReportActionTypes";

function classifyActionState(
  strategyState: "evaluate" | "maintain" | "scale",
): ExecutiveReportActionState {
  if (strategyState === "evaluate") return "plan";
  if (strategyState === "maintain") return "continue";
  return "execute";
}

export function buildExecutiveReportAction(
  strategy: ExecutiveReportStrategy,
): ExecutiveReportAction {
  const records: ExecutiveReportActionEntry[] = strategy.records.map(
    (entry): ExecutiveReportActionEntry => ({
      strategy:    entry,
      state:       classifyActionState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
