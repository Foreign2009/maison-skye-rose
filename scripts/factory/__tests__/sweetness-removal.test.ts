/**
 * Strict-match "removal" claim correction.
 * Observed: Oud Wood "removes the sweetness almost entirely (1/5)" on a
 * "less sweet than Baccarat Rouge 540" turn. 1/5 supports lower sweetness than
 * BR540's 3/5, not near-total removal.
 *
 * Exercises the real planResponse → formatResponse path with canned model output (no LLM call).
 *
 * Run: npx tsx scripts/factory/__tests__/sweetness-removal.test.ts
 */
import assert from "node:assert/strict";
import { planResponse } from "../../../app/lib/concierge/responsePlanner";
import { formatResponse } from "../../../app/lib/concierge/responseFormatter";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import type { ConversationIntent } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const BR540 = "baccarat-rouge-540-inspired";
const OUD   = "oud-wood-inspired";
const SAUV  = "sauvage-inspired";
const k = (slug: string) => mkcCatalogue.find((f) => f.slug === slug)!;
for (const s of [BR540, OUD, SAUV]) if (!mkcCatalogue.some((f) => f.slug === s)) { console.error(`${s} missing — aborting`); process.exit(1); }
const SW2 = mkcCatalogue.find((f) => f.sweetness === 2 && f.gender !== "female")!.slug;   // lower than anchor, differs from Oud
const SW3 = mkcCatalogue.find((f) => f.sweetness === 3 && f.slug !== BR540)!.slug;      // not lower than anchor
const name = (slug: string) => k(slug).name;
const A = name(BR540);

const META = {
  anchorSlug: BR540, anchorName: A, dimension: "sweetness", direction: "less", anchorScore: k(BR540).sweetness,
  anchorDimScores: { sweetness: k(BR540).sweetness, freshness: k(BR540).freshness, warmth: k(BR540).warmth, intensity: k(BR540).intensity, versatility: k(BR540).versatility },
  strictMatches: true, catalogueBoundary: false,
};
const ANCHORED_PLAN = {
  action: "anchored_refinement", requiresRetrieval: true, requiresClarification: false,
  requiresComparison: false, reuseRecommendations: false, nextIntent: "anchored_refinement",
} as ConversationPlan;

function run(raw: string, frags: Array<typeof mkcCatalogue[number]>, opts: { intent?: ConversationIntent; meta?: unknown } = {}) {
  const r = { fragrances: frags, articles: [], collectionName: "Skye", anchoredMeta: opts.meta === undefined ? META : opts.meta } as unknown as RetrievalContext;
  return formatResponse(planResponse(raw, opts.intent ?? "anchored_refinement", r, ANCHORED_PLAN));
}
const frag = (slug: string) => k(slug);
const withoutSweetness = (slug: string) => ({ ...k(slug), sweetness: undefined }) as unknown as typeof mkcCatalogue[number];

test("SR-00 — fixture premise: BR540 3/5, Oud Wood 1/5, Sauvage 1/5", () => {
  assert.equal(k(BR540).sweetness, 3); assert.equal(k(OUD).sweetness, 1); assert.equal(k(SAUV).sweetness, 1);
  assert.equal(k(SW2).sweetness, 2); assert.equal(k(SW3).sweetness, 3);
});

test("SR-01 — exact observed phrase becomes a relative claim with both scores attached", () => {
  const out = run(`[PRODUCT:${OUD}] removes the sweetness almost entirely (1/5), leaving smoky oud and vetiver.`, [frag(OUD), frag(SAUV)]);
  assert.equal(out.content, `${name(OUD)} has lower sweetness (1/5) than ${A} (3/5), leaving smoky oud and vetiver.`);
  assert.ok(!/remov|almost entirely/i.test(out.content), out.content);
});

test("SR-02 — the candidate's own score is used, not the model's stated score", () => {
  const out = run(`[PRODUCT:${SW2}] removes the sweetness almost entirely (1/5).`, [frag(SW2), frag(OUD)]);
  assert.equal(out.content, `${name(SW2)} has lower sweetness (2/5) than ${A} (3/5).`);
});

test("SR-03 — gerund and 'most of the' forms are corrected", () => {
  const out = run(`[PRODUCT:${OUD}] is smoky, removing most of the sweetness.`, [frag(OUD)]);
  assert.equal(out.content, `${name(OUD)} is smoky, with lower sweetness (1/5) than ${A} (3/5).`);
});

test("SR-04 — accurate lower-sweetness wording and unrelated 'removes' prose are unchanged", () => {
  const raw = `[PRODUCT:${OUD}] has lower sweetness than ${A}. It removes any doubt about evening wear.`;
  const out = run(raw, [frag(OUD)]);
  assert.equal(out.content, `${name(OUD)} has lower sweetness than ${A}. It removes any doubt about evening wear.`);
});

test("SR-05 — negations are preserved", () => {
  const raw = `[PRODUCT:${OUD}] doesn't remove the sweetness entirely, and it is not removing the sweetness completely.`;
  const out = run(raw, [frag(OUD)]);
  assert.ok(out.content.includes("doesn't remove the sweetness entirely"), out.content);
  assert.ok(out.content.includes("not removing the sweetness completely"), out.content);
  assert.ok(!out.content.includes("lower sweetness"), out.content);
});

test("SR-06 — quoted customer preferences (double, single, curly) are preserved", () => {
  const raw = `[PRODUCT:${OUD}] is a good fit. You said "I want something that removes the sweetness entirely", ` +
    `or 'removes the sweetness', or “strips away the sweetness”.`;
  const out = run(raw, [frag(OUD)]);
  for (const kept of [`"I want something that removes the sweetness entirely"`, `'removes the sweetness'`, `“strips away the sweetness”`]) {
    assert.ok(out.content.includes(kept), `lost ${kept}: ${out.content}`);
  }
  assert.ok(!out.content.includes("lower sweetness"), out.content);
});

test("SR-07 — unattributed claim with mixed scores is left unchanged (no shared or borrowed score)", () => {
  const out = run(`[PRODUCT:${OUD}] and [PRODUCT:${SW2}] suit you.\n\nBoth remove the sweetness almost entirely.`, [frag(OUD), frag(SW2)]);
  assert.ok(out.content.includes("Both remove the sweetness almost entirely."), out.content);
  assert.ok(!out.content.includes("lower sweetness"), out.content);
});

test("SR-08 — plural/ambiguous subject with identical scores is left unchanged", () => {
  const out = run(`[PRODUCT:${OUD}] and [PRODUCT:${SAUV}] remove the sweetness almost entirely.`, [frag(OUD), frag(SAUV)]);
  assert.ok(out.content.includes("remove the sweetness almost entirely."), out.content);
  assert.ok(!out.content.includes("lower sweetness"), out.content);
});

test("SR-09 — missing score on the named candidate leaves the phrase unchanged", () => {
  const out = run(`[PRODUCT:${OUD}] removes the sweetness almost entirely (1/5).`, [withoutSweetness(OUD), frag(SAUV)]);
  assert.ok(out.content.includes("removes the sweetness almost entirely (1/5)"), out.content);
});

test("SR-10 — unattributed claim with any missing score is left unchanged", () => {
  const out = run(`[PRODUCT:${OUD}] and [PRODUCT:${SAUV}] suit you.\n\nBoth remove the sweetness almost entirely.`, [frag(OUD), withoutSweetness(SAUV)]);
  assert.ok(out.content.includes("Both remove the sweetness almost entirely."), out.content);
});

test("SR-11 — ambiguous attribution where a candidate is not lower than the anchor is left unchanged", () => {
  const out = run(`[PRODUCT:${OUD}] and [PRODUCT:${SW3}] suit you.\n\nBoth remove the sweetness almost entirely.`, [frag(OUD), frag(SW3)]);
  assert.ok(out.content.includes("Both remove the sweetness almost entirely."), out.content);
});

test("SR-12 — named candidate not lower than the anchor is left unchanged", () => {
  const out = run(`[PRODUCT:${SW3}] removes the sweetness almost entirely.`, [frag(SW3), frag(OUD)]);
  assert.ok(out.content.includes("removes the sweetness almost entirely"), out.content);
});

test("SR-13 — turns without strict anchored metadata are unchanged", () => {
  const raw = `[PRODUCT:${OUD}] removes the sweetness almost entirely (1/5).`;
  const plain = run(raw, [frag(OUD)], { intent: "similar_to", meta: null });
  assert.ok(plain.content.includes("removes the sweetness almost entirely (1/5)"), plain.content);
  const notStrict = run(raw, [frag(OUD)], { meta: { ...META, strictMatches: false } });
  assert.equal(notStrict.fragrances.length, 0, "no-match path should render no cards");
  assert.ok(!notStrict.content.includes("lower sweetness (1/5)"), notStrict.content);
});

test("SR-14 — existing absence correction still applies alongside the removal correction", () => {
  const raw = `[PRODUCT:${OUD}] has zero sweetness. [PRODUCT:${SAUV}] removes the sweetness almost entirely.`;
  const out = run(raw, [frag(OUD), frag(SAUV)]);
  assert.ok(!/zero sweetness/i.test(out.content), `absence claim not corrected: ${out.content}`);
  assert.ok(out.content.includes(`${name(SAUV)} has lower sweetness (1/5) than ${A} (3/5).`), out.content);
});

test("SR-15 — only Oud Wood rendered; a sentence about Baccarat Rouge 540 is left unchanged", () => {
  const raw = `[PRODUCT:${OUD}] is smoky and dry. ${A} removes the sweetness almost entirely.`;
  const out = run(raw, [frag(OUD)]);
  assert.ok(out.content.includes(`${A} removes the sweetness almost entirely.`), out.content);
  assert.ok(!out.content.includes("lower sweetness (1/5)"), `Oud Wood's score was assigned: ${out.content}`);
});

test("SR-16 — adverb-first form is corrected as a complete construction", () => {
  const out = run(`[PRODUCT:${OUD}] almost entirely removes the sweetness, leaving dry woods.`, [frag(OUD)]);
  assert.equal(out.content, `${name(OUD)} has lower sweetness (1/5) than ${A} (3/5), leaving dry woods.`);
  assert.ok(!/almost entirely/i.test(out.content), out.content);
});

test("SR-17 — any other adverb before the verb leaves the claim wholly unchanged", () => {
  const out = run(`[PRODUCT:${OUD}] mostly removes the sweetness.`, [frag(OUD)]);
  assert.equal(out.content, `${name(OUD)} mostly removes the sweetness.`);
});

test("SR-18 — an explicit comparison target is preserved (no second comparison inserted)", () => {
  const out = run(`[PRODUCT:${OUD}] removes the sweetness more completely than another fragrance would.`, [frag(OUD)]);
  assert.equal(out.content, `${name(OUD)} removes the sweetness more completely than another fragrance would.`);
  assert.ok(!out.content.includes(A), out.content);
});

test("SR-19 — 'Unlike <anchor>, <candidate> removes …' attributes to the tied grammatical subject", () => {
  const out = run(`Unlike ${A}, [PRODUCT:${OUD}] removes the sweetness almost entirely.`, [frag(OUD)]);
  assert.equal(out.content, `Unlike ${A}, ${name(OUD)} has lower sweetness (1/5) than ${A} (3/5).`);
});

test("SR-20 — a pronoun subject is left unchanged even with a single rendered card", () => {
  const out = run(`[PRODUCT:${OUD}] is smoky. It removes the sweetness almost entirely.`, [frag(OUD)]);
  assert.ok(out.content.includes("It removes the sweetness almost entirely."), out.content);
});

const V28  = "vanilla-28-inspired";
const LB   = "light-blue-inspired";
const LBPH = "light-blue-pour-homme-inspired";

test("SR-21 — only Oud Wood rendered; 'Vanilla 28 Inspired removes …' is left unchanged", () => {
  assert.ok(mkcCatalogue.some((f) => f.slug === V28), "vanilla-28-inspired missing");
  const raw = `[PRODUCT:${OUD}] is an alternative; ${name(V28)} removes the sweetness almost entirely.`;
  const out = run(raw, [frag(OUD)]);
  assert.equal(out.content, `${name(OUD)} is an alternative; ${name(V28)} removes the sweetness almost entirely.`);
});

test("SR-22 — two named candidates with different scores ('… are alternatives, removing …') are left unchanged", () => {
  assert.notEqual(k(OUD).sweetness, k(SW2).sweetness);
  const raw = `[PRODUCT:${OUD}] and [PRODUCT:${SW2}] are alternatives, removing the sweetness almost entirely.`;
  const out = run(raw, [frag(OUD), frag(SW2)]);
  assert.equal(out.content, `${name(OUD)} and ${name(SW2)} are alternatives, removing the sweetness almost entirely.`);
});

test("SR-23 — a bare rendered name inside a longer fragrance name does not attribute the claim", () => {
  assert.ok(k(LB).sweetness < k(BR540).sweetness, `premise: ${LB} must be below the anchor for this check to be meaningful`);
  const raw = `[PRODUCT:${LB}] is bright. ${name(LBPH)} removes the sweetness almost entirely.`;
  const out = run(raw, [frag(LB)]);
  assert.equal(out.content, `${name(LB)} is bright. ${name(LBPH)} removes the sweetness almost entirely.`);
});

test("SR-24 — a coordinated subject with a singular verb is left unchanged", () => {
  const raw = `[PRODUCT:${SW2}] and [PRODUCT:${OUD}] removes the sweetness almost entirely.`;
  const out = run(raw, [frag(SW2), frag(OUD)]);
  assert.ok(out.content.endsWith("removes the sweetness almost entirely."), out.content);
});

test("SR-25 — complete observed live sentence: shared subject after 'but' is corrected, warmth clause kept", () => {
  assert.equal(k(OUD).warmth, 4, "premise: Oud Wood warmth 4/5");
  const raw = `[PRODUCT:${OUD}] keeps some warmth (4/5) but removes the sweetness almost entirely (1/5).`;
  const out = run(raw, [frag(OUD), frag(SAUV)]);
  assert.equal(out.content, `${name(OUD)} keeps some warmth (4/5) but has lower sweetness (1/5) than ${A} (3/5).`);
});

test("SR-26 — a non-rendered fragrance as the subject after 'but' does not borrow Oud Wood's score", () => {
  const raw = `[PRODUCT:${OUD}] keeps some warmth (4/5) but ${name(V28)} removes the sweetness almost entirely.`;
  const out = run(raw, [frag(OUD)]);
  assert.equal(out.content, `${name(OUD)} keeps some warmth (4/5) but ${name(V28)} removes the sweetness almost entirely.`);
});

test("SR-27 — a different rendered fragrance as the subject after 'but' gets its own score, not Oud Wood's", () => {
  const raw = `[PRODUCT:${OUD}] keeps some warmth (4/5) but [PRODUCT:${SW2}] removes the sweetness almost entirely.`;
  const out = run(raw, [frag(OUD), frag(SW2)]);
  assert.ok(out.content.endsWith(`but ${name(SW2)} has lower sweetness (2/5) than ${A} (3/5).`), out.content);
  assert.ok(!out.content.includes("(1/5)"), out.content);
});

test("SR-28 — a pronoun subject after 'but' is left unchanged", () => {
  const raw = `[PRODUCT:${OUD}] keeps some warmth (4/5) but it removes the sweetness almost entirely.`;
  const out = run(raw, [frag(OUD)]);
  assert.equal(out.content, `${name(OUD)} keeps some warmth (4/5) but it removes the sweetness almost entirely.`);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
