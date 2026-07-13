/**
 * Knowledge Lifecycle Manager — Scanner
 *
 * Sole I/O layer for lifecycle detection.
 *
 * Reads:
 *   - factory-log.json       (factoryLogger)
 *   - review-queue.json      (ReviewRegistry)
 *   - promotion-registry.json (PromotionRegistry)
 *   - scripts/factory/drafts/
 *   - scripts/factory/prompts/  (via PromptRegistry)
 *   - app/data/fragrances    (supplier catalogue)
 *   - app/lib/mkc/native     (already-native slugs)
 *
 * Applies all LifecycleRules and returns the complete job list.
 */

import { existsSync, readFileSync } from "fs";
import path from "path";

import { readLog }                    from "../metrics/factoryLogger";
import { getAllRecords }               from "../review/ReviewRegistry";
import { getAllPromotionRecords }      from "../promotion/PromotionRegistry";
import { PromptRegistry }             from "../core/PromptRegistry";
import { deriveSlug }                 from "../intake";

import { fragrances }                 from "../../../app/data/fragrances";
import { nativeFragrances }           from "../../../app/lib/mkc/native/index";

import { applyAllRules, compareSemver } from "./LifecycleRules";
import type { LifecycleJob }           from "./LifecycleJob";
import { SEVERITY_ORDER, STALE_REASONS, FAILED_REASONS, REJECTED_REASONS } from "./LifecycleJob";

// ── Constants ─────────────────────────────────────────────────────────────────

const CURRENT_FACTORY_VERSION = "0.5.0";
const DRAFT_DIR   = path.join(process.cwd(), "scripts", "factory", "drafts");
const PROMPT_DIR  = path.join(process.cwd(), "scripts", "factory", "prompts");

// ── Scan input ────────────────────────────────────────────────────────────────

export interface ScanInput {
  slugFilter?:       string;
  collectionFilter?: "Skye" | "Rose" | "Elite";
  reasonFilter?:     string;
  onlyStale?:        boolean;
  onlyFailed?:       boolean;
  onlyRejected?:     boolean;
}

export interface ScanResult {
  jobs:         LifecycleJob[];
  scannedCount: number;
  scannedAt:    string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildLatestPromptVersions(): Map<string, string> {
  const registry = new PromptRegistry(PROMPT_DIR);
  const latest   = new Map<string, string>();
  try {
    for (const p of registry.listAvailable()) {
      const existing = latest.get(p.name);
      if (!existing || compareSemver(p.version, existing) > 0) {
        latest.set(p.name, p.version);
      }
    }
  } catch {
    // non-fatal: no prompts directory
  }
  return latest;
}

function readDraft(slug: string): string | null {
  const draftPath = path.join(DRAFT_DIR, `${slug}.ts`);
  if (!existsSync(draftPath)) return null;
  try { return readFileSync(draftPath, "utf-8"); } catch { return null; }
}

// ── Main scanner ──────────────────────────────────────────────────────────────

export function scanLifecycle(input: ScanInput = {}): ScanResult {
  const scannedAt = new Date().toISOString();

  // ── Load all data ─────────────────────────────────────────────────────────
  const factoryLog         = readLog();
  const reviewRecords      = getAllRecords();
  const promotionRecords   = getAllPromotionRecords();
  const latestPromptVersions = buildLatestPromptVersions();

  // ── Build lookup maps ─────────────────────────────────────────────────────
  const factoryLogMap  = new Map(factoryLog.runs.map(r => [r.slug, r]));
  const reviewMap      = new Map(reviewRecords.map(r => [r.slug, r]));
  const promotionMap   = new Map(promotionRecords.map(r => [r.slug, r]));

  // ── Scan catalogue ────────────────────────────────────────────────────────
  const catalogue = fragrances as Array<{ title: string; collection: string }>;
  const allJobs: LifecycleJob[] = [];
  let scannedCount = 0;

  for (const f of catalogue) {
    const slug       = deriveSlug(f.title);
    const collection = f.collection as "Skye" | "Rose" | "Elite";
    const name       = f.title;

    // Apply pre-scan filters
    if (input.slugFilter && input.slugFilter !== slug) continue;
    if (input.collectionFilter && input.collectionFilter !== collection) continue;

    scannedCount++;

    const isNative       = nativeFragrances.has(slug);
    const draftContent   = isNative ? null : readDraft(slug);
    const draftExists    = !isNative && draftContent !== null;

    const factoryEntry   = factoryLogMap.get(slug)  ?? null;
    const reviewRecord   = reviewMap.get(slug)       ?? null;
    const promotionRecord = promotionMap.get(slug)   ?? null;

    const jobs = applyAllRules({
      slug, name, collection, isNative, draftExists, draftContent,
      factoryEntry, reviewRecord, promotionRecord,
      latestPromptVersions, currentFactoryVersion: CURRENT_FACTORY_VERSION,
    });

    for (const job of jobs) {
      // Apply post-rule filters
      if (input.reasonFilter && job.reason !== input.reasonFilter) continue;
      if (input.onlyStale    && !STALE_REASONS.has(job.reason))   continue;
      if (input.onlyFailed   && !FAILED_REASONS.has(job.reason))  continue;
      if (input.onlyRejected && !REJECTED_REASONS.has(job.reason)) continue;
      allJobs.push(job);
    }
  }

  // Sort: critical → warning → info, then alphabetically by slug
  allJobs.sort((a, b) => {
    const sd = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (sd !== 0) return sd;
    return a.slug.localeCompare(b.slug);
  });

  return { jobs: allJobs, scannedCount, scannedAt };
}
