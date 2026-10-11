/**
 * Anchor-contrast absence claims.
 * Observed (post-543c0bb, BR540 "less sweet" recommendation):
 *   Sauvage:  "It's confident and magnetic without any of the amber-tonka warmth that makes
 *              Baccarat Rouge so indulgent."
 *   Oud Wood: "Cardamom and Oud create warmth and luxury without the caramel-vanilla sweetness
 *              of Baccarat Rouge — it's polished and refined instead."
 * The context supplies only BR540's name and sweetness score (no notes); BR540's catalogue notes
 * list no tonka, caramel or vanilla. Sauvage warmth is 3/5 (not absent); Oud Wood lists Vanilla.
 *
 * Exercises the real planResponse → formatResponse path with canned model output (no LLM call).
 *
 * Run: npx tsx scripts/factory/__tests__/anchor-contrast-absence.test.ts
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
type Frag = typeof mkcCatalogue[number];
const k = (slug: string) => mkcCatalogue.find((f) => f.slug === slug)!;
for (const s of [BR540, OUD, SAUV, TDH]) if (!mkcCatalogue.some((f) => f.slug === s)) { console.error(`${s} missing — aborting`); process.exit(1); }
const name = (slug: string) => k(slug).name;
const A = name(BR540);
const LIVE_CARDS = [SAUV, TDH, OUD];

const META = {
  anchorSlug: BR540, anchorName: A, dimension: "sweetness", direction: "less", anchorScore: k(BR540).sweetness,
  anchorDimScores: { sweetness: k(BR540).sweetness, freshness: k(BR540).freshness, warmth: k(BR540).warmth, intensity: k(BR540).intensity, versatility: k(BR540).versatility },
  strictMatches: true, catalogueBoundary: false,
};
const ANCHORED_PLAN = {
  action: "anchored_refinement", requiresRetrieval: true, requiresClarification: false,
  requiresComparison: false, reuseRecommendations: false, nextIntent: "anchored_refinement",
} as ConversationPlan;

function run(raw: string, frags: Frag[], opts: { meta?: unknown } = {}) {
  const r = { fragrances: frags, articles: [], collectionName: "Skye", anchoredMeta: opts.meta === undefined ? META : opts.meta } as unknown as RetrievalContext;
  return formatResponse(planResponse(raw, "anchored_refinement", r, ANCHORED_PLAN));
}
const frags = (...slugs: string[]) => slugs.map(k);
const withoutWarmth = (slug: string) => ({ ...k(slug), warmth: undefined }) as unknown as Frag;

const SAUV_OBS = "It's confident and magnetic without any of the amber-tonka warmth that makes Baccarat Rouge so indulgent.";
const OUD_OBS  = "Cardamom and Oud create warmth and luxury without the caramel-vanilla sweetness of Baccarat Rouge — it's polished and refined instead.";

test("AC-00 — fixture premise: BR540 notes lack tonka/caramel/vanilla; scores as recorded", () => {
  const br = k(BR540);
  const brText = [...br.notes.top, ...br.notes.heart, ...br.notes.base, br.description ?? "", br.mood].join(" ");
  assert.ok(!/tonka|caramel|vanilla/i.test(brText), "BR540 record mentions tonka/caramel/vanilla");
  assert.ok(k(OUD).notes.base.includes("Vanilla"));
  assert.equal(br.sweetness, 3); assert.equal(br.warmth, 4);
  assert.equal(k(SAUV).warmth, 3); assert.equal(k(SAUV).sweetness, 1);
  assert.equal(k(OUD).sweetness, 1); assert.equal(k(OUD).warmth, 4);
});

test("AC-01 — observed Sauvage sentence: pronoun subject attributed via its paragraph, warmth scores attached", () => {
  const out = run(`[PRODUCT:${SAUV}] is the freshest of the three. ${SAUV_OBS}`, frags(SAUV));
  assert.equal(out.content, `${name(SAUV)} is the freshest of the three. It's confident and magnetic with lower warmth (3/5) than ${A} (4/5).`);
});

test("AC-02 — observed Oud Wood sentence: sweetness scores attached, trailing contrast clause kept", () => {
  const out = run(`[PRODUCT:${OUD}] brings depth. ${OUD_OBS}`, frags(OUD));
  assert.equal(out.content,
    `${name(OUD)} brings depth. Cardamom and Oud create warmth and luxury with lower sweetness (1/5) than ${A} (3/5) — it's polished and refined instead.`);
});

test("AC-03 — three-card recommendation: each paragraph uses its own candidate; paragraphs and cards preserved", () => {
  const raw =
    `[PRODUCT:${SAUV}] has low sweetness at 1/5. ${SAUV_OBS}\n\n` +
    `[PRODUCT:${TDH}] has low sweetness at 1/5 with mineral vetiver.\n\n` +
    `[PRODUCT:${OUD}] has low sweetness at 1/5. ${OUD_OBS}`;
  const out = run(raw, frags(...LIVE_CARDS));
  assert.equal(out.content,
    `${name(SAUV)} has low sweetness at 1/5. It's confident and magnetic with lower warmth (3/5) than ${A} (4/5).\n\n` +
    `${name(TDH)} has low sweetness at 1/5 with mineral vetiver.\n\n` +
    `${name(OUD)} has low sweetness at 1/5. Cardamom and Oud create warmth and luxury with lower sweetness (1/5) than ${A} (3/5) — it's polished and refined instead.`);
  assert.deepEqual(out.fragrances.map((f) => f.slug), LIVE_CARDS);
});

test("AC-04 — a rendered candidate named in the sentence takes precedence over the paragraph's candidate", () => {
  const raw = `[PRODUCT:${OUD}] is rich. [PRODUCT:${SAUV}] is fresh without any of the amber-tonka warmth that makes Baccarat Rouge so indulgent.`;
  const out = run(raw, frags(OUD, SAUV));
  assert.ok(out.content.endsWith(`${name(SAUV)} is fresh with lower warmth (3/5) than ${A} (4/5).`), out.content);
});

test("AC-04b — a non-rendered fragrance named in the sentence does not borrow the paragraph candidate's score", () => {
  const raw = `[PRODUCT:${SAUV}] is bright. ${name(OUD)} is rich without any of the amber-tonka warmth that makes Baccarat Rouge so indulgent.`;
  const out = run(raw, frags(SAUV));
  assert.equal(out.content, `${name(SAUV)} is bright. ${name(OUD)} is rich without any of the amber-tonka warmth that makes Baccarat Rouge so indulgent.`);
});

test("AC-05 — full anchor name is consumed whole", () => {
  const out = run(`[PRODUCT:${OUD}] is smoky, without the sweetness of ${A}.`, frags(OUD));
  assert.equal(out.content, `${name(OUD)} is smoky, with lower sweetness (1/5) than ${A} (3/5).`);
});

test("AC-06 — ambiguous attribution (paragraph names two candidates, pronoun subject) is left unchanged", () => {
  const raw = `[PRODUCT:${SAUV}] and [PRODUCT:${OUD}] are both dry. ${SAUV_OBS}`;
  const out = run(raw, frags(SAUV, OUD));
  assert.ok(out.content.endsWith(SAUV_OBS), out.content);
});

test("AC-07 — candidate not lower than the anchor on that dimension is left unchanged", () => {
  const raw = `[PRODUCT:${OUD}] is rich. It's polished without the smoky warmth of Baccarat Rouge.`;   // 4/5 vs 4/5
  const out = run(raw, frags(OUD));
  assert.equal(out.content, `${name(OUD)} is rich. It's polished without the smoky warmth of Baccarat Rouge.`);
});

test("AC-08 — missing candidate score is left unchanged (no borrowed or shared score)", () => {
  const out = run(`[PRODUCT:${SAUV}] is bright. ${SAUV_OBS}`, [withoutWarmth(SAUV)]);
  assert.equal(out.content, `${name(SAUV)} is bright. ${SAUV_OBS}`);
});

test("AC-09 — missing anchor dimension scores leave the phrase unchanged", () => {
  const out = run(`[PRODUCT:${SAUV}] is bright. ${SAUV_OBS}`, frags(SAUV), { meta: { ...META, anchorDimScores: undefined } });
  assert.equal(out.content, `${name(SAUV)} is bright. ${SAUV_OBS}`);
});

test("AC-10 — quoted text is preserved (punctuation inside the quote)", () => {
  for (const q of [
    `"Warm without the caramel-vanilla sweetness of Baccarat Rouge."`,
    `“Warm without the caramel-vanilla sweetness of Baccarat Rouge.”`,
  ]) {
    const out = run(`The brief read ${q} [PRODUCT:${OUD}] fits.`, frags(OUD));
    assert.equal(out.content, `The brief read ${q} ${name(OUD)} fits.`);
  }
});

test("AC-11 — guest preferences and negations are preserved", () => {
  for (const s of [
    `Since you prefer warmth without the caramel-vanilla sweetness of Baccarat Rouge, consider it.`,
    `It cannot be called smoky without the caramel-vanilla sweetness of Baccarat Rouge.`,
    `It isn’t confident without any of the amber-tonka warmth that makes Baccarat Rouge so indulgent.`,
  ]) {
    const out = run(`[PRODUCT:${OUD}] is here. ${s}`, frags(OUD));
    assert.equal(out.content, `${name(OUD)} is here. ${s}`);
  }
});

test("AC-12 — no anchor reference, other targets, other 'without' wording and continuations are unchanged", () => {
  for (const s of [
    `It's confident and magnetic without any of the amber-tonka warmth.`,
    `It's warm without the caramel-vanilla sweetness of a dessert fragrance.`,
    `Cardamom and Chinese Pepper build warmth without aggression.`,
    `It's dry without the caramel-vanilla sweetness of Baccarat Rouge and its saffron glow.`,
    `It's dry without the caramel-vanilla sweetness of ${name("baccarat-rouge-540-extrait-inspired")}.`,
  ]) {
    const out = run(`[PRODUCT:${OUD}] is here. ${s}`, frags(OUD));
    assert.equal(out.content, `${name(OUD)} is here. ${s}`);
  }
});

test("AC-13 — turns without strict anchored metadata are unchanged", () => {
  const raw = `[PRODUCT:${SAUV}] is bright. ${SAUV_OBS}`;
  const out = run(raw, frags(SAUV), { meta: null });
  assert.equal(out.content, `${name(SAUV)} is bright. ${SAUV_OBS}`);
});

test("AC-14 — paragraph fallback rejected when the paragraph names a non-rendered fragrance (observed amber-tonka claim)", () => {
  const raw = `[PRODUCT:${SAUV}] is the freshest option. ${name(OUD)} is richer and smokier. ${SAUV_OBS}`;
  const out = run(raw, frags(SAUV));
  assert.equal(out.content, `${name(SAUV)} is the freshest option. ${name(OUD)} is richer and smokier. ${SAUV_OBS}`);
});

test("AC-15 — a sentence describing the anchor itself does not borrow an earlier candidate's score", () => {
  for (const s of [
    `${A} is airy without the heavy sweetness of Baccarat Rouge.`,
    `Baccarat Rouge itself stays luminous, without any of the amber-tonka warmth that makes Baccarat Rouge so indulgent.`,
  ]) {
    const out = run(`[PRODUCT:${SAUV}] is the freshest option. ${s}`, frags(SAUV));
    assert.equal(out.content, `${name(SAUV)} is the freshest option. ${s}`);
  }
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
