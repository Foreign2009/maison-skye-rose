/**
 * Unit tests for responsePlanner.ts post-processors:
 *   sanitiseAbsenceClaims  — Defect A regression (determiners: "without the/its/that sweetness")
 *   sanitiseEqualScoreClaims — Defect B regression ("higher warmth (4/5)" when anchor warmth = 4)
 *
 * Tests run via planResponse() since the helpers are not exported.
 * Each test constructs a minimal RetrievalContext with anchoredMeta and a single
 * real-catalogue candidate, then asserts on planResponse().content.
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { planResponse } from "../../../app/lib/concierge/responsePlanner";
import { catalogueMaps } from "../../../app/lib/discovery";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import type { AnchoredMeta, RetrievalContext } from "../../../app/lib/concierge/contextBuilder";

// ── Fixtures ──────────────────────────────────────────────────────────────────

// Real catalogue entries — type-safe, no casting needed.
const OUD_WOOD = catalogueMaps.bySlug.get("oud-wood-inspired")!;
const BR540    = catalogueMaps.bySlug.get("baccarat-rouge-540-inspired")!;
const SAUVAGE  = catalogueMaps.bySlug.get("sauvage-inspired")!;
const TERRE    = catalogueMaps.bySlug.get("terre-d'hermes-inspired")!;

assert.ok(OUD_WOOD, "oud-wood-inspired must exist in catalogue");
assert.ok(BR540,    "baccarat-rouge-540-inspired must exist in catalogue");
assert.ok(SAUVAGE,  "sauvage-inspired must exist in catalogue");
assert.ok(TERRE,    "terre-d'hermes-inspired must exist in catalogue");

// Verify the defect scenario holds for the actual catalogue values.
// If any score changes, this assertion flags it immediately.
assert.equal(OUD_WOOD.warmth,    4, "Oud Wood warmth must be 4 (defect-B premise)");
assert.equal(BR540.warmth,       4, "BR540 warmth must be 4 (defect-B premise, equal to Oud Wood)");
assert.equal(SAUVAGE.warmth,     3, "Sauvage warmth must be 3 (lower than BR540)");
assert.equal(TERRE.warmth,       3, "Terre warmth must be 3 (lower than BR540)");
assert.equal(BR540.sweetness,    3, "BR540 sweetness must be 3 (anchor for less-sweet search)");
assert.equal(OUD_WOOD.sweetness, 1, "Oud Wood sweetness must be 1");

const ANCHORED_PLAN: ConversationPlan = {
  action: "anchored_refinement",
  reason: "test",
  requiresRetrieval: true,
  requiresComparison: false,
  requiresClarification: false,
  reuseRecommendations: false,
  nextIntent: "anchored_refinement",
};

// AnchoredMeta for a "less sweet than BR540" turn returning Oud Wood as the sole candidate.
// anchorDimScores populated with BR540's actual scores — mirrors what retrievalPlanner now writes.
const BR540_META: AnchoredMeta = {
  anchorSlug:     BR540.slug,
  anchorName:     BR540.name,
  dimension:      "sweetness",
  direction:      "less",
  anchorScore:    BR540.sweetness,
  anchorDimScores: {
    sweetness:   BR540.sweetness,
    freshness:   BR540.freshness,
    warmth:      BR540.warmth,
    intensity:   BR540.intensity,
    versatility: BR540.versatility,
  },
  strictMatches:     true,
  catalogueBoundary: false,
};

// Minimal retrieval context with one candidate — triggers Precedence 3 (single deterministic
// candidate) so finalSlugs = [OUD_WOOD.slug] without needing product markers in content.
function makeRetrieval(overrides: Partial<AnchoredMeta> = {}): RetrievalContext {
  return {
    fragrances: [OUD_WOOD],
    articles: [],
    anchoredMeta: { ...BR540_META, ...overrides },
  };
}

function run(content: string, overrides: Partial<AnchoredMeta> = {}): string {
  return planResponse(content, "anchored_refinement", makeRetrieval(overrides), ANCHORED_PLAN).content;
}

// ── Defect A: absence-claim determiners ───────────────────────────────────────

test("RP-A-01  'without the sweetness' is replaced", () => {
  const out = run("This option sits without the sweetness of Baccarat Rouge — great for formal wear.");
  assert.ok(!out.includes("without the sweetness"), "phrase must be replaced");
  assert.ok(out.includes("lower sweetness"), "replaced with relative direction");
});

test("RP-A-02  'without its sweetness' is replaced", () => {
  const out = run("A dry, resinous character — without its sweetness it registers as a woody amber.");
  assert.ok(!out.includes("without its sweetness"), "phrase must be replaced");
  assert.ok(out.includes("lower sweetness"), "replaced with relative direction");
});

test("RP-A-03  'without that sweetness' is replaced", () => {
  const out = run("Clean and dry without that sweetness you might expect.");
  assert.ok(!out.includes("without that sweetness"), "phrase must be replaced");
  assert.ok(out.includes("lower sweetness"), "replaced with relative direction");
});

test("RP-A-04  original 'without sweetness' (no determiner) still replaced", () => {
  const out = run("This option sits without sweetness.");
  assert.ok(!out.includes("without sweetness"), "original no-determiner form must still be replaced");
  assert.ok(out.includes("lower sweetness"), "replaced with relative direction");
});

test("RP-A-05  original 'without any sweetness' still replaced", () => {
  const out = run("A dry, resinous alternative without any sweetness.");
  assert.ok(!out.includes("without any sweetness"), "without-any form must still be replaced");
  assert.ok(out.includes("lower sweetness"), "replaced with relative direction");
});

test("RP-A-06  score tag (1/5) appended when single candidate", () => {
  // Single candidate Oud Wood sweetness=1 → all candidates share score 1 → scoreTag=" (1/5)"
  const out = run("Sits without the sweetness of the original.");
  assert.ok(out.includes("(1/5)"), "score tag must appear for single-candidate turn");
});

test("RP-A-07  negation 'not without the sweetness' preserved", () => {
  const content = "This is not without the sweetness, it just carries it differently.";
  const out = run(content);
  assert.ok(out.includes("not without the sweetness"), "negated phrase must be preserved");
});

test("RP-A-08  preference 'prefer without the sweetness' preserved", () => {
  const content = "For those who prefer without the sweetness.";
  const out = run(content);
  assert.ok(out.includes("prefer without the sweetness"), "preference phrase must be preserved");
});

// ── Defect B: equal-score comparative claim ───────────────────────────────────

test("RP-B-01  'higher warmth (4/5)' corrected to 'the same warmth' when anchor warmth=4", () => {
  // Oud Wood warmth=4, BR540 warmth=4 → equal → "higher" is false.
  const out = run(`Oud Wood offers higher warmth (${OUD_WOOD.warmth}/5) which suits evening wear.`);
  assert.ok(!out.includes(`higher warmth`), "false higher-warmth claim must be removed");
  assert.ok(out.includes("the same warmth"), "replaced with same-score phrasing");
});

test("RP-B-02  'lower warmth (4/5) than Baccarat Rouge' corrected to 'the same warmth'", () => {
  // Anchor comparison: "than Baccarat Rouge" names the anchor → gate 2b passes.
  // Oud Wood warmth=4, BR540 warmth=4, stated 4 → equal → correction fires.
  const out = run(`Oud Wood features lower warmth (${OUD_WOOD.warmth}/5) than Baccarat Rouge, making it less suited for cold evenings.`);
  assert.ok(!out.includes("lower warmth"), "false lower-warmth vs anchor claim must be removed");
  assert.ok(out.includes("the same warmth"), "replaced with same-score phrasing");
});

test("RP-B-03  genuine 'higher warmth (4/5)' preserved — Oud Wood warmth=4 vs Sauvage anchor warmth=3", () => {
  // Sauvage.warmth=3, Oud Wood.warmth=4 → Oud Wood genuinely warmer than the anchor.
  // Gate 2: statedScore(4) !== anchorDimScore(3) → match returned unchanged.
  const sauvageMeta: AnchoredMeta = {
    anchorSlug:      SAUVAGE.slug,
    anchorName:      SAUVAGE.name,
    dimension:       "warmth",
    direction:       "more",
    anchorScore:     SAUVAGE.warmth,
    anchorDimScores: {
      sweetness:   SAUVAGE.sweetness,
      freshness:   SAUVAGE.freshness,
      warmth:      SAUVAGE.warmth,        // 3
      intensity:   SAUVAGE.intensity,
      versatility: SAUVAGE.versatility,
    },
    strictMatches:     true,
    catalogueBoundary: false,
  };
  const out = planResponse(
    `Oud Wood Inspired offers higher warmth (${OUD_WOOD.warmth}/5), adding depth to the dry-down.`,
    "anchored_refinement",
    { fragrances: [OUD_WOOD], articles: [], anchoredMeta: sauvageMeta },
    ANCHORED_PLAN,
  ).content;
  assert.ok(out.includes(`higher warmth (${OUD_WOOD.warmth}/5)`), "genuine higher warmth claim must be preserved");
});

test("RP-B-04  unnamed claim with mismatched scores → 'higher sweetness (3/5)' left unchanged", () => {
  // Gate 3: no candidate named in the sentence → resolveNamedCandidate returns null → unchanged.
  // Even if Oud Wood were named, gate 4 would also block (OUD_WOOD.sweetness=1 ≠ statedScore=3).
  const out = run(`This option presents higher sweetness (${BR540.sweetness}/5) in warm conditions.`);
  assert.ok(out.includes(`higher sweetness (${BR540.sweetness}/5)`), "non-equal-score claim must not be touched");
});

test("RP-B-05  anchorDimScores absent → content unchanged", () => {
  // When anchorDimScores is not populated (existing serialised states, tests constructed without it),
  // sanitiseEqualScoreClaims must return content unchanged.
  const overrides: Partial<AnchoredMeta> = { anchorDimScores: undefined };
  const phrase = `offers higher warmth (${OUD_WOOD.warmth}/5) for evening wear`;
  const out = run(phrase, overrides);
  assert.ok(out.includes(`higher warmth (${OUD_WOOD.warmth}/5)`), "content unchanged without anchorDimScores");
});

test("RP-B-06  model states score mismatching anchor → leave unchanged (gate 2)", () => {
  // anchor.warmth=4, model writes "(3/5)".
  // Gate 2: statedScore(3) !== anchorDimScore(4) → match returned unchanged.
  // Whether the candidate's actual warmth is 3 or 4 is irrelevant — gate 2 fires first.
  const wrongScore = OUD_WOOD.warmth - 1; // 3
  const out = run(`Oud Wood features higher warmth (${wrongScore}/5), adding depth.`);
  assert.ok(out.includes(`higher warmth (${wrongScore}/5)`), "score-mismatch-with-anchor claim must not be touched");
});

test("RP-B-07  negation 'not higher warmth (4/5)' preserved", () => {
  // Gate 2b: "than expected" is not an anchor reference → match returned unchanged.
  // (The negation guard would also have blocked this, but gate 2b fires first.)
  const out = run(`Oud Wood is not higher warmth (${OUD_WOOD.warmth}/5) than expected — it sits in the same register.`);
  assert.ok(out.includes(`not higher warmth (${OUD_WOOD.warmth}/5)`), "negated phrase must be preserved");
});

test("RP-B-08  unnamed claim → no named candidate in sentence → unchanged (gate 3)", () => {
  // "This fragrance offers higher warmth (4/5)" names no candidate.
  // Gate 3: resolveNamedCandidate returns null → match returned unchanged.
  // (With rendered.some() this would have fired; candidate-specific attribution leaves it unchanged.)
  const noWarmth = { ...OUD_WOOD, warmth: undefined as unknown as number };
  const retrieval: RetrievalContext = {
    fragrances: [OUD_WOOD, noWarmth],
    articles: [],
    anchoredMeta: BR540_META,
    cardTarget: 2,
  };
  const phrase = `This fragrance offers higher warmth (${OUD_WOOD.warmth}/5) during the dry-down.`;
  const out = planResponse(phrase, "anchored_refinement", retrieval, ANCHORED_PLAN).content;
  assert.ok(out.includes(`higher warmth (${OUD_WOOD.warmth}/5)`), "unnamed claim must be left unchanged (gate 3)");
});

test("RP-B-09  three-candidate: Oud Wood higher warmth corrected; Sauvage/Terre lower warmth preserved", () => {
  // The exact live defect scenario. BR540 anchor warmth=4.
  // Candidates: Oud Wood (warmth=4), Sauvage (warmth=3), Terre (warmth=3).
  // Old gate 3 blocked correction because warmth scores were not all equal (4, 3, 3).
  // New per-match algorithm: "higher warmth (4/5)" → statedScore=4=anchor.warmth=4 (gate 2 passes),
  // hasMatchingCandidate: OUD_WOOD.warmth=4=4 (gate 3 passes) → corrected.
  // "lower warmth (3/5)" → statedScore=3 ≠ anchor.warmth=4 (gate 2 fails) → preserved.
  const retrieval: RetrievalContext = {
    fragrances: [OUD_WOOD, SAUVAGE, TERRE],
    articles: [],
    anchoredMeta: BR540_META,
    cardTarget: 3,
  };
  const prose =
    `Oud Wood Inspired features higher warmth (${OUD_WOOD.warmth}/5), making it ideal for cold evenings. ` +
    `Sauvage Inspired registers lower warmth (${SAUVAGE.warmth}/5), keeping it fresh and versatile. ` +
    `Terre d'Hermes Inspired also has lower warmth (${TERRE.warmth}/5), its earthy character staying crisp.`;
  const out = planResponse(prose, "anchored_refinement", retrieval, ANCHORED_PLAN).content;
  assert.ok(!out.includes(`higher warmth (${OUD_WOOD.warmth}/5)`), "false higher-warmth claim corrected");
  assert.ok(out.includes(`the same warmth (${OUD_WOOD.warmth}/5)`), "corrected to same-warmth phrasing");
  assert.equal(
    (out.match(new RegExp(`lower warmth \\(${SAUVAGE.warmth}\\/5\\)`, "g")) ?? []).length,
    2,
    "both genuine lower-warmth (3/5) claims preserved",
  );
});

test("RP-B-10  genuine lower-score comparison preserved (gate 2)", () => {
  // "lower warmth (3/5)" in a three-candidate context where anchor.warmth=4.
  // Gate 2: statedScore(3) !== anchorDimScore(4) → match returned unchanged.
  const retrieval: RetrievalContext = {
    fragrances: [OUD_WOOD, SAUVAGE, TERRE],
    articles: [],
    anchoredMeta: BR540_META,
    cardTarget: 3,
  };
  const phrase = `Sauvage Inspired registers lower warmth (${SAUVAGE.warmth}/5), making it the crisper option.`;
  const out = planResponse(phrase, "anchored_refinement", retrieval, ANCHORED_PLAN).content;
  assert.ok(out.includes(`lower warmth (${SAUVAGE.warmth}/5)`), "genuine lower-warmth claim must be preserved");
});

test("RP-B-11  Sauvage 'higher warmth (4/5)' unchanged; Oud Wood's score must not validate Sauvage's claim", () => {
  // Sauvage.warmth=3, stated score=4=anchor.warmth=4.
  // Gate 2 passes. Gate 3 passes: sentence names Sauvage.
  // Gate 4 fails: Sauvage.warmth(3) ≠ statedScore(4) → model misattributed → unchanged.
  // Oud Wood.warmth=4 is irrelevant — it is not named in the sentence.
  const retrieval: RetrievalContext = {
    fragrances: [OUD_WOOD, SAUVAGE, TERRE],
    articles: [],
    anchoredMeta: BR540_META,
    cardTarget: 3,
  };
  const phrase = `Sauvage Inspired features higher warmth (${BR540.warmth}/5), making it bold and intense.`;
  const out = planResponse(phrase, "anchored_refinement", retrieval, ANCHORED_PLAN).content;
  assert.ok(
    out.includes(`higher warmth (${BR540.warmth}/5)`),
    "misattributed claim must be left unchanged (gate 4: Sauvage.warmth=3 ≠ stated 4)",
  );
});

test("RP-B-13  'lower warmth (4/5) than heavier ouds' preserved — explicit non-anchor baseline (gate 2b)", () => {
  // "than heavier ouds" is an explicit comparison against a non-anchor reference.
  // Gate 2b: compareTarget="heavier ouds" is neither the anchor nor a vague pronoun → unchanged.
  const out = run(`Oud Wood features lower warmth (${OUD_WOOD.warmth}/5) than heavier ouds, making it versatile.`);
  assert.ok(
    out.includes(`lower warmth (${OUD_WOOD.warmth}/5) than heavier ouds`),
    "explicit non-anchor comparison must be left unchanged (gate 2b)",
  );
});

test("RP-B-14  'lower warmth (4/5) than the other fragrances' preserved — gate 2b", () => {
  // "than the other fragrances" is not an anchor reference.
  // Gate 2b: isAnchorRef=false → match returned unchanged.
  const out = run(`Oud Wood has lower warmth (${OUD_WOOD.warmth}/5) than the other fragrances.`);
  assert.ok(
    out.includes(`lower warmth (${OUD_WOOD.warmth}/5) than the other fragrances`),
    "'than the other fragrances' must be left unchanged (gate 2b)",
  );
});

test("RP-B-15  'lower warmth (4/5) than a warmer oud' preserved — gate 2b", () => {
  // "than a warmer oud" is not an anchor reference.
  // Gate 2b: isAnchorRef=false → match returned unchanged.
  const out = run(`Oud Wood has lower warmth (${OUD_WOOD.warmth}/5) than a warmer oud.`);
  assert.ok(
    out.includes(`lower warmth (${OUD_WOOD.warmth}/5) than a warmer oud`),
    "'than a warmer oud' must be left unchanged (gate 2b)",
  );
});

test("RP-B-12  unnamed 'higher warmth (4/5)' → ambiguous attribution → unchanged (gate 3)", () => {
  // No candidate named in the sentence → resolveNamedCandidate returns null.
  // Gate 3: ambiguous attribution → match returned unchanged regardless of pool.
  const retrieval: RetrievalContext = {
    fragrances: [OUD_WOOD, SAUVAGE, TERRE],
    articles: [],
    anchoredMeta: BR540_META,
    cardTarget: 3,
  };
  const phrase = `It offers higher warmth (${BR540.warmth}/5), making it bold and intense.`;
  const out = planResponse(phrase, "anchored_refinement", retrieval, ANCHORED_PLAN).content;
  assert.ok(
    out.includes(`higher warmth (${BR540.warmth}/5)`),
    "unnamed claim must be left unchanged (gate 3: ambiguous attribution)",
  );
});

test("RP-B-16  compound 'than Baccarat Rouge and Sauvage' → unchanged (gate 2b)", () => {
  // "Baccarat Rouge and Sauvage" is not in the explicit alias set.
  // Gate 2b: anchorAliases.has("baccarat rouge and sauvage") → false → match returned unchanged.
  const out = run(`Oud Wood has higher warmth (${OUD_WOOD.warmth}/5) than Baccarat Rouge and Sauvage.`);
  assert.ok(
    out.includes(`higher warmth (${OUD_WOOD.warmth}/5) than Baccarat Rouge and Sauvage`),
    "compound comparison target must be left unchanged (gate 2b)",
  );
});

test("RP-B-17  'does not offer higher warmth (4/5)' preserved via negation guard (no than clause)", () => {
  // No "than" clause → gate 2b does not fire. Gates 3 and 4 pass.
  // Negation guard: preceding 16 chars = "does not offer " → extended pattern
  // \bnot(?:\s+\w+)?\s*$ matches "not offer " → phrase preserved.
  const out = run(`Oud Wood does not offer higher warmth (${OUD_WOOD.warmth}/5).`);
  assert.ok(
    out.includes(`higher warmth (${OUD_WOOD.warmth}/5)`),
    "auxiliary-not construction must be caught by the negation guard",
  );
});

test("RP-B-18  paragraph-level attribution: pronoun sentence, single candidate in paragraph → corrected", () => {
  // Live defect: the model writes a two-sentence paragraph where the first sentence
  // names the fragrance and the second uses a pronoun.
  // Sentence containing the claim: "It's a statement piece … higher warmth (4/5) …" → no name.
  // Paragraph lookup: "Oud Wood Inspired" in first sentence → exactly one rendered candidate.
  // Gate 4: OUD_WOOD.warmth=4 = statedScore=4 → correction fires.
  const para =
    "Oud Wood Inspired opens with cedar and sandalwood, immediately settling into a warm and woody heart.\n" +
    `It's a statement piece for evening and formal moments, where the lower sweetness and higher warmth (${OUD_WOOD.warmth}/5) create something genuinely distinctive.`;
  const out = run(para);
  assert.ok(!out.includes(`higher warmth (${OUD_WOOD.warmth}/5)`), "false higher-warmth claim must be corrected via paragraph attribution");
  assert.ok(out.includes("the same warmth"), "replaced with same-score phrasing");
});

test("RP-B-19  paragraph-level attribution: multiple candidates in paragraph → unchanged (gate 3 ambiguous)", () => {
  // Paragraph names both Oud Wood Inspired and Sauvage Inspired.
  // Sentence using the claim has no name → sentence resolution returns null.
  // Paragraph resolution finds two candidates → ambiguous → gate 3 returns null → unchanged.
  const retrieval: RetrievalContext = {
    fragrances: [OUD_WOOD, SAUVAGE],
    articles: [],
    anchoredMeta: BR540_META,
    cardTarget: 2,
  };
  const para =
    `Oud Wood Inspired and Sauvage Inspired both stand apart from Baccarat Rouge.\n` +
    `They offer higher warmth (${BR540.warmth}/5) in the dry-down, creating a more grounded character.`;
  const out = planResponse(para, "anchored_refinement", retrieval, ANCHORED_PLAN).content;
  assert.ok(
    out.includes(`higher warmth (${BR540.warmth}/5)`),
    "multi-candidate paragraph must be left unchanged (gate 3: ambiguous paragraph attribution)",
  );
});

// ── Mixed-score / absent-score guard (Defect A scoreTag) ─────────────────────

test("RP-A-10  no score tag when one candidate has sweetness and one is missing sweetness", () => {
  // allSame in sanitiseAbsenceClaims: scores=[1], rendered.length=2, 1≠2 → allSame=false → scoreTag="".
  // Ensures a missing-score candidate suppresses the shared tag rather than being silently excluded.
  const noSweetness = { ...OUD_WOOD, sweetness: undefined as unknown as number };
  const retrieval: RetrievalContext = {
    fragrances: [OUD_WOOD, noSweetness],
    articles: [],
    anchoredMeta: BR540_META,
    cardTarget: 2,
  };
  const out = planResponse(
    "These options carry without the sweetness of the original.",
    "anchored_refinement",
    retrieval,
    ANCHORED_PLAN,
  ).content;
  assert.ok(!out.includes("without the sweetness"), "absence phrase replaced");
  assert.ok(out.includes("lower sweetness"), "relative wording present");
  assert.ok(!out.match(/lower sweetness \(\d\/5\) than/), "no score tag when one candidate has no sweetness score");
});

test("RP-A-09  score tag absent when two candidates with different sweetness scores", () => {
  // If retrieval has two candidates with different sweetness scores, allSame=false → no scoreTag.
  // BR540.sweetness=3 differs from OUD_WOOD.sweetness=1 → no shared tag.
  const retrieval: RetrievalContext = {
    fragrances: [OUD_WOOD, BR540],
    articles: [],
    anchoredMeta: BR540_META,
  };
  const out = planResponse(
    "These fragrances sit without the sweetness of the original.",
    "anchored_refinement",
    retrieval,
    ANCHORED_PLAN,
  ).content;
  // Absence claim replaced, but no score tag since sweetness scores differ (1 vs 3).
  assert.ok(!out.includes("without the sweetness"), "phrase replaced");
  assert.ok(out.includes("lower sweetness"), "relative wording present");
  // Score tag must NOT appear since scores differ.
  assert.ok(!out.match(/lower sweetness \(\d\/5\) than/), "no score tag when scores differ");
});
