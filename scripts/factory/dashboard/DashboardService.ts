/**
 * Knowledge Operations Dashboard — Service
 *
 * Reads every operational subsystem and assembles raw data for the dashboard.
 * This is the only module that performs I/O — all other dashboard modules
 * receive pre-assembled data.
 *
 * Read sources:
 *   Factory     — scripts/factory/metrics/factoryLogger
 *   Batch       — scripts/factory/batch/BatchLogger
 *   Review      — scripts/factory/review/ReviewRegistry
 *   Promotion   — scripts/factory/promotion/PromotionRegistry + PromotionHistory
 *   Coverage    — app/lib/mkc/native/index  +  app/data/{skye,rose,elite}
 *   Validation  — app/lib/mkc/validator (run against live native records)
 */

import { existsSync, readdirSync } from "fs";
import path from "path";

import { readLog }                            from "../metrics/factoryLogger";
import { readBatchLog }                       from "../batch/BatchLogger";
import { getAllRecords }                       from "../review/ReviewRegistry";
import { getAllPromotionRecords }              from "../promotion/PromotionRegistry";
import { getHistory }                         from "../promotion/PromotionHistory";
import { getByStatus as reviewByStatus }      from "../review/ReviewRegistry";

import { nativeFragrances }                   from "../../../app/lib/mkc/native/index";
import { skyeFragrances }                     from "../../../app/data/skye";
import { roseFragrances }                     from "../../../app/data/rose";
import { eliteFragrances }                    from "../../../app/data/elite";
import { validateAll }                        from "../../../app/lib/mkc/validator";
import type { FragranceKnowledge }            from "../../../app/lib/mkc/types";

import {
  computeOperationsMetrics, buildProgressBars,
  computeFactoryHealth, computeReviewHealth,
  computePromotionHealth, computeRepositoryHealth, computeSystemHealth,
} from "./DashboardSummary";

import type {
  DashboardData, FactoryMetrics, BatchMetrics,
  ReviewMetrics, PromotionMetrics, ValidationMetrics, CoverageMetrics,
} from "./DashboardMetrics";

// ── Constants ─────────────────────────────────────────────────────────────────

const DRAFT_DIR     = path.join(process.cwd(), "scripts", "factory", "drafts");
const FACTORY_VER   = "0.5.0";
const PRODUCER_NAMES = ["composition", "editorial", "relationships", "education", "discovery"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function countDrafts(): number {
  if (!existsSync(DRAFT_DIR)) return 0;
  try {
    return readdirSync(DRAFT_DIR).filter(f => f.endsWith(".ts")).length;
  } catch { return 0; }
}

function deriveSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

// ── Section builders ──────────────────────────────────────────────────────────

function buildFactoryMetrics(): FactoryMetrics {
  const log    = readLog();
  const latest = log.runs[0] ?? null;

  let lastRunDurationMs: number | null = null;
  if (latest) {
    const start = new Date(latest.startedAt).getTime();
    const end   = new Date(latest.completedAt).getTime();
    if (!isNaN(start) && !isNaN(end)) lastRunDurationMs = end - start;
  }

  const totalDrafts   = countDrafts();
  const reviewSlugs   = new Set(getAllRecords().map(r => r.slug));
  const pendingDrafts = existsSync(DRAFT_DIR)
    ? readdirSync(DRAFT_DIR)
        .filter(f => f.endsWith(".ts"))
        .filter(f => !reviewSlugs.has(f.replace(/\.ts$/, ""))).length
    : 0;

  return {
    factoryVersion:    FACTORY_VER,
    producerStack:     PRODUCER_NAMES,
    lastRunAt:         latest?.completedAt   ?? null,
    lastRunSlug:       latest?.slug          ?? null,
    lastRunDurationMs,
    totalDrafts,
    pendingDrafts,
  };
}

function buildBatchMetrics(): BatchMetrics {
  const batches = readBatchLog();
  if (batches.length === 0) {
    return {
      totalBatches: 0,
      lastBatchId: null, lastBatchAt: null,
      lastBatchGenerated: null, lastBatchFailed: null,
      lastBatchDurationMs: null, lastBatchCostUsd: null,
    };
  }
  const last = batches[0];
  return {
    totalBatches:        batches.length,
    lastBatchId:         last.batchId,
    lastBatchAt:         last.completedAt,
    lastBatchGenerated:  last.report.generated,
    lastBatchFailed:     last.report.failed,
    lastBatchDurationMs: last.report.durationMs,
    lastBatchCostUsd:    last.report.estimatedCostUsd,
  };
}

function buildReviewMetrics(): ReviewMetrics {
  const records = getAllRecords();
  return {
    total:             records.length,
    pending:           records.filter(r => r.status === "pending").length,
    inReview:          records.filter(r => r.status === "in_review").length,
    approved:          records.filter(r => r.status === "approved").length,
    rejected:          records.filter(r => r.status === "rejected").length,
    needsRegeneration: records.filter(r => r.status === "needs_regeneration").length,
    withOpenNotes:     records.filter(r => r.notes.some(n => !n.resolved)).length,
  };
}

function buildPromotionMetrics(): PromotionMetrics {
  const promoRecords = getAllPromotionRecords();
  const history      = getHistory();

  // "Ready" = approved in review but not yet promoted
  const approvedSlugs = new Set(reviewByStatus("approved").map(r => r.slug));
  const promotedSlugs = new Set(
    promoRecords.filter(r => r.status === "promoted").map(r => r.slug),
  );
  const ready = [...approvedSlugs].filter(s => !promotedSlugs.has(s)).length;

  const recentSlugs = history
    .filter(e => e.outcome === "promoted")
    .slice(0, 5)
    .map(e => e.name);

  return {
    ready,
    promoted:   promoRecords.filter(r => r.status === "promoted").length,
    failed:     promoRecords.filter(r => r.status === "failed").length,
    rolledBack: promoRecords.filter(r => r.status === "rolled_back").length,
    inProgress: promoRecords.filter(r => r.status === "in_progress").length,
    recentSlugs,
  };
}

function buildValidationMetrics(): ValidationMetrics {
  const native: FragranceKnowledge[] = [...nativeFragrances.values()];
  const results = validateAll(native);
  return {
    pass:             results.filter(r => r.status === "PASS").length,
    passWithWarnings: results.filter(r => r.status === "PASS_WITH_WARNINGS").length,
    fail:             results.filter(r => r.status === "FAIL").length,
    total:            results.length,
  };
}

function buildCoverageMetrics(): CoverageMetrics {
  const rawAll = [
    ...skyeFragrances  as Array<{ title: string }>,
    ...roseFragrances  as Array<{ title: string }>,
    ...eliteFragrances as Array<{ title: string }>,
  ];

  const totalSupplier   = rawAll.length;
  const nativeSlugs     = new Set(nativeFragrances.keys());
  const nativeRecords   = nativeFragrances.size;
  const adapterRecords  = totalSupplier - nativeRecords;
  const remaining       = rawAll.filter(f => !nativeSlugs.has(deriveSlug(f.title))).length;
  const nativePct       = totalSupplier > 0 ? (nativeRecords / totalSupplier) * 100 : 0;

  return {
    nativeRecords,
    adapterRecords,
    totalSupplier,
    remaining,
    nativePct,
  };
}

// ── Main assembly ─────────────────────────────────────────────────────────────

export function assembleDashboard(): DashboardData {
  const factory    = buildFactoryMetrics();
  const batch      = buildBatchMetrics();
  const review     = buildReviewMetrics();
  const promotion  = buildPromotionMetrics();
  const validation = buildValidationMetrics();
  const coverage   = buildCoverageMetrics();
  const operations = computeOperationsMetrics(readLog().runs, readBatchLog());
  const progress   = buildProgressBars(coverage, promotion);

  const factoryHealth    = computeFactoryHealth(readLog().runs, validation);
  const reviewHealth     = computeReviewHealth(review);
  const promotionHealth  = computePromotionHealth(promotion);
  const repositoryHealth = computeRepositoryHealth(validation);
  const health           = computeSystemHealth(
    factoryHealth, reviewHealth, promotionHealth, repositoryHealth,
  );

  return {
    generatedAt: new Date().toISOString(),
    health,
    factory,
    batch,
    review,
    promotion,
    validation,
    coverage,
    operations,
    progress,
  };
}
