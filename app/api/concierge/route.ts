/**
 * Maison Concierge — API Route
 *
 * POST /api/concierge
 *
 * EP15-P2 orchestration:
 *   planConversation     — decide what kind of turn this is
 *   resolveIntent        — classify the message (skipped when reusing cache)
 *   planRetrieval        — fetch relevant fragrances/articles (skipped when cached)
 *   buildCachedRetrieval — reconstruct context from state when cached
 *   buildContext         — build structured prompt sections
 *   callClaude           — invoke the LLM with system prompt + history
 *   planResponse         — extract markers, generate contextual follow-ups
 *   formatResponse       — resolve slugs → UI-safe objects
 *
 * Environment:
 *   ANTHROPIC_API_KEY    — required (SDK default)
 *   CLAUDE_CONCIERGE_MODEL — optional model override (default: claude-sonnet-5)
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { planConversation }                    from "../../lib/concierge/conversationPlanner";
import { resolveIntent }                       from "../../lib/concierge/intentResolver";
import { planRetrieval, buildCachedRetrieval } from "../../lib/concierge/retrievalPlanner";
import { buildContext, renderContext }          from "../../lib/concierge/contextBuilder";
import { buildSystemPrompt, validateResponse, SAFE_FALLBACK } from "../../lib/concierge/safetyGuard";
import { planResponse }                        from "../../lib/concierge/responsePlanner";
import { formatResponse }                      from "../../lib/concierge/responseFormatter";
import { extractProfile }                                                              from "../../lib/concierge/profileExtractor";
import { buildConsultationPlan, evolveConsultationPlan, detectAffectedRoles }          from "../../lib/concierge/consultationTracker";
import type { ConversationState, SessionUpdates, FormattedResponse, ConsultationPlan } from "../../lib/concierge/types";

// ── Model configuration ───────────────────────────────────────────────────────

const PRIMARY_MODEL  = process.env.CLAUDE_CONCIERGE_MODEL ?? "claude-sonnet-5";
const FALLBACK_MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS     = 400;
const MAX_HISTORY    = 8;

const client = new Anthropic();

// ── Claude call with model fallback ──────────────────────────────────────────

async function callClaude(
  messages:     Array<{ role: "user" | "assistant"; content: string }>,
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

    // 0. Extract and accumulate profile from this message
    const updatedProfile = extractProfile(message, state.profile);

    // 0b. Detect refinement against the active consultation plan (EP18-P1)
    const refinement = state.consultationPlan
      ? detectAffectedRoles(state.consultationPlan, updatedProfile, message)
      : null;

    // 1. Conversation planning — decide action before retrieval
    const plan = planConversation(message, state);

    // 2. Retrieval — conditional on plan
    let retrieval;
    let resolvedIntent;

    if (plan.requiresRetrieval) {
      resolvedIntent = resolveIntent(message, state.context);
      retrieval      = planRetrieval(resolvedIntent, state.context, updatedProfile, refinement?.affectedRoles);
    } else {
      // Reuse cached recommendations without a new catalogue search
      retrieval = buildCachedRetrieval(state);
    }

    // Determine the effective intent for response planning
    const effectiveIntent = resolvedIntent?.intent ?? plan.nextIntent;

    // 3. Build context — includes conversation state, plan, resolved intent, accumulated profile, and refinement
    const builtContext   = buildContext(retrieval, { ...state, profile: updatedProfile }, plan, effectiveIntent, refinement);
    const contextContent = renderContext(builtContext);

    // 4. Build system prompt
    const systemPrompt = buildSystemPrompt(contextContent);

    // 5. Prepare message history
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
    const planned   = planResponse(content, effectiveIntent, retrieval, plan);
    const formatted = formatResponse(planned);

    // 8b. Build or evolve the consultation plan (EP18-P1)
    // In refinement mode, merge kept roles from the existing plan with new
    // assignments — preserving roles the customer did not ask to change.
    const newPlan = buildConsultationPlan(planned.recommendedSlugs, updatedProfile);
    const consultationPlan: ConsultationPlan | undefined =
      refinement && state.consultationPlan && newPlan
        ? evolveConsultationPlan(state.consultationPlan, refinement.affectedRoles, newPlan)
        : (newPlan ?? state.consultationPlan ?? undefined);

    // 9. Derive session state updates for the client to store
    const sessionUpdates: SessionUpdates = {
      selectedSlug:    planned.recommendedSlugs[0],
      lastArticleSlug: planned.articleSlugs[0],
      lastCollection:  retrieval.collectionName,
      comparisonSlugs: plan.requiresComparison
        ? planned.recommendedSlugs.slice(0, 2)
        : state.comparisonSlugs,
      profile:         updatedProfile,
      consultationPlan,
    };

    const response: FormattedResponse = { ...formatted, sessionUpdates };

    return NextResponse.json(response);

  } catch (error) {
    console.error("[Concierge API]", error instanceof Error ? error.message : error);

    return NextResponse.json({
      content:             SAFE_FALLBACK,
      fragrances:          [],
      articles:            [],
      followUpSuggestions: ["Tell me what scents you enjoy.", "What occasions do you need a fragrance for?"],
      intent:              "general_discovery",
    } satisfies FormattedResponse);
  }
}
