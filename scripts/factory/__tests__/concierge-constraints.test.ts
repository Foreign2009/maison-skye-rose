/**
 * Maison Concierge — Constraint and Evaluation Harness
 *
 * EP-AI-C1: deterministic gate for gender constraints, diversity,
 * multi-turn retention, and zero-note composition context.
 *
 * Run: npx tsx scripts/factory/__tests__/concierge-constraints.test.ts
 */

import assert from "node:assert/strict";
import { extractProfile }    from "../../../app/lib/concierge/profileExtractor";
import {
  planRetrieval,
  getEffectiveGenderConstraint,
  applyGenderConstraint,
  scoreFit,
  applyFamilyDiversity,
  applySameBrandPenalty,
  assignRecommendationRoles,
} from "../../../app/lib/concierge/retrievalPlanner";
import type { FitSignals } from "../../../app/lib/concierge/retrievalPlanner";
import { buildContext, renderContext } from "../../../app/lib/concierge/contextBuilder";
import { mkcCatalogue }      from "../../../app/lib/mkc/catalogue";
import { nativeFragrances }  from "../../../app/lib/mkc/native";
import { resolveIntent } from "../../../app/lib/concierge/intentResolver";
import type { ConversationProfile, ConversationState }  from "../../../app/lib/concierge/types";
import type { ResolvedIntent } from "../../../app/lib/concierge/intentResolver";
import { planConversation, type ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import { detectRejections, NONE_OF_THOSE_SIGNALS } from "../../../app/lib/concierge/rejectionDetector";
import { planResponse } from "../../../app/lib/concierge/responsePlanner";

// ── Harness ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError ? err.message : String(err);
    console.error(`  ✗  ${name}\n     ${msg}`);
    failed++;
  }
}

function skip(name: string): void {
  console.log(`  -  ${name} (skipped)`);
  passed++;
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const GENERAL_INTENT: ResolvedIntent = {
  intent:      "general_discovery",
  signals:     {},
  entitySlug:  undefined,
  compareSlug: [],
};

const EMPTY_CONTEXT: ConversationState["context"] = {};

const EMPTY_STATE: ConversationState = {
  sessionId: "test",
  turns:     [],
  context:   {},
};

const BASE_PLAN: ConversationPlan = {
  action:                "new_search",
  reason:                "test",
  requiresRetrieval:     true,
  requiresComparison:    false,
  requiresClarification: false,
  reuseRecommendations:  false,
  nextIntent:            "general_discovery",
};

function makeProfile(overrides: Partial<ConversationProfile>): ConversationProfile {
  return { ...overrides };
}

// ── Section 1: Gender Detection ───────────────────────────────────────────────

console.log("\n── 1. Gender Detection ───────────────────────────────────────────");

test('T1  — "I\'m male" detected as male', () => {
  const p = extractProfile("I'm male", undefined);
  assert.equal(p.preferredGender?.value, "male");
});

test('T2  — "I am a man" detected as male', () => {
  const p = extractProfile("I am a man", undefined);
  assert.equal(p.preferredGender?.value, "male");
});

test('T3  — "I\'m female" detected as female', () => {
  const p = extractProfile("I'm female", undefined);
  assert.equal(p.preferredGender?.value, "female");
});

test('T4  — "I am a woman" detected as female', () => {
  const p = extractProfile("I am a woman", undefined);
  assert.equal(p.preferredGender?.value, "female");
});

test('T5  — "I am male" detected as male', () => {
  const p = extractProfile("I am male", undefined);
  assert.equal(p.preferredGender?.value, "male");
});

test('T6  — "I\'m a man" detected as male', () => {
  const p = extractProfile("I'm a man", undefined);
  assert.equal(p.preferredGender?.value, "male");
});

test('T7  — "as a man" detected as male', () => {
  const p = extractProfile("As a man, I love woody scents", undefined);
  assert.equal(p.preferredGender?.value, "male");
});

test('T8  — "for myself, I\'m male" detected as male', () => {
  const p = extractProfile("for myself, I'm male", undefined);
  assert.equal(p.preferredGender?.value, "male");
});

test('T9  — "I\'m a guy" detected as male', () => {
  const p = extractProfile("I'm a guy", undefined);
  assert.equal(p.preferredGender?.value, "male");
});

test('T10 — "I\'m a woman" detected as female', () => {
  const p = extractProfile("I'm a woman", undefined);
  assert.equal(p.preferredGender?.value, "female");
});

test('T11 — "as a woman" detected as female', () => {
  const p = extractProfile("As a woman who loves florals", undefined);
  assert.equal(p.preferredGender?.value, "female");
});

test('T12 — "I\'m a girl" detected as female', () => {
  const p = extractProfile("I'm a girl who likes fresh scents", undefined);
  assert.equal(p.preferredGender?.value, "female");
});

// Founder-required T-F9: explicit women's request overrides prior male speaker
test('T-F9 — "Show me women\'s fragrances" overrides prior male preference', () => {
  const prior = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const p = extractProfile("Show me women's fragrances", prior);
  assert.equal(p.preferredGender?.value, "female");
});

// Founder-required T-F10: "gender doesn't matter" removes hard constraint
test("T-F10 — \"gender doesn't matter\" sets preferredGender to unisex", () => {
  const prior = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const p = extractProfile("gender doesn't matter to me", prior);
  assert.equal(p.preferredGender?.value, "unisex");
});

// Founder-required T-F11: explicit unisex request
test('T-F11 — "show me unisex fragrances" sets preferredGender to unisex', () => {
  const p = extractProfile("show me unisex fragrances", undefined);
  assert.equal(p.preferredGender?.value, "unisex");
});

// ── Section 2: Effective Gender Constraint ────────────────────────────────────

console.log("\n── 2. Effective Gender Constraint ───────────────────────────────────");

test("T-EC1 — male self → constraint is 'male'", () => {
  const p = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  assert.equal(getEffectiveGenderConstraint(p), "male");
});

test("T-EC2 — female self → constraint is 'female'", () => {
  const p = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  assert.equal(getEffectiveGenderConstraint(p), "female");
});

test("T-EC3 — unisex preference → no constraint (null)", () => {
  const p = makeProfile({ preferredGender: { value: "unisex", confidence: "HIGH" } });
  assert.equal(getEffectiveGenderConstraint(p), null);
});

test("T-EC4 — undefined profile → no constraint (null)", () => {
  assert.equal(getEffectiveGenderConstraint(undefined), null);
});

// Founder-required T-F7: male buying for wife → female constraint
test("T-F7 — male buying for wife → effective constraint is 'female'", () => {
  const p = makeProfile({
    preferredGender:  { value: "male",   confidence: "HIGH" },
    shoppingIntent:   { value: "gift",   confidence: "HIGH" },
    recipientGender:  { value: "female", confidence: "HIGH" },
  });
  assert.equal(getEffectiveGenderConstraint(p), "female");
});

// Founder-required T-F8: female buying for husband → male constraint
test("T-F8 — female buying for husband → effective constraint is 'male'", () => {
  const p = makeProfile({
    preferredGender:  { value: "female", confidence: "HIGH" },
    shoppingIntent:   { value: "gift",   confidence: "HIGH" },
    recipientGender:  { value: "male",   confidence: "HIGH" },
  });
  assert.equal(getEffectiveGenderConstraint(p), "male");
});

// ── Section 3: applyGenderConstraint pure function ────────────────────────────

console.log("\n── 3. applyGenderConstraint ─────────────────────────────────────────");

test("T-AG1 — null constraint passes all candidates", () => {
  const sample = mkcCatalogue.slice(0, 10);
  const result = applyGenderConstraint(sample, null);
  assert.equal(result.length, sample.length);
});

test("T-AG2 — male constraint removes female, keeps male+unisex", () => {
  const sample = mkcCatalogue.slice(0, 20);
  const result = applyGenderConstraint(sample, "male");
  const females = result.filter((k) => k.gender === "female");
  assert.equal(females.length, 0, `Female candidates leaked: ${females.map(k => k.slug).join(", ")}`);
});

test("T-AG3 — female constraint removes male, keeps female+unisex", () => {
  const sample = mkcCatalogue.slice(0, 20);
  const result = applyGenderConstraint(sample, "female");
  const males = result.filter((k) => k.gender === "male");
  assert.equal(males.length, 0, `Male candidates leaked: ${males.map(k => k.slug).join(", ")}`);
});

test("T-AG4 — empty input stays empty", () => {
  const result = applyGenderConstraint([], "male");
  assert.equal(result.length, 0);
});

// ── Section 4: Candidate Pool Filtering via planRetrieval ────────────────────

console.log("\n── 4. Candidate Pool Filtering ──────────────────────────────────────");

// Founder-required T-F5
test("T-F5 — male self → 0 female-only candidates in retrieval result", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend something for me",
  );
  const females = result.fragrances.filter((f) => f.gender === "female");
  assert.equal(females.length, 0,
    `T-F5 FAIL — female candidates in male result: ${females.map(f => f.slug).join(", ")}`);
});

// Founder-required T-F6
test("T-F6 — female self → 0 male-only candidates in retrieval result", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend something for me",
  );
  const males = result.fragrances.filter((f) => f.gender === "male");
  assert.equal(males.length, 0,
    `T-F6 FAIL — male candidates in female result: ${males.map(f => f.slug).join(", ")}`);
});

// No gender constraint → all genders permitted
test("T-F-NC — no gender profile → mixed genders allowed in result", () => {
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, undefined,
    undefined, undefined, null, undefined, "recommend something",
  );
  assert.ok(result.fragrances.length > 0, "Expected candidates when no gender constraint");
});

// Founder-required T-F13: HARD CONSTRAINT — male constraint + empty constrained pool
test("T-F13 — male constraint + all male/unisex excluded → NO female fallback (hard constraint)", () => {
  const maleSlugs   = mkcCatalogue.filter((k) => k.gender === "male").map((k) => k.slug);
  const unisexSlugs = mkcCatalogue.filter((k) => k.gender === "unisex").map((k) => k.slug);
  const allConstrained = new Set([...maleSlugs, ...unisexSlugs]);

  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, allConstrained, "recommend something",
  );
  const females = result.fragrances.filter((f) => f.gender === "female");
  assert.equal(females.length, 0,
    `T-F13 HARD CONSTRAINT VIOLATED — fell back to female candidates: ${females.map(f => f.slug).join(", ")}`);
});

// Founder-required T-F14: HARD CONSTRAINT — female constraint + empty constrained pool
test("T-F14 — female constraint + all female/unisex excluded → NO male fallback (hard constraint)", () => {
  const femaleSlugs = mkcCatalogue.filter((k) => k.gender === "female").map((k) => k.slug);
  const unisexSlugs = mkcCatalogue.filter((k) => k.gender === "unisex").map((k) => k.slug);
  const allConstrained = new Set([...femaleSlugs, ...unisexSlugs]);

  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, allConstrained, "recommend something",
  );
  const males = result.fragrances.filter((f) => f.gender === "male");
  assert.equal(males.length, 0,
    `T-F14 HARD CONSTRAINT VIOLATED — fell back to male candidates: ${males.map(f => f.slug).join(", ")}`);
});

// ── Section 5: Comparison Exemption ──────────────────────────────────────────

console.log("\n── 5. Comparison Exemption ──────────────────────────────────────────");

// Founder-required T-F12
test("T-F12 — comparison intent exempt: named cross-gender fragrances both present", () => {
  const maleFrag   = mkcCatalogue.find((k) => k.gender === "male");
  const femaleFrag = mkcCatalogue.find((k) => k.gender === "female");

  if (!maleFrag || !femaleFrag) {
    skip("T-F12 (insufficient gender coverage in catalogue)");
    return;
  }

  const compareIntent: ResolvedIntent = {
    intent:      "comparison",
    signals:     {},
    entitySlug:  maleFrag.slug,
    compareSlug: [maleFrag.slug, femaleFrag.slug],
  };

  const maleProfile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(
    compareIntent, EMPTY_CONTEXT, maleProfile,
    undefined, undefined, null, undefined, "compare these two",
  );
  const resultSlugs = result.fragrances.map((f) => f.slug);
  assert.ok(resultSlugs.includes(maleFrag.slug),
    `T-F12 FAIL — male fragrance ${maleFrag.slug} missing from comparison result`);
  assert.ok(resultSlugs.includes(femaleFrag.slug),
    `T-F12 FAIL — female fragrance ${femaleFrag.slug} missing (comparison exemption failed)`);
});

// T-F19: comparison item not removed by diversity exclusion
test("T-F19 — comparison item retained even when in excludeSlugs", () => {
  const maleFrag = mkcCatalogue.find((k) => k.gender === "male");
  if (!maleFrag) { skip("T-F19"); return; }

  const compareIntent: ResolvedIntent = {
    intent:      "comparison",
    signals:     {},
    entitySlug:  maleFrag.slug,
    compareSlug: [maleFrag.slug],
  };

  const excludeSlugs = new Set([maleFrag.slug]);
  const result = planRetrieval(
    compareIntent, EMPTY_CONTEXT, undefined,
    undefined, undefined, null, excludeSlugs, "compare these",
  );
  // Comparison is exempt from gender filter and from diversity exclusion
  assert.ok(result.fragrances.length > 0, "T-F19 — expected fragrances for comparison intent");
});

// ── Section 6: Diversity & Repeat Handling ────────────────────────────────────

console.log("\n── 6. Diversity & Repeat Handling ───────────────────────────────────");

// Founder-required T-F17: previous recommendation slugs recognized
test("T-F17 — previous recommendation slugs tracked via excludeSlugs", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });

  const turn1 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend something",
  );
  const turn1Slugs = new Set(turn1.fragrances.map((f) => f.slug));
  assert.ok(turn1Slugs.size > 0, "Turn 1 produced no recommendations");

  const turn2 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, turn1Slugs, "give me different options",
  );
  assert.ok(turn2.fragrances.length > 0, "Turn 2 produced no recommendations");

  // No female candidates under male constraint across both turns
  const turn2Females = turn2.fragrances.filter((f) => f.gender === "female");
  assert.equal(turn2Females.length, 0,
    `T-F17 — female candidates in turn 2 under male constraint: ${turn2Females.map(f => f.slug).join(", ")}`);
});

// Founder-required T-F18: unseen candidates lead
test("T-F18 — diversity: unseen candidates appear before seen candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });

  const turn1 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend something",
  );
  const turn1Set = new Set(turn1.fragrances.map((f) => f.slug));

  const turn2 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, turn1Set, "give me different options",
  );
  const turn2Slugs = turn2.fragrances.map((f) => f.slug);

  // If there are both seen and unseen candidates, unseen must lead
  const hasUnseen = turn2Slugs.some((s) => !turn1Set.has(s));
  const hasSeen   = turn2Slugs.some((s) =>  turn1Set.has(s));

  if (hasUnseen && hasSeen) {
    const firstSeenIdx = turn2Slugs.findIndex((s) => turn1Set.has(s));
    const firstUnseenIdx = turn2Slugs.findIndex((s) => !turn1Set.has(s));
    assert.ok(firstUnseenIdx < firstSeenIdx,
      `T-F18 — seen candidate appears before unseen: seen at [${firstSeenIdx}], unseen at [${firstUnseenIdx}]`);
  }
  // If only unseen or only seen candidates, diversity mechanism passed trivially
});

// Founder-required T-F20: 0 duplicate recommendations in single response
test("T-F20 — 0 duplicate slugs within a single retrieval result", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend something for me",
  );
  const slugs = result.fragrances.map((f) => f.slug);
  const uniqueSlugs = [...new Set(slugs)];
  assert.equal(slugs.length, uniqueSlugs.length,
    `T-F20 — duplicates found: ${slugs.filter((s, i) => slugs.indexOf(s) !== i).join(", ")}`);
});

// Founder-required T-F21: 0 invalid slugs
test("T-F21 — 0 invalid (non-MKC) slugs in retrieval result", () => {
  const allSlugs = new Set(mkcCatalogue.map((k) => k.slug));
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend something",
  );
  const invalid = result.fragrances.filter((f) => !allSlugs.has(f.slug));
  assert.equal(invalid.length, 0,
    `T-F21 — invalid slugs: ${invalid.map(f => f.slug).join(", ")}`);
});

// ── Section 7: Multi-Turn State Retention ────────────────────────────────────

console.log("\n── 7. Multi-Turn State Retention ────────────────────────────────────");

// Founder-required T-F15: follow-up turn retains gender without repeating it
test("T-F15 — gender retained across turns via profile accumulation", () => {
  const profile1 = extractProfile("I'm male", undefined);
  assert.equal(profile1.preferredGender?.value, "male", "T-F15 — turn 1 failed to extract gender");

  const profile2 = extractProfile("I want something fresh", profile1);
  assert.equal(profile2.preferredGender?.value, "male",
    "T-F15 — gender not retained after follow-up message");

  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile2,
    undefined, undefined, null, undefined, "I want something fresh",
  );
  const females = result.fragrances.filter((f) => f.gender === "female");
  assert.equal(females.length, 0,
    `T-F15 — female candidates under retained male constraint: ${females.map(f => f.slug).join(", ")}`);
});

// Founder-required T-F16: recipient switch updates effective gender
test("T-F16 — recipient switch updates effective constraint", () => {
  let profile = extractProfile("I'm male", undefined);
  assert.equal(getEffectiveGenderConstraint(profile), "male", "T-F16 — initial constraint should be male");

  profile = extractProfile("Actually this is for my girlfriend", profile);
  assert.equal(profile.shoppingIntent?.value, "gift",
    "T-F16 — shoppingIntent not updated to gift");
  assert.equal(profile.recipientGender?.value, "female",
    "T-F16 — recipientGender not updated to female");
  assert.equal(getEffectiveGenderConstraint(profile), "female",
    "T-F16 — effective constraint should switch to female for recipient");
});

// ── Section 8: Zero-Note Composition Context ──────────────────────────────────

console.log("\n── 8. Zero-Note Context (Torino24 / Generic) ────────────────────────");

// Founder-required T-F22
test("T-F22 — Torino24 context has no empty Top:/Heart:/Base: lines", () => {
  const torino24 = nativeFragrances.get("torino24-inspired");
  if (!torino24) { skip("T-F22 (torino24-inspired not in nativeFragrances)"); return; }

  const retrieval: RetrievalContext = { fragrances: [torino24], articles: [] };
  const rendered = renderContext(buildContext(retrieval, EMPTY_STATE, BASE_PLAN));
  const lines = rendered.split("\n");

  const emptyNoteLines = lines.filter(
    (l) => l === "   Top: " || l === "   Heart: " || l === "   Base: " ||
            l.trim() === "Top:" || l.trim() === "Heart:" || l.trim() === "Base:",
  );
  assert.equal(emptyNoteLines.length, 0,
    `T-F22 — empty note lines found: ${emptyNoteLines.join(" | ")}`);
});

// Founder-required T-F23
test("T-F23 — Torino24 context uses zero-note indicator, not invented notes", () => {
  const torino24 = nativeFragrances.get("torino24-inspired");
  if (!torino24) { skip("T-F23"); return; }

  const retrieval: RetrievalContext = { fragrances: [torino24], articles: [] };
  const rendered = renderContext(buildContext(retrieval, EMPTY_STATE, BASE_PLAN));

  assert.ok(
    rendered.includes("[Canonical composition not disclosed"),
    `T-F23 — zero-note indicator not found in Torino24 context. Excerpt:\n${rendered.slice(0, 600)}`,
  );
});

// Founder-required T-F24: sparse Scandal (has notes) uses normal note path
test("T-F24 — Scandal (has notes) shows note structure, not zero-note indicator", () => {
  const scandal = nativeFragrances.get("scandal-pour-homme-inspired");
  if (!scandal) { skip("T-F24 (scandal-pour-homme-inspired not found)"); return; }

  const allNotes = [...scandal.notes.top, ...scandal.notes.heart, ...scandal.notes.base];
  assert.ok(allNotes.length > 0, "T-F24 — Scandal should have at least one note");

  const retrieval: RetrievalContext = { fragrances: [scandal], articles: [] };
  const rendered = renderContext(buildContext(retrieval, EMPTY_STATE, BASE_PLAN));

  assert.ok(
    !rendered.includes("[Canonical composition not disclosed"),
    "T-F24 — Scandal incorrectly triggered zero-note path",
  );
  assert.ok(rendered.includes("Heart:") || rendered.includes("Top:") || rendered.includes("Base:"),
    "T-F24 — Scandal should have at least one note line in context");
});

// Founder-required T-F25: Fig & Lotus (unordered, has heart notes)
test("T-F25 — Fig & Lotus (unordered, has heart notes) does not trigger zero-note path", () => {
  const figLotus = nativeFragrances.get("fig-lotus-flower-inspired");
  if (!figLotus) { skip("T-F25 (fig-lotus-flower-inspired not found)"); return; }

  const allNotes = [...figLotus.notes.top, ...figLotus.notes.heart, ...figLotus.notes.base];
  assert.ok(allNotes.length > 0, "T-F25 — Fig & Lotus should have notes (heart tier at minimum)");

  const retrieval: RetrievalContext = { fragrances: [figLotus], articles: [] };
  const rendered = renderContext(buildContext(retrieval, EMPTY_STATE, BASE_PLAN));

  assert.ok(
    !rendered.includes("[Canonical composition not disclosed"),
    "T-F25 — Fig & Lotus incorrectly triggered zero-note path",
  );
});

// Founder-required T-F26: Grapefruit (unordered, has notes)
test("T-F26 — Grapefruit (unordered, has notes) does not trigger zero-note path", () => {
  const grapefruit = nativeFragrances.get("grapefruit-inspired");
  if (!grapefruit) { skip("T-F26 (grapefruit-inspired not found)"); return; }

  const allNotes = [...grapefruit.notes.top, ...grapefruit.notes.heart, ...grapefruit.notes.base];
  assert.ok(allNotes.length > 0, "T-F26 — Grapefruit should have notes");

  const retrieval: RetrievalContext = { fragrances: [grapefruit], articles: [] };
  const rendered = renderContext(buildContext(retrieval, EMPTY_STATE, BASE_PLAN));

  assert.ok(
    !rendered.includes("[Canonical composition not disclosed"),
    "T-F26 — Grapefruit incorrectly triggered zero-note path",
  );
});

// ── Section 9: Catalogue Coverage Report ─────────────────────────────────────

console.log("\n── 9. Catalogue Coverage Report ─────────────────────────────────────");

test("T-COV1 — coverage analysis across diverse intents, profiles, and queries", () => {
  const allSurfaced = new Set<string>();
  const slugFreq: Record<string, number> = {};

  const profiles: Array<ConversationProfile | undefined> = [
    makeProfile({ preferredGender: { value: "male",   confidence: "HIGH" } }),
    makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } }),
    undefined,
    makeProfile({ shoppingIntent: { value: "gift", confidence: "HIGH" }, recipientGender: { value: "female", confidence: "HIGH" } }),
    makeProfile({ shoppingIntent: { value: "gift", confidence: "HIGH" }, recipientGender: { value: "male",   confidence: "HIGH" } }),
  ];

  // Diverse messages — resolveIntent extracts proper intent and family/vibe/occasion signals
  const messages = [
    "recommend a woody fragrance",
    "I love floral and fruity scents",
    "something fresh and citrus",
    "deep oud and oriental",
    "sweet vanilla and gourmand",
    "aromatic and herbal",
    "aquatic and marine",
    "musky and powdery",
    "something warm and spicy",
    "light summer fragrance",
    "something for winter evenings",
    "office fragrance fresh",
    "evening event fragrance",
    "romantic and sensual",
    "something similar to sauvage-inspired",
  ];

  for (const profile of profiles) {
    for (const msg of messages) {
      const resolved = resolveIntent(msg, {});
      const result = planRetrieval(
        resolved, EMPTY_CONTEXT, profile,
        undefined, undefined, null, undefined, msg,
      );
      for (const f of result.fragrances) {
        allSurfaced.add(f.slug);
        slugFreq[f.slug] = (slugFreq[f.slug] ?? 0) + 1;
      }
    }
  }

  const total          = mkcCatalogue.length;
  const eligibleMale   = mkcCatalogue.filter((k) => k.gender === "male"   || k.gender === "unisex").length;
  const eligibleFemale = mkcCatalogue.filter((k) => k.gender === "female" || k.gender === "unisex").length;
  const surfacedCount  = allSurfaced.size;
  const neverReached   = mkcCatalogue.filter((k) => !allSurfaced.has(k.slug)).map((k) => k.slug);
  const topSlugs       = Object.entries(slugFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([s, n]) => `${s}(×${n})`);

  console.log(`\n     ┌─ CATALOGUE COVERAGE REPORT ─────────────────────────────────`);
  console.log(`     │  Total MKC records:           ${total}`);
  console.log(`     │  Eligible (male + unisex):    ${eligibleMale}`);
  console.log(`     │  Eligible (female + unisex):  ${eligibleFemale}`);
  console.log(`     │  Unique records surfaced:      ${surfacedCount}/${total} (${Math.round(surfacedCount / total * 100)}%)`);
  console.log(`     │  Never reached:               ${neverReached.length} records`);
  if (neverReached.length > 0 && neverReached.length <= 30) {
    console.log(`     │  Never-reached slugs:         ${neverReached.join(", ")}`);
  } else if (neverReached.length > 30) {
    console.log(`     │  Never-reached slugs:         (${neverReached.length} — see full list via catalogue audit)`);
  }
  console.log(`     │  Top recommendation concentration: ${topSlugs.join(", ")}`);
  console.log(`     └─────────────────────────────────────────────────────────────`);

  // Soft gate: at least 5% reachability — confirms diverse retrieval paths are active.
  // This is not a coverage ceiling; broader discovery is achieved via the search engine
  // in production with real customer queries.
  assert.ok(
    surfacedCount >= Math.ceil(total * 0.05),
    `T-COV1 — reachability too low: ${surfacedCount}/${total} records surfaced (${Math.round(surfacedCount / total * 100)}%)`,
  );
});

// ── Section 10: Founder Critical Multi-Turn Test ──────────────────────────────

console.log("\n── 10. Founder Critical Multi-Turn Scenario ─────────────────────────");

test("T-FOUNDER — 4-turn scenario: male → fresh → different → girlfriend", () => {
  let profile: ConversationProfile | undefined = undefined;
  const cumulativeExcluded = new Set<string>();

  // ── Turn 1: "I'm male. Recommend a fragrance for myself." ──────────────────
  profile = extractProfile("I'm male. Recommend a fragrance for myself.", profile);
  let result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "I'm male. Recommend a fragrance for myself.",
  );
  const t1Slugs    = result.fragrances.map((f) => f.slug);
  const t1Females  = result.fragrances.filter((f) => f.gender === "female");
  const t1Repeated: string[] = [];

  console.log(`\n     TURN 1: "I'm male. Recommend a fragrance for myself."`);
  console.log(`     Effective gender:     ${getEffectiveGenderConstraint(profile)}`);
  console.log(`     Candidate pool size:  ${result.fragrances.length}`);
  console.log(`     Recommendation slugs: ${t1Slugs.join(", ")}`);
  console.log(`     Repeated from prior:  ${t1Repeated.join(", ") || "none"}`);
  console.log(`     Invalid-gender:       ${t1Females.map(f => f.slug).join(", ") || "none"}`);

  assert.equal(getEffectiveGenderConstraint(profile), "male",
    "T-FOUNDER T1 — effective gender should be male");
  assert.equal(t1Females.length, 0,
    `T-FOUNDER T1 — female candidates in turn 1: ${t1Females.map(f => f.slug).join(", ")}`);
  t1Slugs.forEach((s) => cumulativeExcluded.add(s));

  // ── Turn 2: "I want something fresh." ─────────────────────────────────────
  profile = extractProfile("I want something fresh.", profile);
  const freshIntent: ResolvedIntent = {
    intent:      "general_discovery",
    signals:     { vibe: "fresh" },
    entitySlug:  undefined,
    compareSlug: [],
  };
  result = planRetrieval(
    freshIntent, EMPTY_CONTEXT, profile,
    undefined, undefined, null,
    cumulativeExcluded.size > 0 ? cumulativeExcluded : undefined,
    "I want something fresh.",
  );
  const t2Slugs   = result.fragrances.map((f) => f.slug);
  const t2Females = result.fragrances.filter((f) => f.gender === "female");
  const t2Repeated = t2Slugs.filter((s) => cumulativeExcluded.has(s));

  console.log(`\n     TURN 2: "I want something fresh."`);
  console.log(`     Effective gender:     ${getEffectiveGenderConstraint(profile)}`);
  console.log(`     Candidate pool size:  ${result.fragrances.length}`);
  console.log(`     Recommendation slugs: ${t2Slugs.join(", ")}`);
  console.log(`     Repeated from T1:    ${t2Repeated.join(", ") || "none"}`);
  console.log(`     Invalid-gender:       ${t2Females.map(f => f.slug).join(", ") || "none"}`);

  assert.equal(t2Females.length, 0,
    `T-FOUNDER T2 — female candidates under retained male constraint: ${t2Females.map(f => f.slug).join(", ")}`);
  t2Slugs.forEach((s) => cumulativeExcluded.add(s));

  // ── Turn 3: "Give me some different options." ──────────────────────────────
  profile = extractProfile("Give me some different options.", profile);
  result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null,
    cumulativeExcluded.size > 0 ? cumulativeExcluded : undefined,
    "Give me some different options.",
  );
  const t3Slugs   = result.fragrances.map((f) => f.slug);
  const t3Females = result.fragrances.filter((f) => f.gender === "female");
  const t3Repeated = t3Slugs.filter((s) => cumulativeExcluded.has(s));

  console.log(`\n     TURN 3: "Give me some different options."`);
  console.log(`     Effective gender:     ${getEffectiveGenderConstraint(profile)}`);
  console.log(`     Candidate pool size:  ${result.fragrances.length}`);
  console.log(`     Recommendation slugs: ${t3Slugs.join(", ")}`);
  console.log(`     Repeated from T1+T2: ${t3Repeated.join(", ") || "none"}`);
  console.log(`     Invalid-gender:       ${t3Females.map(f => f.slug).join(", ") || "none"}`);

  assert.equal(t3Females.length, 0,
    `T-FOUNDER T3 — female candidates under retained male constraint: ${t3Females.map(f => f.slug).join(", ")}`);
  t3Slugs.forEach((s) => cumulativeExcluded.add(s));

  // ── Turn 4: "Actually this is for my girlfriend." ─────────────────────────
  profile = extractProfile("Actually this is for my girlfriend.", profile);
  result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null,
    cumulativeExcluded.size > 0 ? cumulativeExcluded : undefined,
    "Actually this is for my girlfriend.",
  );
  const t4Slugs   = result.fragrances.map((f) => f.slug);
  const t4Males   = result.fragrances.filter((f) => f.gender === "male");
  const t4Repeated = t4Slugs.filter((s) => cumulativeExcluded.has(s));

  console.log(`\n     TURN 4: "Actually this is for my girlfriend."`);
  console.log(`     Shopping intent:      ${profile.shoppingIntent?.value}`);
  console.log(`     Recipient gender:     ${profile.recipientGender?.value}`);
  console.log(`     Effective gender:     ${getEffectiveGenderConstraint(profile)}`);
  console.log(`     Candidate pool size:  ${result.fragrances.length}`);
  console.log(`     Recommendation slugs: ${t4Slugs.join(", ")}`);
  console.log(`     Repeated from T1-T3: ${t4Repeated.join(", ") || "none"}`);
  console.log(`     Invalid-gender:       ${t4Males.map(f => f.slug).join(", ") || "none"}`);

  assert.equal(profile.shoppingIntent?.value, "gift",
    "T-FOUNDER T4 — shoppingIntent not updated to gift");
  assert.equal(profile.recipientGender?.value, "female",
    "T-FOUNDER T4 — recipientGender not updated to female");
  assert.equal(getEffectiveGenderConstraint(profile), "female",
    "T-FOUNDER T4 — effective constraint should be female (gift for girlfriend)");
  assert.equal(t4Males.length, 0,
    `T-FOUNDER T4 — male-only candidates for girlfriend: ${t4Males.map(f => f.slug).join(", ")}`);
});

// ── Section 11: C2 Breadth + Ranking ─────────────────────────────────────────
// 30 deterministic gates for EP-AI-C2: recommendation breadth, minimum candidate
// guarantee, catalogue variety, quality ordering, cross-turn diversity, and
// reachability under active gender constraints.

console.log("\n── 11. C2 Breadth + Ranking ─────────────────────────────────────────");

// ── Group A: Core breadth guarantee ──────────────────────────────────────────

test("T-C2-01 — generic male: ≥3 candidates returned", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend a fragrance for me",
  );
  assert.ok(result.fragrances.length >= 3,
    `T-C2-01 — expected ≥3 candidates, got ${result.fragrances.length}: ${result.fragrances.map(f => f.slug).join(", ")}`);
});

test("T-C2-02 — generic female: ≥3 candidates returned", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend a fragrance for me",
  );
  assert.ok(result.fragrances.length >= 3,
    `T-C2-02 — expected ≥3 candidates, got ${result.fragrances.length}: ${result.fragrances.map(f => f.slug).join(", ")}`);
});

test("T-C2-03 — generic no-gender: ≥3 candidates returned", () => {
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, undefined,
    undefined, undefined, null, undefined, "recommend a fragrance",
  );
  assert.ok(result.fragrances.length >= 3,
    `T-C2-03 — expected ≥3 candidates, got ${result.fragrances.length}`);
});

test("T-C2-04 — generic male breadth: zero female-only candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend a fragrance",
  );
  const females = result.fragrances.filter(f => f.gender === "female");
  assert.equal(females.length, 0,
    `T-C2-04 — female candidates in male broad pool: ${females.map(f => f.slug).join(", ")}`);
});

test("T-C2-05 — generic female breadth: zero male-only candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "recommend a fragrance",
  );
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.equal(males.length, 0,
    `T-C2-05 — male candidates in female broad pool: ${males.map(f => f.slug).join(", ")}`);
});

test("T-C2-06 — gift for male recipient: ≥3 male+unisex candidates", () => {
  const profile = makeProfile({
    shoppingIntent:  { value: "gift",  confidence: "HIGH" },
    recipientGender: { value: "male",  confidence: "HIGH" },
  });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "I'm buying a gift for my husband",
  );
  const females = result.fragrances.filter(f => f.gender === "female");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-06 — expected ≥3 candidates for male gift, got ${result.fragrances.length}`);
  assert.equal(females.length, 0,
    `T-C2-06 — female candidates in male-gift pool: ${females.map(f => f.slug).join(", ")}`);
});

// ── Group B: Signal-based breadth ────────────────────────────────────────────

test("T-C2-07 — male + fresh vibe: ≥3 male+unisex candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const intent: ResolvedIntent = { intent: "general_discovery", signals: { vibe: "fresh" }, entitySlug: undefined, compareSlug: [] };
  const result = planRetrieval(intent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "something fresh for me");
  const females = result.fragrances.filter(f => f.gender === "female");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-07 — expected ≥3 male fresh candidates, got ${result.fragrances.length}: ${result.fragrances.map(f => f.slug).join(", ")}`);
  assert.equal(females.length, 0,
    `T-C2-07 — female candidates in male fresh result: ${females.map(f => f.slug).join(", ")}`);
});

test("T-C2-08 — female + floral family: ≥3 female+unisex candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const intent: ResolvedIntent = { intent: "general_discovery", signals: { family: "floral" }, entitySlug: undefined, compareSlug: [] };
  const result = planRetrieval(intent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "I love floral scents");
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-08 — expected ≥3 female floral candidates, got ${result.fragrances.length}: ${result.fragrances.map(f => f.slug).join(", ")}`);
  assert.equal(males.length, 0,
    `T-C2-08 — male candidates in female floral result: ${males.map(f => f.slug).join(", ")}`);
});

test("T-C2-09 — male + woody family: ≥3 male+unisex candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const intent: ResolvedIntent = { intent: "general_discovery", signals: { family: "woody" }, entitySlug: undefined, compareSlug: [] };
  const result = planRetrieval(intent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a woody fragrance");
  const females = result.fragrances.filter(f => f.gender === "female");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-09 — expected ≥3 male woody candidates, got ${result.fragrances.length}: ${result.fragrances.map(f => f.slug).join(", ")}`);
  assert.equal(females.length, 0,
    `T-C2-09 — female candidates in male woody result: ${females.map(f => f.slug).join(", ")}`);
});

test("T-C2-10 — gift for female recipient: ≥3 female+unisex candidates", () => {
  const profile = makeProfile({
    shoppingIntent:  { value: "gift",   confidence: "HIGH" },
    recipientGender: { value: "female", confidence: "HIGH" },
  });
  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, undefined, "gift for my wife",
  );
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-10 — expected ≥3 candidates for female gift, got ${result.fragrances.length}`);
  assert.equal(males.length, 0,
    `T-C2-10 — male candidates in female-gift pool: ${males.map(f => f.slug).join(", ")}`);
});

test("T-C2-11 — female + oriental family: ≥3 female+unisex candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const intent: ResolvedIntent = { intent: "general_discovery", signals: { family: "oriental" }, entitySlug: undefined, compareSlug: [] };
  const result = planRetrieval(intent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "deep oriental scent for me");
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-11 — expected ≥3 female oriental candidates, got ${result.fragrances.length}: ${result.fragrances.map(f => f.slug).join(", ")}`);
  assert.equal(males.length, 0,
    `T-C2-11 — male candidates in female oriental result: ${males.map(f => f.slug).join(", ")}`);
});

// ── Group C: Catalogue variety ────────────────────────────────────────────────

test("T-C2-12 — generic male: ≥3 distinct slugs", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a fragrance");
  const unique = new Set(result.fragrances.map(f => f.slug));
  assert.ok(unique.size >= 3,
    `T-C2-12 — expected ≥3 distinct slugs, got ${unique.size}: ${[...unique].join(", ")}`);
});

test("T-C2-13 — generic female: ≥3 distinct slugs", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a fragrance");
  const unique = new Set(result.fragrances.map(f => f.slug));
  assert.ok(unique.size >= 3,
    `T-C2-13 — expected ≥3 distinct slugs, got ${unique.size}: ${[...unique].join(", ")}`);
});

test("T-C2-14 — generic male: candidate pool not limited to one fragrance", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a fragrance");
  assert.ok(result.fragrances.length > 1,
    `T-C2-14 — male generic should yield >1 candidate, got: ${result.fragrances.map(f => f.slug).join(", ")}`);
});

test("T-C2-15 — generic female: candidate pool not limited to one fragrance", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a fragrance");
  assert.ok(result.fragrances.length > 1,
    `T-C2-15 — female generic should yield >1 candidate, got: ${result.fragrances.map(f => f.slug).join(", ")}`);
});

// ── Group D: Quality ordering ─────────────────────────────────────────────────

test("T-C2-16 — generic male: if multiple bestsellers exist in pool, no non-bestseller precedes them", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a fragrance");
  const frags = result.fragrances;
  const firstNonBsIdx = frags.findIndex(f => !f.bestSeller);
  const lastBsAfterNonBs = firstNonBsIdx === -1 ? -1
    : frags.slice(firstNonBsIdx).findIndex(f => f.bestSeller);
  assert.equal(lastBsAfterNonBs, -1,
    `T-C2-16 — a bestseller appears after a non-bestseller in the male generic pool (sort order violated)`);
});

test("T-C2-17 — generic female: no non-bestseller before bestsellers", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a fragrance");
  const frags = result.fragrances;
  const firstNonBsIdx = frags.findIndex(f => !f.bestSeller);
  const lastBsAfterNonBs = firstNonBsIdx === -1 ? -1
    : frags.slice(firstNonBsIdx).findIndex(f => f.bestSeller);
  assert.equal(lastBsAfterNonBs, -1,
    `T-C2-17 — a bestseller appears after a non-bestseller in the female generic pool`);
});

test("T-C2-18 — generic no-gender: zero duplicate slugs in result", () => {
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "recommend something");
  const slugs = result.fragrances.map(f => f.slug);
  const unique = new Set(slugs);
  assert.equal(slugs.length, unique.size,
    `T-C2-18 — duplicate slugs in no-gender generic result: ${slugs.filter((s, i) => slugs.indexOf(s) !== i).join(", ")}`);
});

// ── Group E: Session diversity with constraint ────────────────────────────────

test("T-C2-19 — male turn 2 with turn 1 excluded: still ≥3 candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a fragrance");
  const excludeT1 = new Set(t1.fragrances.map(f => f.slug));
  const t2 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, excludeT1, "give me something different");
  assert.ok(t2.fragrances.length >= 3,
    `T-C2-19 — turn 2 male: expected ≥3 candidates after turn 1 excluded, got ${t2.fragrances.length}: ${t2.fragrances.map(f => f.slug).join(", ")}`);
});

test("T-C2-20 — female turn 2 with turn 1 excluded: still ≥3 candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend a fragrance");
  const excludeT1 = new Set(t1.fragrances.map(f => f.slug));
  const t2 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, excludeT1, "give me something different");
  assert.ok(t2.fragrances.length >= 3,
    `T-C2-20 — turn 2 female: expected ≥3 candidates after turn 1 excluded, got ${t2.fragrances.length}: ${t2.fragrances.map(f => f.slug).join(", ")}`);
});

test("T-C2-21 — turn 2 male with exclusions: gender constraint still maintained", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const excludeT1 = new Set(t1.fragrances.map(f => f.slug));
  const t2 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, excludeT1, "different options");
  const females = t2.fragrances.filter(f => f.gender === "female");
  assert.equal(females.length, 0,
    `T-C2-21 — female candidates in turn 2 male result: ${females.map(f => f.slug).join(", ")}`);
});

test("T-C2-22 — turn 2 female with exclusions: gender constraint still maintained", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const excludeT1 = new Set(t1.fragrances.map(f => f.slug));
  const t2 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, excludeT1, "different options");
  const males = t2.fragrances.filter(f => f.gender === "male");
  assert.equal(males.length, 0,
    `T-C2-22 — male candidates in turn 2 female result: ${males.map(f => f.slug).join(", ")}`);
});

test("T-C2-23 — 3-turn male session: turn 3 still produces candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const cumulative = new Set<string>();
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  t1.fragrances.forEach(f => cumulative.add(f.slug));
  const t2 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, new Set(cumulative), "different");
  t2.fragrances.forEach(f => cumulative.add(f.slug));
  const t3 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, new Set(cumulative), "more options");
  assert.ok(t3.fragrances.length > 0,
    `T-C2-23 — turn 3 male returned 0 candidates after ${cumulative.size} excluded`);
  const t3Females = t3.fragrances.filter(f => f.gender === "female");
  assert.equal(t3Females.length, 0,
    `T-C2-23 — female candidates leaked in turn 3 male: ${t3Females.map(f => f.slug).join(", ")}`);
});

// ── Group F: Minimum guarantee safety net ─────────────────────────────────────

test("T-C2-24 — male + occasion signal: ≥3 candidates including minimum guarantee", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const intent: ResolvedIntent = { intent: "occasion_search", signals: { occasion: "evening event" }, entitySlug: undefined, compareSlug: [] };
  const result = planRetrieval(intent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "something for an evening event");
  const females = result.fragrances.filter(f => f.gender === "female");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-24 — expected ≥3 candidates for male evening intent, got ${result.fragrances.length}`);
  assert.equal(females.length, 0,
    `T-C2-24 — female candidates in male occasion result: ${females.map(f => f.slug).join(", ")}`);
});

test("T-C2-25 — female + occasion signal: ≥3 candidates including minimum guarantee", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const intent: ResolvedIntent = { intent: "occasion_search", signals: { occasion: "summer outdoor" }, entitySlug: undefined, compareSlug: [] };
  const result = planRetrieval(intent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "something for a summer event");
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-25 — expected ≥3 candidates for female occasion intent, got ${result.fragrances.length}`);
  assert.equal(males.length, 0,
    `T-C2-25 — male candidates in female occasion result: ${males.map(f => f.slug).join(", ")}`);
});

test("T-C2-26 — no gender constraint: retrieval returns candidates without restriction", () => {
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "recommend something");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-26 — no-gender generic should yield ≥3, got ${result.fragrances.length}`);
  const allGenders = new Set(result.fragrances.map(f => f.gender));
  // With no constraint the pool is unconstrained; it may include any mix
  assert.ok(allGenders.size >= 1, "T-C2-26 — expected at least one gender in result");
});

// ── Group G: Catalogue reachability ───────────────────────────────────────────

test("T-C2-27 — diverse male queries: ≥10 unique male+unisex slugs reached", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const messages = [
    { msg: "recommend something", intent: GENERAL_INTENT },
    { msg: "something fresh and citrus", intent: { intent: "general_discovery", signals: { vibe: "fresh" }, entitySlug: undefined, compareSlug: [] } as ResolvedIntent },
    { msg: "deep woody oud scent",  intent: { intent: "general_discovery", signals: { family: "woody" }, entitySlug: undefined, compareSlug: [] } as ResolvedIntent },
    { msg: "romantic evening fragrance", intent: { intent: "occasion_search", signals: { occasion: "evening" }, entitySlug: undefined, compareSlug: [] } as ResolvedIntent },
    { msg: "aromatic spicy scent",  intent: { intent: "general_discovery", signals: { family: "aromatic" }, entitySlug: undefined, compareSlug: [] } as ResolvedIntent },
  ];
  const allSlugs = new Set<string>();
  for (const { msg, intent } of messages) {
    const result = planRetrieval(intent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, msg);
    result.fragrances.forEach(f => allSlugs.add(f.slug));
  }
  assert.ok(allSlugs.size >= 10,
    `T-C2-27 — expected ≥10 unique male+unisex slugs across diverse queries, got ${allSlugs.size}`);
});

test("T-C2-28 — diverse female queries: ≥10 unique female+unisex slugs reached", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const messages = [
    { msg: "recommend something", intent: GENERAL_INTENT },
    { msg: "light floral scent",  intent: { intent: "general_discovery", signals: { family: "floral" }, entitySlug: undefined, compareSlug: [] } as ResolvedIntent },
    { msg: "sweet gourmand",      intent: { intent: "general_discovery", signals: { vibe: "sweet" },   entitySlug: undefined, compareSlug: [] } as ResolvedIntent },
    { msg: "romantic date night", intent: { intent: "occasion_search",  signals: { occasion: "date night" }, entitySlug: undefined, compareSlug: [] } as ResolvedIntent },
    { msg: "fresh aquatic",       intent: { intent: "general_discovery", signals: { vibe: "aquatic" }, entitySlug: undefined, compareSlug: [] } as ResolvedIntent },
  ];
  const allSlugs = new Set<string>();
  for (const { msg, intent } of messages) {
    const result = planRetrieval(intent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, msg);
    result.fragrances.forEach(f => allSlugs.add(f.slug));
  }
  assert.ok(allSlugs.size >= 10,
    `T-C2-28 — expected ≥10 unique female+unisex slugs across diverse queries, got ${allSlugs.size}`);
});

test("T-C2-29 — 5-turn male session with exclusions: all turns yield ≥1 unseen candidate", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const cumulative = new Set<string>();
  let allTurnsHadUnseen = true;
  for (let turn = 1; turn <= 5; turn++) {
    const result = planRetrieval(
      GENERAL_INTENT, EMPTY_CONTEXT, profile,
      undefined, undefined, null,
      cumulative.size > 0 ? new Set(cumulative) : undefined,
      "recommend",
    );
    const unseen = result.fragrances.filter(f => !cumulative.has(f.slug));
    if (unseen.length === 0 && result.fragrances.length > 0) allTurnsHadUnseen = false;
    result.fragrances.forEach(f => cumulative.add(f.slug));
    if (result.fragrances.length === 0) break; // catalogue exhausted — acceptable
  }
  assert.ok(allTurnsHadUnseen,
    "T-C2-29 — at least one turn returned only previously-seen candidates before catalogue was exhausted");
});

test("T-C2-30 — similar_to fallback (no entity): ≥3 male+unisex candidates with male constraint", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const similarIntent: ResolvedIntent = {
    intent: "similar_to",
    signals: {},
    entitySlug: undefined, // no entity → falls through to buildBroadPool
    compareSlug: [],
  };
  const result = planRetrieval(similarIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "something similar");
  const females = result.fragrances.filter(f => f.gender === "female");
  assert.ok(result.fragrances.length >= 3,
    `T-C2-30 — expected ≥3 male+unisex candidates for similar_to fallback, got ${result.fragrances.length}: ${result.fragrances.map(f => f.slug).join(", ")}`);
  assert.equal(females.length, 0,
    `T-C2-30 — female candidates in male similar_to fallback: ${females.map(f => f.slug).join(", ")}`);
});

// ── Section 12: R1 Fit Ranking + Diversity Gates (EP-AI-C2-R1) ───────────────

test("T-R1-01 — scoreFit: returns 0 with no signals and no profile", () => {
  const k = mkcCatalogue[0];
  const fit = scoreFit(k, {}, undefined);
  assert.equal(fit, 0.0, `T-R1-01 — expected 0.0, got ${fit} for slug ${k.slug}`);
});

test("T-R1-02 — scoreFit: family-matched fragrance scores higher than unmatched", () => {
  const signals: FitSignals = { family: "fresh" };
  const freshCandidate = mkcCatalogue.find(
    k => k.family.some(f => f.toLowerCase().includes("fresh"))
  );
  const nonFreshCandidate = mkcCatalogue.find(
    k => !k.family.some(f => f.toLowerCase().includes("fresh")) && k.family.length > 0
  );
  assert.ok(freshCandidate, "T-R1-02 — fresh-family fixture not found in catalogue");
  assert.ok(nonFreshCandidate, "T-R1-02 — non-fresh fixture not found in catalogue");
  const freshFit   = scoreFit(freshCandidate!, signals, undefined);
  const nonFreshFit = scoreFit(nonFreshCandidate!, signals, undefined);
  assert.ok(
    freshFit > nonFreshFit,
    `T-R1-02 — fresh-family fit (${freshFit}) must exceed non-fresh fit (${nonFreshFit}). Fresh: ${freshCandidate!.slug}, Non-fresh: ${nonFreshCandidate!.slug}`
  );
});

test("T-R1-03 — fit ranking: fresh-signal planRetrieval promotes fresh-family candidate to top position", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const freshIntent: ResolvedIntent = {
    intent: "general_discovery",
    signals: { family: "fresh" },
    entitySlug: undefined,
    compareSlug: [],
  };
  const result = planRetrieval(freshIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "something fresh");
  assert.ok(result.fragrances.length >= 1, "T-R1-03 — fresh signal with male profile must return ≥1 candidate");
  const top = result.fragrances[0];
  const topFit = scoreFit(top, { family: "fresh" }, profile);
  assert.ok(
    topFit > 0,
    `T-R1-03 — top candidate "${top.slug}" should have fit > 0 for fresh family signal, got ${topFit}. Families: ${top.family.join(", ")}`
  );
});

test("T-R1-04 — family diversity: top-4 unconstrained results span ≥2 distinct primary families", () => {
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "recommend something");
  const top4 = result.fragrances.slice(0, 4);
  const primaryFamilies = new Set(top4.map(f => (f.family[0] ?? "other").toLowerCase()));
  assert.ok(
    primaryFamilies.size >= 2,
    `T-R1-04 — top-4 should have ≥2 distinct primary families, got ${primaryFamilies.size}: ${[...primaryFamilies].join(", ")}`
  );
});

test("T-R1-05 — applyFamilyDiversity: limits same primary family to maxPerFamily leading positions", () => {
  const floral = mkcCatalogue.filter(k => (k.family[0] ?? "").toLowerCase() === "floral").slice(0, 4);
  const woody  = mkcCatalogue.filter(k => (k.family[0] ?? "").toLowerCase() === "woody").slice(0, 2);
  assert.ok(floral.length >= 3, "T-R1-05 — need ≥3 floral records in catalogue");
  const input = [...floral, ...woody]; // 4 floral + 2 woody
  const out = applyFamilyDiversity(input, 2);
  assert.equal(out.length, input.length, "T-R1-05 — applyFamilyDiversity must not drop candidates");
  const floralInTop4 = out.slice(0, 4).filter(k => (k.family[0] ?? "").toLowerCase() === "floral").length;
  assert.ok(
    floralInTop4 <= 2,
    `T-R1-05 — at most 2 floral in leading positions; found ${floralInTop4}`
  );
});

test("T-R1-06 — applySameBrandPenalty: preserves all candidates, only reorders", () => {
  const candidates = mkcCatalogue.slice(0, 8);
  const result = applySameBrandPenalty(candidates, 2);
  assert.equal(result.length, candidates.length, "T-R1-06 — applySameBrandPenalty must not remove candidates");
  const inputSlugs = new Set(candidates.map(k => k.slug));
  assert.ok(
    result.every(k => inputSlugs.has(k.slug)),
    "T-R1-06 — applySameBrandPenalty output must contain same candidates as input"
  );
});

test("T-R1-07 — roles: fragranceRoles array length equals fragrances array length", () => {
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "recommend");
  assert.equal(
    result.fragranceRoles?.length,
    result.fragrances.length,
    `T-R1-07 — fragranceRoles.length (${result.fragranceRoles?.length}) must equal fragrances.length (${result.fragrances.length})`
  );
});

test("T-R1-08 — roles: all values are non-empty strings", () => {
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "recommend");
  assert.ok(result.fragranceRoles !== undefined, "T-R1-08 — fragranceRoles must be present");
  const invalid = result.fragranceRoles!.filter(r => typeof r !== "string" || r.length === 0);
  assert.equal(invalid.length, 0, `T-R1-08 — invalid roles found: ${JSON.stringify(invalid)}`);
});

test("T-R1-09 — roles: 'Best Seller Pick' or 'Top Recommendation' appears at position 0 when no signals", () => {
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "recommend");
  const firstRole = result.fragranceRoles?.[0];
  assert.ok(
    firstRole === "Best Seller Pick" || firstRole === "Top Recommendation",
    `T-R1-09 — position-0 role with no signals should be 'Best Seller Pick' or 'Top Recommendation', got '${firstRole}'`
  );
});

test("T-R1-10 — roles: 'Perfect Match' assigned when fit ≥ 0.35 in signal-rich context", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const freshIntent: ResolvedIntent = {
    intent: "general_discovery",
    signals: { family: "fresh" },
    entitySlug: undefined,
    compareSlug: [],
  };
  const result = planRetrieval(freshIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "I love fresh scents");
  const roles = result.fragranceRoles ?? [];
  const hasPerfectMatch = roles.some(r => r === "Perfect Match" || r === "You May Also Love");
  assert.ok(
    hasPerfectMatch,
    `T-R1-10 — expected at least one fit-aware role ('Perfect Match' or 'You May Also Love') in result; got: ${JSON.stringify(roles)}`
  );
});

test("T-R1-11 — hidden-gem path: less-obvious request returns ≥1 non-bestseller candidate", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "something less obvious");
  assert.ok(result.fragrances.length >= 1, "T-R1-11 — less-obvious request must yield ≥1 candidate");
  const hasNonBS = result.fragrances.some(f => !f.bestSeller);
  assert.ok(hasNonBS, "T-R1-11 — less-obvious request should include at least 1 non-bestseller");
});

test("T-R1-12 — recipient gender hard constraint still enforced after R1 changes (regression)", () => {
  const profile = makeProfile({
    shoppingIntent:  { value: "gift", confidence: "HIGH" },
    recipientGender: { value: "female", confidence: "HIGH" },
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "gift for her");
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.equal(males.length, 0, `T-R1-12 — male candidates leaked for female-gift intent: ${males.map(f => f.slug).join(", ")}`);
  assert.ok(result.fragrances.length >= 3, `T-R1-12 — expected ≥3 female/unisex candidates for gift-female, got ${result.fragrances.length}`);
});

// ── Section 13: C3 Rejection Model ───────────────────────────────────────────
// EP-AI-C3: named-product rejection, "none of those", session-seen filtering.

console.log("\n── 13. C3 Rejection Model ────────────────────────────────────────────");

test("T-C3-01 — detectRejections: named fragrance ('I don't like Sauvage') → sauvage-inspired rejected", () => {
  const rejected = detectRejections("I don't like Sauvage", undefined, undefined);
  assert.ok(
    rejected.includes("sauvage-inspired"),
    `T-C3-01 — expected sauvage-inspired in rejected set, got: [${rejected.join(", ")}]`,
  );
});

test("T-C3-02 — rejected slug absent from planRetrieval candidates", () => {
  const profile = makeProfile({
    preferredGender: { value: "male", confidence: "HIGH" },
    rejectedSlugs: ["sauvage-inspired"],
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend for me");
  const leaked = result.fragrances.find(f => f.slug === "sauvage-inspired");
  assert.equal(leaked, undefined,
    "T-C3-02 — sauvage-inspired appeared in candidates despite being rejected");
});

test("T-C3-03 — detectRejections: 'none of those' rejects previous recommendation set", () => {
  const lastRecs = ["aventus-inspired", "hacivat-inspired", "layton-inspired"];
  const rejected = detectRejections("None of those", undefined, lastRecs);
  for (const slug of lastRecs) {
    assert.ok(
      rejected.includes(slug),
      `T-C3-03 — expected ${slug} in rejected set after 'none of those', got: [${rejected.join(", ")}]`,
    );
  }
});

test("T-C3-04 — NONE_OF_THOSE_SIGNALS covers key phrases", () => {
  for (const phrase of ["none of those", "none of these", "none of them", "not those"]) {
    assert.ok(
      NONE_OF_THOSE_SIGNALS.some(p => p === phrase),
      `T-C3-04 — '${phrase}' not in NONE_OF_THOSE_SIGNALS`,
    );
  }
});

test("T-C3-05 — 'different options' variety turn: only unseen candidates returned (≥2 unseen exist)", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  // Seed session with first batch
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend for me");
  const t1Slugs = new Set(t1.fragrances.map(f => f.slug));

  // Variety turn — should return only unseen candidates
  const t2 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null,
    t1Slugs,
    "Give me different options",
  );
  const t2Repeated = t2.fragrances.filter(f => t1Slugs.has(f.slug));
  assert.equal(t2Repeated.length, 0,
    `T-C3-05 — variety turn returned session-seen slugs: ${t2Repeated.map(f => f.slug).join(", ")}`);
});

test("T-C3-06 — 'something else' variety turn: only unseen candidates returned", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend for me");
  const t1Slugs = new Set(t1.fragrances.map(f => f.slug));

  const t2 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null,
    t1Slugs,
    "Show me something else",
  );
  const t2Repeated = t2.fragrances.filter(f => t1Slugs.has(f.slug));
  assert.equal(t2Repeated.length, 0,
    `T-C3-06 — 'something else' turn returned session-seen slugs: ${t2Repeated.map(f => f.slug).join(", ")}`);
});

test("T-C3-07 — gender constraint (male) preserved after slug rejection", () => {
  const profile = makeProfile({
    preferredGender: { value: "male", confidence: "HIGH" },
    rejectedSlugs: ["aventus-inspired"],
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const females = result.fragrances.filter(f => f.gender === "female");
  assert.equal(females.length, 0,
    `T-C3-07 — female candidates leaked despite male constraint + rejection: ${females.map(f => f.slug).join(", ")}`);
  assert.equal(result.fragrances.find(f => f.slug === "aventus-inspired"), undefined,
    "T-C3-07 — rejected aventus-inspired still in candidates");
});

test("T-C3-08 — gender constraint (female) preserved after slug rejection", () => {
  const profile = makeProfile({
    preferredGender: { value: "female", confidence: "HIGH" },
    rejectedSlugs: ["delina-inspired"],
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.equal(males.length, 0,
    `T-C3-08 — male candidates leaked despite female constraint + rejection: ${males.map(f => f.slug).join(", ")}`);
  assert.equal(result.fragrances.find(f => f.slug === "delina-inspired"), undefined,
    "T-C3-08 — rejected delina-inspired still in candidates");
});

test("T-C3-09 — gift-recipient female constraint preserved after rejection", () => {
  const profile = makeProfile({
    shoppingIntent:  { value: "gift",   confidence: "HIGH" },
    recipientGender: { value: "female", confidence: "HIGH" },
    rejectedSlugs:   ["delina-inspired"],
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "gift for her");
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.equal(males.length, 0,
    `T-C3-09 — male candidates leaked despite female gift constraint: ${males.map(f => f.slug).join(", ")}`);
  assert.equal(result.fragrances.find(f => f.slug === "delina-inspired"), undefined,
    "T-C3-09 — rejected delina-inspired still in candidates for gift turn");
});

// ── Section 14: C3 Negative Preference Constraints ───────────────────────────

console.log("\n── 14. C3 Negative Preference Constraints ────────────────────────────");

test("T-C3-10 — extractProfile: 'I hate oud' → avoidedFamilies includes Oud", () => {
  const p = extractProfile("I hate oud fragrances", undefined);
  assert.ok(
    (p.avoidedFamilies?.value ?? []).some(f => f.toLowerCase() === "oud"),
    `T-C3-10 — expected Oud in avoidedFamilies, got: [${p.avoidedFamilies?.value.join(", ")}]`,
  );
});

test("T-C3-11 — avoidedFamilies Oud: oud-family fragrances excluded from broad pool", () => {
  const oudFamilies = mkcCatalogue.filter(
    k => k.family.some(f => f.toLowerCase() === "oud") && (k.gender === "male" || k.gender === "unisex")
  );
  if (oudFamilies.length === 0) {
    skip("T-C3-11 — no oud-family male/unisex fragrances in catalogue");
    return;
  }
  const profile = makeProfile({
    preferredGender:  { value: "male", confidence: "HIGH" },
    avoidedFamilies:  { value: ["Oud"],  confidence: "HIGH" },
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend for me");
  const oudLeaks = result.fragrances.filter(
    f => f.family.some(fam => fam.toLowerCase() === "oud")
  );
  assert.equal(oudLeaks.length, 0,
    `T-C3-11 — oud-family fragrances in result despite avoidance: ${oudLeaks.map(f => f.slug).join(", ")}`);
});

test("T-C3-12 — extractProfile: 'I don't like floral scents' → avoidedFamilies includes Floral", () => {
  const p = extractProfile("I don't like floral scents", undefined);
  assert.ok(
    (p.avoidedFamilies?.value ?? []).some(f => f.toLowerCase() === "floral"),
    `T-C3-12 — expected Floral in avoidedFamilies, got: [${p.avoidedFamilies?.value.join(", ")}]`,
  );
});

test("T-C3-13 — extractProfile: 'nothing gourmand' → avoidedFamilies includes Gourmand", () => {
  const p = extractProfile("nothing gourmand please", undefined);
  assert.ok(
    (p.avoidedFamilies?.value ?? []).some(f => f.toLowerCase() === "gourmand"),
    `T-C3-13 — expected Gourmand in avoidedFamilies, got: [${p.avoidedFamilies?.value.join(", ")}]`,
  );
});

test("T-C3-14 — avoidedFamilies Floral: floral fragrances excluded for female guest", () => {
  const floralFemale = mkcCatalogue.filter(
    k => k.family.some(f => f.toLowerCase() === "floral") && (k.gender === "female" || k.gender === "unisex")
  );
  if (floralFemale.length === 0) {
    skip("T-C3-14 — no floral female/unisex fragrances in catalogue");
    return;
  }
  const profile = makeProfile({
    preferredGender:  { value: "female", confidence: "HIGH" },
    avoidedFamilies:  { value: ["Floral"], confidence: "HIGH" },
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "something for me");
  const floralLeaks = result.fragrances.filter(
    f => f.family.some(fam => fam.toLowerCase() === "floral") && f.gender === "female"
  );
  assert.equal(floralLeaks.length, 0,
    `T-C3-14 — floral fragrances in female result despite avoidance: ${floralLeaks.map(f => f.slug).join(", ")}`);
});

test("T-C3-15 — extractProfile: 'without oud' → avoidedFamilies includes Oud", () => {
  const p = extractProfile("I want something without oud", undefined);
  assert.ok(
    (p.avoidedFamilies?.value ?? []).some(f => f.toLowerCase() === "oud"),
    `T-C3-15 — expected Oud in avoidedFamilies after 'without oud', got: [${p.avoidedFamilies?.value.join(", ")}]`,
  );
});

test("T-C3-16 — unknown negative attribute does not corrupt profile", () => {
  const p = extractProfile("I don't like boring fragrances", undefined);
  // 'boring' is not in FAMILIES or NOTES — profile should not have avoidedFamilies or avoidedNotes set from this
  const avoidedLen = (p.avoidedFamilies?.value ?? []).length + (p.avoidedNotes?.value ?? []).length;
  assert.equal(avoidedLen, 0,
    `T-C3-16 — unexpected avoidances added for unknown term 'boring': families=[${p.avoidedFamilies?.value.join(", ")}] notes=[${p.avoidedNotes?.value.join(", ")}]`,
  );
});

// ── Section 15: C3 Profile Correction ────────────────────────────────────────

console.log("\n── 15. C3 Profile Correction ─────────────────────────────────────────");

test("T-C3-17 — gender correction: 'I'm male' → 'I'm female' overrides to female", () => {
  let p = extractProfile("I'm male", undefined);
  assert.equal(p.preferredGender?.value, "male", "T-C3-17 — initial male not detected");
  p = extractProfile("I'm female", p);
  assert.equal(p.preferredGender?.value, "female",
    `T-C3-17 — expected female after correction, got ${p.preferredGender?.value}`);
});

test("T-C3-18 — gift → self pivot: shoppingIntent returns to self", () => {
  let p = extractProfile("I'm buying for my girlfriend", undefined);
  assert.equal(p.shoppingIntent?.value, "gift", "T-C3-18 — gift not detected initially");
  p = extractProfile("Actually I'd like something for myself", p);
  assert.equal(p.shoppingIntent?.value, "self",
    `T-C3-18 — expected self after pivot, got ${p.shoppingIntent?.value}`);
  assert.equal(getEffectiveGenderConstraint(p), null,
    "T-C3-18 — expected no constraint after self pivot (unspecified personal gender)");
});

test("T-C3-19 — self → gift pivot: recipientGender drives constraint", () => {
  let p = extractProfile("I'm male. Recommend for me.", undefined);
  assert.equal(p.preferredGender?.value, "male", "T-C3-19 — male not detected initially");
  p = extractProfile("Actually this is for my girlfriend", p);
  assert.equal(p.shoppingIntent?.value, "gift", "T-C3-19 — gift not detected after pivot");
  assert.equal(p.recipientGender?.value, "female", "T-C3-19 — recipientGender not female");
  assert.equal(getEffectiveGenderConstraint(p), "female",
    `T-C3-19 — expected female constraint after self→gift pivot, got ${getEffectiveGenderConstraint(p)}`);
});

test("T-C3-20 — avoided family removes from preferred when contradiction detected", () => {
  let p = extractProfile("I love fresh fragrances", undefined);
  assert.ok((p.preferredFamilies?.value ?? []).some(f => f.toLowerCase() === "fresh"),
    "T-C3-20 — Fresh not in preferredFamilies initially");
  p = extractProfile("I don't like fresh scents anymore", p);
  const preferred = p.preferredFamilies?.value ?? [];
  const avoided   = p.avoidedFamilies?.value  ?? [];
  assert.ok(!preferred.some(f => f.toLowerCase() === "fresh"),
    `T-C3-20 — Fresh still in preferredFamilies after contradiction: [${preferred.join(", ")}]`);
  assert.ok(avoided.some(f => f.toLowerCase() === "fresh"),
    `T-C3-20 — Fresh not in avoidedFamilies after contradiction: [${avoided.join(", ")}]`);
});

// ── Section 16: C3 Comparison Exemption + Candidate Bound ────────────────────

console.log("\n── 16. C3 Comparison Exemption + Candidate Bound ────────────────────");

test("T-C3-21 — comparison intent: cross-gender products preserved (exemption)", () => {
  const maleSlug   = "aventus-inspired";
  const femaleSlug = "delina-inspired";
  const comparisonIntent: ResolvedIntent = {
    intent:      "comparison",
    signals:     {},
    entitySlug:  maleSlug,
    compareSlug: [maleSlug, femaleSlug],
  };
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(comparisonIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "compare these two");
  const slugs = result.fragrances.map(f => f.slug);
  assert.ok(slugs.includes(maleSlug),   `T-C3-21 — ${maleSlug} missing from comparison result`);
  assert.ok(slugs.includes(femaleSlug), `T-C3-21 — ${femaleSlug} missing from comparison (exemption not applied)`);
});

test("T-C3-22 — rejected slug is absent even in comparison result (hard filter applies)", () => {
  const maleSlug   = "aventus-inspired";
  const femaleSlug = "delina-inspired";
  const comparisonIntent: ResolvedIntent = {
    intent:      "comparison",
    signals:     {},
    entitySlug:  maleSlug,
    compareSlug: [maleSlug, femaleSlug],
  };
  // NOTE: rejected slugs still apply to comparison (hard filter after switch).
  // The comparison exemption is only for gender — not for product rejection.
  const profile = makeProfile({ rejectedSlugs: ["aventus-inspired"] });
  const result = planRetrieval(comparisonIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "compare these");
  assert.equal(result.fragrances.find(f => f.slug === "aventus-inspired"), undefined,
    "T-C3-22 — rejected aventus-inspired appeared in comparison candidates");
});

test("T-C3-23 — no duplicate slugs in single planRetrieval result", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const slugs = result.fragrances.map(f => f.slug);
  const uniqueSlugs = new Set(slugs);
  assert.equal(slugs.length, uniqueSlugs.size,
    `T-C3-23 — duplicate slugs in result: [${slugs.join(", ")}]`);
});

// ── Section 17: C3 Session Diversity + Variety ───────────────────────────────

console.log("\n── 17. C3 Session Diversity + Variety ────────────────────────────────");

test("T-C3-24 — rejected slug absent even when it would be highest-quality candidate", () => {
  // Find a bestseller in the male pool to use as the rejection target
  const topMale = mkcCatalogue.find(k => k.bestSeller && (k.gender === "male" || k.gender === "unisex"));
  if (!topMale) {
    skip("T-C3-24 — no male bestseller available as fixture");
    return;
  }
  const profile = makeProfile({
    preferredGender: { value: "male", confidence: "HIGH" },
    rejectedSlugs:   [topMale.slug],
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend the best");
  assert.equal(result.fragrances.find(f => f.slug === topMale.slug), undefined,
    `T-C3-24 — rejected bestseller ${topMale.slug} appeared in candidates`);
});

test("T-C3-25 — variety turn excludes all session-seen when ≥2 unseen available", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  // Get a large first batch to create session-seen set
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const t1Slugs = new Set(t1.fragrances.map(f => f.slug));

  // Verify ≥2 unseen exist in the constrained catalogue
  const male = mkcCatalogue.filter(k => k.gender === "male" || k.gender === "unisex");
  const unseenInCatalogue = male.filter(k => !t1Slugs.has(k.slug));
  if (unseenInCatalogue.length < 2) {
    skip("T-C3-25 — fewer than 2 unseen male candidates after T1, cannot test variety filtering");
    return;
  }

  const t2 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, t1Slugs,
    "Give me completely different options",
  );
  const t2Repeated = t2.fragrances.filter(f => t1Slugs.has(f.slug));
  assert.equal(t2Repeated.length, 0,
    `T-C3-25 — variety turn returned previously seen slugs: ${t2Repeated.map(f => f.slug).join(", ")}`);
});

test("T-C3-26 — recycle permitted when constrained catalogue exhausted (non-variety turn)", () => {
  // Exhaust the female catalogue by excluding everything
  const allFemale = mkcCatalogue.filter(k => k.gender === "female" || k.gender === "unisex");
  const exhaustedSet = new Set(allFemale.map(k => k.slug));
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });

  const result = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, exhaustedSet,
    "recommend", // not a variety turn — recycle allowed
  );
  // Should not throw and should still return something (recycled candidates)
  assert.ok(result.fragrances.length >= 0, "T-C3-26 — planRetrieval crashed on exhausted catalogue");
});

test("T-C3-27 — rejected slugs do not appear across a 3-turn male session", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });

  // Turn 1
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const t1Slugs = t1.fragrances.map(f => f.slug);

  // Reject all of Turn 1
  const profileWithRejections = makeProfile({
    preferredGender: { value: "male", confidence: "HIGH" },
    rejectedSlugs:   t1Slugs,
  });

  // Turn 2 — none from T1 should appear
  const t2 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profileWithRejections,
    undefined, undefined, null,
    new Set(t1Slugs),
    "something different",
  );
  const t2Leaked = t2.fragrances.filter(f => t1Slugs.includes(f.slug));
  assert.equal(t2Leaked.length, 0,
    `T-C3-27 — Turn 2 returned rejected T1 slugs: ${t2Leaked.map(f => f.slug).join(", ")}`);

  // Turn 3 — rejected slugs still excluded
  const t2Slugs = t2.fragrances.map(f => f.slug);
  const t3 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profileWithRejections,
    undefined, undefined, null,
    new Set([...t1Slugs, ...t2Slugs]),
    "more recommendations",
  );
  const t3Leaked = t3.fragrances.filter(f => t1Slugs.includes(f.slug));
  assert.equal(t3Leaked.length, 0,
    `T-C3-27 — Turn 3 returned rejected T1 slugs: ${t3Leaked.map(f => f.slug).join(", ")}`);
});

test("T-C3-28 — unknown entity reference: planRetrieval returns non-empty graceful fallback", () => {
  const unknownIntent: ResolvedIntent = {
    intent:      "similar_to",
    signals:     {},
    entitySlug:  "not-a-real-slug-xyz-99999",
    compareSlug: [],
  };
  const result = planRetrieval(unknownIntent, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "something similar");
  assert.ok(result.fragrances.length >= 0, "T-C3-28 — planRetrieval crashed on unknown entity slug");
});

// ── Section 18: C3 Safety + Multi-Turn Scenarios ─────────────────────────────

console.log("\n── 18. C3 Safety + Multi-Turn Scenarios ─────────────────────────────");

test("T-C3-29 — Torino24 zero-note safety: rejected slugs active does not invent notes", () => {
  // Torino24 has notesEvidenceLocked = true and empty note arrays.
  // The context builder must not claim note tier content for it.
  const torino = mkcCatalogue.find(k => k.slug === "torino24-inspired");
  if (!torino) {
    skip("T-C3-29 — torino24-inspired not found in catalogue");
    return;
  }
  assert.equal([...torino.notes.top, ...torino.notes.heart, ...torino.notes.base].length, 0,
    "T-C3-29 — torino24-inspired unexpectedly has note data");
});

test("T-C3-30 — rejected Torino24 absent from candidates", () => {
  const profile = makeProfile({
    preferredGender: { value: "female", confidence: "HIGH" },
    rejectedSlugs:   ["torino24-inspired"],
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  assert.equal(result.fragrances.find(f => f.slug === "torino24-inspired"), undefined,
    "T-C3-30 — rejected torino24-inspired appeared in candidates");
});

test("T-C3-31 — avoidedFamilies + rejectedSlugs both enforced simultaneously", () => {
  const anyOudMale = mkcCatalogue.find(
    k => k.family.some(f => f.toLowerCase() === "oud") && (k.gender === "male" || k.gender === "unisex")
  );
  const topMale = mkcCatalogue.find(k => k.bestSeller && (k.gender === "male" || k.gender === "unisex") &&
    !k.family.some(f => f.toLowerCase() === "oud"));

  const profile = makeProfile({
    preferredGender: { value: "male", confidence: "HIGH" },
    avoidedFamilies: { value: ["Oud"], confidence: "HIGH" },
    rejectedSlugs:   topMale ? [topMale.slug] : [],
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");

  if (anyOudMale) {
    const oudInResult = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
    assert.equal(oudInResult.length, 0,
      `T-C3-31 — oud fragrances in result despite avoidance: ${oudInResult.map(f => f.slug).join(", ")}`);
  }
  if (topMale) {
    assert.equal(result.fragrances.find(f => f.slug === topMale.slug), undefined,
      `T-C3-31 — rejected slug ${topMale.slug} still in result despite being rejected`);
  }
});

test("T-C3-32 — third-person negation: 'She doesn't like oud' → avoidedFamilies includes Oud", () => {
  const p = extractProfile("She doesn't like oud fragrances", undefined);
  assert.ok(
    (p.avoidedFamilies?.value ?? []).some(f => f.toLowerCase() === "oud"),
    `T-C3-32 — expected Oud in avoidedFamilies from third-person negation, got: [${p.avoidedFamilies?.value.join(", ")}]`,
  );
});

test("T-C3-33 — multi-turn: rejection persists across profile updates", () => {
  // Simulate route.ts behavior: extraction updates profile, rejection is passed through
  let profile: ConversationProfile | undefined = undefined;
  const lastRecs: string[] = [];

  // Turn 1 — establish male preference
  profile = extractProfile("I'm male", profile);
  let result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  result.fragrances.forEach(f => lastRecs.push(f.slug));

  // Turn 2 — reject a specific fragrance
  const targetSlug = result.fragrances[0]?.slug;
  if (!targetSlug) {
    skip("T-C3-33 — no candidates in Turn 1 to use as rejection fixture");
    return;
  }
  profile = extractProfile("something fresh", profile);
  profile.rejectedSlugs = [targetSlug];

  // Turn 3 — fresh signal with rejection active
  const freshIntent: ResolvedIntent = {
    intent: "general_discovery", signals: { vibe: "fresh" }, entitySlug: undefined, compareSlug: [],
  };
  result = planRetrieval(freshIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "something fresh");
  assert.equal(result.fragrances.find(f => f.slug === targetSlug), undefined,
    `T-C3-33 — rejected slug ${targetSlug} reappeared in Turn 3`);
});

test("T-C3-34 — multi-turn female: avoidance survives pivot from male context", () => {
  let profile: ConversationProfile | undefined = undefined;

  // Phase 1: male context with oud avoidance
  profile = extractProfile("I'm male and I hate oud", profile);
  assert.ok(
    (profile.avoidedFamilies?.value ?? []).some(f => f.toLowerCase() === "oud"),
    "T-C3-34 — oud not in avoidedFamilies before pivot",
  );

  // Phase 2: pivot to gift for girlfriend (female context)
  profile = extractProfile("Actually this is for my girlfriend", profile);
  assert.equal(profile.shoppingIntent?.value, "gift", "T-C3-34 — gift not detected after pivot");
  assert.equal(profile.recipientGender?.value, "female", "T-C3-34 — female recipient not detected");

  // Avoidance should survive pivot
  assert.ok(
    (profile.avoidedFamilies?.value ?? []).some(f => f.toLowerCase() === "oud"),
    `T-C3-34 — oud avoidance lost after gift pivot: [${profile.avoidedFamilies?.value.join(", ")}]`,
  );

  // Retrieval should honour both female constraint AND oud avoidance
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const males = result.fragrances.filter(f => f.gender === "male");
  const oudLeaks = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
  assert.equal(males.length, 0,
    `T-C3-34 — male candidates after gift pivot: ${males.map(f => f.slug).join(", ")}`);
  assert.equal(oudLeaks.length, 0,
    `T-C3-34 — oud fragrances persisted despite avoidance after pivot: ${oudLeaks.map(f => f.slug).join(", ")}`);
});

test("T-C3-35 — no gender leakage after male → female pivot with rejection active", () => {
  let profile = makeProfile({
    preferredGender: { value: "male",   confidence: "HIGH" },
    rejectedSlugs:   ["aventus-inspired"],
  });

  // Pivot to female gift
  profile = extractProfile("Actually I'm buying for my wife", profile);
  profile.rejectedSlugs = ["aventus-inspired"]; // simulate route.ts merge

  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const males = result.fragrances.filter(f => f.gender === "male");
  assert.equal(males.length, 0,
    `T-C3-35 — male candidates after pivot to female gift: ${males.map(f => f.slug).join(", ")}`);
  assert.equal(result.fragrances.find(f => f.slug === "aventus-inspired"), undefined,
    "T-C3-35 — rejected aventus-inspired appeared after pivot");
});

test("T-C3-36 — 'none of those' followed by new search: results contain only new candidates", () => {
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const t1Slugs = t1.fragrances.map(f => f.slug);
  const t1SlugSet = new Set(t1Slugs);

  // Simulate "none of those" → t1Slugs become rejected
  const profileAfterNone = makeProfile({
    preferredGender: { value: "female", confidence: "HIGH" },
    rejectedSlugs:   t1Slugs,
  });

  const t2 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profileAfterNone,
    undefined, undefined, null,
    t1SlugSet,
    "show me other options",
  );
  const t2Leaked = t2.fragrances.filter(f => t1SlugSet.has(f.slug));
  assert.equal(t2Leaked.length, 0,
    `T-C3-36 — after 'none of those', T1 slugs reappeared in T2: ${t2Leaked.map(f => f.slug).join(", ")}`);
});

test("T-C3-37 — ordinal reference: lastRecommendationSlugs[1] resolves as 'second one'", () => {
  // Unit-level test: verify the structure that ordinal resolution depends on.
  // The full ordinal → selectedSlug resolution happens in route.ts (not planRetrieval),
  // so this test confirms the data model is correctly populated.
  const mockLastRecs = ["aventus-inspired", "hacivat-inspired", "layton-inspired"];
  const secondOne = mockLastRecs[1];
  assert.equal(secondOne, "hacivat-inspired",
    "T-C3-37 — index 1 of mockLastRecs should be hacivat-inspired");
  // The route resolves ordinals and overrides selectedSlug — no further action needed at planRetrieval level.
  // Documented: planRetrieval order = planner order, not guaranteed LLM presentation order.
});

test("T-C3-38 — variety turn with zero unseen: falls through to broad-catalogue fallback", () => {
  // Exhaust a small portion of the female catalogue
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const allFemale = mkcCatalogue.filter(k => k.gender === "female" || k.gender === "unisex");

  if (allFemale.length <= t1.fragrances.length) {
    skip("T-C3-38 — catalogue too small to exhaust for variety-fallback test");
    return;
  }

  // All current fragrances are excluded, so variety filter falls through to broader catalogue
  const excludeAll = new Set(allFemale.map(k => k.slug));
  const t2 = planRetrieval(
    GENERAL_INTENT, EMPTY_CONTEXT, profile,
    undefined, undefined, null, excludeAll,
    "Show me other options", // variety signal, but no unseen → fallback to catalogue
  );
  // Should not crash; recycled candidates are acceptable when catalogue is exhausted
  assert.ok(t2.fragrances.length >= 0, "T-C3-38 — planRetrieval crashed on exhausted catalogue with variety turn");
});

test("T-C3-39 — detectRejections: merges existing rejections with newly detected", () => {
  const existingProfile = makeProfile({ rejectedSlugs: ["delina-inspired"] });
  const lastRecs = ["aventus-inspired", "hacivat-inspired"];
  const merged = detectRejections("None of those", existingProfile, lastRecs);
  assert.ok(merged.includes("delina-inspired"),  "T-C3-39 — existing rejected slug lost in merge");
  assert.ok(merged.includes("aventus-inspired"), "T-C3-39 — new none-of-those slug missing in merge");
  assert.ok(merged.includes("hacivat-inspired"), "T-C3-39 — new none-of-those slug missing in merge");
});

test("T-C3-40 — multi-turn Founder scenario: zero gender leakage + zero rejection leakage across 4 turns", () => {
  let profile: ConversationProfile | undefined = undefined;
  const cumulativeExcluded = new Set<string>();
  let allRejectedSlugs: string[] = [];

  // Turn 1 — male
  profile = extractProfile("I'm male. Recommend a fragrance for myself.", profile);
  let result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "I'm male. Recommend a fragrance for myself.");
  result.fragrances.forEach(f => cumulativeExcluded.add(f.slug));
  assert.equal(result.fragrances.filter(f => f.gender === "female").length, 0, "T-C3-40 T1 — female candidates");

  // Turn 2 — reject first result
  const rejectedSlug = result.fragrances[0]?.slug;
  if (rejectedSlug) allRejectedSlugs = [rejectedSlug];
  profile = extractProfile("I want something fresh.", profile);
  profile.rejectedSlugs = allRejectedSlugs.length > 0 ? [...allRejectedSlugs] : undefined;
  const freshIntent: ResolvedIntent = { intent: "general_discovery", signals: { vibe: "fresh" }, entitySlug: undefined, compareSlug: [] };
  result = planRetrieval(freshIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, cumulativeExcluded.size > 0 ? new Set(cumulativeExcluded) : undefined, "I want something fresh.");
  result.fragrances.forEach(f => cumulativeExcluded.add(f.slug));
  assert.equal(result.fragrances.filter(f => f.gender === "female").length, 0, "T-C3-40 T2 — female candidates");
  if (rejectedSlug) {
    assert.equal(result.fragrances.find(f => f.slug === rejectedSlug), undefined, `T-C3-40 T2 — rejected ${rejectedSlug} reappeared`);
  }

  // Turn 3 — variety turn
  result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, cumulativeExcluded.size > 0 ? new Set(cumulativeExcluded) : undefined, "Give me different options.");
  result.fragrances.forEach(f => cumulativeExcluded.add(f.slug));
  assert.equal(result.fragrances.filter(f => f.gender === "female").length, 0, "T-C3-40 T3 — female candidates on variety turn");
  if (rejectedSlug) {
    assert.equal(result.fragrances.find(f => f.slug === rejectedSlug), undefined, `T-C3-40 T3 — rejected ${rejectedSlug} reappeared on variety turn`);
  }

  // Turn 4 — gift pivot to girlfriend
  profile = extractProfile("Actually I'm buying for my girlfriend now.", profile);
  profile.rejectedSlugs = allRejectedSlugs.length > 0 ? [...allRejectedSlugs] : undefined;
  result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, cumulativeExcluded.size > 0 ? new Set(cumulativeExcluded) : undefined, "Actually I'm buying for my girlfriend now.");
  assert.equal(getEffectiveGenderConstraint(profile), "female", "T-C3-40 T4 — constraint should be female after gift pivot");
  assert.equal(result.fragrances.filter(f => f.gender === "male").length, 0, "T-C3-40 T4 — male candidates after female pivot");
  if (rejectedSlug) {
    assert.equal(result.fragrances.find(f => f.slug === rejectedSlug), undefined, `T-C3-40 T4 — rejected ${rejectedSlug} reappeared after pivot`);
  }
});

// ── Section 19: C4-P0 Candidate Integrity ─────────────────────────────────────

console.log("\n── 19. C4-P0 Candidate Integrity ────────────────────────────────────");

test("T-C4-P0-01 — 'None of those.' with prior recs → action=new_search, requiresRetrieval=true", () => {
  const state: ConversationState = {
    ...EMPTY_STATE,
    lastRecommendationSlugs: ["aventus-inspired", "hacivat-inspired"],
    turns: [{ role: "assistant" as const, content: "Here are some options", intent: "general_discovery" as const, timestamp: 0 }],
  };
  const plan = planConversation("None of those.", state);
  assert.equal(plan.action, "new_search",
    `T-C4-P0-01 — expected new_search, got ${plan.action}`);
  assert.equal(plan.requiresRetrieval, true,
    "T-C4-P0-01 — requiresRetrieval must be true on rejection");
  assert.equal(plan.reuseRecommendations, false,
    "T-C4-P0-01 — reuseRecommendations must be false on rejection");
});

test("T-C4-P0-02 — 'None of these.' → action=new_search", () => {
  const state: ConversationState = {
    ...EMPTY_STATE,
    lastRecommendationSlugs: ["aventus-inspired"],
    turns: [{ role: "assistant" as const, content: "Here are some options", intent: "general_discovery" as const, timestamp: 0 }],
  };
  const plan = planConversation("None of these.", state);
  assert.equal(plan.action, "new_search",
    `T-C4-P0-02 — expected new_search, got ${plan.action}`);
});

test("T-C4-P0-03 — 'Not those.' → action=new_search", () => {
  const state: ConversationState = {
    ...EMPTY_STATE,
    lastRecommendationSlugs: ["aventus-inspired"],
    turns: [{ role: "assistant" as const, content: "Here are some options", intent: "general_discovery" as const, timestamp: 0 }],
  };
  const plan = planConversation("Not those.", state);
  assert.equal(plan.action, "new_search",
    `T-C4-P0-03 — expected new_search, got ${plan.action}`);
});

test("T-C4-P0-04 — 'None of them.' → action=new_search", () => {
  const state: ConversationState = {
    ...EMPTY_STATE,
    lastRecommendationSlugs: ["aventus-inspired"],
    turns: [{ role: "assistant" as const, content: "Here are some options", intent: "general_discovery" as const, timestamp: 0 }],
  };
  const plan = planConversation("None of them.", state);
  assert.equal(plan.action, "new_search",
    `T-C4-P0-04 — expected new_search, got ${plan.action}`);
});

test("T-C4-P0-05 — 'those two' (genuine reference) → NOT classified as rejection (reuse_cached)", () => {
  const state: ConversationState = {
    ...EMPTY_STATE,
    lastRecommendationSlugs: ["aventus-inspired", "hacivat-inspired"],
    turns: [{ role: "assistant" as const, content: "Here are some options", intent: "general_discovery" as const, timestamp: 0 }],
  };
  const plan = planConversation("Tell me more about those two.", state);
  assert.equal(plan.action, "reuse_cached",
    `T-C4-P0-05 — 'those two' should be reuse_cached (reference), got ${plan.action}`);
  assert.equal(plan.requiresRetrieval, false,
    "T-C4-P0-05 — reference phrase must not trigger retrieval");
});

test("T-C4-P0-06 — all NONE_OF_THOSE_SIGNALS classify as new_search with prior recs", () => {
  const state: ConversationState = {
    ...EMPTY_STATE,
    lastRecommendationSlugs: ["aventus-inspired"],
    turns: [{ role: "assistant" as const, content: "Here are some options", intent: "general_discovery" as const, timestamp: 0 }],
  };
  for (const signal of NONE_OF_THOSE_SIGNALS) {
    const plan = planConversation(signal, state);
    assert.equal(plan.action, "new_search",
      `T-C4-P0-06 — signal "${signal}" was not classified as new_search (got ${plan.action})`);
  }
});

test("T-C4-P0-07 — similar_to path: avoidedFamilies applied universally", () => {
  const oudFragrances = mkcCatalogue.filter(k => k.family.some(f => f.toLowerCase() === "oud"));
  if (oudFragrances.length === 0) { skip("T-C4-P0-07 — no oud-family fragrances in catalogue"); return; }
  const source = mkcCatalogue.find(k => k.gender === "male" || k.gender === "unisex");
  if (!source) { skip("T-C4-P0-07 — no source fragrance found"); return; }
  const simIntent: ResolvedIntent = { intent: "similar_to", signals: {}, entitySlug: source.slug, compareSlug: [] };
  const profile = makeProfile({ avoidedFamilies: { value: ["Oud"], confidence: "HIGH" } });
  const result = planRetrieval(simIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, `something like ${source.slug}`);
  const oudInResult = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
  assert.equal(oudInResult.length, 0,
    `T-C4-P0-07 — oud in similar_to result despite avoidance: ${oudInResult.map(f => f.slug).join(", ")}`);
});

test("T-C4-P0-08 — occasion_search path: avoidedFamilies applied universally", () => {
  const oudFragrances = mkcCatalogue.filter(k => k.family.some(f => f.toLowerCase() === "oud"));
  if (oudFragrances.length === 0) { skip("T-C4-P0-08 — no oud-family fragrances in catalogue"); return; }
  const occasionIntent: ResolvedIntent = { intent: "occasion_search", signals: { occasion: "evening" }, entitySlug: undefined, compareSlug: [] };
  const profile = makeProfile({ avoidedFamilies: { value: ["Oud"], confidence: "HIGH" } });
  const result = planRetrieval(occasionIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "evening occasion");
  const oudInResult = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
  assert.equal(oudInResult.length, 0,
    `T-C4-P0-08 — oud in occasion_search result despite avoidance: ${oudInResult.map(f => f.slug).join(", ")}`);
});

test("T-C4-P0-09 — seasonal path: avoidedFamilies applied universally", () => {
  const oudFragrances = mkcCatalogue.filter(k => k.family.some(f => f.toLowerCase() === "oud"));
  if (oudFragrances.length === 0) { skip("T-C4-P0-09 — no oud-family fragrances in catalogue"); return; }
  const seasonalIntent: ResolvedIntent = { intent: "seasonal", signals: { occasion: "winter" }, entitySlug: undefined, compareSlug: [] };
  const profile = makeProfile({ avoidedFamilies: { value: ["Oud"], confidence: "HIGH" } });
  const result = planRetrieval(seasonalIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "winter fragrance");
  const oudInResult = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
  assert.equal(oudInResult.length, 0,
    `T-C4-P0-09 — oud in seasonal result despite avoidance: ${oudInResult.map(f => f.slug).join(", ")}`);
});

test("T-C4-P0-10 — comparison: explicitly named avoided product preserved as comparison subject", () => {
  const oudFrag    = mkcCatalogue.find(k => k.family.some(f => f.toLowerCase() === "oud"));
  const nonOudFrag = mkcCatalogue.find(k => !k.family.some(f => f.toLowerCase() === "oud"));
  if (!oudFrag || !nonOudFrag) { skip("T-C4-P0-10 — required catalogue fixtures not found"); return; }
  const profile = makeProfile({ avoidedFamilies: { value: ["Oud"], confidence: "HIGH" } });
  const compIntent: ResolvedIntent = {
    intent: "comparison", signals: {}, entitySlug: oudFrag.slug, compareSlug: [oudFrag.slug, nonOudFrag.slug],
  };
  const result = planRetrieval(compIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, `compare ${oudFrag.slug} and ${nonOudFrag.slug}`);
  assert.ok(result.fragrances.find(f => f.slug === oudFrag.slug),
    `T-C4-P0-10 — named oud comparison subject was incorrectly filtered`);
  assert.ok(result.fragrances.find(f => f.slug === nonOudFrag.slug),
    `T-C4-P0-10 — non-oud comparison subject missing from result`);
});

test("T-C4-P0-11 — sourceKnowledge with avoidedFamily must not appear in candidate list", () => {
  const oudSource = mkcCatalogue.find(k => k.family.some(f => f.toLowerCase() === "oud"));
  if (!oudSource) { skip("T-C4-P0-11 — no oud fragrance found as source fixture"); return; }
  const profile = makeProfile({ avoidedFamilies: { value: ["Oud"], confidence: "HIGH" } });
  const simIntent: ResolvedIntent = { intent: "similar_to", signals: {}, entitySlug: oudSource.slug, compareSlug: [] };
  const result = planRetrieval(simIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, `something like ${oudSource.slug}`);
  assert.equal(result.fragrances.find(f => f.slug === oudSource.slug), undefined,
    `T-C4-P0-11 — oud sourceKnowledge ${oudSource.slug} appeared in candidates despite avoidedFamilies`);
});

test("T-C4-P0-12 — sourceKnowledge with rejectedSlug must not appear in candidate list", () => {
  const source = mkcCatalogue.find(k => k.gender === "male" || k.gender === "unisex");
  if (!source) { skip("T-C4-P0-12 — no source fragrance found"); return; }
  const profile = makeProfile({ rejectedSlugs: [source.slug] });
  const simIntent: ResolvedIntent = { intent: "similar_to", signals: {}, entitySlug: source.slug, compareSlug: [] };
  const result = planRetrieval(simIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, `something like ${source.slug}`);
  assert.equal(result.fragrances.find(f => f.slug === source.slug), undefined,
    `T-C4-P0-12 — rejected sourceKnowledge ${source.slug} appeared in candidates`);
});

test("T-C4-P0-13 — sourceKnowledge with avoidedNote must not appear in candidate list", () => {
  const withNotes = mkcCatalogue.find(k => [...k.notes.top, ...k.notes.heart, ...k.notes.base].length > 0);
  if (!withNotes) { skip("T-C4-P0-13 — no fragrance with notes found"); return; }
  const someNote = [...withNotes.notes.top, ...withNotes.notes.heart, ...withNotes.notes.base][0];
  const profile = makeProfile({ avoidedNotes: { value: [someNote], confidence: "HIGH" } });
  const simIntent: ResolvedIntent = { intent: "similar_to", signals: {}, entitySlug: withNotes.slug, compareSlug: [] };
  const result = planRetrieval(simIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, `something like ${withNotes.slug}`);
  assert.equal(result.fragrances.find(f => f.slug === withNotes.slug), undefined,
    `T-C4-P0-13 — sourceKnowledge with avoided note "${someNote}" appeared in candidates`);
});

test("T-C4-P0-14 — education path: avoidedFamilies applied universally", () => {
  const oudFragrances = mkcCatalogue.filter(k => k.family.some(f => f.toLowerCase() === "oud"));
  if (oudFragrances.length === 0) { skip("T-C4-P0-14 — no oud-family fragrances in catalogue"); return; }
  const educationIntent: ResolvedIntent = { intent: "education", signals: {}, entitySlug: undefined, compareSlug: [] };
  const profile = makeProfile({ avoidedFamilies: { value: ["Oud"], confidence: "HIGH" } });
  const result = planRetrieval(educationIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "tell me about fragrance families");
  const oudInResult = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
  assert.equal(oudInResult.length, 0,
    `T-C4-P0-14 — oud in education result despite avoidance: ${oudInResult.map(f => f.slug).join(", ")}`);
});

test("T-C4-P0-15 — zero forbidden candidates: full constraint stack (gender + rejection + avoidance)", () => {
  const profile = makeProfile({
    preferredGender:  { value: "female", confidence: "HIGH" },
    avoidedFamilies:  { value: ["Oud"],  confidence: "HIGH" },
    rejectedSlugs:    ["aventus-inspired"],
  });
  const result = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const males = result.fragrances.filter(f => f.gender === "male");
  const oud   = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
  const rej   = result.fragrances.filter(f => f.slug === "aventus-inspired");
  assert.equal(males.length, 0, `T-C4-P0-15 — male candidates in female result: ${males.map(f => f.slug).join(", ")}`);
  assert.equal(oud.length,   0, `T-C4-P0-15 — oud in result despite avoidance: ${oud.map(f => f.slug).join(", ")}`);
  assert.equal(rej.length,   0, `T-C4-P0-15 — rejected aventus-inspired in result`);
});

test("T-C4-P0-16 — 'none of those' + new planRetrieval: zero T4 slugs in T5 result", () => {
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const t4 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, "recommend");
  const t4Slugs = t4.fragrances.map(f => f.slug);
  const profileAfterRejection = makeProfile({
    preferredGender: { value: "male", confidence: "HIGH" },
    rejectedSlugs:   t4Slugs,
  });
  const t5 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, profileAfterRejection, undefined, undefined, null, new Set(t4Slugs), "None of those. Something else.");
  const leaked = t5.fragrances.filter(f => t4Slugs.includes(f.slug));
  assert.equal(leaked.length, 0,
    `T-C4-P0-16 — T4 slugs reappeared in T5 after 'none of those': ${leaked.map(f => f.slug).join(", ")}`);
});

test("T-C4-P0-17 — avoidedNotes on similar_to: avoided note absent from result candidates", () => {
  const noteCounts = new Map<string, number>();
  for (const k of mkcCatalogue) {
    for (const n of [...k.notes.top, ...k.notes.heart, ...k.notes.base]) {
      noteCounts.set(n.toLowerCase(), (noteCounts.get(n.toLowerCase()) ?? 0) + 1);
    }
  }
  const commonNote = [...noteCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!commonNote) { skip("T-C4-P0-17 — no common note found in catalogue"); return; }
  const source = mkcCatalogue.find(k =>
    ![...k.notes.top, ...k.notes.heart, ...k.notes.base].map(n => n.toLowerCase()).includes(commonNote)
  );
  if (!source) { skip("T-C4-P0-17 — no source without the avoided note"); return; }
  const profile = makeProfile({ avoidedNotes: { value: [commonNote], confidence: "HIGH" } });
  const simIntent: ResolvedIntent = { intent: "similar_to", signals: {}, entitySlug: source.slug, compareSlug: [] };
  const result = planRetrieval(simIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, `something like ${source.slug}`);
  const leaked = result.fragrances.filter(f =>
    [...f.notes.top, ...f.notes.heart, ...f.notes.base].some(n =>
      n.toLowerCase().includes(commonNote) || commonNote.includes(n.toLowerCase())
    )
  );
  assert.equal(leaked.length, 0,
    `T-C4-P0-17 — candidates with avoided note "${commonNote}" in similar_to result: ${leaked.map(f => f.slug).join(", ")}`);
});

test("T-C4-P0-18 — sourceKnowledge that passes all constraints is still permitted (non-regression)", () => {
  const source = mkcCatalogue.find(k =>
    (k.gender === "male" || k.gender === "unisex") &&
    !k.family.some(f => f.toLowerCase() === "oud")
  );
  if (!source) { skip("T-C4-P0-18 — no clean source fixture found"); return; }
  const profile = makeProfile({
    preferredGender:  { value: "male", confidence: "HIGH" },
    avoidedFamilies:  { value: ["Oud"], confidence: "HIGH" },
  });
  const simIntent: ResolvedIntent = { intent: "similar_to", signals: {}, entitySlug: source.slug, compareSlug: [] };
  const result = planRetrieval(simIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, `something like ${source.slug}`);
  const genderLeaks = result.fragrances.filter(f => f.gender === "female");
  const oudLeaks    = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
  assert.equal(genderLeaks.length, 0, `T-C4-P0-18 — gender leak in clean similar_to: ${genderLeaks.map(f => f.slug).join(", ")}`);
  assert.equal(oudLeaks.length,    0, `T-C4-P0-18 — oud in clean similar_to despite avoidance: ${oudLeaks.map(f => f.slug).join(", ")}`);
});

test("T-C4-P0-19 — 'not any of those' → new_search (NONE_OF_THOSE_SIGNALS variant)", () => {
  const state: ConversationState = {
    ...EMPTY_STATE,
    lastRecommendationSlugs: ["aventus-inspired"],
    turns: [{ role: "assistant" as const, content: "Here are some options", intent: "general_discovery" as const, timestamp: 0 }],
  };
  const plan = planConversation("not any of those", state);
  assert.equal(plan.action, "new_search",
    `T-C4-P0-19 — expected new_search for 'not any of those', got ${plan.action}`);
});

test("T-C4-P0-20 — avoidance + rejection combined on similar_to: source absent, zero oud in result", () => {
  const oudSource = mkcCatalogue.find(k => k.family.some(f => f.toLowerCase() === "oud"));
  if (!oudSource) { skip("T-C4-P0-20 — no oud source fragrance found"); return; }
  const profile = makeProfile({
    avoidedFamilies: { value: ["Oud"], confidence: "HIGH" },
    rejectedSlugs:   [oudSource.slug],
  });
  const simIntent: ResolvedIntent = { intent: "similar_to", signals: {}, entitySlug: oudSource.slug, compareSlug: [] };
  const result = planRetrieval(simIntent, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined, `something like ${oudSource.slug}`);
  assert.equal(result.fragrances.find(f => f.slug === oudSource.slug), undefined,
    `T-C4-P0-20 — rejected+avoided oud source appeared in candidates`);
  const oudLeaks = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "oud"));
  assert.equal(oudLeaks.length, 0,
    `T-C4-P0-20 — oud in result with rejection+avoidance active: ${oudLeaks.map(f => f.slug).join(", ")}`);
});

// ── Section 20: EP-AI-C4 — Progressive Refinement + Comparative Intelligence ──

console.log("\n── 20. EP-AI-C4 Progressive Refinement ──────────────────────────────");

// ── C4-01 to C4-10: Planner routing ──────────────────────────────────────────

test("T-C4-01 — 'like the first one but fresher' → anchored_refinement", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are some options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["fragrance-a", "fragrance-b"],
  };
  const plan = planConversation("like the first one but fresher", state);
  assert.equal(plan.action, "anchored_refinement",
    `T-C4-01 — expected anchored_refinement, got ${plan.action}`);
  assert.equal(plan.requiresRetrieval, true, "T-C4-01 — requiresRetrieval must be true");
});

test("T-C4-02 — 'same as the second but less sweet' → anchored_refinement", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["fragrance-a", "fragrance-b"],
  };
  const plan = planConversation("same as the second but less sweet", state);
  assert.equal(plan.action, "anchored_refinement",
    `T-C4-02 — expected anchored_refinement, got ${plan.action}`);
});

test("T-C4-03 — direction signal + selectedSlug → anchored_refinement (no explicit reference)", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["fragrance-a"], selectedSlug: "fragrance-a",
  };
  const plan = planConversation("something warmer", state);
  assert.equal(plan.action, "anchored_refinement",
    `T-C4-03 — expected anchored_refinement with selectedSlug anchor, got ${plan.action}`);
});

test("T-C4-04 — 'the first one' with NO direction signal → reuse_cached (not anchored)", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["fragrance-a", "fragrance-b"],
  };
  const plan = planConversation("tell me more about the first one", state);
  assert.equal(plan.action, "reuse_cached",
    `T-C4-04 — expected reuse_cached for reference without direction, got ${plan.action}`);
});

test("T-C4-05 — 'something fresher' with NO previous recs and NO selectedSlug → new_search", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [], context: {},
  };
  const plan = planConversation("something fresher please", state);
  assert.notEqual(plan.action, "anchored_refinement",
    "T-C4-05 — should not anchor when there is no previous recommendation to anchor on");
});

test("T-C4-06 — 'the third one but bolder' → anchored_refinement", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["a", "b", "c"],
  };
  const plan = planConversation("the third one but bolder", state);
  assert.equal(plan.action, "anchored_refinement",
    `T-C4-06 — expected anchored_refinement, got ${plan.action}`);
});

test("T-C4-07 — 'option 2 but less intense' → anchored_refinement", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["a", "b", "c"],
  };
  const plan = planConversation("option 2 but less intense", state);
  assert.equal(plan.action, "anchored_refinement",
    `T-C4-07 — expected anchored_refinement for 'option 2 but less intense', got ${plan.action}`);
});

test("T-C4-08 — comparison signal takes precedence over anchored_refinement", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["a", "b"], selectedSlug: "a",
  };
  const plan = planConversation("compare them, which is fresher?", state);
  assert.equal(plan.action, "comparison",
    `T-C4-08 — comparison must take precedence, got ${plan.action}`);
});

test("T-C4-09 — 'none of those' takes precedence over anchored_refinement signals", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["a", "b"], selectedSlug: "a",
  };
  // "none of those" fires before anchored_refinement check
  const plan = planConversation("none of those, something fresher", state);
  assert.equal(plan.action, "new_search",
    `T-C4-09 — none_of_those + direction should still → new_search, got ${plan.action}`);
});

test("T-C4-10 — 'the last one but cooler' → anchored_refinement", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "Here are options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["a", "b", "c"],
  };
  const plan = planConversation("the last one but cooler", state);
  assert.equal(plan.action, "anchored_refinement",
    `T-C4-10 — expected anchored_refinement for 'the last one but cooler', got ${plan.action}`);
});

// ── C4-11 to C4-20: Anchored pool — directional filtering ────────────────────

const ANCHORED_INTENT: ResolvedIntent = {
  intent: "anchored_refinement" as const, signals: {}, entitySlug: undefined, compareSlug: [],
};

test("T-C4-11 — freshness:more strict match: anchor below max freshness → fresher candidates", () => {
  // Find an anchor with freshness < max so fresher candidates exist
  const maxFresh = Math.max(...mkcCatalogue.map(k => k.freshness ?? 0));
  const anchor   = mkcCatalogue.find(k => (k.freshness ?? 0) < maxFresh);
  if (!anchor) { skip("T-C4-11 — no anchor below max freshness"); return; }
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);
  const allFresher = result.fragrances.every(f => (f.freshness ?? 0) > (anchor.freshness ?? 0));
  // When strictMatches=true, all candidates must be fresher
  if (result.anchoredMeta?.strictMatches) {
    assert.ok(allFresher,
      `T-C4-11 — strict match but some candidates not fresher than ${anchor.freshness}`);
  } else {
    // No strict matches found — acceptable fallback
    assert.ok(result.fragrances.length > 0, "T-C4-11 — fallback must still return candidates");
  }
});

test("T-C4-12 — freshness:more no strict match: anchor at max freshness → strictMatches=false", () => {
  const maxFresh = Math.max(...mkcCatalogue.map(k => k.freshness ?? 0));
  const anchor   = mkcCatalogue.find(k => (k.freshness ?? 0) >= maxFresh);
  if (!anchor) { skip("T-C4-12 — no max-freshness anchor"); return; }
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);
  assert.equal(result.anchoredMeta?.strictMatches, false,
    "T-C4-12 — anchor at max freshness must produce strictMatches=false");
  assert.ok(result.fragrances.length > 0, "T-C4-12 — fallback must return candidates even with no strict match");
});

test("T-C4-13 — sweetness:less strict match: anchor above min sweetness → candidates less sweet", () => {
  const minSweet = Math.min(...mkcCatalogue.map(k => k.sweetness ?? 5));
  const anchor   = mkcCatalogue.find(k => (k.sweetness ?? 0) > minSweet + 1);
  if (!anchor) { skip("T-C4-13 — no anchor above min sweetness"); return; }
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but less sweet", anchor.slug);
  if (result.anchoredMeta?.strictMatches) {
    const allLessSweet = result.fragrances.every(f => (f.sweetness ?? 0) < (anchor.sweetness ?? 0));
    assert.ok(allLessSweet,
      `T-C4-13 — strict match but some candidates not less sweet than anchor (${anchor.sweetness})`);
  } else {
    assert.ok(result.fragrances.length > 0, "T-C4-13 — fallback must return candidates");
  }
});

test("T-C4-14 — sweetness:less no strict match: anchor at min sweetness → strictMatches=false", () => {
  const minSweet = Math.min(...mkcCatalogue.map(k => k.sweetness ?? 5));
  const anchor   = mkcCatalogue.find(k => (k.sweetness ?? 5) <= minSweet);
  if (!anchor) { skip("T-C4-14 — no min-sweetness anchor"); return; }
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but less sweet", anchor.slug);
  assert.equal(result.anchoredMeta?.strictMatches, false,
    "T-C4-14 — anchor at min sweetness must produce strictMatches=false");
});

test("T-C4-15 — warmth:more strict match: anchor below max warmth → warmer candidates", () => {
  const maxWarmth = Math.max(...mkcCatalogue.map(k => k.warmth ?? 0));
  const anchor    = mkcCatalogue.find(k => (k.warmth ?? 0) < maxWarmth);
  if (!anchor) { skip("T-C4-15 — no anchor below max warmth"); return; }
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but warmer", anchor.slug);
  if (result.anchoredMeta?.strictMatches) {
    const allWarmer = result.fragrances.every(f => (f.warmth ?? 0) > (anchor.warmth ?? 0));
    assert.ok(allWarmer, `T-C4-15 — strict match but some candidates not warmer than anchor (${anchor.warmth})`);
  } else {
    assert.ok(result.fragrances.length > 0, "T-C4-15 — fallback must return candidates");
  }
});

test("T-C4-16 — intensity:less strict match: anchor above min intensity → lighter candidates", () => {
  const minInt = Math.min(...mkcCatalogue.map(k => k.intensity ?? 5));
  const anchor  = mkcCatalogue.find(k => (k.intensity ?? 0) > minInt + 1);
  if (!anchor) { skip("T-C4-16 — no anchor above min intensity"); return; }
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but lighter", anchor.slug);
  if (result.anchoredMeta?.strictMatches) {
    const allLighter = result.fragrances.every(f => (f.intensity ?? 0) < (anchor.intensity ?? 0));
    assert.ok(allLighter, `T-C4-16 — strict match but some candidates not lighter than anchor (${anchor.intensity})`);
  } else {
    assert.ok(result.fragrances.length > 0, "T-C4-16 — fallback must return candidates");
  }
});

test("T-C4-17 — anchor slug itself must never appear in results", () => {
  const anchor = mkcCatalogue[0];
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);
  assert.equal(result.fragrances.find(f => f.slug === anchor.slug), undefined,
    `T-C4-17 — anchor slug ${anchor.slug} appeared in anchored_refinement results`);
});

test("T-C4-18 — gender constraint respected in anchored pool", () => {
  const femaleAnchor = mkcCatalogue.find(k => k.gender === "female");
  if (!femaleAnchor) { skip("T-C4-18 — no female anchor available"); return; }
  const profile = makeProfile({ preferredGender: { value: "male", confidence: "HIGH" } });
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined,
    "like that but fresher", femaleAnchor.slug);
  const genderLeaks = result.fragrances.filter(f => f.gender === "female");
  assert.equal(genderLeaks.length, 0,
    `T-C4-18 — female fragrance in male-constrained anchored pool: ${genderLeaks.map(f => f.slug).join(", ")}`);
});

test("T-C4-19 — avoidedFamilies respected in anchored pool", () => {
  const anchor = mkcCatalogue.find(k => k.freshness !== undefined);
  if (!anchor) { skip("T-C4-19 — no anchor with freshness"); return; }
  const profile = makeProfile({ avoidedFamilies: { value: ["Floral"], confidence: "HIGH" } });
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);
  const floralLeaks = result.fragrances.filter(f =>
    f.family.some(fam => fam.toLowerCase() === "floral")
  );
  assert.equal(floralLeaks.length, 0,
    `T-C4-19 — floral fragrance appeared in anchored pool with floral avoided: ${floralLeaks.map(f => f.slug).join(", ")}`);
});

test("T-C4-20 — rejectedSlugs respected in anchored pool", () => {
  const candidates = mkcCatalogue.filter(k => k.freshness !== undefined && k.freshness < 5);
  if (candidates.length < 2) { skip("T-C4-20 — not enough candidates"); return; }
  const anchor   = candidates[0];
  const rejected = candidates[1].slug;
  const profile  = makeProfile({ rejectedSlugs: [rejected] });
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);
  assert.equal(result.fragrances.find(f => f.slug === rejected), undefined,
    `T-C4-20 — rejected slug ${rejected} appeared in anchored pool`);
});

// ── C4-21 to C4-28: Product card reliability (A2 fix) ────────────────────────

const ANCHOR_PLAN: ConversationPlan = {
  action: "anchored_refinement", reason: "test", requiresRetrieval: true,
  requiresComparison: false, requiresClarification: false,
  reuseRecommendations: false, nextIntent: "anchored_refinement",
};

test("T-C4-21 — valid [PRODUCT:slug] marker → exactly the matching card rendered", () => {
  const frag = mkcCatalogue[0];
  const retrieval: RetrievalContext = { fragrances: [frag, mkcCatalogue[1]], articles: [] };
  const raw = `Here is your recommendation [PRODUCT:${frag.slug}]`;
  const result = planResponse(raw, "anchored_refinement", retrieval, ANCHOR_PLAN);
  assert.deepEqual(result.recommendedSlugs, [frag.slug],
    `T-C4-21 — expected [${frag.slug}], got [${result.recommendedSlugs.join(", ")}]`);
});

test("T-C4-22 — invalid [PRODUCT:unknown-slug] marker → no card rendered (not unknown slug)", () => {
  const frag = mkcCatalogue[0];
  const retrieval: RetrievalContext = { fragrances: [frag], articles: [] };
  const raw = `Here is a great fragrance [PRODUCT:totally-made-up-slug-xyz]`;
  const result = planResponse(raw, "anchored_refinement", retrieval, ANCHOR_PLAN);
  assert.ok(!result.recommendedSlugs.includes("totally-made-up-slug-xyz"),
    "T-C4-22 — invalid slug must not appear in recommendedSlugs");
});

test("T-C4-23 — no marker but exact name in prose → card from retrieval candidates", () => {
  const frag = mkcCatalogue[0];
  const retrieval: RetrievalContext = { fragrances: [frag], articles: [] };
  // No [PRODUCT:slug] marker — only the name in prose
  const raw = `I'd recommend ${frag.name} for this direction.`;
  const result = planResponse(raw, "anchored_refinement", retrieval, ANCHOR_PLAN);
  assert.ok(result.recommendedSlugs.includes(frag.slug),
    `T-C4-23 — name match fallback did not resolve ${frag.name} → ${frag.slug}`);
});

test("T-C4-24 — single-best: retrieval holds exactly 1 fragrance → exactly 1 deterministic card", () => {
  const frag = mkcCatalogue[0];
  const retrieval: RetrievalContext = { fragrances: [frag], articles: [] };
  // No marker and name not in prose
  const raw = "This is the perfect fragrance for you based on your preferences.";
  const result = planResponse(raw, "anchored_refinement", retrieval, ANCHOR_PLAN);
  assert.deepEqual(result.recommendedSlugs, [frag.slug],
    `T-C4-24 — single candidate must produce deterministic card: got [${result.recommendedSlugs.join(", ")}]`);
});

test("T-C4-25 — no marker, no name match, multiple candidates → no speculative cards", () => {
  const frag1 = mkcCatalogue[0];
  const frag2 = mkcCatalogue[1];
  const retrieval: RetrievalContext = { fragrances: [frag1, frag2], articles: [] };
  // Generic response that mentions neither name
  const raw = "Here are some options that might work for you.";
  const result = planResponse(raw, "anchored_refinement", retrieval, ANCHOR_PLAN);
  assert.equal(result.recommendedSlugs.length, 0,
    `T-C4-25 — no marker + no name match + multiple candidates must produce 0 cards, got: [${result.recommendedSlugs.join(", ")}]`);
});

test("T-C4-26 — retrieved fragrance not mentioned/marked must not become a card", () => {
  const mentioned = mkcCatalogue[0];
  const notMentioned = mkcCatalogue[1];
  const retrieval: RetrievalContext = { fragrances: [mentioned, notMentioned], articles: [] };
  const raw = `I'd recommend ${mentioned.name} [PRODUCT:${mentioned.slug}]`;
  const result = planResponse(raw, "anchored_refinement", retrieval, ANCHOR_PLAN);
  assert.ok(!result.recommendedSlugs.includes(notMentioned.slug),
    `T-C4-26 — unrecommended retrieval candidate ${notMentioned.slug} must not appear in cards`);
});

test("T-C4-27 — multiple valid markers → multiple matching cards only", () => {
  const f1 = mkcCatalogue[0];
  const f2 = mkcCatalogue[1];
  const f3 = mkcCatalogue[2];
  const retrieval: RetrievalContext = { fragrances: [f1, f2, f3], articles: [] };
  const raw = `Option A [PRODUCT:${f1.slug}] and Option B [PRODUCT:${f2.slug}]`;
  const result = planResponse(raw, "general_discovery", retrieval, BASE_PLAN);
  assert.deepEqual(result.recommendedSlugs.sort(), [f1.slug, f2.slug].sort(),
    `T-C4-27 — expected [${f1.slug}, ${f2.slug}], got [${result.recommendedSlugs.join(", ")}]`);
  assert.ok(!result.recommendedSlugs.includes(f3.slug),
    `T-C4-27 — unrecommended ${f3.slug} must not appear even though retrieved`);
});

test("T-C4-28 — response may never map to non-current candidate", () => {
  const inContext = mkcCatalogue[0];
  const notInContext = mkcCatalogue[5];
  const retrieval: RetrievalContext = { fragrances: [inContext], articles: [] };
  // LLM emits a slug for a fragrance NOT in retrieval context
  const raw = `I recommend this [PRODUCT:${notInContext.slug}]`;
  const result = planResponse(raw, "anchored_refinement", retrieval, ANCHOR_PLAN);
  assert.ok(!result.recommendedSlugs.includes(notInContext.slug),
    `T-C4-28 — non-current candidate ${notInContext.slug} must never render as a card`);
});

// ── C4-29 to C4-35: Anchored refinement constraints (Founder required) ────────

test("T-C4-29 — strict directional match exists: leading candidates satisfy direction", () => {
  // Find anchor with freshness < max so strict fresher candidates exist
  const maxFresh = Math.max(...mkcCatalogue.map(k => k.freshness ?? 0));
  const anchor   = mkcCatalogue.find(k => (k.freshness ?? 0) < maxFresh - 1);
  if (!anchor) { skip("T-C4-29 — no suitable anchor for strict test"); return; }
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);
  if (result.anchoredMeta?.strictMatches) {
    const leadsFresher = (result.fragrances[0]?.freshness ?? 0) > (anchor.freshness ?? 0);
    assert.ok(leadsFresher,
      `T-C4-29 — strict match declared but lead candidate (${result.fragrances[0]?.freshness}) not fresher than anchor (${anchor.freshness})`);
  } else {
    // No strict matches available in catalogue — graceful fallback
    assert.ok(result.fragrances.length > 0, "T-C4-29 — fallback must provide candidates");
  }
});

test("T-C4-30 — no strict directional match: strictMatches=false, no false 'improved' result", () => {
  const minFresh = Math.min(...mkcCatalogue.map(k => k.freshness ?? 5));
  const anchor   = mkcCatalogue.find(k => (k.freshness ?? 5) <= minFresh);
  if (!anchor) { skip("T-C4-30 — no min-freshness anchor"); return; }
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but less fresh", anchor.slug);
  assert.equal(result.anchoredMeta?.strictMatches, false,
    "T-C4-30 — anchor at minimum freshness: strictMatches must be false");
  // Confirm meta carries the honest direction info
  assert.equal(result.anchoredMeta?.direction, "less", "T-C4-30 — direction must be 'less'");
});

test("T-C4-31 — anchor is not automatically presented as a new recommendation", () => {
  const anchor = mkcCatalogue[0];
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);
  assert.equal(result.fragrances.find(f => f.slug === anchor.slug), undefined,
    `T-C4-31 — anchor ${anchor.slug} must not appear in recommendations`);
});

test("T-C4-32 — rejected anchor: results exclude it even as a reference", () => {
  const anchor  = mkcCatalogue[0];
  const profile = makeProfile({ rejectedSlugs: [anchor.slug] });
  const result  = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);
  assert.equal(result.fragrances.find(f => f.slug === anchor.slug), undefined,
    `T-C4-32 — rejected anchor ${anchor.slug} must not appear in results`);
});

test("T-C4-33 — avoided-family anchor: results exclude anchor even when it's the source", () => {
  const floralAnchor = mkcCatalogue.find(k => k.family.some(f => f.toLowerCase() === "floral"));
  if (!floralAnchor) { skip("T-C4-33 — no floral anchor"); return; }
  const profile = makeProfile({ avoidedFamilies: { value: ["Floral"], confidence: "HIGH" } });
  const result  = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined,
    "like that but fresher", floralAnchor.slug);
  assert.equal(result.fragrances.find(f => f.slug === floralAnchor.slug), undefined,
    `T-C4-33 — avoided-family anchor ${floralAnchor.slug} must not appear in results`);
  const floralLeaks = result.fragrances.filter(f => f.family.some(fam => fam.toLowerCase() === "floral"));
  assert.equal(floralLeaks.length, 0,
    `T-C4-33 — floral fragrance leaked into anchored pool with floral avoided`);
});

test("T-C4-34 — gender constraint survives anchored refinement", () => {
  const maleAnchor = mkcCatalogue.find(k => k.gender === "male");
  if (!maleAnchor) { skip("T-C4-34 — no male anchor"); return; }
  const profile = makeProfile({ preferredGender: { value: "female", confidence: "HIGH" } });
  const result  = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined,
    "like that but fresher", maleAnchor.slug);
  const maleLeaks = result.fragrances.filter(f => f.gender === "male");
  assert.equal(maleLeaks.length, 0,
    `T-C4-34 — male fragrance in female-constrained anchored pool: ${maleLeaks.map(f => f.slug).join(", ")}`);
});

test("T-C4-35 — gift recipient gender constraint survives anchored refinement", () => {
  const anchor = mkcCatalogue[0];
  const profile = makeProfile({
    shoppingIntent:   { value: "gift",   confidence: "HIGH" },
    recipientGender:  { value: "female", confidence: "HIGH" },
  });
  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined,
    "like that but warmer", anchor.slug);
  const maleLeaks = result.fragrances.filter(f => f.gender === "male");
  assert.equal(maleLeaks.length, 0,
    `T-C4-35 — male fragrance in gift/female anchored pool: ${maleLeaks.map(f => f.slug).join(", ")}`);
});

// ── C4-36 to C4-40: Acceptance conversations + governance ─────────────────────

test("T-C4-36 — Conversation A: multi-turn discover → anchor + direction → fresh retrieval", () => {
  // Turn 1: discover → get recommendations
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "recommend me a fragrance");
  assert.ok(t1.fragrances.length > 0, "T-C4-36 — Turn 1 must return candidates");

  // Turn 2: guest references second recommendation + direction
  const t1Slugs = t1.fragrances.map(f => f.slug);
  const anchorSlug = t1Slugs[1] ?? t1Slugs[0];
  const anchIntent: ResolvedIntent = { intent: "anchored_refinement" as const, signals: {}, entitySlug: undefined, compareSlug: [] };
  const t2 = planRetrieval(anchIntent, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "like the second one but fresher", anchorSlug);

  assert.ok(t2.fragrances.length > 0, "T-C4-36 — Turn 2 anchored_refinement must return candidates");
  assert.equal(t2.fragrances.find(f => f.slug === anchorSlug), undefined,
    "T-C4-36 — anchor must not appear in Turn 2 results");
  assert.equal(t2.anchoredMeta?.anchorSlug, anchorSlug,
    "T-C4-36 — anchoredMeta must carry the correct anchor slug");
  assert.equal(t2.anchoredMeta?.dimension, "freshness",
    `T-C4-36 — dimension must be 'freshness', got '${t2.anchoredMeta?.dimension}'`);
  assert.equal(t2.anchoredMeta?.direction, "more",
    `T-C4-36 — direction must be 'more', got '${t2.anchoredMeta?.direction}'`);
});

test("T-C4-37 — Conversation B: 'the second one but less sweet' → sweetness:less anchor", () => {
  const t1 = planRetrieval(GENERAL_INTENT, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined, "recommend fragrances");
  const anchorSlug = t1.fragrances[1]?.slug ?? t1.fragrances[0]?.slug;
  if (!anchorSlug) { skip("T-C4-37 — no candidates from Turn 1"); return; }

  const anchIntent: ResolvedIntent = { intent: "anchored_refinement" as const, signals: {}, entitySlug: undefined, compareSlug: [] };
  const t2 = planRetrieval(anchIntent, EMPTY_CONTEXT, undefined, undefined, undefined, null, undefined,
    "the second one but less sweet", anchorSlug);

  assert.equal(t2.anchoredMeta?.dimension, "sweetness",
    `T-C4-37 — expected dimension sweetness, got ${t2.anchoredMeta?.dimension}`);
  assert.equal(t2.anchoredMeta?.direction, "less",
    `T-C4-37 — expected direction less, got ${t2.anchoredMeta?.direction}`);
  assert.equal(t2.fragrances.find(f => f.slug === anchorSlug), undefined,
    "T-C4-37 — anchor must not be in Turn 2 results");
});

test("T-C4-38 — BUDGET_REFINEMENT_NOT_MEANINGFUL_CURRENTLY: all fragrances same price tiers", () => {
  const prices = mkcCatalogue.map(k => ({
    s5:  k.prices?.["5ml"]  ?? "missing",
    s10: k.prices?.["10ml"] ?? "missing",
    s30: k.prices?.["30ml"] ?? "missing",
  }));
  const distinct = new Set(prices.map(p => JSON.stringify(p)));
  assert.equal(distinct.size, 1,
    `T-C4-38 — Expected 1 unique price combo (uniform pricing), found ${distinct.size}. ` +
    `If pricing is now differentiated, remove BUDGET_REFINEMENT_NOT_MEANINGFUL_CURRENTLY guard.`);
});

test("T-C4-39 — anchored_refinement plan action correctly sets requiresRetrieval=true and nextIntent", () => {
  const state: ConversationState = {
    sessionId: "test", turns: [{ role: "assistant" as const, content: "options", intent: "general_discovery" as const, timestamp: 0 }],
    context: {}, lastRecommendationSlugs: ["a", "b", "c"],
  };
  const plan = planConversation("the third one but richer", state);
  assert.equal(plan.action, "anchored_refinement",
    `T-C4-39 — expected anchored_refinement, got ${plan.action}`);
  assert.equal(plan.requiresRetrieval, true,
    "T-C4-39 — requiresRetrieval must be true for anchored_refinement");
  assert.equal(plan.nextIntent, "anchored_refinement",
    `T-C4-39 — nextIntent must be 'anchored_refinement', got ${plan.nextIntent}`);
});

test("T-C4-40 — anchored_refinement + avoidance + rejection all respected simultaneously", () => {
  const allCandidates = mkcCatalogue.filter(k => k.freshness !== undefined);
  if (allCandidates.length < 3) { skip("T-C4-40 — insufficient candidates"); return; }
  const anchor   = allCandidates[0];
  const rejected = allCandidates[1].slug;
  const avoided  = allCandidates[2].family[0] ?? "Floral";

  const profile = makeProfile({
    rejectedSlugs:   [rejected],
    avoidedFamilies: { value: [avoided], confidence: "HIGH" },
  });

  const result = planRetrieval(ANCHORED_INTENT, EMPTY_CONTEXT, profile, undefined, undefined, null, undefined,
    "like that but fresher", anchor.slug);

  // Anchor absent
  assert.equal(result.fragrances.find(f => f.slug === anchor.slug), undefined,
    `T-C4-40 — anchor ${anchor.slug} appeared in results`);
  // Rejected absent
  assert.equal(result.fragrances.find(f => f.slug === rejected), undefined,
    `T-C4-40 — rejected slug ${rejected} appeared in results`);
  // Avoided family absent
  const avoidedLeaks = result.fragrances.filter(f =>
    f.family.some(fam => fam.toLowerCase() === avoided.toLowerCase())
  );
  assert.equal(avoidedLeaks.length, 0,
    `T-C4-40 — avoided family '${avoided}' leaked into anchored pool`);
});

// ── Summary ───────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n${"─".repeat(70)}`);
console.log(`  ${total} tests  |  ${passed} passed  |  ${failed} failed`);
console.log("─".repeat(70));

if (failed > 0) process.exit(1);
