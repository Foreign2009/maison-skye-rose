/**
 * Knowledge Operations Dashboard — CLI Entry Point
 *
 * Usage:
 *   npm run mkc:dashboard              — human-readable terminal dashboard
 *   npm run mkc:dashboard -- --json    — machine-readable JSON
 *   npm run mkc:dashboard -- --help    — usage
 */

import { buildDashboardReport, toJSON } from "./DashboardReport";
import { renderDashboard }              from "./DashboardRenderer";
import { logDashboardInvocation }       from "./DashboardLogger";

const args   = process.argv.slice(2);
const isJSON = args.includes("--json");
const isHelp = args.includes("--help") || args.includes("-h");

if (isHelp) {
  console.log(`
Knowledge Operations Dashboard

  npm run mkc:dashboard              Human-readable dashboard
  npm run mkc:dashboard -- --json    Machine-readable JSON
`);
  process.exit(0);
}

const t0   = Date.now();
const data = buildDashboardReport();

if (isJSON) {
  console.log(toJSON(data));
} else {
  renderDashboard(data);
}

logDashboardInvocation({
  timestamp:  data.generatedAt,
  format:     isJSON ? "json" : "human",
  durationMs: Date.now() - t0,
});
