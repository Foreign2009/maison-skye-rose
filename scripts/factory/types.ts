/**
 * Knowledge Factory — Shared Pipeline Types
 *
 * Pipeline-level types shared across factory modules.
 * Core framework types (producer, engine, context) live in ./core/types.ts.
 */

import type { FragranceKnowledge, ProductCategory } from "../../app/lib/mkc/types";
import type { HomeFragranceKnowledge }              from "../../app/lib/mkc/homeFragranceTypes";
import type { DisplayFragrance }                    from "../../app/lib/knowledgeAdapter";
import type { ValidationResult }                    from "../../app/lib/mkc/validator";
import type { ProducerResult, HomeFragranceProducerResult } from "./core/types";

// ── Product intake types ───────────────────────────────────────────────────────

export interface ProductIntakeBase {
  readonly category:   ProductCategory;
  readonly title:      string;
  readonly bestSeller: boolean;
  readonly newArrival: boolean;
}

export interface FragranceIntake extends ProductIntakeBase {
  readonly category:   "fragrance";
  readonly collection: "Skye" | "Rose" | "Elite";
  readonly subtitle:   string;
  readonly mood:       string;
  readonly profile:    string;
  readonly season:     string;
  readonly notes:      string[];
  readonly prices:     { "5ml": number; "10ml": number; "30ml": number };
  readonly images:     { "5ml": string; "10ml": string; "30ml": string };
  // Evidence-lock: mirrors DisplayFragrance fields. When true, governed notes are
  // preserved through the pipeline; CompositionProducer is bypassed.
  readonly notesEvidenceLocked?: boolean;
  readonly notesStructured?:     { top: string[]; heart: string[]; base: string[] };
}

export interface HomeFragranceIntake extends ProductIntakeBase {
  readonly category:    "home-fragrance";
  readonly productType: "candle" | "diffuser" | "room-spray";
  readonly range:       string;
  readonly subtitle:    string;
  readonly mood:        string;
  readonly profile:     string;
  readonly season:      string;
  readonly notes:       string[];
  readonly prices:      Record<string, number>;
  readonly images:      Record<string, string>;
}

// Discriminated union of all supported product intake contracts.
// Add a new member here when a new category has a concrete product record and supplier catalogue.
export type ProductIntake = FragranceIntake | HomeFragranceIntake;

// ── Intake ────────────────────────────────────────────────────────────────────

export interface IntakeInput {
  slug:  string;
  force: boolean;
}

export interface IntakeResult {
  status:     "found" | "not_found" | "already_native" | "already_drafted";
  intake:     ProductIntake | null;
  collection: "Skye" | "Rose" | "Elite" | null;
  source:     "skye" | "rose" | "elite" | null;
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

export interface ScaffoldResult {
  record:   FragranceKnowledge;
  degraded: boolean;
}

// Truthful scaffold result for home fragrance.
// Not forced through ScaffoldResult.record: FragranceKnowledge — that type
// cannot represent home fragrance without fabricated fields (EP4-P2R).
export interface HomeFragranceScaffoldResult {
  record:   HomeFragranceKnowledge;
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
  producerResults?: ProducerResult[];
}

// ── Home Fragrance Pipeline state ─────────────────────────────────────────────
//
// Parallel to PipelineState for the home fragrance pipeline path.
// Omits fields that cannot truthfully represent home fragrance:
//   displayFrag  — DisplayFragrance is personal-fragrance-typed
//   validationResult — home fragrance validator is not yet implemented (EP4-P3C)
//
// producerResults uses HomeFragranceProducerResult (not ProducerResult)
// because fields must be Partial<HomeFragranceKnowledge>.

export interface HomeFragrancePipelineState {
  slug:            string;
  record:          HomeFragranceKnowledge;
  stageLog:        StageEntry[];
  factoryVersion:  string;
  producerResults?: HomeFragranceProducerResult[];
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
  silent?:  boolean;   // suppress per-stage console output (used by batch runner)
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
