/**
 * Knowledge Operations Dashboard — Logger
 *
 * Appends each dashboard invocation to dashboard-log.json.
 * Capped at 200 entries. Non-fatal on write failure.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const LOG_PATH    = path.join(process.cwd(), "scripts", "factory", "dashboard", "dashboard-log.json");
const MAX_ENTRIES = 200;

export interface DashboardLogEntry {
  timestamp: string;
  format:    "human" | "json";
  durationMs: number;
}

interface DashboardLogFile {
  version: string;
  entries: DashboardLogEntry[];
}

function readFile(): DashboardLogFile {
  if (!existsSync(LOG_PATH)) return { version: "1.0", entries: [] };
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf-8")) as DashboardLogFile;
  } catch {
    return { version: "1.0", entries: [] };
  }
}

export function logDashboardInvocation(entry: DashboardLogEntry): void {
  try {
    const file = readFile();
    file.entries.unshift(entry);
    if (file.entries.length > MAX_ENTRIES) file.entries = file.entries.slice(0, MAX_ENTRIES);
    writeFileSync(LOG_PATH, JSON.stringify(file, null, 2) + "\n", "utf-8");
  } catch {
    // Non-fatal
  }
}
