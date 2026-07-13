/**
 * Knowledge Lifecycle Manager — Logger
 *
 * Append-only audit trail for all lifecycle operations.
 * Persisted to lifecycle-log.json, capped at 500 entries.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const LOG_PATH    = path.join(process.cwd(), "scripts", "factory", "lifecycle", "lifecycle-log.json");
const MAX_ENTRIES = 500;

export interface LifecycleLogEntry {
  timestamp:    string;
  action:       string;
  details:      string;
}

interface LifecycleLogFile {
  version: string;
  entries: LifecycleLogEntry[];
}

function readFile(): LifecycleLogFile {
  if (!existsSync(LOG_PATH)) return { version: "1.0", entries: [] };
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf-8")) as LifecycleLogFile;
  } catch {
    return { version: "1.0", entries: [] };
  }
}

export function logLifecycleAction(action: string, details: string): void {
  try {
    const file = readFile();
    file.entries.push({ timestamp: new Date().toISOString(), action, details });
    if (file.entries.length > MAX_ENTRIES) file.entries = file.entries.slice(-MAX_ENTRIES);
    writeFileSync(LOG_PATH, JSON.stringify(file, null, 2) + "\n", "utf-8");
  } catch {
    // Non-fatal
  }
}
