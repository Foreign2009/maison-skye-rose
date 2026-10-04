/**
 * Maison Concierge — Response Planner
 *
 * Interprets raw LLM output: extracts [PRODUCT:slug] and [ARTICLE:slug] markers,
 * falls back to retrieval context when the model omits markers, and generates
 * contextual follow-up suggestions based on the ConversationPlan.
 *
 * EP15-P2: planResponse now accepts ConversationPlan for richer follow-ups.
 */

import type { ConversationIntent, ConversationProfile } from "./types";
import type { RetrievalContext, AnchoredMeta } from "./contextBuilder";
import type { ConversationPlan }   from "./conversationPlanner";

// ── Marker patterns ───────────────────────────────────────────────────────────

// EP-AI-C6-P3-R2 Repair A: character class extended to include apostrophe (U+0027).
// 11 canonical MKC slugs contain apostrophes (e.g. voyage-d'hermes-inspired).
// Audit of all 222 MKC slugs confirms only [a-z0-9'-] chars appear in slugs.
const PRODUCT_RE = /\[PRODUCT:([a-z0-9'-]+)\]/g;
const ARTICLE_RE = /\[ARTICLE:([a-z0-9-]+)\]/g;

// ── Precedence-2 bare-name matching helpers ───────────────────────────────────
// Allows "Chanel No. 5" in prose to match canonical "Chanel No 5 Inspired",
// and "CK One" to match "CK One Inspired", without false positives.

const PROSE_NAME_SUFFIXES = [" Inspired", " Eau de Parfum", " EDP", " Eau de Toilette", " EDT"];

function stripProseSuffix(name: string): string {
  const lower = name.toLowerCase();
  for (const s of PROSE_NAME_SUFFIXES) {
    if (lower.endsWith(s.toLowerCase())) return name.slice(0, -s.length);
  }
  return name;
}

// Removes periods and collapses whitespace so "No. 5" ≡ "No 5".
function normalizeForProseMatch(s: string): string {
  return s.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}

// ── No-match deterministic response ──────────────────────────────────────────
// Builds the entire response content for a no-match anchored_refinement turn from
// AnchoredMeta alone. No model prose is retained — the entire content comes from
// catalogue metadata so false claims (invented scores, zero-dimension assertions,
// product markers) cannot survive regardless of what the model returned.
//
// Three separate paths:
//   null score   — comparison cannot be established; no score invented
//   boundary     — anchor is at the limit of the catalogue range
//   exclusion    — lower/higher options exist but are filtered by active preferences
function buildNoMatchResponse(meta: AnchoredMeta): string {
  const { anchorName, dimension, direction, anchorScore, catalogueBoundary } = meta;

  if (anchorScore === null) {
    return (
      `${anchorName} does not have a ${dimension} score in our catalogue, so a directional comparison cannot be made.` +
      ` Would you like to explore another fragrance characteristic instead?`
    );
  }

  const dirWord  = direction === "less" ? "lower"  : "higher";
  const limitEnd = direction === "less" ? "lowest" : "highest";

  if (catalogueBoundary) {
    return (
      `${anchorName} is already at the ${limitEnd} end of our ${dimension} range (${anchorScore}/5)` +
      ` — no fragrance in our catalogue scores ${dirWord} in ${dimension}.` +
      ` Would you like to explore another fragrance characteristic instead?`
    );
  }

  return (
    `No fragrance scores ${dirWord} in ${dimension} than ${anchorName} (${anchorScore}/5) within your current preferences` +
    ` — ${dirWord}-${dimension} options may exist in the catalogue but are excluded by your active filters.` +
    ` Would you like to relax one of your preferences, or explore another fragrance characteristic instead?`
  );
}

// ── Strict-match absence-claim post-processor ────────────────────────────────
// After callClaude, sweeps residual absence-implying phrases from strict-match
// anchored_refinement responses. The calibration instruction explicitly prohibits
// phrases like "without sweetness" and "zero sweetness", but model compliance
// is probabilistic — this sweep corrects residual phrases that survive.
//
// Relative wording: phrases are corrected to "lower/higher {dim} than {anchorName}"
// (verified by the actual rendered candidate scores), not to flat "low/high" labels
// that have no anchor reference. Score tag appended only when all rendered candidates
// share the same score — avoids false precision for mixed-score pools.
//
// Preserves valid negations ("not zero sweetness") and quoted customer preferences
// ("I want no sweetness"). Checks 16 chars before the match for negation/preference words.
//
// Inferred failure mechanism: the model may treat absence phrases as legitimate
// fragrance character descriptions rather than literal echoes of the banned text.
// This is a plausible inference from the observed failure pattern, not a verified
// internal model cause.

function extractDimScore(
  f: { sweetness: number; freshness: number; warmth: number; intensity: number },
  dim: string,
): number | null {
  const map: Record<string, number> = {
    sweetness: f.sweetness,
    freshness: f.freshness,
    warmth:    f.warmth,
    intensity: f.intensity,
  };
  return map[dim.toLowerCase()] ?? null;
}

function sanitiseAbsenceClaims(
  content:  string,
  meta:     AnchoredMeta,
  rendered: RetrievalContext["fragrances"],  // actual rendered candidates only
): string {
  const { anchorName, dimension, direction } = meta;
  const dim     = dimension.toLowerCase();
  const dirComp = direction === "less" ? "lower" : "higher";

  // Score from rendered candidates for this dimension.
  // A score tag is added only when EVERY rendered candidate contributes a valid,
  // finite, in-range score AND all values match.
  //
  // The guard requires scores.length === rendered.length so that candidates for which
  // extractDimScore returns null (unscored dimension, unknown field) are never silently
  // excluded from the set in a way that produces a falsely shared tag.
  // e.g. rendered=[sw1, null] → scores=[1] → 1 ≠ 2 (rendered.length) → no tag.
  const scores = rendered.flatMap((f) => {
    const v = extractDimScore(
      f as { sweetness: number; freshness: number; warmth: number; intensity: number },
      dim,
    );
    return v !== null ? [v] : [];
  });
  const allSame =
    rendered.length > 0 &&
    scores.length === rendered.length &&
    scores.every((s) => Number.isFinite(s) && s >= 1 && s <= 5 && s === scores[0]);
  const scoreTag = allSame ? ` (${scores[0]}/5)` : "";

  // "with lower sweetness than Baccarat Rouge 540 Inspired (1/5)"
  const withRelative = `with ${dirComp} ${dim} than ${anchorName}${scoreTag}`;
  // "lower sweetness than Baccarat Rouge 540 Inspired (1/5)"
  const bareRelative = `${dirComp} ${dim} than ${anchorName}${scoreTag}`;

  // Preserves valid negations ("not without sweetness", "isn't no sweetness") and
  // quoted customer preferences ("I want no sweetness", "since you prefer no sweetness").
  // Checks 16 characters before the match — wide enough for "I want " (7 chars) and
  // "seeking " (8 chars). Includes negation words and preference-intent verbs.
  function replaceUnlessNegated(text: string, pattern: RegExp, repl: string): string {
    return text.replace(pattern, (match, offset: number) => {
      const preceding = text.slice(Math.max(0, offset - 16), offset);
      if (
        /\b(?:not|isn't|aren't|don't|doesn't|never|want|wants|wanted|wanting|prefer|prefers|preferred|seek|seeking|avoid|avoiding|avoids)\s*$/i
          .test(preceding)
      ) {
        return match;
      }
      return repl;
    });
  }

  let result = content;

  // "without [any] sweetness" → "with lower sweetness than {anchor}(scoreTag)"
  result = replaceUnlessNegated(result, new RegExp(`without(?:\\s+any)?\\s+${dim}\\b`, "gi"), withRelative);
  // "no sweetness" (word boundary) → "lower sweetness than {anchor}(scoreTag)"
  result = replaceUnlessNegated(result, new RegExp(`\\bno\\s+${dim}\\b`, "gi"), bareRelative);
  // "zero sweetness" → "lower sweetness than {anchor}(scoreTag)"
  result = replaceUnlessNegated(result, new RegExp(`\\bzero\\s+${dim}\\b`, "gi"), bareRelative);
  // "sweetness-free" → "lower-sweetness"
  result = replaceUnlessNegated(result, new RegExp(`\\b${dim}-free\\b`, "gi"), `${dirComp}-${dim}`);

  // Sweetness-specific sugar synonyms (also forbidden by calibration instruction)
  if (dim === "sweetness") {
    result = replaceUnlessNegated(result, /without(?:\s+any)?\s+sugar\b/gi, withRelative);
    result = replaceUnlessNegated(result, /\bno\s+sugar\b/gi, bareRelative);
    result = replaceUnlessNegated(result, /\bsugar-?free\b/gi, `${dirComp}-sweetness`);
    result = replaceUnlessNegated(result, /\bsugarless\b/gi, `${dirComp}-sweetness`);
  }

  return result;
}

// ── Contextual follow-up generation ──────────────────────────────────────────

// ── Static follow-up pools ────────────────────────────────────────────────────
// Baseline suggestions per intent. Profile-safe filtering runs at generation
// time — suggestions that would propose avoided or rejected directions are
// removed before the slice. Deterministic only: no additional LLM call.

const STATIC_FOLLOW_UPS: Record<ConversationIntent, string[]> = {
  similar_to:          ["Compare these", "Show me another option", "Find something fresher"],
  comparison:          ["Show me something different", "Which is better for evenings?"],
  education:           ["Show fragrances in this family", "Teach me more"],
  occasion_search:     ["Find something subtler", "Show best sellers for this occasion"],
  seasonal:            ["Show year-round options", "Find something for cooler weather"],
  gift:                ["Show luxury gift options", "Find something for daily wear"],
  general_discovery:   ["Help me find my signature scent", "Show best sellers"],
  clarification:       ["Shop by occasion", "Help me explore families"],
  anchored_refinement: ["Show me more in this direction", "Compare these", "Tell me more about this one"],
};

// Follow-up phrases that could inadvertently propose a direction the guest
// explicitly dislikes. We filter these out when we can detect a conflict.
const DIRECTION_KEYWORDS: Array<{ phrase: string; families: string[]; vibes: string[] }> = [
  { phrase: "something warmer",      families: ["oriental", "amber", "woody"], vibes: ["warm"] },
  { phrase: "for cooler weather",    families: ["oriental", "amber"],          vibes: ["warm", "cosy"] },
  { phrase: "luxury gift options",   families: [],                             vibes: [] },
  { phrase: "show best sellers",     families: [],                             vibes: [] },
  { phrase: "find something fresher",families: ["citrus", "aquatic", "green"], vibes: ["fresh"] },
  { phrase: "shop by occasion",      families: [],                             vibes: [] },
];

function isSuggestionSafe(
  suggestion:      string,
  avoidedFamilies: string[],
  avoidedNotes:    string[],
): boolean {
  const s = suggestion.toLowerCase();
  for (const { phrase, families } of DIRECTION_KEYWORDS) {
    if (s.includes(phrase.toLowerCase()) && families.length > 0) {
      if (families.some((fam) =>
        avoidedFamilies.some((af) => af.toLowerCase().includes(fam) || fam.includes(af.toLowerCase()))
      )) return false;
    }
  }
  // Crude note check: if the suggestion mentions a note the guest avoids
  for (const note of avoidedNotes) {
    if (note.length > 3 && s.includes(note.toLowerCase())) return false;
  }
  return true;
}

function generateFollowUps(
  plan:      ConversationPlan,
  intent:    ConversationIntent,
  hasRecs:   boolean,
  profile?:  ConversationProfile,
  recCount?: number,
): string[] {
  const avoidedFamilies = (profile?.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
  const avoidedNotes    = (profile?.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());

  const filter = (suggestions: string[]): string[] =>
    suggestions
      .filter((s) => isSuggestionSafe(s, avoidedFamilies, avoidedNotes))
      .slice(0, 2);

  // Clarification turns — minimal, focused
  if (plan.requiresClarification) {
    return filter(["Shop by occasion", "Help me explore families"]);
  }

  // Comparison just completed — profile-neutral post-comparison suggestions
  if (plan.requiresComparison) {
    return filter(["Show me something different", "Find gifts", "Show best sellers"]);
  }

  // Cache-reuse path — customer already has recommendations
  if (plan.reuseRecommendations && hasRecs) {
    return filter(["Compare these", "Show me another option", "Teach me more"]);
  }

  // Education completed
  if (plan.nextIntent === "education" || intent === "education") {
    return filter(["Show fragrances in this family", "Teach me more", "Find gifts"]);
  }

  // Consultation readiness gate fired — suggest discovery alternatives
  if (plan.consultationReadinessQuestion) {
    return filter(["Show me what's popular", "Help me explore by occasion"]);
  }

  // anchored_refinement with empty pool: product-referencing chips ("Compare these two",
  // "Show me more in this direction") make no sense when zero cards were returned.
  // Redirect toward adjacent dimensions or broader discovery instead.
  if (intent === "anchored_refinement" && !hasRecs) {
    // "Try a different direction" is honest: routes to new_search with no direction re-trigger.
    // "Explore the catalogue" is honest: routes to general_discovery using quality-ranked pool
    // (sortByQuality: bestSeller → overallScore → popularity). Does not promise a different anchor
    // is excluded — retrieval may still return the anchor since mentionedSlug persists in context.
    // "Explore a different family" was replaced because the pipeline cannot enforce a family
    // change from this chip text alone (no family signal in the message).
    return filter(["Try a different direction", "Explore the catalogue"]);
  }

  // Generic selection based on intent.
  // anchored_refinement: suppress "Compare these" when fewer than 2 cards are shown.
  // Comparison requires two subjects — 1 card makes the chip misleading.
  const pool = STATIC_FOLLOW_UPS[intent] ?? STATIC_FOLLOW_UPS.general_discovery;
  const filteredPool =
    intent === "anchored_refinement" && recCount !== undefined && recCount < 2
      ? pool.filter((s) => !s.toLowerCase().startsWith("compare"))
      : pool;
  return filter(filteredPool);
}

// ── Public types ──────────────────────────────────────────────────────────────

export interface PlannedResponse {
  content:             string;
  recommendedSlugs:    string[];
  articleSlugs:        string[];
  followUpSuggestions: string[];
  intent:              ConversationIntent;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function planResponse(
  rawContent: string,
  intent:     ConversationIntent,
  retrieval:  RetrievalContext,
  plan:       ConversationPlan,
  profile?:   ConversationProfile,
): PlannedResponse {
  const rawSlugs:    string[] = [];
  const articleSlugs: string[] = [];

  // Extract [PRODUCT:slug] markers and preserve the canonical name in prose.
  //
  // The model wraps product markers in **...** for emphasis: **[PRODUCT:slug]**.
  // ConciergeMessage renders content as a plain text node (no markdown processor),
  // so those asterisks appear as literal characters. Handling bold-wrapped and
  // non-bold forms as separate patterns removes the ** together with the marker,
  // preventing orphaned **** from appearing in the chat bubble.
  //
  // Valid slug (present in retrieval context) → replaced with the canonical name.
  // Unknown / disallowed slug                 → replaced with "" (whole construct
  //                                             removed; no marker leaked to UI).
  //
  // Slug collection pre-scan: capture slugs in text-appearance order before the
  // two replacement passes. The bold pass (Step 1) and non-bold pass (Step 2)
  // run in a fixed sequence; without a pre-scan a bold slug positioned after a
  // non-bold one in the text would still be pushed first, inverting first-mentioned
  // priority when cardTarget limits the selection to fewer cards than markers.
  // Step 0: Collapse **canonical name** [PRODUCT:slug] → [PRODUCT:slug].
  // Only collapses when the bold text matches that product's canonical name AND
  // the slug is present in the retrieval context (eligible this turn).
  // Unrelated bold prose and out-of-retrieval slugs are preserved unchanged so
  // Steps 1/2 handle or discard them cleanly without double-processing.
  rawContent = rawContent.replace(/\*\*([^*]+)\*\*\s*(\[PRODUCT:[a-z0-9'-]+\])/g, (_match, name: string, marker: string) => {
    const slug = marker.slice(9, -1); // '[PRODUCT:'.length === 9, strip trailing ']'
    const frag = retrieval.fragrances.find((f) => f.slug === slug);
    if (!frag) return _match;
    if (frag.name.toLowerCase().trim() !== name.trim().toLowerCase()) return _match;
    return marker;
  });

  // Step 0b: Collapse bare canonical-name [PRODUCT:slug] → [PRODUCT:slug].
  // On comparison turns the model often writes the name in prose and then
  // immediately emits a marker: "Sauvage Inspired [PRODUCT:sauvage-inspired]".
  // Step 2 would then substitute the marker with the name again, producing
  // "Sauvage Inspired Sauvage Inspired". Collapsing here prevents the duplicate.
  // Only fires when the name is immediately adjacent (optional whitespace only) —
  // legitimate mentions elsewhere in the same sentence are not affected.
  for (const frag of retrieval.fragrances) {
    const escapedName = frag.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedSlug = frag.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rawContent = rawContent.replace(
      new RegExp(`${escapedName}\\s*(\\[PRODUCT:${escapedSlug}\\])`, "g"),
      "$1",
    );
  }

  {
    const slugScanRE = /\*\*\[PRODUCT:([a-z0-9'-]+)\]\*\*|\[PRODUCT:([a-z0-9'-]+)\]/g;
    let m: RegExpExecArray | null;
    while ((m = slugScanRE.exec(rawContent)) !== null) {
      const slug = m[1] ?? m[2];
      if (!rawSlugs.includes(slug)) rawSlugs.push(slug);
    }
  }
  // Step 1: bold-wrapped markers (**[PRODUCT:slug]**) — content replacement only.
  let content = rawContent.replace(/\*\*\[PRODUCT:([a-z0-9'-]+)\]\*\*/g, (_, slug: string) => {
    const frag = retrieval.fragrances.find((f) => f.slug === slug);
    return frag ? frag.name : "";
  });
  // Step 2: non-bold (or asymmetrically-wrapped) markers ([PRODUCT:slug])
  content = content.replace(PRODUCT_RE, (_, slug: string) => {
    const frag = retrieval.fragrances.find((f) => f.slug === slug);
    return frag ? frag.name : "";
  });

  // Extract [ARTICLE:slug] markers and preserve the canonical title in prose.
  // The model emits [ARTICLE:slug] without bold-wrapping per system prompt, but
  // bold-wrapped form is handled first for safety.
  //
  // Valid slug (present in retrieval context) → replaced with the article title;
  //                                             slug added to articleSlugs for card.
  // Unknown / out-of-retrieval slug           → replaced with "" (removed cleanly);
  //                                             slug NOT added to articleSlugs so
  //                                             formatResponse cannot render a card
  //                                             by resolving it against academyCatalogue.
  //
  // Step 1: bold-wrapped markers (**[ARTICLE:slug]**) — treated as a unit.
  content = content.replace(/\*\*\[ARTICLE:([a-z0-9-]+)\]\*\*/g, (_, slug: string) => {
    const article = retrieval.articles.find((a) => a.slug === slug);
    if (article) {
      if (!articleSlugs.includes(slug)) articleSlugs.push(slug);
      return article.title;
    }
    return "";
  });
  // Step 2: non-bold (or asymmetrically-wrapped) markers ([ARTICLE:slug])
  content = content.replace(ARTICLE_RE, (_, slug: string) => {
    const article = retrieval.articles.find((a) => a.slug === slug);
    if (article) {
      if (!articleSlugs.includes(slug)) articleSlugs.push(slug);
      return article.title;
    }
    return "";
  });

  // Repair B: final safety sweep — strip any residual internal control markers not
  // matched by the primary parsers (e.g. apostrophe-slug variants missed by PRODUCT_RE
  // before the R2 fix, unknown slugs, markdown-adjacent forms). Uses [^\]]* to catch
  // any slug content. Must run after primary extraction so valid slugs are already
  // captured and only unresolved syntax remains.
  content = content
    .replace(/\[PRODUCT:[^\]]*\]/g, "")
    .replace(/\[ARTICLE:[^\]]*\]/g, "");

  // Repair C: strip residual **bold** emphasis markers.
  // The system prompt prohibits bold and single-asterisk emphasis, but model
  // compliance is probabilistic — on comparison turns the model uses **Name**
  // as a visual section heading per fragrance. These characters are not processed
  // by a Markdown renderer and appear literally in the chat bubble.
  // The enclosed text is preserved; only the paired ** delimiters are removed.
  // Must run after Repair B so no marker syntax (e.g. **[PRODUCT:...]**) remains
  // to be mis-matched — those are already resolved or stripped by Steps 0–2.
  content = content.replace(/\*\*([^*\n]+)\*\*/g, "$1");

  if (articleSlugs.length === 0 && retrieval.articles.length > 0) {
    retrieval.articles.slice(0, 2).forEach((a) => articleSlugs.push(a.slug));
  }

  // ── Product card resolution (EP-AI-C4 A2 fix) ────────────────────────────────
  // Product cards must refer only to fragrances actually in the current retrieval
  // context. Precedence (Founder-approved):
  //   1. Valid [PRODUCT:slug] markers restricted to current retrieval candidates
  //   2. Exact product-name matches in prose, restricted to current candidates
  //   3. Deterministic single candidate when retrieval holds exactly one fragrance
  //   4. No card — never render speculative or unvalidated product cards
  //
  // PROHIBITED: arbitrary first-N fallback, catalogue-wide matching, unknown slugs.

  const validFragranceSlugs = new Set(retrieval.fragrances.map((f) => f.slug));

  // Precedence 1: valid markers
  let finalSlugs: string[] = rawSlugs.filter((s) => validFragranceSlugs.has(s));

  if (finalSlugs.length === 0) {
    // Precedence 2: product-name match in prose — full canonical name OR bare name (suffix-stripped),
    // both normalized for punctuation ("No. 5" ≡ "No 5"). Minimum 5-char bare name to avoid
    // false positives from very short product identifiers.
    const normContent = normalizeForProseMatch(content);
    const nameMatched = retrieval.fragrances
      .filter((f) => {
        if (normContent.includes(normalizeForProseMatch(f.name))) return true;
        const bare = stripProseSuffix(f.name);
        return bare !== f.name && bare.length >= 5 && normContent.includes(normalizeForProseMatch(bare));
      })
      .map((f) => f.slug);

    if (nameMatched.length > 0) {
      finalSlugs = nameMatched;
    } else if (retrieval.fragrances.length === 1) {
      // Precedence 3: single deterministic candidate (single-best intent)
      finalSlugs = [retrieval.fragrances[0].slug];
    }
    // Precedence 4: no card (finalSlugs stays [])
  }

  // EP-AI-C6-P3-R2: Server-side card guarantee (Repair D — deterministic fill).
  // cardTarget is set on retrieval by buildContext (via computeCardTarget) before
  // this function is called. Two directions:
  //   Over-emission: LLM emits more valid markers than target → cap to target.
  //   Under-emission: LLM emits fewer valid markers but governed context has enough → fill.
  // Invariant: model-selected valid cards come first; deterministic fill preserves
  // governed candidate order. Never fabricates products; only uses retrieval.fragrances.
  const cardTarget = retrieval.cardTarget ?? null;
  if (cardTarget !== null) {
    if (finalSlugs.length > cardTarget) {
      finalSlugs = finalSlugs.slice(0, cardTarget);
    } else if (finalSlugs.length < cardTarget && retrieval.fragrances.length >= cardTarget) {
      for (const f of retrieval.fragrances) {
        if (finalSlugs.length >= cardTarget) break;
        if (!finalSlugs.includes(f.slug)) finalSlugs.push(f.slug);
      }
    }
  }

  // No-match anchored_refinement post-processor:
  // Replace the entire content with a deterministic response built from AnchoredMeta.
  // No model prose is retained — invented scores, zero-dimension claims, product markers,
  // and extra questions are discarded regardless of what the model returned.
  if (retrieval.anchoredMeta && !retrieval.anchoredMeta.strictMatches) {
    finalSlugs = [];
    content = buildNoMatchResponse(retrieval.anchoredMeta);
  }

  // Strict-match anchored_refinement: post-process residual absence-implying phrases.
  // The calibration instruction prohibits "without sweetness", "zero sweetness", etc.
  // but model compliance is probabilistic. This sweep corrects residual phrases using
  // relative wording validated against rendered candidates only — not the full pool.
  // Applied after marker processing so product name substitutions are already done.
  if (intent === "anchored_refinement" && retrieval.anchoredMeta?.strictMatches === true) {
    const renderedCandidates = retrieval.fragrances.filter((f) => finalSlugs.includes(f.slug));
    content = sanitiseAbsenceClaims(content, retrieval.anchoredMeta, renderedCandidates);
  }

  const hasRecs             = retrieval.fragrances.length > 0;
  const followUpSuggestions = generateFollowUps(plan, intent, hasRecs, profile, finalSlugs.length).slice(0, 2);

  return {
    content:          content.replace(/\s{2,}/g, " ").trim(),
    recommendedSlugs: finalSlugs,
    articleSlugs,
    followUpSuggestions,
    intent,
  };
}
