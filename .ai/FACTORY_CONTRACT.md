# Knowledge Factory — Interface Contract

**Version:** 1.0
**Status:** FROZEN — P2A
**Date:** 2026-07-12
**Governs:** All Program 7.0 sprints (P2 through P5)

Every future producer, engine, and infrastructure component must conform
to the interfaces defined here. Changes to this document require an explicit
architecture review and a new version number.

---

## Table of Contents

1. [FactoryContext](#1-factorycontext)
2. [BaseProducer](#2-baseproducer)
3. [GenerationEngine](#3-generationengine)
4. [GenerationTask](#4-generationtask)
5. [PromptRegistry](#5-promptregistry)
6. [FactoryConfig](#6-factoryconfig)
7. [ProducerResult](#7-producerresult)
8. [FactoryLogger](#8-factorylogger)
9. [Invariants](#9-invariants)

---

## 1. FactoryContext

The single immutable context object supplied to every producer. It carries
everything a producer needs to know about the record being processed.

**Rule:** Producers must never import from `app/lib/mkc/` or `app/data/`
directly. All repository data arrives via `FactoryContext`. The
`ContextBuilder` is the only module allowed to assemble it.

```typescript
// Illustrative signature

interface FactoryContext {
  // Run identification
  readonly runId:          string;          // UUID — correlation ID for all events in this run
  readonly factoryVersion: string;          // e.g. "0.1.0"
  readonly wave:           string | null;   // optional batch label, e.g. "wave-1"
  readonly startedAt:      Date;

  // Fragrance under production
  readonly slug:           string;
  readonly name:           string;
  readonly collection:     "Skye" | "Rose" | "Elite";
  readonly displayFrag:    Readonly<DisplayFragrance>;   // raw supplier record
  readonly scaffoldRecord: Readonly<FragranceKnowledge>; // deterministic scaffold at entry

  // Current merged state (updated after each producer by the orchestrator)
  readonly currentRecord:  Readonly<FragranceKnowledge>;

  // Catalogue reference (for cross-record validation and relationship scoring)
  readonly nativeFragrances: ReadonlyMap<string, FragranceKnowledge>;
  readonly catalogueSize:    number;         // nativeFragrances.size at context build time

  // Configuration
  readonly config:         Readonly<FactoryConfig>;
}
```

**Immutability contract:**

- `FactoryContext` is constructed once by `ContextBuilder` before the first
  producer runs.
- `currentRecord` is the only field updated between producers — the
  orchestrator rebuilds the context with a new `currentRecord` after each
  `ProducerResult` is merged. All other fields remain stable.
- Producers receive `Readonly<FactoryContext>`. TypeScript `readonly` on
  nested objects is shallow — producers must not mutate nested objects.

**ContextBuilder responsibilities:**

```typescript
// Illustrative signature

class ContextBuilder {
  static build(state: PipelineState, config: FactoryConfig): FactoryContext;
  static withMergedRecord(ctx: FactoryContext, record: FragranceKnowledge): FactoryContext;
}
```

---

## 2. BaseProducer

Abstract base class. Owns the producer execution lifecycle. Concrete producers
implement only `buildPrompt`, `parse`, and `validate`. The lifecycle
sequence is not overridable.

**Execution sequence:**

```
run(context, engine)
  │
  ├─ 1. preCheck(context)
  │       → PreCheckResult { pass: boolean; reason?: string }
  │       Default: always pass.
  │       Override to: skip when config.enabled=false, guard required fields, etc.
  │       If preCheck fails → return ProducerResult with status="skipped"
  │
  ├─ 2. buildPrompt(context)              [ABSTRACT]
  │       → GenerationTask
  │       Assemble system prompt + user message from PromptRegistry + context fields.
  │       Must not perform I/O. Must not call the engine.
  │
  ├─ 3. execute(task, engine)
  │       → GenerationResponse
  │       Delegates to GenerationEngine.generate(task).
  │       Engine owns retry, timeout, cost accounting.
  │       Not overridable. Producers do not touch the engine directly.
  │
  ├─ 4. parse(response, context)          [ABSTRACT]
  │       → Partial<FragranceKnowledge>
  │       Extract structured fields from the LLM response content.
  │       Input is already normalised by the engine (JSON fences stripped, etc.)
  │       If parse fails → throw ParseError; run() catches it → status="failed"
  │
  ├─ 5. validate(fields, context)         [ABSTRACT]
  │       → ProducerValidation { errors: string[]; warnings: string[] }
  │       Check producer-contributed fields against business rules.
  │       Should call validateKnowledgeRecord for semantic checks.
  │       errors → status="degraded" (fields still applied)
  │       (A producer that produces truly unusable fields should throw in parse.)
  │
  ├─ 6. measure(context, response, ms)    [OVERRIDABLE]
  │       → ProducerMetrics
  │       Default: extract token counts from response.usage; record durationMs.
  │       Override to add provider-specific cost calculations.
  │
  └─ 7. assemble(...)
          → ProducerResult
          Combines fields, validation, metrics, artifacts into the final result.
          Not overridable.
```

```typescript
// Illustrative signature

abstract class BaseProducer {
  abstract readonly name:    string;   // e.g. "CompositionProducer"
  abstract readonly version: string;  // e.g. "1.0.0"

  async run(
    context: FactoryContext,
    engine:  GenerationEngine,
  ): Promise<ProducerResult>;

  // ── Extension points ─────────────────────────────────────────────────────

  protected preCheck(context: FactoryContext): PreCheckResult;

  protected abstract buildPrompt(context: FactoryContext): GenerationTask;

  protected abstract parse(
    response: GenerationResponse,
    context:  FactoryContext,
  ): Partial<FragranceKnowledge>;

  protected abstract validate(
    fields:  Partial<FragranceKnowledge>,
    context: FactoryContext,
  ): ProducerValidation;

  protected measure(
    context:    FactoryContext,
    response:   GenerationResponse,
    durationMs: number,
  ): ProducerMetrics;
}

interface PreCheckResult {
  pass:    boolean;
  reason?: string;   // populated when pass=false; becomes skippedReason in ProducerResult
}

interface ProducerValidation {
  errors:   string[];
  warnings: string[];
}
```

**Extension points summary:**

| Method | Overridable | Abstract | Description |
|---|---|---|---|
| `preCheck` | ✓ | — | Guard before running |
| `buildPrompt` | — | ✓ | Assemble GenerationTask |
| `parse` | — | ✓ | Extract fields from LLM output |
| `validate` | — | ✓ | Business-rule checks on output |
| `measure` | ✓ | — | Metric collection |

---

## 3. GenerationEngine

The engine hides every LLM provider. Producers interact only with the engine,
never with providers directly.

**Responsibilities:**

1. **Provider dispatch** — select a `GenerationProvider` by name from the task
2. **Retry** — apply retry policy on recoverable failures
3. **Cost accounting** — track token usage across the session
4. **Response normalisation** — strip markdown fences, validate JSON structure
5. **Confidence estimation** — score how cleanly the provider returned structured output
6. **Timeout enforcement** — abort generation calls exceeding `config.generationTimeout`

**Retry rules:**

| Failure type | Retry? |
|---|---|
| `rate_limited` | ✓ — with backoff |
| `timeout` | ✓ — with backoff |
| `malformed_response` | ✓ — up to maxAttempts |
| `context_exceeded` | ✗ — never retry |
| `invalid_request` | ✗ — never retry |
| `auth_error` | ✗ — never retry |

Backoff strategy: configurable (`linear` or `exponential`). Base delay
(`backoffBaseMs`) doubles on each attempt for exponential.

**Confidence scoring** (derived from response, not from the model's stated confidence):

| Signal | Confidence |
|---|---|
| Valid JSON, all expected fields present | 1.0 |
| Valid JSON, some fields missing | 0.7 |
| JSON corrected after stripping fences/garbage | 0.5 |
| Prose parsed via heuristic | 0.3 |
| Unparseable | 0.0 |

**Cost accounting:**

The engine maintains session-level totals. It enforces `config.maxSessionTokens`
as a hard ceiling — if the next call would exceed it, the engine returns a
`context_exceeded` response without calling the provider.

```typescript
// Illustrative signature

interface GenerationEngine {
  generate(task: GenerationTask): Promise<GenerationResponse>;
  registerProvider(provider: GenerationProvider): void;
  getSessionCost(): SessionCost;
  listProviders(): string[];
}

interface GenerationProvider {
  readonly name:    string;   // e.g. "claude", "openai", "gemini", "local"
  readonly modelId: string;   // e.g. "claude-sonnet-5"
  generate(task: GenerationTask): Promise<GenerationResponse>;
}

interface SessionCost {
  totalPromptTokens:     number;
  totalCompletionTokens: number;
  totalTokens:           number;
  callCount:             number;
  estimatedCostUSD:      number | null;  // null when provider does not report pricing
}
```

---

## 4. GenerationTask

The canonical unit of work passed to `GenerationEngine.generate()`.
Produced by a concrete producer's `buildPrompt()` method.

A `GenerationTask` must be fully self-contained: given only the task and
a provider, the call must be reproducible.

```typescript
// Illustrative signature

interface GenerationTask {
  // Identity
  producerName:   string;          // e.g. "CompositionProducer"
  promptName:     string;          // e.g. "composition-producer"
  promptVersion:  string;          // e.g. "1.0.0"

  // Provider selection
  providerName:   string;          // must match a registered provider
  modelId:        string;          // exact model ID to use

  // Prompt content
  systemPrompt:   string;          // full system prompt (loaded from PromptRegistry)
  userMessage:    string;          // assembled by buildPrompt() from context fields

  // Generation parameters
  temperature:    number;          // 0.0–1.0
  maxTokens:      number;

  // Response contract
  expectedFormat: "json" | "text"; // engine uses this to apply normalisation

  // Correlation
  correlationId:  string;          // = FactoryContext.runId
  metadata:       Record<string, string>; // arbitrary key/value for logging
}
```

---

## 5. PromptRegistry

Manages prompt files outside TypeScript source. Prompts are plain text files,
versioned independently of code.

**Versioning strategy:**

- Semantic versioning: `{major}.{minor}.{patch}`
- **Major** — prompt intent changes; model behaviour may change materially
- **Minor** — tuning, examples added, wording improved; behaviour improves
- **Patch** — typo fixes, formatting only

Breaking major changes require updating `ProducerConfig.promptVersion` pins
in `FactoryConfig`.

**Storage layout:**

```
scripts/factory/prompts/
  {producer-name}.v{version}.txt

Examples:
  composition-producer.v1.0.0.txt
  editorial-producer.v1.0.0.txt
  editorial-producer.v1.1.0.txt
  discovery-producer.v2.0.0.txt
```

**Loading:**

- Lazy: files are read from disk only on first request
- Cached: subsequent calls in the same session return the in-memory copy
- Never re-read during a single factory run

**Selection:**

```typescript
// Illustrative signature

interface PromptRegistry {
  load(promptName: string, version: string): PromptVersion;  // explicit version
  loadLatest(promptName: string): PromptVersion;             // highest semver found
  listAvailable(): PromptVersion[];                          // all discovered prompts
}

interface PromptVersion {
  name:       string;   // e.g. "composition-producer"
  version:    string;   // e.g. "1.0.0"
  content:    string;   // full text content
  loadedFrom: string;   // absolute path — for audit trail
  loadedAt:   Date;
}
```

**Fallback policy (per producer, configured in FactoryConfig):**

| Policy | Behaviour when requested version not found |
|---|---|
| `"fail"` (default) | Throw — hard stop. No ambiguity. |
| `"previous"` | Try previous minor version (same major). Fail if none found. |

**Never fall forward:** a missing `1.0.0` will not silently use `1.1.0`.
Version pins are explicit.

---

## 6. FactoryConfig

The global configuration object for a factory session. Assembled once
from: compiled defaults → optional `scripts/factory/factory.config.json`
→ CLI flag overrides.

```typescript
// Illustrative signature

interface FactoryConfig {

  // ── Provider registry ───────────────────────────────────────────────────
  defaultProvider: string;                         // e.g. "claude"
  providers:       Record<string, ProviderConfig>;

  // ── Per-producer overrides (keyed by producer name) ─────────────────────
  producers:       Record<string, ProducerConfig>;

  // ── Session limits ──────────────────────────────────────────────────────
  maxSessionTokens:  number;   // hard ceiling across all producers in a run
  maxProducerTokens: number;   // per-producer ceiling (overridable per producer)

  // ── Dry-run ─────────────────────────────────────────────────────────────
  dryRun: boolean;
  // When true: all GenerationEngine.generate() calls are intercepted.
  // Engine returns a stub GenerationResponse with empty content and zero tokens.
  // Draft is written with FACTORY_DRY_RUN annotations instead of producer output.

  // ── Logging ─────────────────────────────────────────────────────────────
  logLevel:            "silent" | "normal" | "verbose" | "debug";
  logProducerArtifacts: boolean;
  // When true: raw LLM responses written to scripts/factory/artifacts/{slug}/{producer}.json

  // ── Timeouts (ms) ───────────────────────────────────────────────────────
  generationTimeout: number;   // single LLM call timeout
  producerTimeout:   number;   // total producer run timeout (all retry attempts combined)

  // ── Retry policy ────────────────────────────────────────────────────────
  maxAttempts:      number;                         // default: 3
  backoffStrategy:  "linear" | "exponential";       // default: "exponential"
  backoffBaseMs:    number;                         // default: 1000
}

interface ProviderConfig {
  name:         string;   // must match a registered GenerationProvider
  modelId:      string;   // e.g. "claude-sonnet-5"
  apiKeyEnvVar: string;   // e.g. "ANTHROPIC_API_KEY"
}

interface ProducerConfig {
  enabled:         boolean;             // false → producer is skipped (preCheck fails)
  providerName?:   string;              // override defaultProvider for this producer
  modelId?:        string;              // override provider's default model
  temperature:     number;
  maxTokens:       number;
  promptVersion?:  string;              // pin to specific version; undefined = loadLatest
  promptFallback?: "fail" | "previous"; // default: "fail"
}
```

**Dry-run guarantee:** When `dryRun: true`, no network call is made under
any circumstance. The engine short-circuits before calling the provider.
This is enforced inside `GenerationEngine`, not inside producers.

---

## 7. ProducerResult

The return type of every producer run. The merger uses `fields` to enrich
the record. The orchestrator uses `status` to decide whether to continue.
The draft builder uses `errors`, `warnings`, and `confidence` for annotations.

```typescript
// Illustrative signature

type ProducerStatus = "success" | "degraded" | "failed" | "skipped";

interface ProducerResult {
  // Identity
  producerName:    string;
  producerVersion: string;
  promptVersion:   string | null;   // null when status=skipped or preCheck failed

  // Outcome
  status:   ProducerStatus;
  fields:   Partial<FragranceKnowledge>;  // fields contributed by this producer
  confidence: number;                     // 0.0–1.0 from GenerationEngine

  // Issues
  errors:   string[];   // present when status=degraded (fields still applied) or status=failed
  warnings: string[];   // always applied regardless of status

  // Metrics
  metrics: ProducerMetrics;

  // Debug artifacts
  artifacts: ProducerArtifact[];   // empty unless config.logProducerArtifacts=true

  // Skip reason
  skippedReason?: string;          // populated only when status=skipped
}

interface ProducerMetrics {
  durationMs:        number;
  attempts:          number;        // 1 normally; 2–3 if retried
  promptTokens:      number;
  completionTokens:  number;
  totalTokens:       number;
  modelId:           string;        // actual model used (may differ from task.modelId if aliased)
  cached:            boolean;       // true if provider returned a cached/prompt-cached response
}

interface ProducerArtifact {
  type:      "raw_response" | "parsed_fields" | "validation_trace";
  content:   string;   // JSON-serialised
  createdAt: Date;
}
```

**Status semantics and merger behaviour:**

| Status | `fields` state | Merger applies `fields`? | Pipeline continues? |
|---|---|---|---|
| `success` | Complete, validated | ✓ | ✓ |
| `degraded` | Partial or has issues | ✓ — with FACTORY_WARN annotation | ✓ |
| `failed` | Empty or unparseable | ✗ | ✓ — record proceeds without these fields |
| `skipped` | Empty | ✗ | ✓ |

A `failed` producer does not abort the pipeline. The record proceeds and
the draft is annotated. Promotion will be blocked by the downstream
validator if required fields are absent.

---

## 8. FactoryLogger

Structured event logger for the factory session. Distinct from `FactoryLogEntry`
(the durable run ledger in `factory-log.json`) — `FactoryLogger` handles
in-session console output and structured event emission.

**Responsibilities:**

- Emit structured `LogEvent` objects at configurable levels
- Carry the run's `correlationId` (= `FactoryContext.runId`) on every event
- Format human-readable output consistent with the existing orchestrator
  console style (icon + stage name + status + duration)
- Provide separate logging surfaces for pipeline-level and producer-level events

**Log levels:**

| Level | What it shows |
|---|---|
| `silent` | Nothing |
| `normal` (default) | Stage outcomes, producer outcomes, final summary |
| `verbose` | Above + token counts, confidence scores, prompt versions |
| `debug` | Above + full GenerationRequest/Response, parse traces |

```typescript
// Illustrative signature

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEvent {
  level:         LogLevel;
  correlationId: string;           // = FactoryContext.runId
  slug:          string;
  producerName:  string | null;    // null for pipeline-level events
  stage:         string;
  message:       string;
  durationMs?:   number;
  data?:         Record<string, unknown>;  // structured payload (verbose/debug only)
  timestamp:     Date;
}

interface FactoryLogger {
  // Configuration
  setLevel(level: "silent" | "normal" | "verbose" | "debug"): void;
  setCorrelationId(id: string): void;

  // Pipeline-level events
  pipelineStart(slug: string): void;
  pipelineEnd(slug: string, durationMs: number, status: string): void;
  stagePass(stage: string, durationMs: number): void;
  stageFail(stage: string, durationMs: number, message: string): void;
  stageDegraded(stage: string, durationMs: number, message: string): void;

  // Producer-level events
  producerStart(producerName: string): void;
  producerEnd(result: ProducerResult): void;

  // Emit raw event (for infrastructure use)
  emit(event: LogEvent): void;
}
```

**Correlation ID:**

Every `LogEvent` carries `correlationId = FactoryContext.runId`. This is
a UUID set when the context is built and propagated through all sub-systems.
Log analysis can reconstruct a complete production run by filtering on a
single `correlationId`.

**Console format contract** (matches P1 orchestrator style):

```
  ✓  intake           pass      1ms
  ✓  scaffold         pass      2ms
  ⚠  composition      degraded  210ms  (3 errors)
  ✓  editorial        success   180ms
  ✗  discovery        failed    350ms  (parse error: invalid JSON)
```

`FactoryLogger` does not write to `factory-log.json`. The `FactoryLogEntry`
durable ledger is written by `FactoryLogger` after the pipeline completes
via a separate `FactoryLogEntry` update call (handled by the orchestrator).

---

## 9. Invariants

These rules apply across all P2+ factory components without exception.

**Context invariants:**
- A producer may never import from `app/lib/mkc/`, `app/data/`, or any
  other application module. All data arrives via `FactoryContext`.
- `ContextBuilder` is the only module that reads from the application layer.

**Engine invariants:**
- Producers never call `GenerationProvider.generate()` directly.
  All LLM access goes through `GenerationEngine.generate()`.
- When `dryRun: true`, no network call is ever made.

**Prompt invariants:**
- No prompt string is embedded in TypeScript source.
- All prompt content lives in `scripts/factory/prompts/*.txt`.
- Prompts are loaded via `PromptRegistry`; never via `fs.readFileSync` directly
  inside a producer.

**Result invariants:**
- A `failed` producer never aborts the pipeline.
- A `failed` producer's `fields` are never applied by the merger.
- `confidence: 0.0` is only valid when `status` is `"failed"` or `"skipped"`.

**Promotion invariant:**
- `promotionManager.ts` remains the only module that writes to
  `app/lib/mkc/native/`. No producer, engine, or logger may write there.

**Build invariant:**
- All factory TypeScript must compile cleanly as part of `npm run build`.
- A draft file with `FACTORY_ERROR` annotations must still be valid TypeScript.
  Annotations are comments, not code.

---

*Contract version 1.0 — frozen 2026-07-12*
*Next review: before P3 (Relationship Producer)*
