/**
 * Knowledge Factory — Core Framework Types
 *
 * All shared types for the Producer Framework.
 * Governs P2B through P5 per FACTORY_CONTRACT.md (v1.0 frozen 2026-07-12).
 *
 * Producers import only from here — never from app/ directly.
 */

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";
import type { DisplayFragrance }   from "../../../app/lib/knowledgeAdapter";

// Re-export for producers — keeps app/ imports out of producer files
export type { FragranceKnowledge, DisplayFragrance };

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
