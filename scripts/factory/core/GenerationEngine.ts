/**
 * Knowledge Factory — Generation Engine
 *
 * Provider registry with retry, cost tracking, response normalisation,
 * and confidence scoring. Producers never touch providers directly.
 *
 * Retry policy (from FactoryConfig):
 *   Retryable:     rate_limited | timeout | malformed_response
 *   Not retryable: context_exceeded | auth_error | error
 *
 * Confidence scoring:
 *   1.0 — valid JSON, all expected fields present
 *   0.5 — valid JSON after stripping markdown fences
 *   0.0 — unparseable
 */

import type {
  FactoryConfig,
  GenerationProvider,
  GenerationTask,
  GenerationResponse,
  SessionCost,
} from "./types";

export class GenerationEngine {
  private readonly providers = new Map<string, GenerationProvider>();
  private readonly cost: SessionCost = {
    totalPromptTokens:     0,
    totalCompletionTokens: 0,
    totalTokens:           0,
    callCount:             0,
  };

  constructor(private readonly config: FactoryConfig) {}

  registerProvider(provider: GenerationProvider): void {
    this.providers.set(provider.name, provider);
  }

  listProviders(): string[] {
    return [...this.providers.keys()];
  }

  getSessionCost(): SessionCost {
    return { ...this.cost };
  }

  async generate(task: GenerationTask): Promise<GenerationResponse> {
    // Dry-run — no network call under any circumstance
    if (this.config.dryRun) {
      return { status: "dry_run", content: "", confidence: 0, usage: zeroUsage(), modelId: task.modelId, durationMs: 0, attempts: 0 };
    }

    // Session token ceiling
    if (this.cost.totalTokens >= this.config.maxSessionTokens) {
      return errResponse(task, "context_exceeded", "Session token limit reached");
    }

    const provider = this.providers.get(task.providerName);
    if (!provider) {
      return errResponse(
        task, "error",
        `No provider registered: "${task.providerName}". Available: [${this.listProviders().join(", ")}]`,
      );
    }

    let last: GenerationResponse = errResponse(task, "error", "No attempts made");

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      if (attempt > 1) await sleep(this.backoffMs(attempt));

      const t0 = Date.now();
      try {
        const timeout = new Promise<never>((_, rej) =>
          setTimeout(() => rej(new Error("timeout")), this.config.generationTimeout),
        );
        last = await Promise.race([provider.generate(task), timeout]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        last = { ...errResponse(task, msg === "timeout" ? "timeout" : "error", msg), durationMs: Date.now() - t0 };
      }

      last = { ...last, attempts: attempt };

      if (task.expectedFormat === "json" && last.status === "success") {
        last = normaliseJson(last);
      }

      if (!isRetryable(last.status)) break;
    }

    this.accumulate(last);
    return last;
  }

  private backoffMs(attempt: number): number {
    return this.config.backoffStrategy === "exponential"
      ? this.config.backoffBaseMs * Math.pow(2, attempt - 2)
      : this.config.backoffBaseMs;
  }

  private accumulate(r: GenerationResponse): void {
    this.cost.totalPromptTokens     += r.usage.promptTokens;
    this.cost.totalCompletionTokens += r.usage.completionTokens;
    this.cost.totalTokens           += r.usage.totalTokens;
    this.cost.callCount++;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normaliseJson(r: GenerationResponse): GenerationResponse {
  let content = r.content.trim();
  let confidence = 1.0;

  const fence = content.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) {
    content    = fence[1].trim();
    confidence = 0.5;
  }

  try {
    const parsed = JSON.parse(content);
    if (typeof parsed !== "object" || parsed === null) {
      return { ...r, status: "malformed_response", content, confidence: 0.0 };
    }
    return { ...r, content, confidence };
  } catch {
    return { ...r, status: "malformed_response", content, confidence: 0.0 };
  }
}

function isRetryable(status: GenerationResponse["status"]): boolean {
  return status === "rate_limited" || status === "timeout" || status === "malformed_response";
}

function errResponse(task: GenerationTask, status: GenerationResponse["status"], error: string): GenerationResponse {
  return { status, content: "", confidence: 0.0, usage: zeroUsage(), modelId: task.modelId, durationMs: 0, attempts: 1, error };
}

function zeroUsage() {
  return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
