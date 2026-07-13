/**
 * Knowledge Factory — Promotion Logger
 *
 * Append-only audit trail for all promotion pipeline actions.
 * Persisted to scripts/factory/promotion/promotion-log.json.
 * Capped at 1,000 entries to prevent unbounded growth.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const LOG_PATH    = path.join(process.cwd(), "scripts", "factory", "promotion", "promotion-log.json");
const MAX_ENTRIES = 1_000;

export interface PromotionLogEntry {
  timestamp: string;
  action:    string;
  slug:      string;
  operator:  string;
  details:   string;
}

interface PromotionLogFile {
  version: string;
  entries: PromotionLogEntry[];
}

function readLogFile(): PromotionLogFile {
  if (!existsSync(LOG_PATH)) return { version: "1.0", entries: [] };
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf-8")) as PromotionLogFile;
  } catch {
    return { version: "1.0", entries: [] };
  }
}

export function logPromotionAction(
  action:   string,
  slug:     string,
  operator: string,
  details:  string,
): void {
  try {
    const log = readLogFile();
    log.entries.push({
      timestamp: new Date().toISOString(),
      action,
      slug,
      operator,
      details,
    });
    if (log.entries.length > MAX_ENTRIES) {
      log.entries = log.entries.slice(-MAX_ENTRIES);
    }
    writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + "\n", "utf-8");
  } catch (err) {
    console.warn(`[promote] Warning: could not write promotion-log.json — ${err instanceof Error ? err.message : err}`);
  }
}

export function readPromotionLog(): PromotionLogEntry[] {
  return readLogFile().entries;
}
