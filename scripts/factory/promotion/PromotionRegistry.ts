/**
 * Knowledge Factory — Promotion Registry
 *
 * Tracks the promotion status of every record that has entered the
 * promotion pipeline. Persisted to promotion-registry.json.
 *
 * This is distinct from the Review Registry:
 *   ReviewRegistry  → editorial review state (approved/rejected/etc.)
 *   PromotionRegistry → promotion pipeline state (in_progress/promoted/failed/rolled_back)
 *
 * Also exports all shared types used across the Promotion Pipeline.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const REGISTRY_PATH = path.join(
  process.cwd(), "scripts", "factory", "promotion", "promotion-registry.json"
);

// ── Shared types ──────────────────────────────────────────────────────────────

export type PromotionStatus =
  | "in_progress"
  | "promoted"
  | "failed"
  | "rolled_back";

export type PromotionOutcome =
  | "promoted"
  | "review_required"
  | "no_draft"
  | "already_promoted"
  | "native_exists"
  | "validation_failed"
  | "build_failed"
  | "rolled_back"
  | "error";

export interface PromotionRecord {
  slug:             string;
  name:             string;
  collection:       "Skye" | "Rose" | "Elite";
  operator:         string;
  reviewedBy:       string;
  status:           PromotionStatus;
  startedAt:        string;
  completedAt:      string | null;
  nativePath:       string | null;
  validationStatus: "PASS" | "PASS_WITH_WARNINGS" | "FAIL" | null;
  buildResult:      "pass" | "fail" | null;
  durationMs:       number | null;
  error:            string | null;
}

export interface PromotionTransactionResult {
  outcome:          PromotionOutcome;
  slug:             string;
  name:             string;
  nativePath:       string | null;
  validationStatus: "PASS" | "PASS_WITH_WARNINGS" | "FAIL" | null;
  buildResult:      "pass" | "fail" | null;
  durationMs:       number;
  error:            string | null;
  message:          string;
}

interface PromotionRegistryFile {
  version: string;
  records: PromotionRecord[];
}

// ── I/O ───────────────────────────────────────────────────────────────────────

function readFile(): PromotionRegistryFile {
  if (!existsSync(REGISTRY_PATH)) return { version: "1.0", records: [] };
  try {
    return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as PromotionRegistryFile;
  } catch {
    return { version: "1.0", records: [] };
  }
}

function writeFile(file: PromotionRegistryFile): void {
  writeFileSync(REGISTRY_PATH, JSON.stringify(file, null, 2) + "\n", "utf-8");
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getAllPromotionRecords(): PromotionRecord[] {
  return readFile().records;
}

export function getByPromotionStatus(status: PromotionStatus): PromotionRecord[] {
  return readFile().records.filter(r => r.status === status);
}

export function findPromotionRecord(slug: string): PromotionRecord | undefined {
  return readFile().records.find(r => r.slug === slug);
}

export function upsertPromotionRecord(record: PromotionRecord): void {
  const file = readFile();
  const idx  = file.records.findIndex(r => r.slug === record.slug);
  if (idx >= 0) {
    file.records[idx] = record;
  } else {
    file.records.unshift(record);   // most-recent first
  }
  writeFile(file);
}

export function updatePromotionRecord(
  slug:    string,
  updates: Partial<PromotionRecord>,
): PromotionRecord | null {
  const file = readFile();
  const idx  = file.records.findIndex(r => r.slug === slug);
  if (idx < 0) return null;
  file.records[idx] = { ...file.records[idx], ...updates };
  writeFile(file);
  return file.records[idx];
}
