/**
 * Maison Concierge — Claude client wrapper
 *
 * Extracted from route.ts so the call logic can be exercised by tests without
 * importing the Next.js route handler. The Anthropic client is passed as a
 * parameter (dependency injection) so tests can supply a mock.
 */

import type Anthropic from "@anthropic-ai/sdk";

// ── Token budgets ─────────────────────────────────────────────────────────────

export const MAX_TOKENS            = 400;
// Comparison turns: 3 fragrances × intelligence scores + decisive recommendation
// routinely exceeds 400 tokens. 700 gives headroom without an unbounded budget.
export const MAX_TOKENS_COMPARISON = 700;

/** Returns the appropriate token budget for this turn. */
export function selectTokenBudget(requiresComparison: boolean): number {
  return requiresComparison ? MAX_TOKENS_COMPARISON : MAX_TOKENS;
}

// ── Truncation fallback ───────────────────────────────────────────────────────

// Returned when the provider signals stop_reason="max_tokens" — i.e. generation
// was cut off before a natural sentence boundary. Displayed instead of
// unfinished prose. Not the same as SAFE_FALLBACK (forbidden-content guard).
// Phrased independently of any visible cards so it is accurate for every request.
export const TRUNCATION_FALLBACK =
  "I couldn't complete that response. Please try again, or ask about one specific aspect, " +
  "such as sweetness, freshness, warmth, or occasion.";

// ── Provider call ─────────────────────────────────────────────────────────────

/**
 * Calls Claude with a model-fallback strategy and stop_reason guard.
 *
 * - stop_reason "end_turn"   → returns the model's text as-is.
 * - stop_reason "max_tokens" → returns TRUNCATION_FALLBACK (complete, safe prose).
 * - Provider error on primary → retried once on fallbackModel; re-throws if both fail.
 */
export async function callClaude(
  client:        Anthropic,
  messages:      Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt:  string,
  maxTokens:     number = MAX_TOKENS,
  primaryModel:  string = "claude-sonnet-5",
  fallbackModel: string = "claude-haiku-4-5-20251001",
): Promise<string> {
  async function attempt(model: string): Promise<string> {
    const response = await client.messages.create({
      model,
      max_tokens:  maxTokens,
      temperature: 0,
      system:      systemPrompt,
      messages,
    });
    if (response.stop_reason === "max_tokens") {
      return TRUNCATION_FALLBACK;
    }
    return (response.content as Array<{ type: string; text?: string }>)
      .filter((block) => block.type === "text")
      .map((block) => block.text ?? "")
      .join("");
  }

  try {
    return await attempt(primaryModel);
  } catch {
    if (primaryModel === fallbackModel) throw new Error("Claude unavailable");
    return await attempt(fallbackModel);
  }
}
