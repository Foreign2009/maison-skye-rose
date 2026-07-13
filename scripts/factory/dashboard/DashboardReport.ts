/**
 * Knowledge Operations Dashboard — Report
 *
 * Thin wrapper that builds DashboardData from DashboardService
 * and provides a typed JSON export.
 *
 * Purpose: keeps index.ts clean and provides a stable report boundary
 * so future reporters (HTML, CSV) can import from a single point.
 */

import { assembleDashboard } from "./DashboardService";
import type { DashboardData } from "./DashboardMetrics";

export function buildDashboardReport(): DashboardData {
  return assembleDashboard();
}

export function toJSON(data: DashboardData): string {
  return JSON.stringify(data, null, 2);
}
