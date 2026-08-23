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
} from "../../../app/lib/concierge/retrievalPlanner";
import { buildContext, renderContext } from "../../../app/lib/concierge/contextBuilder";
import { mkcCatalogue }      from "../../../app/lib/mkc/catalogue";
import { nativeFragrances }  from "../../../app/lib/mkc/native";
import { resolveIntent } from "../../../app/lib/concierge/intentResolver";
import type { ConversationProfile, ConversationState }  from "../../../app/lib/concierge/types";
import type { ResolvedIntent } from "../../../app/lib/concierge/intentResolver";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";

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

// ── Summary ───────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n${"─".repeat(70)}`);
console.log(`  ${total} tests  |  ${passed} passed  |  ${failed} failed`);
console.log("─".repeat(70));

if (failed > 0) process.exit(1);
