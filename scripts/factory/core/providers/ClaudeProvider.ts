/**
 * Knowledge Factory — Claude Provider
 *
 * Concrete GenerationProvider backed by @anthropic-ai/sdk.
 * API key sourced from constructor arg or ANTHROPIC_API_KEY env var.
 *
 * Maps Anthropic error types to GenerationStatus:
 *   429 / rate_limit  → "rate_limited"
 *   529 / overloaded  → "rate_limited"
 *   all other errors  → "error"
 */

import Anthropic from "@anthropic-ai/sdk";
import type { GenerationProvider, GenerationTask, GenerationResponse } from "../types";

export class ClaudeProvider implements GenerationProvider {
  readonly name = "claude";
  private readonly client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({ apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY });
  }

  get modelId(): string {
    return "claude-haiku-4-5-20251001";
  }

  async generate(task: GenerationTask): Promise<GenerationResponse> {
    const t0 = Date.now();
    try {
      const response = await this.client.messages.create({
        model:      task.modelId,
        max_tokens: task.maxTokens,
        system:     task.systemPrompt,
        messages:   [{ role: "user", content: task.userMessage }],
      });

      const block   = response.content[0];
      const content = block.type === "text" ? block.text : "";

      return {
        status:     "success",
        content,
        confidence: 1.0,
        usage: {
          promptTokens:     response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens:      response.usage.input_tokens + response.usage.output_tokens,
        },
        modelId:    task.modelId,
        durationMs: Date.now() - t0,
        attempts:   1,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const lower   = message.toLowerCase();
      const status  = lower.includes("rate limit") || lower.includes("overloaded")
        ? "rate_limited"
        : "error";

      return {
        status,
        content:    "",
        confidence: 0.0,
        usage:      { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        modelId:    task.modelId,
        durationMs: Date.now() - t0,
        attempts:   1,
        error:      message,
      };
    }
  }
}
