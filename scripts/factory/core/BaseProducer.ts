/**
 * Knowledge Factory — Base Producer
 *
 * Abstract lifecycle class. All concrete producers extend this.
 * The run() lifecycle sequence is not overridable per FACTORY_CONTRACT.md.
 *
 * Abstract (must implement): buildPrompt, parse, validate
 * Overridable with defaults:  preCheck, measure
 */

import type { GenerationEngine } from "./GenerationEngine";
import type {
  FactoryContext,
  GenerationTask,
  GenerationResponse,
  ProducerResult,
  ProducerMetrics,
  ProducerArtifact,
  PreCheckResult,
  ProducerValidation,
  FragranceKnowledge,
} from "./types";

export abstract class BaseProducer {
  abstract readonly name:    string;
  abstract readonly version: string;

  async run(context: FactoryContext, engine: GenerationEngine): Promise<ProducerResult> {
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

    // ── Step 3: execute (engine owns retry, timeout, cost) ────────────────────
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
    let fields: Partial<FragranceKnowledge>;
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

  protected preCheck(_ctx: FactoryContext): PreCheckResult {
    return { pass: true };
  }

  protected abstract buildPrompt(ctx: FactoryContext): GenerationTask;

  protected abstract parse(
    response: GenerationResponse,
    ctx:      FactoryContext,
  ): Partial<FragranceKnowledge>;

  protected abstract validate(
    fields: Partial<FragranceKnowledge>,
    ctx:    FactoryContext,
  ): ProducerValidation;

  protected measure(
    _ctx:       FactoryContext,
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

  private skipped(reason: string, t0: number): ProducerResult {
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

  private failed(error: string, t0: number): ProducerResult {
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
  ): ProducerResult {
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
