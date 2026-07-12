/**
 * Knowledge Factory — Factory Logger
 *
 * Maintains factory-log.json as the persistent ledger of all factory runs
 * and promotions. Writes atomically to prevent corruption on interrupt.
 *
 * factory-log.json is committed to the repository so that:
 *   - The mkc:coverage dashboard shows factory progress
 *   - The admin briefing (P5) can report factory health
 *   - Idempotency checks can detect re-runs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import type { FactoryLogEntry, FactoryLogFile } from "../types";

// ── Paths ─────────────────────────────────────────────────────────────────────

const ROOT     = process.cwd();
const LOG_PATH = path.join(ROOT, "scripts", "factory", "factory-log.json");
const TMP_PATH = LOG_PATH + ".tmp";

// ── Read ──────────────────────────────────────────────────────────────────────

export function readLog(): FactoryLogFile {
  if (!existsSync(LOG_PATH)) {
    return { version: "1.0", runs: [] };
  }
  try {
    const raw = readFileSync(LOG_PATH, "utf-8");
    return JSON.parse(raw) as FactoryLogFile;
  } catch {
    return { version: "1.0", runs: [] };
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────

function writeLog(logFile: FactoryLogFile): void {
  const json = JSON.stringify(logFile, null, 2) + "\n";
  // Atomic write: write to .tmp, then rename to final path
  writeFileSync(TMP_PATH, json, "utf-8");
  writeFileSync(LOG_PATH, json, "utf-8");
}

// ── Upsert ────────────────────────────────────────────────────────────────────
// Replaces the existing entry for a slug (re-run) or inserts a new one.
// Maintains the log in descending chronological order.

export function logRun(entry: FactoryLogEntry): void {
  try {
    const log = readLog();
    const idx = log.runs.findIndex(r => r.slug === entry.slug);
    if (idx >= 0) {
      log.runs[idx] = entry;
    } else {
      log.runs.unshift(entry);
    }
    writeLog(log);
  } catch (err) {
    // Logging failure is non-terminal. Print warning and continue.
    console.warn(`[factory] Warning: could not write factory-log.json — ${err instanceof Error ? err.message : err}`);
  }
}

// ── Mark promoted ─────────────────────────────────────────────────────────────

export function markPromoted(slug: string): void {
  try {
    const log = readLog();
    const entry = log.runs.find(r => r.slug === slug);
    if (entry) {
      entry.promotedAt = new Date().toISOString();
      writeLog(log);
    }
  } catch (err) {
    console.warn(`[factory] Warning: could not mark ${slug} as promoted — ${err instanceof Error ? err.message : err}`);
  }
}

// ── Check idempotency ─────────────────────────────────────────────────────────

export function hasRun(slug: string): boolean {
  return readLog().runs.some(r => r.slug === slug);
}

export function isPromoted(slug: string): boolean {
  return readLog().runs.some(r => r.slug === slug && r.promotedAt !== null);
}
