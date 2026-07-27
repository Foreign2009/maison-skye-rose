import type { ExecutiveReportTrend } from "./ExecutiveReportTrendTypes";
import type {
  ExecutiveReportForecast,
  ExecutiveReportForecastEntry,
  ExecutiveReportForecastState,
} from "./ExecutiveReportForecastTypes";

function classifyForecastState(
  trendState: "emerging" | "stable" | "improving",
): ExecutiveReportForecastState {
  if (trendState === "emerging")  return "watch";
  if (trendState === "stable")    return "steady";
  return "accelerating";
}

export function buildExecutiveReportForecast(
  trend: ExecutiveReportTrend,
): ExecutiveReportForecast {
  const records: ExecutiveReportForecastEntry[] = trend.records.map(
    (entry): ExecutiveReportForecastEntry => ({
      trend:       entry,
      state:       classifyForecastState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
