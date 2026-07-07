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
import type { ConversationState }  from "./types";
import type { ConversationPlan }   from "./conversationPlanner";
import { catalogueMaps }           from "../discovery";
import { computeWardrobe }         from "../mkc/wardrobeEngine";

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

function buildGoalSection(plan: ConversationPlan, state: ConversationState): PromptSection {
  const parts: string[] = [];

  if (plan.requiresComparison) {
    parts.push("Goal: Compare fragrance options directly. Highlight meaningful differences.");
    parts.push("Help the customer decide between the options.");
  } else if (plan.requiresClarification) {
    parts.push("Goal: Intent is unclear. Ask one warm, concise clarifying question.");
    parts.push("Do not recommend specific fragrances until you understand their needs.");
  } else if (plan.reuseRecommendations) {
    parts.push("Goal: Follow up on previous recommendations. No new fragrances needed.");
    parts.push("Answer the question using the fragrances already presented.");
  } else if (plan.nextIntent === "education") {
    parts.push("Goal: Provide a clear, engaging educational answer.");
    parts.push("Reference relevant Academy articles when available.");
  } else if (plan.nextIntent === "gift") {
    parts.push("Goal: Help the customer select a fragrance as a gift.");
    parts.push("Ask about the recipient if no information is available.");
  } else if (plan.nextIntent === "seasonal") {
    parts.push("Goal: Recommend fragrances suited to the requested season.");
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

  const content = fragrances
    .map(
      (k, i) =>
        `${i + 1}. ${k.name} [slug: ${k.slug}]
   Family: ${k.family.join(", ")} | Season: ${k.season} | Character: ${k.scentCharacter} | Projection: ${k.projection}
   Wardrobe Role: ${computeWardrobe(k).wardrobeRole}
   Occasions: ${k.occasions.join(", ")}
   Top: ${k.notes.top.join(", ")}
   Heart: ${k.notes.heart.join(", ")}
   Base: ${k.notes.base.join(", ")}
   Profile: ${k.profile}${k.bestSeller ? "\n   [Best Seller]" : ""}${k.newArrival ? "\n   [New Arrival]" : ""}`
    )
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

function buildInstructionsSection(plan: ConversationPlan): PromptSection {
  const instructions: string[] = [];

  if (plan.requiresComparison) {
    instructions.push(
      "Compare the previous recommendations directly.",
      "Focus on meaningful scent differences: family, notes, season, projection.",
      "Give a clear recommendation for which to choose based on context.",
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

  if (instructions.length === 0) return { label: "", content: "" };

  return { label: "RESPONSE INSTRUCTIONS", content: instructions.join("\n") };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildContext(
  retrieval: RetrievalContext,
  state:     ConversationState,
  plan:      ConversationPlan
): BuiltContext {
  const sections: PromptSection[] = [
    buildConversationContextSection(state),
    buildGoalSection(plan, state),
    buildPreviousRecommendationsSection(state, retrieval.fragrances),
    buildFragranceSection(retrieval.fragrances, plan.reuseRecommendations),
    retrieval.collectionName
      ? { label: "FEATURED COLLECTION", content: retrieval.collectionName }
      : { label: "", content: "" },
    buildArticleSection(retrieval.articles),
    buildInstructionsSection(plan),
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
