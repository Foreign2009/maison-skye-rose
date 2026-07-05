/**
 * Maison Concierge — API Route
 *
 * POST /api/concierge
 *
 * Receives a customer message and the current ConversationState.
 * Orchestrates: intent resolution → retrieval → context building →
 * Claude API → response planning → formatting → JSON response.
 *
 * The API key is ANTHROPIC_API_KEY (standard SDK default).
 * The model is CLAUDE_CONCIERGE_MODEL (env var, defaults to claude-sonnet-5).
 *
 * This is the only file in the project that imports @anthropic-ai/sdk.
 * It must remain server-only and never be imported by client components.
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { resolveIntent }           from "../../lib/concierge/intentResolver";
import { planRetrieval }           from "../../lib/concierge/retrievalPlanner";
import { buildContext, renderContext } from "../../lib/concierge/contextBuilder";
import { buildSystemPrompt, validateResponse, SAFE_FALLBACK } from "../../lib/concierge/safetyGuard";
import { planResponse }            from "../../lib/concierge/responsePlanner";
import { formatResponse }          from "../../lib/concierge/responseFormatter";
import type { ConversationState }  from "../../lib/concierge/types";

// ── Model configuration ───────────────────────────────────────────────────────

const PRIMARY_MODEL  = process.env.CLAUDE_CONCIERGE_MODEL ?? "claude-sonnet-5";
const FALLBACK_MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS     = 400;
const MAX_HISTORY    = 8; // turns to include from conversation history

const client = new Anthropic();

// ── Claude call with model fallback ──────────────────────────────────────────

async function callClaude(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string
): Promise<string> {
  async function attempt(model: string): Promise<string> {
    const response = await client.messages.create({
      model,
      max_tokens:  MAX_TOKENS,
      temperature: 0,
      system:      systemPrompt,
      messages,
    });
    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");
  }

  try {
    return await attempt(PRIMARY_MODEL);
  } catch {
    if (PRIMARY_MODEL === FALLBACK_MODEL) throw new Error("Claude unavailable");
    return await attempt(FALLBACK_MODEL);
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { message?: string; state?: ConversationState };
    const { message, state } = body;

    if (!message?.trim() || !state) {
      return NextResponse.json({ error: "message and state are required" }, { status: 400 });
    }

    // 1. Resolve intent
    const resolved = resolveIntent(message, state.context);

    // 2. Plan retrieval
    const retrieval = planRetrieval(resolved, state.context);

    // 3. Build context
    const builtContext   = buildContext(retrieval);
    const contextContent = renderContext(builtContext);

    // 4. Build system prompt
    const systemPrompt = buildSystemPrompt(contextContent);

    // 5. Prepare history (last N turns, roles normalised)
    const history = state.turns.slice(-MAX_HISTORY).map((turn) => ({
      role:    turn.role as "user" | "assistant",
      content: turn.content,
    }));

    // 6. Call Claude
    const rawContent = await callClaude(
      [...history, { role: "user" as const, content: message }],
      systemPrompt
    );

    // 7. Validate safety
    const safe    = validateResponse(rawContent);
    const content = safe ? rawContent : SAFE_FALLBACK;

    // 8. Plan and format response
    const planned   = planResponse(content, resolved.intent, retrieval);
    const formatted = formatResponse(planned);

    return NextResponse.json(formatted);

  } catch (error) {
    console.error("[Concierge API]", error instanceof Error ? error.message : error);

    // Always return 200 with fallback — never expose 500 to the UI
    return NextResponse.json({
      content:             SAFE_FALLBACK,
      fragrances:          [],
      articles:            [],
      followUpSuggestions: ["Tell me what scents you enjoy.", "What occasions do you need a fragrance for?"],
      intent:              "general_discovery",
    } satisfies import("../../lib/concierge/types").FormattedResponse);
  }
}
