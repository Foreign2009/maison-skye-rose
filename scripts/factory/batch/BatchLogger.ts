/**
 * Knowledge Factory — Batch Logger
 *
 * Maintains scripts/factory/batch-log.json as the persistent record of all
 * batch runs. Appended after each batch completes (most-recent first).
 * Capped at 100 entries to prevent unbounded growth.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { BatchReport } from "./BatchReport";

const LOG_PATH = path.join(process.cwd(), "scripts", "factory", "batch-log.json");

export interface BatchLogEntry {
  batchId:     string;
  startedAt:   string;
  completedAt: string;
  config: {
    maxConcurrency: number;
    dryRun:         boolean;
    force:          boolean;
    collection?:    string;
    limit?:         number;
  };
  report: BatchReport;
}

interface BatchLogFile {
  version: string;
  batches: BatchLogEntry[];
}

function readLog(): BatchLogFile {
  if (!existsSync(LOG_PATH)) return { version: "1.0", batches: [] };
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf-8")) as BatchLogFile;
  } catch {
    return { version: "1.0", batches: [] };
  }
}

export function writeBatchLog(entry: BatchLogEntry): void {
  try {
    const log = readLog();
    log.batches.unshift(entry);
    if (log.batches.length > 100) log.batches = log.batches.slice(0, 100);
    writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + "\n", "utf-8");
  } catch (err) {
    console.warn(`[batch] Warning: could not write batch-log.json — ${err instanceof Error ? err.message : err}`);
  }
}

export function readBatchLog(): BatchLogEntry[] {
  return readLog().batches;
}
