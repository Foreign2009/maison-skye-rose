/**
 * Knowledge Factory — Review Registry
 *
 * Single source of truth for all review record state.
 * Reads and writes scripts/factory/review/review-queue.json.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import type { ReviewRecord, ReviewQueueFile, ReviewStatus } from "./ReviewState";

const REVIEW_DIR    = path.join(process.cwd(), "scripts", "factory", "review");
const REGISTRY_PATH = path.join(REVIEW_DIR, "review-queue.json");

// ── I/O ───────────────────────────────────────────────────────────────────────

function readFile(): ReviewQueueFile {
  if (!existsSync(REGISTRY_PATH)) return { version: "1.0", records: [] };
  try {
    return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as ReviewQueueFile;
  } catch {
    return { version: "1.0", records: [] };
  }
}

function writeFile(file: ReviewQueueFile): void {
  if (!existsSync(REVIEW_DIR)) mkdirSync(REVIEW_DIR, { recursive: true });
  writeFileSync(REGISTRY_PATH, JSON.stringify(file, null, 2) + "\n", "utf-8");
}

// ── Public API ────────────────────────────────────────────────────────────────

export function loadRegistry(): ReviewQueueFile {
  return readFile();
}

export function getAllRecords(): ReviewRecord[] {
  return readFile().records;
}

export function getByStatus(status: ReviewStatus): ReviewRecord[] {
  return readFile().records.filter(r => r.status === status);
}

export function findRecord(slug: string): ReviewRecord | undefined {
  return readFile().records.find(r => r.slug === slug);
}

export function addRecord(record: ReviewRecord): void {
  const file = readFile();
  const idx  = file.records.findIndex(r => r.slug === record.slug);
  if (idx >= 0) {
    file.records[idx] = record;
  } else {
    file.records.push(record);
  }
  writeFile(file);
}

export function updateRecord(slug: string, updates: Partial<ReviewRecord>): ReviewRecord | null {
  const file = readFile();
  const idx  = file.records.findIndex(r => r.slug === slug);
  if (idx < 0) return null;
  file.records[idx] = { ...file.records[idx], ...updates };
  writeFile(file);
  return file.records[idx];
}
