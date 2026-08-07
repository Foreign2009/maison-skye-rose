/**
 * Knowledge Factory — Home Fragrance Base Producer
 *
 * Abstract lifecycle class for Home Fragrance producers.
 * Parallel to BaseProducer — typed entirely around HomeFragranceFactoryContext,
 * Partial<HomeFragranceKnowledge>, and HomeFragranceProducerResult.
 *
 * Does NOT extend BaseProducer. BaseProducer is typed around FactoryContext,
 * FragranceKnowledge, and DisplayFragrance — none of which apply to home
 * fragrance. A parallel abstract class preserves the domain boundary.
 *
 * Lifecycle (run() is not overridable per FACTORY_CONTRACT discipline):
 *   1. preCheck     — skip guard (overridable with default pass)
 *   2. buildPrompt  — build GenerationTask (abstract)
 *   3. engine.generate() — provider execution (engine owns retry/timeout)
 *   4. parse        — extract Partial<HomeFragranceKnowledge> (abstract)
 *   5. validate     — producer-level field checks, pre-merge (abstract)
 *   6. measure      — token metrics (overridable with default)
 *   7. assemble     — return HomeFragranceProducerResult
 */

import type { GenerationEngine } from "./GenerationEngine";
import type {
  HomeFragranceFactoryContext,
  HomeFragranceKnowledge,
  HomeFragranceProducerResult,
  GenerationTask,
  GenerationResponse,
  ProducerMetrics,
  ProducerArtifact,
  PreCheckResult,
  ProducerValidation,
} from "./types";

// ── ProducerSet type ───────────────────────────────────────────────────────────
//
// Structurally distinct from the fragrance ProducerSet (BaseProducer[]).
// A HomeFragranceProducerSet will not compile if fragrance BaseProducer
// instances are accidentally substituted — the abstract method signatures
// on HomeFragranceBaseProducer use HomeFragranceFactoryContext and
// Partial<HomeFragranceKnowledge>, which are incompatible with their
// fragrance equivalents.

export type HomeFragranceProducerSet = {
  readonly category: "home-fragrance";
  readonly producers: readonly HomeFragranceBaseProducer[];
};

// ── Abstract base ──────────────────────────────────────────────────────────────

export abstract class HomeFragranceBaseProducer {
  abstract readonly name:    string;
  abstract readonly version: string;

  async run(
    context: HomeFragranceFactoryContext,
    engine:  GenerationEngine,
  ): Promise<HomeFragranceProducerResult> {
    const t0 = Date.now();

    // ── Step 1: pre-check ─────────────────────────────────────────────────────
    const check = this.preCheck(context);
    if (!check.pass) {
      return this.skipped(check.reason ?? "preCheck failed", t0);
    }

    // ── Step 2: build prompt ──────────────────────────────────────────────────
    let task: GenerationTask;
    try {
      task = this.buildPrompt(context);
    } catch (err) {
      return this.failed(`buildPrompt: ${msg(err)}`, t0);
    }

    // ── Step 3: execute ───────────────────────────────────────────────────────
    const response = await engine.generate(task);

    if (response.status === "dry_run") {
      return this.skipped("dry-run mode — no API call made", t0);
    }

    if (response.status !== "success") {
      return this.failedWithResponse(
        `generation: ${response.error ?? response.status}`,
        response, task.promptVersion, t0,
      );
    }

    // ── Step 4: parse ─────────────────────────────────────────────────────────
    let fields: Partial<HomeFragranceKnowledge>;
    try {
      fields = this.parse(response, context);
    } catch (err) {
      return this.failedWithResponse(`parse: ${msg(err)}`, response, task.promptVersion, t0);
    }

    // ── Step 5: validate ──────────────────────────────────────────────────────
    const validation = this.validate(fields, context);

    // ── Step 6: measure ───────────────────────────────────────────────────────
    const metrics = this.measure(context, response, Date.now() - t0);

    // ── Step 7: assemble ──────────────────────────────────────────────────────
    const artifacts: ProducerArtifact[] = context.config.logProducerArtifacts
      ? [{ type: "raw_response", content: response.content, createdAt: new Date() }]
      : [];

    return {
      producerName:    this.name,
      producerVersion: this.version,
      promptVersion:   task.promptVersion,
      status:          validation.errors.length > 0 ? "degraded" : "success",
      fields,
      confidence:      response.confidence,
      errors:          validation.errors,
      warnings:        validation.warnings,
      metrics,
      artifacts,
    };
  }

  // ── Extension points ───────────────────────────────────────────────────────

  protected preCheck(_ctx: HomeFragranceFactoryContext): PreCheckResult {
    return { pass: true };
  }

  protected abstract buildPrompt(ctx: HomeFragranceFactoryContext): GenerationTask;

  protected abstract parse(
    response: GenerationResponse,
    ctx:      HomeFragranceFactoryContext,
  ): Partial<HomeFragranceKnowledge>;

  protected abstract validate(
    fields: Partial<HomeFragranceKnowledge>,
    ctx:    HomeFragranceFactoryContext,
  ): ProducerValidation;

  protected measure(
    _ctx:       HomeFragranceFactoryContext,
    response:   GenerationResponse,
    durationMs: number,
  ): ProducerMetrics {
    return {
      durationMs,
      attempts:         response.attempts,
      promptTokens:     response.usage.promptTokens,
      completionTokens: response.usage.completionTokens,
      totalTokens:      response.usage.totalTokens,
      modelId:          response.modelId,
      cached:           false,
    };
  }

  // ── Result builders ────────────────────────────────────────────────────────

  private skipped(reason: string, t0: number): HomeFragranceProducerResult {
    return {
      producerName:    this.name,
      producerVersion: this.version,
      promptVersion:   null,
      status:          "skipped",
      fields:          {},
      confidence:      0.0,
      errors:          [],
      warnings:        [],
      metrics:         emptyMetrics(Date.now() - t0),
      artifacts:       [],
      skippedReason:   reason,
    };
  }

  private failed(error: string, t0: number): HomeFragranceProducerResult {
    return {
      producerName:    this.name,
      producerVersion: this.version,
      promptVersion:   null,
      status:          "failed",
      fields:          {},
      confidence:      0.0,
      errors:          [error],
      warnings:        [],
      metrics:         emptyMetrics(Date.now() - t0),
      artifacts:       [],
    };
  }

  private failedWithResponse(
    error:         string,
    response:      GenerationResponse,
    promptVersion: string,
    t0:            number,
  ): HomeFragranceProducerResult {
    return {
      producerName:    this.name,
      producerVersion: this.version,
      promptVersion,
      status:          "failed",
      fields:          {},
      confidence:      0.0,
      errors:          [error],
      warnings:        [],
      metrics: {
        durationMs:       Date.now() - t0,
        attempts:         response.attempts,
        promptTokens:     response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
        totalTokens:      response.usage.totalTokens,
        modelId:          response.modelId,
        cached:           false,
      },
      artifacts: [],
    };
  }
}

// ── Module helpers ─────────────────────────────────────────────────────────────

function emptyMetrics(durationMs: number): ProducerMetrics {
  return { durationMs, attempts: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0, modelId: "", cached: false };
}

function msg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
