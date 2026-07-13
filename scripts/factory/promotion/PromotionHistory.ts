/**
 * Knowledge Factory — Promotion History
 *
 * Append-only ledger of every completed promotion attempt.
 * Persisted to scripts/factory/promotion/promotion-history.json.
 * Never truncated — this is the permanent record of what was promoted.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const HISTORY_PATH = path.join(
  process.cwd(), "scripts", "factory", "promotion", "promotion-history.json"
);

export interface PromotionHistoryEntry {
  promotionId:      string;
  slug:             string;
  name:             string;
  collection:       "Skye" | "Rose" | "Elite";
  operator:         string;
  reviewedBy:       string;
  factoryVersion:   string;
  promptVersions:   string;
  startedAt:        string;
  completedAt:      string;
  durationMs:       number;
  outcome:          "promoted" | "failed" | "rolled_back";
  validationStatus: "PASS" | "PASS_WITH_WARNINGS" | "FAIL" | null;
  buildResult:      "pass" | "fail" | null;
  nativePath:       string | null;
  error:            string | null;
}

interface PromotionHistoryFile {
  version: string;
  entries: PromotionHistoryEntry[];
}

function readHistoryFile(): PromotionHistoryFile {
  if (!existsSync(HISTORY_PATH)) return { version: "1.0", entries: [] };
  try {
    return JSON.parse(readFileSync(HISTORY_PATH, "utf-8")) as PromotionHistoryFile;
  } catch {
    return { version: "1.0", entries: [] };
  }
}

export function recordHistory(entry: PromotionHistoryEntry): void {
  try {
    const hist = readHistoryFile();
    hist.entries.unshift(entry);   // most-recent first
    writeFileSync(HISTORY_PATH, JSON.stringify(hist, null, 2) + "\n", "utf-8");
  } catch (err) {
    console.warn(`[promote] Warning: could not write promotion-history.json — ${err instanceof Error ? err.message : err}`);
  }
}

export function getHistory(): PromotionHistoryEntry[] {
  return readHistoryFile().entries;
}

export function getHistoryForSlug(slug: string): PromotionHistoryEntry[] {
  return readHistoryFile().entries.filter(e => e.slug === slug);
}
