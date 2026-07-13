/**
 * Knowledge Factory — Review Logger
 *
 * Append-only audit trail for all editorial review actions.
 * Persisted to scripts/factory/review/review-log.json.
 * Capped at 1 000 entries to prevent unbounded growth.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const REVIEW_DIR = path.join(process.cwd(), "scripts", "factory", "review");
const LOG_PATH   = path.join(REVIEW_DIR, "review-log.json");
const MAX_ENTRIES = 1_000;

export interface ReviewLogEntry {
  timestamp: string;
  action:    string;
  slug:      string;
  reviewer:  string;
  details:   string;
}

interface ReviewLogFile {
  version: string;
  entries: ReviewLogEntry[];
}

function readLog(): ReviewLogFile {
  if (!existsSync(LOG_PATH)) return { version: "1.0", entries: [] };
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf-8")) as ReviewLogFile;
  } catch {
    return { version: "1.0", entries: [] };
  }
}

export function logReviewAction(
  action:   string,
  slug:     string,
  reviewer: string,
  details:  string,
): void {
  try {
    if (!existsSync(REVIEW_DIR)) mkdirSync(REVIEW_DIR, { recursive: true });
    const log = readLog();
    log.entries.push({
      timestamp: new Date().toISOString(),
      action,
      slug,
      reviewer,
      details,
    });
    if (log.entries.length > MAX_ENTRIES) {
      log.entries = log.entries.slice(-MAX_ENTRIES);
    }
    writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + "\n", "utf-8");
  } catch (err) {
    console.warn(`[review] Warning: could not write review-log.json — ${err instanceof Error ? err.message : err}`);
  }
}

export function readReviewLog(): ReviewLogEntry[] {
  return readLog().entries;
}
