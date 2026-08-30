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
import type { ConversationState, ConversationIntent, ConversationProfile, RefinementState, ExplorationTarget, ConfidenceClassification } from "./types";
import type { ConversationPlan }   from "./conversationPlanner";
import type { ConciergeCustomerContext } from "./customerAdapter";
import { getCurrentSeason }                         from "../discovery";
import { computeWardrobe }                          from "../mkc/wardrobeEngine";
import { getKnowledgeQuality }                      from "../mkc/knowledgeQuality";
import { getRelatedKnowledge, getKnowledgeSummary } from "../intelligence";
import { analyseWardrobe }                 from "./wardrobeAnalyser";
import { planCollection }                  from "./collectionPlanner";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AnchoredMeta {
  anchorSlug:    string;
  anchorName:    string;
  dimension:     string;
  direction:     "more" | "less";
  anchorScore:   number;
  strictMatches: boolean;
}

export interface RetrievalContext {
  fragrances:                FragranceKnowledge[];
  articles:                  AcademyArticle[];
  collectionName?:           string;
  fragranceRoles?:           string[];             // deterministic role labels (EP-AI-C2-R1)
  anchoredMeta?:             AnchoredMeta;         // EP-AI-C4: anchored refinement metadata
  confidenceClassifications?: ConfidenceClassification[];  // EP-AI-C5: per-candidate fit confidence
  poolExhausted?:            boolean;              // EP-AI-C5: fewer than 2 eligible candidates after all filters
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
      .map((slug) => getKnowledgeSummary(slug)?.name ?? slug)
      .slice(0, 3)
      .join(", ");
    parts.push(`Previously recommended: ${names}`);
  }

  if (state.selectedSlug) {
    const name = getKnowledgeSummary(state.selectedSlug)?.name;
    if (name) parts.push(`Customer is currently focused on: ${name}`);
  }

  if (state.comparisonSlugs && state.comparisonSlugs.length >= 2) {
    const names = state.comparisonSlugs
      .map((s) => getKnowledgeSummary(s)?.name ?? s)
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
  } else if (effectiveIntent === "anchored_refinement") {
    parts.push("Goal: Find fragrances that vary from a reference in a specific intelligence dimension.");
    parts.push("Do not re-recommend the anchor fragrance unless the guest explicitly asks about it.");
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
      const k = retrievalFragrances.find((f) => f.slug === slug) ?? getKnowledgeSummary(slug);
      return k ? `${i + 1}. ${k.name} [slug: ${k.slug}] — ${k.family.join(", ")}` : null;
    })
    .filter((r): r is string => !!r);

  if (recs.length === 0) return { label: "", content: "" };

  return { label: "PREVIOUS RECOMMENDATIONS", content: recs.join("\n") };
}

function buildRelationshipBlock(k: FragranceKnowledge): string | null {
  const relationships = getRelatedKnowledge(k.slug);
  if (!relationships?.hasRelationships) return null;

  const parts: string[] = [];
  if (relationships.evolutionOf)                   parts.push(`   • Evolved from: ${relationships.evolutionOf.name}`);
  if (relationships.evolutions.length > 0)         parts.push(`   • Evolution: ${relationships.evolutions.map((r) => r.name).join(", ")}`);
  if (relationships.alternatives.length > 0)       parts.push(`   • Alternative: ${relationships.alternatives.map((r) => r.name).join(", ")}`);
  if (relationships.wardrobePartners.length > 0)   parts.push(`   • Wardrobe partner: ${relationships.wardrobePartners.map((r) => r.name).join(", ")}`);

  if (parts.length === 0) return null;
  return `   Relationships:\n${parts.join("\n")}`;
}

function buildFragranceSection(
  fragrances:                FragranceKnowledge[],
  reuseMode:                 boolean,
  fragranceRoles?:           string[],
  confidenceClassifications?: ConfidenceClassification[],
): PromptSection {
  if (fragrances.length === 0) return { label: "", content: "" };

  const label = reuseMode ? "CURRENT FRAGRANCES IN DISCUSSION" : "FRAGRANCES IN CONTEXT";

  // Fields ordered by editorial priority (Refinement 3):
  // Description → Mood → Wardrobe Role → Vibe → Occasions → Notes → Intelligence
  const content = fragrances
    .map((k, i) => {
      const role       = fragranceRoles?.[i];
      const confidence = confidenceClassifications?.[i];
      const roleTag    = role ? ` — [${role}]` : "";
      const confTag    = confidence ? ` [${confidence}]` : "";
      const header     = `${i + 1}. ${k.name} [slug: ${k.slug}]${roleTag}${confTag}`;
      const lines: string[] = [header];
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
      const allNotesList = [...k.notes.top, ...k.notes.heart, ...k.notes.base];
      if (allNotesList.length > 0) {
        lines.push(`   Top: ${k.notes.top.join(", ")}`);
        lines.push(`   Heart: ${k.notes.heart.join(", ")}`);
        lines.push(`   Base: ${k.notes.base.join(", ")}`);
      } else {
        lines.push(`   Notes: [Canonical composition not disclosed — use mood and profile for recommendations]`);
      }
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
  explorationTarget?: ExplorationTarget | null,
  anchoredMeta?:      AnchoredMeta,
  rawMessage?:        string,  // EP-AI-C6-P3 Change G
): PromptSection {
  const instructions: string[] = [];

  // Change G / R1: Semantic multi-option card target injection.
  // Primary: explicit count or plural signal in the current message (detectCardTarget).
  // Fallback: when no explicit signal is present but the profile carries an active
  // discovery brief (preferredFamilies + preferredSeasons both set), inherit card
  // target 5 — handles short gender-pivot turns ("and female") that continue an
  // established seasonal consultation. Guards: academy_lookup and reuseRecommendations
  // have their own framing and are excluded.
  if (rawMessage && !plan.requiresComparison && !plan.requiresClarification) {
    let cardTarget = detectCardTarget(rawMessage);
    if (cardTarget === null && !plan.reuseRecommendations && plan.action !== "academy_lookup" && state.profile) {
      const hasFamilies = (state.profile.preferredFamilies?.value.length ?? 0) > 0;
      const hasSeasons  = (state.profile.preferredSeasons?.value.length  ?? 0) > 0;
      if (hasFamilies && hasSeasons) cardTarget = 5;
    }
    if (cardTarget !== null) {
      instructions.push(
        `Present up to ${cardTarget} meaningfully differentiated fragrances. Each option should offer a distinct character or mood.`
      );
    }
  }

  // ── Anchored refinement instructions (EP-AI-C4) ──────────────────────────────
  // Must fire first so the anchor context frames all other instructions.
  if (effectiveIntent === "anchored_refinement" && anchoredMeta) {
    const { anchorName, dimension, direction, anchorScore, strictMatches } = anchoredMeta;
    const dirWord = direction === "more" ? "higher" : "lower";
    instructions.push(
      `[Anchored Refinement — anchor: ${anchorName} · ${dimension} ${anchorScore}/5 · guest requested: ${dirWord} ${dimension}]`
    );
    if (strictMatches) {
      instructions.push(
        `FRAGRANCES IN CONTEXT are genuinely ${dirWord} in ${dimension} than ${anchorName} (${anchorScore}/5).`,
        `Present them as satisfying the directional request. Tag each as [PRODUCT:slug].`,
        `Briefly reference the ${dimension} difference to make the improvement concrete — e.g., compare the score to the anchor's.`
      );
    } else {
      instructions.push(
        `No fragrances in context score ${dirWord} in ${dimension} than ${anchorName} (${anchorScore}/5).`,
        `FRAGRANCES IN CONTEXT are the closest available options — they do not strictly satisfy the directional request.`,
        `Be transparent: acknowledge the closest available options, describe their ${dimension} character honestly, and let the guest decide.`,
        `Do NOT claim these are ${dirWord} in ${dimension} when they are not. Do not use language like "fresher option" if they are not fresher.`,
        `Tag each presented option as [PRODUCT:slug].`
      );
    }
  }

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

// Bare season keywords → canonical season name (EP-AI-C6-P3 Change D)
const SEASON_KEYWORD_MAP: Record<string, string> = {
  summer: "Summer",
  winter: "Winter",
  spring: "Spring",
  autumn: "Autumn",
  fall:   "Autumn",
};

function buildSeasonalContextSection(rawMessage?: string): PromptSection {
  const calendarSeason = getCurrentSeason();

  // Change D: when the guest explicitly requested a season that differs from the
  // current calendar season, state both and make the guest request the priority.
  if (rawMessage) {
    const msgLower = rawMessage.toLowerCase();
    for (const [kw, guestSeason] of Object.entries(SEASON_KEYWORD_MAP)) {
      if (msgLower.includes(kw)) {
        if (guestSeason !== calendarSeason) {
          return {
            label:   "CURRENT SEASON",
            content: `${calendarSeason} (South Africa) — the guest has specifically requested ${guestSeason} fragrances. Prioritise ${guestSeason} recommendations regardless of current calendar season.`,
          };
        }
        break; // guest requested same season as calendar — fall through to normal path
      }
    }
  }

  return {
    label:   "CURRENT SEASON",
    content: `${calendarSeason} (South Africa). When relevant, favour fragrances and recommendations suited to this season.`,
  };
}

function buildCustomerAwarenessSection(
  ctx: ConciergeCustomerContext,
): PromptSection {
  const parts: string[] = [];

  const stageDescriptions: Record<string, string> = {
    new:        "New visitor — no browsing history yet",
    exploring:  "Actively browsing — has viewed fragrances but not yet saved",
    engaged:    "Engaged — has saved favourites or completed the quiz",
    converting: "Returning customer — has previously purchased",
  };
  parts.push(`Customer journey: ${stageDescriptions[ctx.journeyStage] ?? ctx.journeyStage}`);

  if (ctx.hasSaved && ctx.savedSlugs.length > 0) {
    const names = ctx.savedSlugs
      .map((s) => getKnowledgeSummary(s)?.name ?? s)
      .slice(0, 5)
      .join(", ");
    parts.push(`Saved favourites: ${names}`);
  }

  if (ctx.hasRecentlyViewed && ctx.recentlyViewed.length > 0) {
    const names = ctx.recentlyViewed
      .map((s) => getKnowledgeSummary(s)?.name ?? s)
      .slice(0, 5)
      .join(", ");
    parts.push(`Recently viewed: ${names}`);
  }

  if (ctx.hasQuizResult && ctx.lastQuizSlugs.length > 0) {
    const names = ctx.lastQuizSlugs
      .map((s) => getKnowledgeSummary(s)?.name ?? s)
      .slice(0, 3)
      .join(", ");
    parts.push(`Quiz matches: ${names}`);
  }

  if (ctx.hasPreferences) {
    if (ctx.preferredFamilies.length > 0) {
      parts.push(`Preferred families: ${ctx.preferredFamilies.join(", ")}`);
    }
    if (ctx.preferredOccasions.length > 0) {
      parts.push(`Preferred occasions: ${ctx.preferredOccasions.join(", ")}`);
    }
    if (ctx.dominantGender) {
      parts.push(`Dominant gender preference: ${ctx.dominantGender}`);
    }
  }

  if (parts.length <= 1) return { label: "", content: "" };

  return { label: "CUSTOMER AWARENESS", content: parts.join("\n") };
}

// ── EP-AI-C6-P3 Change G / R1: Semantic multi-option card target ──────────────

// Patterns that signal a plural / multi-option discovery request.
// "give me something woody" and "give me one recommendation" must NOT trigger five-card.
const MULTI_OPTION_PATTERNS: RegExp[] = [
  // Explicit plurality markers before the noun: "some options", "a few summer fragrances"
  // Allows up to 3 intervening adjective words (e.g. "a few fresh summer scents")
  /\b(?:some|a few|several|multiple|different|various)\s+(?:\w+\s+){0,3}(?:fragrances?|scents?|perfumes?|options?|recommendations?|choices?|picks?)\b/i,
  // Explicit multi-option imperative: "give me options", "show me alternatives"
  /\b(?:give me|show me|list|get me|find me)\s+(?:options?|alternatives?|recommendations?|choices?|picks?|a selection)\b/i,
  // Imperative discovery targeting a plural noun: "give me fresh fragrances",
  // "list fresh fragrances for women", "give me the fresh summer vibes listed male fragrances".
  // Requires at least one qualifying word between the imperative and the plural noun.
  /\b(?:give me|show me|list|get me|find me)\b(?:\s+\S+){1,10}\s+(?:fragrances|scents|perfumes)\b/i,
  // Question form with plural noun: "what fresh fragrances do you recommend?"
  /\b(?:what|which|any)\s+(?:\w+\s+){0,4}(?:fragrances|scents|perfumes)\b/i,
];

// Patterns that assert a singular request — override any multi-option signal.
const SINGULAR_OVERRIDE_PATTERNS: RegExp[] = [
  /\b(?:just\s+)?one\s+(?:fragrance|scent|recommendation|option|pick)\b/i,
  /\bthe best\s+(?:one|fragrance|option|scent)\b/i,
  /\bsingle\s+(?:fragrance|scent|recommendation)\b/i,
];

export function detectCardTarget(rawMessage: string): number | null {
  if (SINGULAR_OVERRIDE_PATTERNS.some((p) => p.test(rawMessage))) return null;

  // Explicit count [1-9] or the word "one" with up to 3 intervening adjective words.
  // Handles: "give me 5 summer fragrances", "show me 4 fresh woody fragrances",
  //          "give me one summer fragrance" → 1.
  const countMatch = rawMessage.match(
    /\b(one|[1-9])\s+(?:\w+\s+){0,3}(?:fragrances?|scents?|perfumes?|options?|recommendations?|choices?|picks?)\b/i
  );
  if (countMatch) {
    const raw   = countMatch[1].toLowerCase();
    const count = raw === "one" ? 1 : parseInt(raw, 10);
    return Math.min(count, 5);
  }

  if (MULTI_OPTION_PATTERNS.some((p) => p.test(rawMessage))) return 5;

  return null;
}

// ── EP-AI-C5 section builders ─────────────────────────────────────────────────

// Rejected products: complete list (no cap), compact representation.
// Purpose: prose suppression — instructs the LLM never to recommend these.
// The hard filter in retrievalPlanner is the authoritative exclusion gate;
// this section adds prose-level suppression for the LLM.
function buildRejectedProductsSection(profile: ConversationProfile | undefined): PromptSection {
  const slugs = profile?.rejectedSlugs ?? [];
  if (slugs.length === 0) return { label: "", content: "" };

  const lines = slugs.map((slug) => {
    const name = getKnowledgeSummary(slug)?.name;
    return name ? `• ${name} (${slug})` : `• ${slug}`;
  });

  return {
    label:   "REJECTED PRODUCTS",
    content: `Do not recommend any of the following. They were explicitly declined by the guest this session.\n${lines.join("\n")}`,
  };
}

// EP-AI-C6-P1: Gender eligibility — prose-level guard to prevent the LLM from
// recommending off-gender fragrances even when context sections appear to permit it.
// Complements the hard catalogue filter in retrievalPlanner — the hard filter is
// the authoritative gate; this section adds an explicit instruction layer.
function buildGenderEligibilitySection(profile: ConversationProfile | undefined): PromptSection {
  if (!profile) return { label: "", content: "" };

  const shoppingFor = profile.shoppingIntent?.value;
  const preferred   = profile.preferredGender?.value;
  const recipient   = profile.recipientGender?.value;

  // Gift path: constraint is recipient gender
  if (shoppingFor === "gift" && recipient && recipient !== "unisex") {
    return {
      label:   "GENDER ELIGIBILITY",
      content: [
        `The guest is shopping for a gift. The recipient is ${recipient}.`,
        `Only recommend fragrances that are ${recipient} or unisex.`,
        `Do not recommend fragrances marketed to the opposite gender.`,
        `Never assume the recipient's gender has changed unless the guest explicitly states it.`,
      ].join("\n"),
    };
  }

  // Self path: constraint is preferred gender
  if ((!shoppingFor || shoppingFor === "self") && preferred && preferred !== "unisex") {
    return {
      label:   "GENDER ELIGIBILITY",
      content: [
        `The guest has identified as ${preferred}.`,
        `Only recommend fragrances that are ${preferred} or unisex.`,
        `Do not recommend fragrances marketed to the opposite gender.`,
        `Never assume the guest's gender has changed unless they explicitly state it.`,
      ].join("\n"),
    };
  }

  return { label: "", content: "" };
}

// Consultation stage: derived from existing state — no new persistent field.
function deriveConsultationStage(state: ConversationState): string {
  if (state.turns.length === 0) return "Starting consultation";
  if (state.consultationPlan && (state.consultationPlan.roles.length > 0)) {
    return "Collection consultation in progress";
  }
  if ((state.lastRecommendationSlugs ?? []).length > 0) return "Following up on recommendations";
  return "Exploring preferences";
}

function buildConsultationStageSection(state: ConversationState): PromptSection {
  return {
    label:   "CONSULTATION STAGE",
    content: deriveConsultationStage(state),
  };
}

// Consultation readiness: when the question fatigue gate fires, embed one
// targeted question as a directive so the LLM appends it after recommending.
function buildConsultationReadinessSection(plan: ConversationPlan): PromptSection {
  if (!plan.consultationReadinessQuestion) return { label: "", content: "" };
  return {
    label:   "CLARIFICATION FOCUS",
    content: `After presenting your recommendation(s), end with this question (adapted naturally to your voice):\n"${plan.consultationReadinessQuestion}"`,
  };
}

// Pool exhaustion: fewer than 2 valid candidates after all constraint filters.
function buildPoolExhaustionSection(
  retrieval: RetrievalContext,
  profile:   ConversationProfile | undefined,
): PromptSection {
  if (!retrieval.poolExhausted) return { label: "", content: "" };

  const avoidedFamilies = (profile?.avoidedFamilies?.value ?? []);
  const preferredGender = profile?.preferredGender?.value;
  const hasRejections   = (profile?.rejectedSlugs ?? []).length > 0;

  const constraintHints: string[] = [];
  if (avoidedFamilies.length > 0) constraintHints.push(`avoided families: ${avoidedFamilies.join(", ")}`);
  if (preferredGender)             constraintHints.push(`gender preference: ${preferredGender}`);
  if (hasRejections)               constraintHints.push("previously declined fragrances");

  const constraintDesc = constraintHints.length > 0
    ? `Likely constraint(s): ${constraintHints.join("; ")}.`
    : "";

  return {
    label:   "POOL EXHAUSTION",
    content: [
      "The current constraints have narrowed the catalogue to fewer than 2 eligible candidates.",
      constraintDesc,
      "Acknowledge this honestly to the guest.",
      "Identify which single constraint caused the narrowing and ask their permission to relax it — for example: \"If you're open to exploring outside [family], I can open up a wider selection.\"",
      "Also mention the Scent Finder quiz (/quiz) as an alternative way to discover options.",
      "Do not automatically relax any constraint without the guest's explicit agreement.",
    ].filter(Boolean).join("\n"),
  };
}

// Comparison intelligence: preference-aware priority so the most relevant
// intelligence differences appear first in the comparison prompt.
// Priority: (1) guest explicitly asked about a dimension, (2) dimensions with
// the largest spread across the candidates, (3) all remaining dimensions.
function buildComparisonIntelligenceSection(
  fragrances:  FragranceKnowledge[],
  rawMessage:  string | undefined,
  profile:     ConversationProfile | undefined,
  isComparison: boolean,
): PromptSection {
  if (!isComparison || fragrances.length < 2) return { label: "", content: "" };

  type Dim = { key: string; label: string };
  const DIMS: Dim[] = [
    { key: "sweetness",   label: "Sweetness"   },
    { key: "freshness",   label: "Freshness"   },
    { key: "warmth",      label: "Warmth"      },
    { key: "intensity",   label: "Intensity"   },
    { key: "versatility", label: "Versatility" },
  ];

  // Tier 1: detect which dimension the guest explicitly asked about this turn
  const msgLower = (rawMessage ?? "").toLowerCase();
  const explicitDim = DIMS.find((d) => msgLower.includes(d.key.toLowerCase()))?.key ?? null;

  // Tier 2: derive a preferred dimension from the guest's accumulated family preferences.
  // Conservative — maps only Maison family vocabulary that clearly aligns with a numeric
  // MKC intelligence field. Unlisted families (e.g. Floral, Woody) fall through to tier 3.
  const FAMILY_TO_DIM: Array<{ families: string[]; dim: string }> = [
    { families: ["citrus", "aquatic", "fresh", "green"], dim: "freshness" },
    { families: ["oriental", "amber"],                   dim: "warmth"    },
    { families: ["gourmand"],                            dim: "sweetness" },
  ];
  const guestFamilies = (profile?.preferredFamilies?.value ?? []).map((f) => f.toLowerCase());
  const profileDim = FAMILY_TO_DIM.find((entry) =>
    guestFamilies.some((gf) => entry.families.some((f) => gf.includes(f) || f.includes(gf)))
  )?.dim ?? null;

  // Compute spread for each dimension across the two primary fragrances
  const f0 = fragrances[0];
  const f1 = fragrances[1];
  type ScoredDim = Dim & { spread: number; priority: number };
  const scored: ScoredDim[] = DIMS.map((d) => {
    const v0 = (f0 as Record<string, unknown>)[d.key];
    const v1 = (f1 as Record<string, unknown>)[d.key];
    const spread = typeof v0 === "number" && typeof v1 === "number" ? Math.abs(v0 - v1) : 0;
    // Priority: tier 1 (explicit current-turn question) > tier 2 (known preferences) > tier 3 (spread)
    const priority = d.key === explicitDim ? 100
                   : d.key === profileDim  ? 50
                   : spread;
    return { ...d, spread, priority };
  });

  scored.sort((a, b) => b.priority - a.priority);

  const lines = scored.slice(0, 3).map((d) => {
    const vals = fragrances.slice(0, 2).map((f) => {
      const v = (f as Record<string, unknown>)[d.key];
      return `${f.name}: ${typeof v === "number" ? `${v}/5` : "—"}`;
    });
    return `${d.label}: ${vals.join(" vs ")}`;
  });

  return {
    label:   "COMPARISON INTELLIGENCE FOCUS",
    content: `Key dimensions for this comparison (most relevant first):\n${lines.join("\n")}\nAddress the guest's explicit question about these dimensions first.`,
  };
}

// ── Modified buildFragranceSection: embeds confidence classification tags ─────
// STRONG_MATCH / GOOD_MATCH / EXPLORATORY is injected after the role tag so
// the LLM can calibrate its confidence language without needing to compute fit.

// ── Public API ────────────────────────────────────────────────────────────────

export function buildContext(
  retrieval:          RetrievalContext,
  state:              ConversationState,
  plan:               ConversationPlan,
  effectiveIntent?:   ConversationIntent,
  refinement?:        RefinementState | null,
  explorationTarget?: ExplorationTarget | null,
  customerCtx?:       ConciergeCustomerContext | null,
  rawMessage?:        string,   // EP-AI-C5: used for preference-aware comparison intelligence
): BuiltContext {
  const sections: PromptSection[] = [
    buildSeasonalContextSection(rawMessage),  // EP-AI-C6-P3 Change D
    buildConsultationStageSection(state),                                        // EP-AI-C5
    buildConversationContextSection(state),
    buildProfileSection(state.profile),
    buildRejectedProductsSection(state.profile),                                // EP-AI-C5
    buildGenderEligibilitySection(state.profile),                               // EP-AI-C6-P1
    customerCtx ? buildCustomerAwarenessSection(customerCtx) : { label: "", content: "" },
    buildWardrobeSection(state.profile),
    buildCollectionSection(state.profile),
    buildConsultationPlanSection(state, refinement, explorationTarget),         // EP18-P1/P2
    buildGoalSection(plan, state, effectiveIntent),
    buildPreviousRecommendationsSection(state, retrieval.fragrances),
    buildFragranceSection(
      retrieval.fragrances,
      plan.reuseRecommendations,
      retrieval.fragranceRoles,
      retrieval.confidenceClassifications,                                       // EP-AI-C5
    ),
    retrieval.collectionName
      ? { label: "FEATURED COLLECTION", content: retrieval.collectionName }
      : { label: "", content: "" },
    buildArticleSection(retrieval.articles),
    buildComparisonIntelligenceSection(                                          // EP-AI-C5
      retrieval.fragrances,
      rawMessage,
      state.profile,
      plan.requiresComparison,
    ),
    buildPoolExhaustionSection(retrieval, state.profile),                       // EP-AI-C5
    buildConsultationReadinessSection(plan),                                    // EP-AI-C5
    buildInstructionsSection(plan, state, effectiveIntent, refinement, explorationTarget, retrieval.anchoredMeta, rawMessage), // EP18-P1/P2 / EP-AI-C4 / EP-AI-C6-P3
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
