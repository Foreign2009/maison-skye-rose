/**
 * Knowledge Factory — Core Framework Types
 *
 * All shared types for the Producer Framework.
 * Governs P2B through P5 per FACTORY_CONTRACT.md (v1.0 frozen 2026-07-12).
 *
 * Producers import only from here — never from app/ directly.
 */

import type { FragranceKnowledge }      from "../../../app/lib/mkc/types";
import type { HomeFragranceKnowledge }  from "../../../app/lib/mkc/homeFragranceTypes";
import type { DisplayFragrance }        from "../../../app/lib/knowledgeAdapter";

// Re-export for producers — keeps app/ imports out of producer files
export type { FragranceKnowledge, HomeFragranceKnowledge, DisplayFragrance };

// ── Provider + config ─────────────────────────────────────────────────────────

export interface ProviderConfig {
  name:         string;
  modelId:      string;
  apiKeyEnvVar: string;
}

export interface ProducerConfig {
  enabled:         boolean;
  providerName?:   string;
  modelId?:        string;
  temperature:     number;
  maxTokens:       number;
  promptVersion?:  string;
  promptFallback?: "fail" | "previous";
}

export interface FactoryConfig {
  defaultProvider:      string;
  providers:            Record<string, ProviderConfig>;
  producers:            Record<string, ProducerConfig>;
  maxSessionTokens:     number;
  maxProducerTokens:    number;
  dryRun:               boolean;
  logLevel:             "silent" | "normal" | "verbose" | "debug";
  logProducerArtifacts: boolean;
  generationTimeout:    number;
  producerTimeout:      number;
  maxAttempts:          number;
  backoffStrategy:      "linear" | "exponential";
  backoffBaseMs:        number;
}

// ── Factory context ───────────────────────────────────────────────────────────

export interface FactoryContext {
  readonly runId:            string;
  readonly factoryVersion:   string;
  readonly wave:             string | null;
  readonly startedAt:        Date;
  readonly slug:             string;
  readonly name:             string;
  readonly collection:       "Skye" | "Rose" | "Elite";
  readonly displayFrag:      Readonly<DisplayFragrance>;
  readonly scaffoldRecord:   Readonly<FragranceKnowledge>;
  readonly currentRecord:    Readonly<FragranceKnowledge>;
  readonly nativeFragrances: ReadonlyMap<string, FragranceKnowledge>;
  readonly catalogueSize:    number;
  readonly config:           Readonly<FactoryConfig>;
}

// ── Generation ────────────────────────────────────────────────────────────────

export interface GenerationTask {
  producerName:   string;
  promptName:     string;
  promptVersion:  string;
  providerName:   string;
  modelId:        string;
  systemPrompt:   string;
  userMessage:    string;
  temperature:    number;
  maxTokens:      number;
  expectedFormat: "json" | "text";
  correlationId:  string;
  metadata:       Record<string, string>;
}

export type GenerationStatus =
  | "success"
  | "dry_run"
  | "error"
  | "rate_limited"
  | "context_exceeded"
  | "timeout"
  | "malformed_response";

export interface GenerationResponse {
  status:     GenerationStatus;
  content:    string;
  confidence: number;
  usage: {
    promptTokens:     number;
    completionTokens: number;
    totalTokens:      number;
  };
  modelId:    string;
  durationMs: number;
  attempts:   number;
  error?:     string;
}

export interface GenerationProvider {
  readonly name:    string;
  readonly modelId: string;
  generate(task: GenerationTask): Promise<GenerationResponse>;
}

export interface SessionCost {
  totalPromptTokens:     number;
  totalCompletionTokens: number;
  totalTokens:           number;
  callCount:             number;
}

// ── Prompts ───────────────────────────────────────────────────────────────────

export interface PromptVersion {
  name:       string;
  version:    string;
  content:    string;
  loadedFrom: string;
  loadedAt:   Date;
}

// ── Producer types ────────────────────────────────────────────────────────────

export type ProducerStatus = "success" | "degraded" | "failed" | "skipped";

export interface ProducerMetrics {
  durationMs:       number;
  attempts:         number;
  promptTokens:     number;
  completionTokens: number;
  totalTokens:      number;
  modelId:          string;
  cached:           boolean;
}

export interface ProducerArtifact {
  type:      "raw_response" | "parsed_fields" | "validation_trace";
  content:   string;
  createdAt: Date;
}

export interface ProducerResult {
  producerName:    string;
  producerVersion: string;
  promptVersion:   string | null;
  status:          ProducerStatus;
  fields:          Partial<FragranceKnowledge>;
  confidence:      number;
  errors:          string[];
  warnings:        string[];
  metrics:         ProducerMetrics;
  artifacts:       ProducerArtifact[];
  skippedReason?:  string;
}

export interface PreCheckResult {
  pass:    boolean;
  reason?: string;
}

export interface ProducerValidation {
  errors:   string[];
  warnings: string[];
}

// ── Home Fragrance context ────────────────────────────────────────────────────
//
// HomeFragranceFactoryContext is the parallel to FactoryContext for home
// fragrance producers. It deliberately omits:
//   collection   — fragrance-only; home fragrance uses "range"
//   displayFrag  — DisplayFragrance adapter is personal-fragrance-typed
//   nativeFragrances — no home fragrance native registry yet (EP4-P5)
//
// HomeFragranceFactoryContext and FactoryContext are structurally distinct
// by design and must not be conflated.

export interface HomeFragranceFactoryContext {
  readonly runId:          string;
  readonly factoryVersion: string;
  readonly startedAt:      Date;
  readonly slug:           string;
  readonly name:           string;
  readonly category:       "home-fragrance";
  readonly productType:    "candle" | "diffuser" | "room-spray";
  readonly range:          string;
  readonly scaffoldRecord: Readonly<HomeFragranceKnowledge>;
  readonly currentRecord:  Readonly<HomeFragranceKnowledge>;
  readonly config:         Readonly<FactoryConfig>;
}

// ── Home Fragrance producer result ────────────────────────────────────────────
//
// HomeFragranceProducerResult is the parallel to ProducerResult for home
// fragrance producers. The key difference:
//   fields: Partial<HomeFragranceKnowledge>  (not Partial<FragranceKnowledge>)
//
// Shared lifecycle metadata types (ProducerStatus, ProducerMetrics,
// ProducerArtifact) are reused because they are category-neutral.

export interface HomeFragranceProducerResult {
  producerName:    string;
  producerVersion: string;
  promptVersion:   string | null;
  status:          ProducerStatus;
  fields:          Partial<HomeFragranceKnowledge>;
  confidence:      number;
  errors:          string[];
  warnings:        string[];
  metrics:         ProducerMetrics;
  artifacts:       ProducerArtifact[];
  skippedReason?:  string;
}
