/**
 * Knowledge Factory — Mock Home Fragrance Generation Provider
 *
 * Deterministic provider for validating the complete Home Fragrance producer
 * chain without any network calls or API keys.
 *
 * Routes by producerName:
 *   HomeFragranceCompositionProducer → fixed composition JSON
 *   HomeFragranceEditorialProducer   → fixed editorial JSON
 *   unknown producer                 → error response
 *
 * Never calls any external service. Safe to invoke in CI and local
 * validation without ANTHROPIC_API_KEY or any other credential.
 */

import type { GenerationProvider, GenerationTask, GenerationResponse } from "../core/types";

// ── Fixed deterministic outputs ───────────────────────────────────────────────

const COMPOSITION_CONTENT = JSON.stringify({
  top:   ["Rose", "Bergamot"],
  heart: ["Oud", "Geranium"],
  base:  ["Sandalwood", "Amber"],
});

const EDITORIAL_CONTENT = JSON.stringify({
  subtitle:    "Warm Ritual",
  description: "A rich interplay of rose and oud opens the room with warmth and quiet depth. " +
               "Geranium adds a grounding green accord as the heart settles into the space with assured elegance. " +
               "Sandalwood and amber linger long after, anchoring the atmosphere with calm, enduring richness.",
});

// ── Mock provider ─────────────────────────────────────────────────────────────

export class MockHomeFragranceGenerationProvider implements GenerationProvider {
  readonly name    = "mock-home-fragrance";
  readonly modelId = "mock-hf-1.0.0";

  async generate(task: GenerationTask): Promise<GenerationResponse> {
    let content: string;

    if (task.producerName === "HomeFragranceCompositionProducer") {
      content = COMPOSITION_CONTENT;
    } else if (task.producerName === "HomeFragranceEditorialProducer") {
      content = EDITORIAL_CONTENT;
    } else {
      return {
        status:     "error",
        content:    "",
        confidence: 0.0,
        usage:      { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        modelId:    this.modelId,
        durationMs: 0,
        attempts:   1,
        error:      `MockHomeFragranceGenerationProvider: no fixture for producerName "${task.producerName}"`,
      };
    }

    return {
      status:     "success",
      content,
      confidence: 1.0,
      usage:      { promptTokens: 50, completionTokens: 100, totalTokens: 150 },
      modelId:    this.modelId,
      durationMs: 1,
      attempts:   1,
    };
  }
}
