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
import { detectRejections }                                                            from "../../lib/concierge/rejectionDetector";
import { buildConsultationPlan, evolveConsultationPlan, detectAffectedRoles, detectExplorationTarget } from "../../lib/concierge/consultationTracker";
import { adaptCustomerProfile }                from "../../lib/concierge/customerAdapter";
import { catalogueMaps }                       from "../../lib/discovery";
import type { ConversationState, SessionUpdates, FormattedResponse, ConsultationPlan }                 from "../../lib/concierge/types";
import type { UnifiedCustomerProfile }         from "../../lib/customer/profile/UnifiedCustomerProfile";

// ── Model configuration ───────────────────────────────────────────────────────

const PRIMARY_MODEL  = process.env.CLAUDE_CONCIERGE_MODEL ?? "claude-sonnet-5";
const FALLBACK_MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS     = 400;
const MAX_HISTORY    = 8;

const client = new Anthropic();

// ── Browser profile assembly ───────────────────────────────────────────────────

interface BrowserProfile {
  savedTitles?:  readonly string[];
  viewedTitles?: readonly string[];
}

function buildUnifiedProfileFromBrowser(
  browser: BrowserProfile,
): UnifiedCustomerProfile | null {
  const byName     = catalogueMaps.byName;
  const savedSlugs = (browser.savedTitles ?? [])
    .map((t) => byName.get(t)?.slug)
    .filter((s): s is string => !!s);
  const recentlyViewed = (browser.viewedTitles ?? [])
    .map((t) => byName.get(t)?.slug)
    .filter((s): s is string => !!s);

  if (savedSlugs.length === 0 && recentlyViewed.length === 0) return null;

  const now = Date.now();
  return {
    tier:           "unified",
    identity:       {},
    metadata:       { version: 1, createdAt: now, updatedAt: now },
    signals:        [],
    recentlyViewed,
    savedSlugs,
    lastQuizSlugs:  [],
    lastActiveAt:   null,
  };
}

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
    const body = await req.json() as {
      message?:       string;
      state?:         ConversationState;
      browserProfile?: BrowserProfile;
    };
    const { message, state } = body;

    if (!message?.trim() || !state) {
      return NextResponse.json({ error: "message and state are required" }, { status: 400 });
    }

    // Assemble unified customer profile from browser-persisted state (optional)
    const unifiedProfile = body.browserProfile
      ? buildUnifiedProfileFromBrowser(body.browserProfile)
      : null;
    const customerCtx = unifiedProfile ? adaptCustomerProfile(unifiedProfile) : null;

    // Compute session-wide recommendation history from existing assistant turns.
    // ConversationTurn.retrievedSlugs is populated by ConciergePanel on every
    // assistant turn before dispatch — no new client state required.
    // Bounded by the 10-turn client retention window: at most 5 assistant turns
    // contribute to the exclusion set in a typical alternating conversation.
    const cumulativeExcludeSlugs = new Set<string>(
      state.turns
        .filter((t) => t.role === "assistant" && (t.retrievedSlugs?.length ?? 0) > 0)
        .flatMap((t) => t.retrievedSlugs!)
    );

    // 0. Extract and accumulate profile from this message
    const updatedProfile = extractProfile(message, state.profile);

    // 0a. Detect slug-level rejections (EP-AI-C3):
    //   - Named-product rejection: "I don't like Sauvage" → reject sauvage-inspired
    //   - "None of those" → reject the previous recommendation set
    // Merged into updatedProfile so planRetrieval's hard rejection filter fires.
    const newRejectedSlugs = detectRejections(message, state.profile, state.lastRecommendationSlugs);
    if (newRejectedSlugs.length > 0) {
      updatedProfile.rejectedSlugs = newRejectedSlugs;
    }

    // 0b. Ordinal reference resolution (EP-AI-C3 / EP-AI-C4):
    // "the second one" / "option 2" / "the last one" → lastRecommendationSlugs[n]
    // Used in context building and as the anchor for anchored_refinement turns.
    type OrdinalIndex = number | "last";
    const ORDINAL_LOOKUP: Array<[RegExp, OrdinalIndex]> = [
      [/(the )?first( one| option| fragrance)?/,          0],
      [/(the )?second( one| option| fragrance)?/,         1],
      [/(the )?third( one| option| fragrance)?/,          2],
      [/\boption\s+(1|one)\b/,                             0],
      [/\boption\s+(2|two)\b/,                             1],
      [/\boption\s+(3|three)\b/,                           2],
      [/\bnumber\s+(1|one)\b/,                             0],
      [/\bnumber\s+(2|two)\b/,                             1],
      [/\bnumber\s+(3|three)\b/,                           2],
      [/\bthe\s+last\s+(one|option|fragrance)?\b/,        "last"],
    ];
    let resolvedOrdinalSlug: string | undefined;
    const qOrdinal = message.toLowerCase();
    for (const [pattern, idx] of ORDINAL_LOOKUP) {
      if (pattern.test(qOrdinal)) {
        resolvedOrdinalSlug = idx === "last"
          ? state.lastRecommendationSlugs?.at(-1)
          : state.lastRecommendationSlugs?.[idx as number];
        break;
      }
    }

    // 0c. Anchor resolution for anchored_refinement (EP-AI-C4):
    // Resolved early so it's available to planConversation signal context and
    // planRetrieval. Ordinal wins over persisted selectedSlug for specificity.
    // Evaluated after planConversation so we can check plan.action below.

    // 0d. Detect refinement against the active consultation plan (EP18-P1)
    const refinement = state.consultationPlan
      ? detectAffectedRoles(state.consultationPlan, updatedProfile, message)
      : null;

    // 1. Conversation planning — decide action before retrieval
    const plan = planConversation(message, state);

    // 1b. Detect exploration target when planning routes to alternative exploration (EP18-P2)
    const explorationTarget = (plan.action === "alternative_exploration" && state.consultationPlan)
      ? detectExplorationTarget(state.consultationPlan, message, state.selectedSlug)
      : null;

    // 1c. Anchor slug for anchored_refinement (EP-AI-C4):
    // Ordinal takes precedence (guest explicitly referenced a position);
    // falls back to persisted selectedSlug; falls back to first previous rec.
    const anchorSlug: string | undefined = plan.action === "anchored_refinement"
      ? (resolvedOrdinalSlug ?? state.selectedSlug ?? state.lastRecommendationSlugs?.[0])
      : undefined;

    // 2. Retrieval — conditional on plan
    let retrieval;
    let resolvedIntent;

    if (plan.requiresRetrieval) {
      resolvedIntent = resolveIntent(message, state.context);

      // EP-AI-C4: override intent so planRetrieval routes to anchored_refinement case
      if (plan.action === "anchored_refinement") {
        resolvedIntent = { ...resolvedIntent, intent: "anchored_refinement" as const };
      }

      // Refinement roles and exploration target are mutually exclusive per plan.action
      const refinementRoles = plan.action === "refinement" ? refinement?.affectedRoles : undefined;
      retrieval = planRetrieval(
        resolvedIntent,
        state.context,
        updatedProfile,
        refinementRoles,
        explorationTarget ?? undefined,
        unifiedProfile,
        cumulativeExcludeSlugs.size > 0 ? cumulativeExcludeSlugs : undefined,
        message,
        anchorSlug,
      );
    } else {
      // Reuse cached recommendations without a new catalogue search
      retrieval = buildCachedRetrieval(state);
    }

    // Determine the effective intent for response planning
    const effectiveIntent = resolvedIntent?.intent ?? plan.nextIntent;

    // 3. Build context — gate refinement and explorationTarget to their respective plan.action
    const activeRefinement = plan.action === "refinement" ? refinement : null;
    // Ordinal resolution and anchor resolution both surface the correct focused fragrance.
    // anchorSlug wins for anchored_refinement turns; ordinal wins otherwise.
    const contextSelectedSlug = anchorSlug ?? resolvedOrdinalSlug;
    const stateForContext: typeof state = {
      ...state,
      profile: updatedProfile,
      ...(contextSelectedSlug ? { selectedSlug: contextSelectedSlug } : {}),
    };
    const builtContext     = buildContext(retrieval, stateForContext, plan, effectiveIntent, activeRefinement, explorationTarget, customerCtx, message);
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
    const planned   = planResponse(content, effectiveIntent, retrieval, plan, updatedProfile);
    const formatted = formatResponse(planned);

    // 8b. Build or evolve the consultation plan (EP18-P1/P2)
    // Refinement and exploration both evolve only the affected/explored role —
    // all other roles are preserved. The two paths are mutually exclusive per plan.action.
    const newPlan = buildConsultationPlan(planned.recommendedSlugs, updatedProfile);
    const evolvedAffected =
      plan.action === "refinement"               && (refinement?.affectedRoles?.length ?? 0) > 0
        ? refinement!.affectedRoles
      : plan.action === "alternative_exploration" && explorationTarget
        ? [explorationTarget.role]
      : null;

    const consultationPlan: ConsultationPlan | undefined =
      evolvedAffected && state.consultationPlan && newPlan
        ? evolveConsultationPlan(state.consultationPlan, evolvedAffected, newPlan)
        : (newPlan ?? state.consultationPlan ?? undefined);

    // 9. Derive session state updates for the client to store
    // selectedSlug persistence (EP-AI-C4):
    //   anchored_refinement → anchor slug (the fragrance the guest referenced)
    //   ordinal resolved    → the specifically referenced fragrance
    //   otherwise           → first validated recommendation from this turn
    // EP-AI-C5: track how many explicit clarification turns have occurred this session.
    // Increment when: (a) plan.action === "clarification" (pure clarification turn),
    // or (b) plan.consultationReadinessQuestion is set (hybrid fatigue-gate turn).
    // Carry forward when: neither applies.
    const prevClarificationCount = state.clarificationTurnCount ?? 0;
    const isExplicitClarificationTurn =
      plan.action === "clarification" || !!plan.consultationReadinessQuestion;
    const nextClarificationCount = isExplicitClarificationTurn
      ? prevClarificationCount + 1
      : prevClarificationCount;

    const sessionUpdates: SessionUpdates = {
      selectedSlug: plan.action === "anchored_refinement"
        ? (anchorSlug ?? planned.recommendedSlugs[0])
        : (resolvedOrdinalSlug ?? planned.recommendedSlugs[0]),
      lastArticleSlug: planned.articleSlugs[0],
      lastCollection:  retrieval.collectionName,
      comparisonSlugs: plan.requiresComparison
        ? planned.recommendedSlugs.slice(0, 2)
        : state.comparisonSlugs,
      profile:               updatedProfile,
      consultationPlan,
      clarificationTurnCount: nextClarificationCount,  // EP-AI-C5
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
