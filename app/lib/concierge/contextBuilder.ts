/**
 * Maison Concierge — Context Builder
 *
 * Converts retrieval results + conversation state into structured prompt
 * sections. Returns labelled sections rather than one concatenated string so
 * the API route can control assembly and token budgeting.
 *
 * EP15-P2: added Conversation Context, Current Customer Goal,
 * Previous Recommendations, and Response Instructions sections.
 */

import type { FragranceKnowledge } from "../mkc/types";
import type { AcademyArticle }     from "../academy/types";
import type { ConversationState, ConversationIntent }  from "./types";
import type { ConversationPlan }   from "./conversationPlanner";
import { catalogueMaps, getCurrentSeason } from "../discovery";
import { computeWardrobe }                 from "../mkc/wardrobeEngine";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RetrievalContext {
  fragrances:      FragranceKnowledge[];
  articles:        AcademyArticle[];
  collectionName?: string;
}

export interface PromptSection {
  label:   string;
  content: string;
}

export interface BuiltContext {
  sections:      PromptSection[];
  tokenEstimate: number;
}

// ── Section builders ──────────────────────────────────────────────────────────

function buildConversationContextSection(state: ConversationState): PromptSection {
  if (state.turns.length === 0) return { label: "", content: "" };

  const parts: string[] = [];
  parts.push(`Turn ${Math.floor(state.turns.length / 2) + 1} of the conversation.`);

  if ((state.lastRecommendationSlugs ?? []).length > 0) {
    const names = (state.lastRecommendationSlugs ?? [])
      .map((slug) => catalogueMaps.bySlug.get(slug)?.name ?? slug)
      .slice(0, 3)
      .join(", ");
    parts.push(`Previously recommended: ${names}`);
  }

  if (state.selectedSlug) {
    const name = catalogueMaps.bySlug.get(state.selectedSlug)?.name;
    if (name) parts.push(`Customer is currently focused on: ${name}`);
  }

  if (state.comparisonSlugs && state.comparisonSlugs.length >= 2) {
    const names = state.comparisonSlugs
      .map((s) => catalogueMaps.bySlug.get(s)?.name ?? s)
      .join(" vs ");
    parts.push(`Active comparison: ${names}`);
  }

  if (state.lastCollection) {
    parts.push(`Last discussed collection: ${state.lastCollection}`);
  }

  return { label: "CONVERSATION CONTEXT", content: parts.join("\n") };
}

function buildGoalSection(
  plan:             ConversationPlan,
  state:            ConversationState,
  effectiveIntent?: ConversationIntent
): PromptSection {
  const parts: string[] = [];

  if (plan.requiresComparison) {
    parts.push("Goal: Compare fragrance options directly. Highlight meaningful differences using Intelligence scores.");
    parts.push("Help the customer decide between the options with a clear recommendation.");
  } else if (plan.requiresClarification) {
    parts.push("Goal: Intent is unclear. Ask one warm, concise clarifying question.");
    parts.push("Do not recommend specific fragrances until you understand their needs.");
  } else if (plan.reuseRecommendations) {
    parts.push("Goal: Follow up on previous recommendations. No new fragrances needed.");
    parts.push("Answer the question using the fragrances already presented.");
  } else if (plan.nextIntent === "education" || effectiveIntent === "education") {
    parts.push("Goal: Provide a clear, engaging educational answer.");
    parts.push("Reference relevant Academy articles when available.");
  } else if (plan.nextIntent === "gift" || effectiveIntent === "gift") {
    parts.push("Goal: Help the customer select a fragrance as a gift.");
    parts.push("If recipient details are unknown, ask the minimum question needed to personalise the recommendation.");
  } else if (plan.nextIntent === "seasonal" || effectiveIntent === "seasonal") {
    parts.push("Goal: Recommend fragrances suited to the requested season.");
  } else if (effectiveIntent === "occasion_search") {
    parts.push("Goal: Recommend fragrances that suit the stated occasion.");
  }

  if (state.context.occasion && !plan.requiresComparison) {
    parts.push(`Customer context: shopping for ${state.context.occasion}.`);
  }
  if (state.context.gender) {
    parts.push(`Gender preference: ${state.context.gender}.`);
  }

  return { label: "CURRENT CUSTOMER GOAL", content: parts.join("\n") };
}

function buildPreviousRecommendationsSection(
  state: ConversationState,
  retrievalFragrances: FragranceKnowledge[]
): PromptSection {
  const slugs = state.lastRecommendationSlugs ?? [];
  if (slugs.length === 0) return { label: "", content: "" };

  const recs = slugs
    .map((slug, i) => {
      const k = retrievalFragrances.find((f) => f.slug === slug) ?? catalogueMaps.bySlug.get(slug);
      return k ? `${i + 1}. ${k.name} [slug: ${k.slug}] — ${k.family.join(", ")}` : null;
    })
    .filter((r): r is string => !!r);

  if (recs.length === 0) return { label: "", content: "" };

  return { label: "PREVIOUS RECOMMENDATIONS", content: recs.join("\n") };
}

function buildFragranceSection(fragrances: FragranceKnowledge[], reuseMode: boolean): PromptSection {
  if (fragrances.length === 0) return { label: "", content: "" };

  const label = reuseMode ? "CURRENT FRAGRANCES IN DISCUSSION" : "FRAGRANCES IN CONTEXT";

  // Fields ordered by editorial priority (Refinement 3):
  // Description → Mood → Wardrobe Role → Vibe → Occasions → Notes → Intelligence
  const content = fragrances
    .map((k, i) => {
      const lines: string[] = [`${i + 1}. ${k.name} [slug: ${k.slug}]`];

      // Editorial content first — only present on native knowledge records
      if (k.description) lines.push(`   Description: ${k.description}`);
      lines.push(`   Mood: ${k.mood}`);
      lines.push(`   Wardrobe Role: ${computeWardrobe(k).wardrobeRole} | Signature: ${k.signatureStyle.join(", ")}`);
      lines.push(`   Vibe: ${k.vibe.join(", ")}`);
      lines.push(`   Occasions: ${k.occasions.join(", ")}`);

      // Composition — structural context
      lines.push(`   Family: ${k.family.join(", ")} | Season: ${k.season} | Character: ${k.scentCharacter} | Projection: ${k.projection}`);
      lines.push(`   Top: ${k.notes.top.join(", ")}`);
      lines.push(`   Heart: ${k.notes.heart.join(", ")}`);
      lines.push(`   Base: ${k.notes.base.join(", ")}`);
      lines.push(`   Profile: ${k.profile}`);

      // Intelligence scores — support comparisons and explanations
      lines.push(`   Intelligence: sweetness ${k.sweetness}/5 · freshness ${k.freshness}/5 · warmth ${k.warmth}/5 · intensity ${k.intensity}/5 · versatility ${k.versatility}/5`);

      // Persona fit
      lines.push(`   Best for: ${k.recommendedFor.slice(0, 2).join("; ")}`);

      if (k.bestSeller) lines.push("   [Best Seller]");
      if (k.newArrival) lines.push("   [New Arrival]");

      return lines.join("\n");
    })
    .join("\n\n");

  return { label, content };
}

function buildArticleSection(articles: AcademyArticle[]): PromptSection {
  if (articles.length === 0) return { label: "", content: "" };

  const content = articles
    .map(
      (a, i) =>
        `${i + 1}. "${a.title}" [slug: ${a.slug}]
   Category: ${a.category} | Read time: ${a.readTime} min
   ${a.excerpt}`
    )
    .join("\n\n");

  return { label: "ACADEMY ARTICLES IN CONTEXT", content };
}

function buildInstructionsSection(
  plan:             ConversationPlan,
  state:            ConversationState,
  effectiveIntent?: ConversationIntent
): PromptSection {
  const instructions: string[] = [];

  if (plan.requiresComparison) {
    instructions.push(
      "Compare the previous recommendations directly.",
      "Use Intelligence scores (sweetness, freshness, warmth, intensity) to highlight concrete differences.",
      "Give a clear, decisive recommendation for which to choose.",
      "Tag each fragrance as [PRODUCT:slug]."
    );
  }

  if (plan.requiresClarification) {
    instructions.push(
      "Do not list fragrances yet.",
      "Ask a single warm, specific question: occasion, family preference, or gender."
    );
  }

  if (plan.reuseRecommendations && !plan.requiresComparison) {
    instructions.push(
      "Answer using the fragrances already shown. Do not introduce new ones.",
      "Tag referenced fragrances as [PRODUCT:slug]."
    );
  }

  // Gift: ask about the recipient when their preferences are not yet known.
  // Only fires when no gender or occasion context is available from prior turns.
  const isGiftIntent = plan.nextIntent === "gift" || effectiveIntent === "gift" || !!state.context.giftContext;
  if (isGiftIntent && !state.context.gender && !state.context.occasion) {
    instructions.push(
      "If the recipient's scent preferences or occasions are not clear from the conversation, ask ONE warm question before recommending."
    );
  }

  if (instructions.length === 0) return { label: "", content: "" };

  return { label: "RESPONSE INSTRUCTIONS", content: instructions.join("\n") };
}

function buildSeasonalContextSection(): PromptSection {
  const season = getCurrentSeason();
  return {
    label:   "CURRENT SEASON",
    content: `${season} (South Africa). When relevant, favour fragrances and recommendations suited to this season.`,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildContext(
  retrieval:        RetrievalContext,
  state:            ConversationState,
  plan:             ConversationPlan,
  effectiveIntent?: ConversationIntent
): BuiltContext {
  const sections: PromptSection[] = [
    buildSeasonalContextSection(),
    buildConversationContextSection(state),
    buildGoalSection(plan, state, effectiveIntent),
    buildPreviousRecommendationsSection(state, retrieval.fragrances),
    buildFragranceSection(retrieval.fragrances, plan.reuseRecommendations),
    retrieval.collectionName
      ? { label: "FEATURED COLLECTION", content: retrieval.collectionName }
      : { label: "", content: "" },
    buildArticleSection(retrieval.articles),
    buildInstructionsSection(plan, state, effectiveIntent),
  ].filter((s) => s.label && s.content);

  const fullText      = sections.map((s) => `=== ${s.label} ===\n${s.content}`).join("\n\n");
  const tokenEstimate = Math.ceil(fullText.length / 4);

  return { sections, tokenEstimate };
}

export function renderContext(built: BuiltContext): string {
  return built.sections
    .map((s) => `=== ${s.label} ===\n${s.content}`)
    .join("\n\n");
}
