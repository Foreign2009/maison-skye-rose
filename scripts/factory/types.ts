/**
 * Knowledge Factory — Shared Types (P1)
 *
 * All types shared across factory modules.
 * P2 will extend these with ProducerResult, ProducerName, KQProjection.
 */

import type { FragranceKnowledge } from "../../app/lib/mkc/types";
import type { DisplayFragrance }   from "../../app/lib/knowledgeAdapter";
import type { ValidationResult }   from "../../app/lib/mkc/validator";

// ── Intake ────────────────────────────────────────────────────────────────────

export interface IntakeInput {
  slug:  string;
  force: boolean;
}

export interface IntakeResult {
  status:      "found" | "not_found" | "already_native" | "already_drafted";
  displayFrag: DisplayFragrance | null;
  collection:  "Skye" | "Rose" | "Elite" | null;
  source:      "skye" | "rose" | "elite" | null;
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

export interface ScaffoldResult {
  record:   FragranceKnowledge;
  degraded: boolean;
}

// ── Pipeline state ────────────────────────────────────────────────────────────

export interface StageEntry {
  stage:      string;
  status:     "pass" | "fail" | "skip" | "degraded";
  durationMs: number;
  message?:   string;
}

export interface PipelineState {
  slug:             string;
  displayFrag:      DisplayFragrance;
  record:           FragranceKnowledge;
  validationResult: ValidationResult | null;
  stageLog:         StageEntry[];
  factoryVersion:   string;
}

// ── Draft builder ─────────────────────────────────────────────────────────────

export interface DraftBuilderInput {
  state:    PipelineState;
  draftDir: string;
}

export interface DraftBuilderResult {
  path:    string;
  written: boolean;
  bytes:   number;
}

// ── Pipeline result ───────────────────────────────────────────────────────────

export interface PipelineInput {
  slug:     string;
  force:    boolean;
  dryRun:   boolean;
}

export interface PipelineResult {
  status:    "complete" | "degraded" | "failed" | "skipped";
  slug:      string;
  draftPath: string | null;
  state:     PipelineState | null;
  message:   string;
  durationMs: number;
}

// ── Promotion ─────────────────────────────────────────────────────────────────

export interface PromotionInput {
  slug:  string;
  force: boolean;
}

export interface PromotionResult {
  status:     "promoted" | "validation_failed" | "build_failed" | "rejected" | "no_draft";
  nativePath: string | null;
  errors:     string[];
  message:    string;
}

// ── Factory log ───────────────────────────────────────────────────────────────

export interface FactoryLogEntry {
  slug:             string;
  name:             string;
  wave:             string | null;
  startedAt:        string;
  completedAt:      string;
  factoryVersion:   string;
  stages:           StageEntry[];
  validationStatus: "PASS" | "PASS_WITH_WARNINGS" | "FAIL" | "UNKNOWN";
  promotedAt:       string | null;
}

export interface FactoryLogFile {
  version: string;
  runs:    FactoryLogEntry[];
}
