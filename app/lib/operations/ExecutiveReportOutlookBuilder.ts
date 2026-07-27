import type { ExecutiveReportForecast } from "./ExecutiveReportForecastTypes";
import type {
  ExecutiveReportOutlook,
  ExecutiveReportOutlookEntry,
  ExecutiveReportOutlookState,
} from "./ExecutiveReportOutlookTypes";

function classifyOutlookState(
  forecastState: "watch" | "steady" | "accelerating",
): ExecutiveReportOutlookState {
  if (forecastState === "watch")  return "monitor";
  if (forecastState === "steady") return "healthy";
  return "expanding";
}

export function buildExecutiveReportOutlook(
  forecast: ExecutiveReportForecast,
): ExecutiveReportOutlook {
  const records: ExecutiveReportOutlookEntry[] = forecast.records.map(
    (entry): ExecutiveReportOutlookEntry => ({
      forecast:    entry,
      state:       classifyOutlookState(entry.state),
      generatedAt: entry.generatedAt,
    }),
  );
  return { records, generatedAt: new Date().toISOString() };
}
