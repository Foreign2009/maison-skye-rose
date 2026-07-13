/**
 * Knowledge Operations Dashboard — Metrics Types
 *
 * Single source of truth for all DashboardData types.
 * No business logic lives here — only shapes.
 */

// ── Health ────────────────────────────────────────────────────────────────────

export type HealthStatus = "healthy" | "warning" | "critical";

export interface HealthIndicator {
  status:  HealthStatus;
  label:   string;
  reasons: string[];
}

export interface SystemHealth {
  factory:    HealthIndicator;
  review:     HealthIndicator;
  promotion:  HealthIndicator;
  repository: HealthIndicator;
  overall:    HealthIndicator;
}

// ── Progress bar ──────────────────────────────────────────────────────────────

export interface ProgressBar {
  label:   string;
  current: number;
  total:   number;
  pct:     number;
  bar:     string;   // pre-rendered ASCII bar
}

// ── Factory ───────────────────────────────────────────────────────────────────

export interface ProducerSuccessRate {
  name:        string;
  total:       number;
  pass:        number;
  degraded:    number;
  fail:        number;
  successRate: number;   // 0–1
}

export interface FactoryMetrics {
  factoryVersion:  string;
  producerStack:   string[];
  lastRunAt:       string | null;
  lastRunSlug:     string | null;
  lastRunDurationMs: number | null;
  totalDrafts:     number;
  pendingDrafts:   number;
}

export interface BatchMetrics {
  totalBatches:      number;
  lastBatchId:       string | null;
  lastBatchAt:       string | null;
  lastBatchGenerated: number | null;
  lastBatchFailed:   number | null;
  lastBatchDurationMs: number | null;
  lastBatchCostUsd:  number | null;
}

// ── Review ────────────────────────────────────────────────────────────────────

export interface ReviewMetrics {
  total:             number;
  pending:           number;
  inReview:          number;
  approved:          number;
  rejected:          number;
  needsRegeneration: number;
  withOpenNotes:     number;
}

// ── Promotion ─────────────────────────────────────────────────────────────────

export interface PromotionMetrics {
  ready:       number;   // approved but not yet promoted
  promoted:    number;
  failed:      number;
  rolledBack:  number;
  inProgress:  number;
  recentSlugs: string[];
}

// ── Repository ────────────────────────────────────────────────────────────────

export interface ValidationMetrics {
  pass:             number;
  passWithWarnings: number;
  fail:             number;
  total:            number;
}

export interface CoverageMetrics {
  nativeRecords:    number;
  adapterRecords:   number;
  totalSupplier:    number;
  remaining:        number;
  nativePct:        number;
}

// ── Operations ────────────────────────────────────────────────────────────────

export interface OperationsMetrics {
  averageRuntimeMs:    number | null;
  averageTotalTokens:  number | null;
  totalEstimatedCostUsd: number;
  totalTokens:         number;
  producerRates:       ProducerSuccessRate[];
}

// ── Dashboard data (root) ─────────────────────────────────────────────────────

export interface DashboardData {
  generatedAt: string;
  health:      SystemHealth;
  factory:     FactoryMetrics;
  batch:       BatchMetrics;
  review:      ReviewMetrics;
  promotion:   PromotionMetrics;
  validation:  ValidationMetrics;
  coverage:    CoverageMetrics;
  operations:  OperationsMetrics;
  progress:    ProgressBar[];
}
