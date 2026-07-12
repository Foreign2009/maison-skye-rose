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
import type { ConversationState, ConversationIntent, ConversationProfile, RefinementState, ExplorationTarget } from "./types";
import type { ConversationPlan }   from "./conversationPlanner";
import { catalogueMaps, getCurrentSeason } from "../discovery";
import { computeWardrobe }                 from "../mkc/wardrobeEngine";
import { getRelationshipSummary }          from "../mkc/graph";
import { getKnowledgeQuality }             from "../mkc/knowledgeQuality";
import { analyseWardrobe }                 from "./wardrobeAnalyser";
import { planCollection }                  from "./collectionPlanner";

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

function buildRelationshipBlock(k: FragranceKnowledge): string | null {
  const summary = getRelationshipSummary(k, catalogueMaps.bySlug);
  if (!summary.hasRelationships) return null;

  const parts: string[] = [];
  if (summary.evolutionOf)              parts.push(`   • Evolved from: ${summary.evolutionOf.name}`);
  if (summary.evolutions.length > 0)    parts.push(`   • Evolution: ${summary.evolutions.map((r) => r.name).join(", ")}`);
  if (summary.alternatives.length > 0)  parts.push(`   • Alternative: ${summary.alternatives.map((r) => r.name).join(", ")}`);
  if (summary.wardrobePartners.length > 0) parts.push(`   • Wardrobe partner: ${summary.wardrobePartners.map((r) => r.name).join(", ")}`);

  if (parts.length === 0) return null;
  return `   Relationships:\n${parts.join("\n")}`;
}

function buildFragranceSection(fragrances: FragranceKnowledge[], reuseMode: boolean): PromptSection {
  if (fragrances.length === 0) return { label: "", content: "" };

  const label = reuseMode ? "CURRENT FRAGRANCES IN DISCUSSION" : "FRAGRANCES IN CONTEXT";

  // Fields ordered by editorial priority (Refinement 3):
  // Description → Mood → Wardrobe Role → Vibe → Occasions → Notes → Intelligence
  const content = fragrances
    .map((k, i) => {
      const lines: string[] = [`${i + 1}. ${k.name} [slug: ${k.slug}]`];
      const quality = getKnowledgeQuality(k.slug);

      // Editorial content — authored for native records only
      if (k.description) lines.push(`   Description: ${k.description}`);

      // Educational depth signal — guides LLM when editorial richness is absent
      if (quality?.educationalRichness === 0) {
        lines.push(`   [Prioritise Academy article recommendations for educational depth on this fragrance]`);
      }
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

      // Relationship graph context — only for native records with authored relationships
      const relBlock = buildRelationshipBlock(k);
      if (relBlock) lines.push(relBlock);

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
  plan:               ConversationPlan,
  state:              ConversationState,
  effectiveIntent?:   ConversationIntent,
  refinement?:        RefinementState | null,
  explorationTarget?: ExplorationTarget | null
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

  // Refinement instructions (EP18-P1) — preserve roles, explain changes
  if (plan.action === "refinement" && state.consultationPlan) {
    const toReplace = refinement?.affectedRoles ?? [];
    const kept = state.consultationPlan.roles.filter(
      (r) => !toReplace.some((ar) => ar.slug === r.slug)
    );

    if (toReplace.length > 0) {
      instructions.push("[Refinement mode — do not rebuild the consultation from scratch]");
      if (kept.length > 0) {
        const keepList = kept
          .map((r) => `Role ${r.position} — ${r.title} (${r.name})`)
          .join(", ");
        instructions.push(`Preserve: ${keepList}`);
      }
      const replaceList = toReplace
        .map((r) => `Role ${r.position} — ${r.title}`)
        .join("; ");
      instructions.push(
        `Replace only: ${replaceList}${refinement?.reason ? ` — ${refinement.reason}` : ""}`
      );
      instructions.push("Select the replacement from FRAGRANCES IN CONTEXT. Tag it as [PRODUCT:slug].");
      instructions.push(
        "Frame as a consultation refinement: acknowledge what stays the same first, " +
        "then introduce the replacement as completing the collection. " +
        "Do not suggest the previous recommendation was wrong — the consultation is becoming more personalised. " +
        "After introducing the replacement, restate what the complete collection now achieves together."
      );
    } else if (refinement?.budgetRefinement) {
      instructions.push("[Budget refinement — collection structure preserved]");
      const currentList = state.consultationPlan.roles
        .map((r) => `Role ${r.position} — ${r.title} (${r.name})`)
        .join(", ");
      instructions.push(`Current assignments: ${currentList}`);
      instructions.push(
        "Budget guidance has been updated. Where better-value options are available in FRAGRANCES IN CONTEXT, " +
        "suggest them for the relevant role. Preserve assignments where the existing fragrance remains the right choice. " +
        "Frame as the consultation adapting to the updated budget — not replacing the collection."
      );
    }
  }

  // Exploration instructions (EP18-P2) — preserve stable roles, explain difference
  if (plan.action === "alternative_exploration" && state.consultationPlan && explorationTarget) {
    const target = explorationTarget.role;
    const kept   = state.consultationPlan.roles.filter((r) => r.slug !== target.slug);

    instructions.push("[Alternative exploration — do not rebuild the consultation]");

    if (kept.length > 0) {
      const keepList = kept.map((r) => `${r.title} (${r.name})`).join(", ");
      instructions.push(`Preserve: ${keepList}`);
    }

    let exploreDetail = `Exploring alternative for: ${target.title} (currently ${target.name})`;
    if (explorationTarget.characterPref && explorationTarget.characterPref !== target.character) {
      exploreDetail += ` — exploring ${explorationTarget.characterPref} direction`;
    } else if (explorationTarget.intelligenceHint) {
      exploreDetail += ` — ${explorationTarget.intelligenceHint.direction} ${explorationTarget.intelligenceHint.dimension}`;
    }
    instructions.push(exploreDetail);
    instructions.push(`Reason: ${explorationTarget.reason}`);
    instructions.push(
      "Select one alternative from FRAGRANCES IN CONTEXT. Tag it as [PRODUCT:slug]. " +
      "Open by acknowledging what stays the same, then introduce the alternative as 'another direction' " +
      "or 'a different interpretation' — never 'a better option'. " +
      "Explain how this alternative differs in character, mood, or feel without ranking them. " +
      "Do not imply the current assignment was wrong — the customer is exploring possibilities. " +
      "After introducing the alternative, briefly confirm what the overall consultation still achieves."
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

function buildProfileSection(profile: ConversationProfile | undefined): PromptSection {
  if (!profile) return { label: "", content: "" };

  const lines: string[] = [];
  const confidenceHints: string[] = [];

  if (profile.preferredFamilies?.value.length) {
    lines.push(`Enjoys\n${profile.preferredFamilies.value.map((v) => `• ${v}`).join("\n")}`);
    if (profile.preferredFamilies.confidence === "MEDIUM") {
      confidenceHints.push("[Confidence: Medium — acknowledge that several directions may suit]");
    }
  }

  if (profile.avoidedFamilies?.value.length) {
    lines.push(`Avoids\n${profile.avoidedFamilies.value.map((v) => `• ${v}`).join("\n")}`);
  }

  if (profile.preferredNotes?.value.length) {
    lines.push(`Preferred Notes\n${profile.preferredNotes.value.map((v) => `• ${v}`).join("\n")}`);
  }

  if (profile.avoidedNotes?.value.length) {
    lines.push(`Avoided Notes\n${profile.avoidedNotes.value.map((v) => `• ${v}`).join("\n")}`);
  }

  if (profile.preferredOccasions?.value.length) {
    lines.push(`Occasion\n${profile.preferredOccasions.value.map((v) => `• ${v}`).join("\n")}`);
  }

  if (profile.preferredSeasons?.value.length) {
    lines.push(`Season\n${profile.preferredSeasons.value.map((v) => `• ${v}`).join("\n")}`);
  }

  if (profile.shoppingIntent?.value === "gift") {
    const who = profile.shoppingFor?.value ?? "someone";
    const gender = profile.recipientGender?.value;
    const line = gender
      ? `Gift — for ${who} (${gender})`
      : `Gift — for ${who}`;
    lines.push(`Shopping For\n• ${line}`);
  }

  if (profile.budget?.value) {
    lines.push(`Budget\n• Around R${profile.budget.value}`);
    if (profile.budget.confidence === "MEDIUM") {
      confidenceHints.push("[Confidence: Medium — customer mentioned a figure but may be flexible]");
    }
  }

  if (profile.existingCollection?.value.length) {
    lines.push(
      `Existing Collection\n${profile.existingCollection.value.map((v) => `• ${v}`).join("\n")}\n[Recommend fragrances that complement, not duplicate, this collection]`
    );
  }

  if (lines.length === 0) return { label: "", content: "" };

  const content = [...lines, ...confidenceHints].join("\n\n");
  return { label: "CUSTOMER PROFILE", content };
}

function buildWardrobeSection(profile: ConversationProfile | undefined): PromptSection {
  const names = profile?.existingCollection?.value;
  if (!names?.length) return { label: "", content: "" };

  const analysis = analyseWardrobe(names);
  if (!analysis) return { label: "", content: "" };

  const lines: string[] = [];

  // Resolution header
  const resolutionNote = analysis.resolvedCount < analysis.totalCount
    ? `${analysis.resolvedCount} of ${analysis.totalCount} fragrances identified`
    : `${analysis.resolvedCount} fragrance${analysis.resolvedCount !== 1 ? "s" : ""} identified`;
  lines.push(`Collection style: ${analysis.style} (${resolutionNote})`);

  // Character distribution
  const charDisplay = Object.entries(analysis.characterCounts)
    .filter(([, n]) => n > 0)
    .map(([char, n]) => (n > 1 ? `${char} (×${n})` : char))
    .join(" · ");
  if (charDisplay) lines.push(`Character coverage: ${charDisplay}`);

  // Occasion coverage
  if (analysis.coveredOccasions.length > 0) {
    lines.push(`Occasion coverage: ${analysis.coveredOccasions.join(" · ")}`);
  }

  // Family coverage
  if (analysis.familyCoverage.length > 0) {
    lines.push(`Family coverage: ${analysis.familyCoverage.join(" · ")}`);
  }

  lines.push("");

  // Editorial strength description — always positive (Refinement 2)
  lines.push(`Strengths: ${analysis.strengths}`);

  // Opportunity description — framed as addition, never deficiency (Refinement 3)
  if (analysis.opportunity) {
    lines.push(`Opportunity: ${analysis.opportunity}.`);
  } else {
    lines.push("The collection is well-rounded — focus recommendations on the customer's stated preferences.");
  }

  // Graph insights — collection-level relationship analysis (EP21-P5)
  const { graphInsights } = analysis;
  if (graphInsights.completedPairs.length > 0) {
    lines.push(`Graph coverage: ${graphInsights.completedPairs.join(" · ")}`);
  }
  if (graphInsights.missingEvolutions.length > 0) {
    lines.push(`Natural line extensions: ${graphInsights.missingEvolutions.join(", ")}`);
  }
  if (graphInsights.missingPartners.length > 0) {
    lines.push(`Natural seasonal companions: ${graphInsights.missingPartners.join(", ")}`);
  }

  // Customer intent override signal (Refinement 1)
  lines.push("");
  lines.push("[Customer intent always takes priority. If the customer explicitly requests a fragrance in a style already present in their collection, acknowledge the overlap and recommend the best option for their stated goal.]");

  return { label: "WARDROBE ANALYSIS", content: lines.join("\n") };
}

function buildCollectionSection(profile: ConversationProfile | undefined): PromptSection {
  if (!profile?.collectionType) return { label: "", content: "" };

  const brief = planCollection(profile);
  if (!brief || brief.roles.length === 0) return { label: "", content: "" };

  const lines: string[] = [];

  // Header — describe size in terms of new additions when wardrobe-aware
  const sizeDesc = brief.wardrobeAware
    ? `${brief.newCount} new addition${brief.newCount !== 1 ? "s" : ""} to complete a ${brief.targetSize}-fragrance collection`
    : `${brief.targetSize} fragrance${brief.targetSize !== 1 ? "s" : ""}`;
  lines.push(`Collection type: ${brief.label} (${sizeDesc})`);

  if (brief.budgetNote) lines.push(`Budget guidance: ${brief.budgetNote}`);

  if (brief.wardrobeAware) {
    const filledCount = brief.targetSize - brief.newCount;
    lines.push(`Wardrobe context: Existing collection already fills ${filledCount} role${filledCount !== 1 ? "s" : ""}. Recommend only the additions listed below.`);
  }

  lines.push("");

  // Roles — each with character, title, and editorial purpose (Refinement 2)
  for (const role of brief.roles) {
    lines.push(`Role ${role.position} — ${role.title}`);
    lines.push(`Character: ${role.character}`);
    lines.push(`Purpose: ${role.purpose}`);
    lines.push("");
  }

  // Framing instructions (Refinements 1, 3, 4, 8)
  lines.push(
    "[Curate this as a personal fragrance consultation, not a product list. " +
    "Recommend one fragrance per role from FRAGRANCES IN CONTEXT. " +
    "Explain each recommendation in terms of its role and what it brings to the collection. " +
    "After individual recommendations, describe what the complete collection achieves together — the occasions, moods, and moments it collectively covers. " +
    "Write as a luxury consultation: 'I'd build your collection around...' or 'I'd begin your wardrobe with...' — never 'Here are three fragrances.' " +
    "Customer intent always overrides collection optimisation: if the customer explicitly wants only one character type, honour that preference entirely.]"
  );

  return { label: "COLLECTION BRIEF", content: lines.join("\n") };
}

function buildConsultationPlanSection(
  state:              ConversationState,
  refinement?:        RefinementState | null,
  explorationTarget?: ExplorationTarget | null
): PromptSection {
  const plan = state.consultationPlan;
  if (!plan || plan.roles.length === 0) return { label: "", content: "" };

  const isRefinement  = !!refinement;
  const isExploration = !!explorationTarget;
  const affectedSlugs = new Set(
    (refinement?.affectedRoles ?? []).map((r) => r.slug)
  );

  const lines: string[] = [];
  lines.push(`${plan.label} — ${plan.roles.length} fragrance${plan.roles.length !== 1 ? "s" : ""}`);
  lines.push("");

  for (const role of plan.roles) {
    lines.push(`Role ${role.position} — ${role.title}`);
    lines.push(`Fragrance: ${role.name} [slug: ${role.slug}]`);
    lines.push(`Character: ${role.character}`);

    if (isRefinement) {
      if (affectedSlugs.has(role.slug)) {
        lines.push(`[REPLACE — ${refinement?.reason ?? "preference updated"}]`);
      } else if (refinement?.budgetRefinement) {
        lines.push("[REVIEW — budget guidance updated]");
      } else {
        lines.push("[KEEP]");
      }
    } else if (isExploration) {
      if (role.slug === explorationTarget!.role.slug) {
        lines.push(`[EXPLORE — ${explorationTarget!.reason}]`);
        if (explorationTarget!.characterPref) {
          lines.push(`Target character: ${explorationTarget!.characterPref}`);
        }
        if (explorationTarget!.intelligenceHint) {
          lines.push(`Direction: ${explorationTarget!.intelligenceHint.direction} ${explorationTarget!.intelligenceHint.dimension}`);
        }
      } else {
        lines.push("[KEEP]");
      }
    }

    lines.push("");
  }

  return { label: "CONSULTATION PLAN", content: lines.join("\n").trim() };
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
  retrieval:          RetrievalContext,
  state:              ConversationState,
  plan:               ConversationPlan,
  effectiveIntent?:   ConversationIntent,
  refinement?:        RefinementState | null,
  explorationTarget?: ExplorationTarget | null
): BuiltContext {
  const sections: PromptSection[] = [
    buildSeasonalContextSection(),
    buildConversationContextSection(state),
    buildProfileSection(state.profile),
    buildWardrobeSection(state.profile),
    buildCollectionSection(state.profile),
    buildConsultationPlanSection(state, refinement, explorationTarget),        // EP18-P1/P2
    buildGoalSection(plan, state, effectiveIntent),
    buildPreviousRecommendationsSection(state, retrieval.fragrances),
    buildFragranceSection(retrieval.fragrances, plan.reuseRecommendations),
    retrieval.collectionName
      ? { label: "FEATURED COLLECTION", content: retrieval.collectionName }
      : { label: "", content: "" },
    buildArticleSection(retrieval.articles),
    buildInstructionsSection(plan, state, effectiveIntent, refinement, explorationTarget), // EP18-P1/P2
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
