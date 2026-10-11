/**
 * Unsupported "without gourmand sweetness" qualifier.
 * Observed (post-059a711, BR540 "less sweet" turn):
 *   "Cardamom and Chinese Pepper create warmth without gourmand sweetness."
 * Oud Wood's context says "creating warmth without aggression"; no prompt-visible field
 * mentions "gourmand", and its listed base notes include Tonka Bean and Vanilla. A 1/5
 * sweetness score establishes neither presence nor absence of gourmand character.
 *
 * Exercises the real planResponse → formatResponse path with canned model output (no LLM call).
 *
 * Run: npx tsx scripts/factory/__tests__/gourmand-absence.test.ts
 */
import assert from "node:assert/strict";
import { planResponse } from "../../../app/lib/concierge/responsePlanner";
import { formatResponse } from "../../../app/lib/concierge/responseFormatter";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const BR540 = "baccarat-rouge-540-inspired";
const OUD   = "oud-wood-inspired";
const SAUV  = "sauvage-inspired";
const TDH   = "terre-d'hermes-inspired";
const k = (slug: string) => mkcCatalogue.find((f) => f.slug === slug)!;
for (const s of [BR540, OUD, SAUV, TDH]) if (!mkcCatalogue.some((f) => f.slug === s)) { console.error(`${s} missing — aborting`); process.exit(1); }
const name = (slug: string) => k(slug).name;
const A = name(BR540);
const LIVE_CARDS = [SAUV, TDH, OUD];
// A record whose description mentions "gourmand" (support guard fixture).
const GDESC = mkcCatalogue.find((f) => /gourmand/i.test(f.description ?? ""))!.slug;

const META = {
  anchorSlug: BR540, anchorName: A, dimension: "sweetness", direction: "less", anchorScore: k(BR540).sweetness,
  anchorDimScores: { sweetness: k(BR540).sweetness, freshness: k(BR540).freshness, warmth: k(BR540).warmth, intensity: k(BR540).intensity, versatility: k(BR540).versatility },
  strictMatches: true, catalogueBoundary: false,
};
const ANCHORED_PLAN = {
  action: "anchored_refinement", requiresRetrieval: true, requiresClarification: false,
  requiresComparison: false, reuseRecommendations: false, nextIntent: "anchored_refinement",
} as ConversationPlan;

function run(raw: string, slugs: string[], opts: { meta?: unknown } = {}) {
  const r = { fragrances: slugs.map(k), articles: [], collectionName: "Skye", anchoredMeta: opts.meta === undefined ? META : opts.meta } as unknown as RetrievalContext;
  return formatResponse(planResponse(raw, "anchored_refinement", r, ANCHORED_PLAN));
}
const OBS = "Cardamom and Chinese Pepper create warmth without gourmand sweetness.";

test("GA-00 — fixture premise: no live-turn card mentions 'gourmand'; Oud Wood source says 'warmth without aggression'", () => {
  for (const s of LIVE_CARDS) {
    const f = k(s);
    const visible = [f.description, f.mood, ...f.recommendedFor.slice(0, 2), ...f.family].join(" ");
    assert.ok(!/gourmand/i.test(visible), `${s} mentions gourmand`);
  }
  assert.ok(k(OUD).description!.includes("Cardamom and Chinese Pepper creating warmth without aggression"));
  assert.ok(k(OUD).notes.base.includes("Tonka Bean") && k(OUD).notes.base.includes("Vanilla"));
  assert.equal(k(OUD).sweetness, 1);
});

test("GA-01 — observed live sentence: unsupported qualifier removed, supported clause kept", () => {
  const raw = `[PRODUCT:${OUD}] is the deepest of the three. ${OBS}`;
  const out = run(raw, [OUD]);
  assert.equal(out.content, `${name(OUD)} is the deepest of the three. Cardamom and Chinese Pepper create warmth.`);
});

test("GA-02 — three cards, separate paragraphs, scores and card order preserved", () => {
  const raw =
    `[PRODUCT:${SAUV}] has low sweetness at 1/5 with bright bergamot.\n\n` +
    `[PRODUCT:${TDH}] has low sweetness at 1/5 with mineral vetiver.\n\n` +
    `[PRODUCT:${OUD}] keeps some warmth (4/5) at sweetness 1/5. ${OBS}`;
  const out = run(raw, LIVE_CARDS);
  assert.equal(out.content,
    `${name(SAUV)} has low sweetness at 1/5 with bright bergamot.\n\n` +
    `${name(TDH)} has low sweetness at 1/5 with mineral vetiver.\n\n` +
    `${name(OUD)} keeps some warmth (4/5) at sweetness 1/5. Cardamom and Chinese Pepper create warmth.`);
  assert.deepEqual(out.fragrances.map((f) => f.slug), LIVE_CARDS);
});

test("GA-03 — 'any' form and a comma continuation are corrected without stranding punctuation", () => {
  const out = run(`[PRODUCT:${OUD}] builds warmth without any gourmand sweetness, then settles into oud.`, [OUD]);
  assert.equal(out.content, `${name(OUD)} builds warmth, then settles into oud.`);
});

test("GA-04 — guest preferences are preserved", () => {
  for (const raw of [
    `Since you prefer warmth without gourmand sweetness, consider [PRODUCT:${OUD}].`,
    `You want something warm without gourmand sweetness. [PRODUCT:${OUD}] is one option.`,
    `If you'd rather have warmth without gourmand sweetness, [PRODUCT:${OUD}] fits.`,
  ]) {
    const out = run(raw, [OUD]);
    assert.ok(out.content.includes("without gourmand sweetness"), out.content);
  }
});

test("GA-05 — negations are preserved", () => {
  for (const raw of [
    `[PRODUCT:${OUD}] is not without gourmand sweetness.`,
    `[PRODUCT:${OUD}] never feels warm without gourmand sweetness.`,
  ]) {
    const out = run(raw, [OUD]);
    assert.ok(out.content.includes("without gourmand sweetness"), out.content);
  }
});

test("GA-06 — quoted text is preserved (double, curly, single) with punctuation inside the quote", () => {
  // Punctuation after "sweetness" sits inside the quotation, so the removal regex matches;
  // no negation or preference word is present, so only the quote guard can preserve it.
  for (const q of [
    `"Warm without gourmand sweetness."`,
    `“Warm without gourmand sweetness,” `,
    `'Warm without gourmand sweetness!'`,
  ]) {
    const raw = `The brief read ${q.trimEnd()} [PRODUCT:${OUD}] fits.`;
    const out = run(raw, [OUD]);
    assert.equal(out.content, `The brief read ${q.trimEnd()} ${name(OUD)} fits.`);
  }
});

test("GA-13 — 'cannot', \"can't\" and 'can’t' negations are preserved", () => {
  for (const neg of ["cannot", "can't", "can’t"]) {
    const raw = `[PRODUCT:${OUD}] ${neg} create warmth without gourmand sweetness.`;
    const out = run(raw, [OUD]);
    assert.equal(out.content, `${name(OUD)} ${neg} create warmth without gourmand sweetness.`);
  }
});

test("GA-07 — non-clause-boundary continuation is left unchanged", () => {
  const out = run(`[PRODUCT:${OUD}] builds warmth without gourmand sweetness or heaviness.`, [OUD]);
  assert.equal(out.content, `${name(OUD)} builds warmth without gourmand sweetness or heaviness.`);
});

test("GA-08 — a linking or function word before the phrase is left unchanged", () => {
  for (const raw of [
    `The drydown of [PRODUCT:${OUD}] is without gourmand sweetness.`,
    `[PRODUCT:${OUD}] is woody and without gourmand sweetness.`,
  ]) {
    const out = run(raw, [OUD]);
    assert.ok(out.content.includes("without gourmand sweetness"), out.content);
  }
});

test("GA-09 — a fragrance in context that mentions 'gourmand' leaves the phrase unchanged", () => {
  const raw = `[PRODUCT:${OUD}] and [PRODUCT:${GDESC}] differ. ${OBS}`;
  const out = run(raw, [OUD, GDESC]);
  assert.ok(out.content.endsWith(OBS), out.content);
});

test("GA-10 — no rendered cards (no-match) leaves the text unchanged", () => {
  const out = run(`Nothing matched exactly. ${OBS}`, []);
  assert.equal(out.content, `Nothing matched exactly. ${OBS}`);
});

test("GA-11 — supported 'without' wording and other gourmand phrasing are unchanged", () => {
  const raw = `[PRODUCT:${OUD}] builds warmth without aggression. It is not a gourmand fragrance in our catalogue family list.`;
  const out = run(raw, [OUD]);
  assert.equal(out.content, `${name(OUD)} builds warmth without aggression. It is not a gourmand fragrance in our catalogue family list.`);
});

test("GA-12 — applies without strict anchored metadata too (claim is unsupported on any turn)", () => {
  const out = run(`[PRODUCT:${OUD}] is smoky. ${OBS}`, [OUD], { meta: null });
  assert.equal(out.content, `${name(OUD)} is smoky. Cardamom and Chinese Pepper create warmth.`);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
