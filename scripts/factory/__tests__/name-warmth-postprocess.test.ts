/**
 * Response post-processing regressions:
 *   A. Adjacent duplicated fragrance names left by marker substitution
 *      (observed: "Beautiful by Estée Lauder Inspired Beautiful by Estée Lauder Inspired opens with…").
 *   B. "without any amber warmth" for a fragrance whose catalogue warmth is scored
 *      (observed: Terre d'Hermès "refinement and complexity without any amber warmth").
 *
 * Exercises the real planResponse → formatResponse path with canned model output (no LLM call).
 *
 * Run: npx tsx scripts/factory/__tests__/name-warmth-postprocess.test.ts
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

const B     = "beautiful-by-estee-lauder-inspired";
const TERRE = "terre-d'hermes-inspired";
const BR540 = "baccarat-rouge-540-inspired";
const SAUV  = "sauvage-inspired";
const OUD   = "oud-wood-inspired";
const LB    = "light-blue-inspired";
const LBPH  = "light-blue-pour-homme-inspired";
for (const s of [B, TERRE, BR540, SAUV, OUD, LB, LBPH]) {
  if (!mkcCatalogue.some((f) => f.slug === s)) { console.error(`${s} missing from catalogue — aborting`); process.exit(1); }
}
const name = (slug: string) => mkcCatalogue.find((f) => f.slug === slug)!.name;
const count = (hay: string, needle: string) => hay.split(needle).length - 1;

const PLAN = {
  action: "new_search", requiresRetrieval: true, requiresClarification: false,
  requiresComparison: false, reuseRecommendations: false, nextIntent: "general_discovery",
} as ConversationPlan;

function retrieval(slugs: string[], extra: Partial<RetrievalContext> = {}): RetrievalContext {
  return {
    fragrances: slugs.map((s) => mkcCatalogue.find((f) => f.slug === s)!),
    articles: [], collectionName: "Rose", ...extra,
  } as unknown as RetrievalContext;
}

function run(raw: string, slugs: string[], intent: ConversationIntent = "similar_to", plan = PLAN, extra: Partial<RetrievalContext> = {}) {
  return formatResponse(planResponse(raw, intent, retrieval(slugs, extra), plan));
}

console.log("\n── A. Adjacent duplicated fragrance names ────────────────────────");

test("NM-01 — observed case: accented name beside marker renders the name once", () => {
  const out = run(`Beautiful by Estée Lauder Inspired [PRODUCT:${B}] opens with rose and mandarin.`, [B, SAUV]);
  assert.equal(out.content, `${name(B)} opens with rose and mandarin.`);
});

test("NM-02 — marker before accented name renders the name once", () => {
  const out = run(`[PRODUCT:${B}] Beautiful by Estée Lauder Inspired opens with rose and mandarin.`, [B, SAUV]);
  assert.equal(out.content, `${name(B)} opens with rose and mandarin.`);
});

test("NM-03 — bold marker before exact canonical name renders the name once", () => {
  const out = run(`**[PRODUCT:${B}]** ${name(B)} opens with rose and mandarin.`, [B, SAUV]);
  assert.equal(out.content, `${name(B)} opens with rose and mandarin.`);
});

test("NM-04 — fully accented double (both variants) collapses to one canonical name", () => {
  // Single-candidate retrieval supplies the card (no marker, so no extra substituted mention).
  const out = run(`Beautiful by Estée Lauder Inspired Beautiful by Estée Lauder Inspired opens with rose.`, [B]);
  assert.equal(out.content, `${name(B)} opens with rose.`);
  assert.deepEqual(out.fragrances.map((f) => f.slug), [B]);
});

test("NM-05 — curly-apostrophe / accented Terre d’Hermès beside its marker renders once", () => {
  const out = run(`Terre d’Hermès Inspired [PRODUCT:${TERRE}] is mineral and woody.`, [TERRE, SAUV]);
  assert.equal(out.content, `${name(TERRE)} is mineral and woody.`);
});

test("NM-06 — a legitimate later mention of the same fragrance is preserved", () => {
  const out = run(`[PRODUCT:${B}] opens with rose. Many guests return to ${name(B)} for weddings.`, [B, SAUV]);
  assert.equal(count(out.content, name(B)), 2, out.content);
});

test("NM-07 — distinct adjacent names (one a prefix of the other) are not collapsed", () => {
  const out = run(`Try [PRODUCT:${LB}] [PRODUCT:${LBPH}] for summer.`, [LB, LBPH]);
  assert.ok(out.content.includes(`${name(LB)} ${name(LBPH)}`), out.content);
});

test("NM-08 — the same name across a paragraph break is not collapsed", () => {
  const out = run(`${name(B)}\n\n${name(B)} opens with rose.`, [B]);
  assert.equal(out.content, `${name(B)}\n\n${name(B)} opens with rose.`);
  assert.ok(out.content.includes("\n\n"), "paragraph break lost");
});

test("NM-09 — three-fragrance deterministic comparison keeps 3 cards and separate paragraphs", () => {
  const cmpPlan = { ...PLAN, action: "comparison", requiresComparison: true, reuseRecommendations: true, nextIntent: "comparison" } as ConversationPlan;
  const out = run(`[PRODUCT:${SAUV}] vs [PRODUCT:${TERRE}] vs [PRODUCT:${OUD}]`, [SAUV, TERRE, OUD], "comparison", cmpPlan,
    { comparisonCandidateSlugs: [SAUV, TERRE, OUD], cardTarget: 3 } as Partial<RetrievalContext>);
  assert.deepEqual(out.fragrances.map((f) => f.slug), [SAUV, TERRE, OUD]);
  const paragraphs = out.content.split("\n\n");
  for (const s of [SAUV, TERRE, OUD]) {
    assert.ok(paragraphs.some((p) => p.startsWith(name(s))), `no paragraph for ${name(s)}`);
  }
  assert.ok(paragraphs.length >= 4, `expected separate paragraphs, got ${paragraphs.length}`);
});

console.log("\n── B. 'Amber warmth' absence claims ──────────────────────────────");

const score = (slug: string) => mkcCatalogue.find((f) => f.slug === slug)!.warmth;
// Corrected output must never assert amber absence.
const assertsAmberAbsence = (s: string) => /amber note|without (?:an?|any) amber\b|\bno amber\b(?! warmth)/i.test(s);

test("AW-01 — observed case: Terre d'Hermes phrase becomes its actual warmth score", () => {
  const out = run(`[PRODUCT:${TERRE}] brings refinement and complexity without any amber warmth.`, [TERRE, SAUV]);
  assert.equal(out.content, `${name(TERRE)} brings refinement and complexity with warmth rated ${score(TERRE)}/5.`);
  assert.equal(score(TERRE), 3, "Terre warmth fixture changed");
  assert.ok(!/amber/i.test(out.content) && !assertsAmberAbsence(out.content), out.content);
});

test("AW-02 — score comes from the attributed candidate (BR540 → its own 4/5)", () => {
  const out = run(`[PRODUCT:${BR540}] is luminous without any amber warmth.`, [BR540, SAUV]);
  assert.equal(score(BR540), 4, "BR540 warmth fixture changed");
  assert.ok(out.content.includes(`luminous with warmth rated ${score(BR540)}/5`), out.content);
  assert.ok(!assertsAmberAbsence(out.content), out.content);
});

test("AW-03 — 'no amber warmth' form uses the candidate score without asserting absence", () => {
  const out = run(`[PRODUCT:${TERRE}] has no amber warmth, just mineral calm.`, [TERRE]);
  assert.ok(out.content.includes(`has warmth rated ${score(TERRE)}/5, just mineral calm.`), out.content);
  assert.ok(!assertsAmberAbsence(out.content), out.content);
});

test("AW-04 — missing warmth score leaves the phrase unchanged", () => {
  const terreNoScore = { ...mkcCatalogue.find((f) => f.slug === TERRE)!, warmth: undefined } as unknown as typeof mkcCatalogue[number];
  const r = { fragrances: [terreNoScore], articles: [], collectionName: "Skye" } as unknown as RetrievalContext;
  const out = formatResponse(planResponse(`[PRODUCT:${TERRE}] is refined without any amber warmth.`, "similar_to", r, PLAN));
  assert.ok(out.content.includes("without any amber warmth"), out.content);
});

test("AW-05 — ambiguous attribution (two rendered fragrances, unnamed) is left unchanged", () => {
  const out = run(`Both [PRODUCT:${TERRE}] and [PRODUCT:${SAUV}] work. Each offers polish without any amber warmth.`, [TERRE, SAUV]);
  assert.ok(out.content.includes("without any amber warmth"), out.content);
});

test("AW-06 — accented name in prose still attributes the claim to Terre", () => {
  const out = run(`[PRODUCT:${SAUV}] is bold.\n\nTerre d’Hermès Inspired is calmer, without any amber warmth. [PRODUCT:${TERRE}]`, [SAUV, TERRE]);
  assert.ok(out.content.includes(`calmer, with warmth rated ${score(TERRE)}/5.`), out.content);
});

test("AW-09 — negations and preferences (plain and quoted) are preserved", () => {
  const raw = `[PRODUCT:${TERRE}] is not without any amber warmth. Since you prefer no amber warmth, it suits you. ` +
    `You said "no amber warmth" matters, and you want “without any amber warmth” too.`;
  const out = run(raw, [TERRE]);
  for (const kept of ["not without any amber warmth", "prefer no amber warmth", `"no amber warmth"`, "“without any amber warmth”"]) {
    assert.ok(out.content.includes(kept), `lost "${kept}": ${out.content}`);
  }
  assert.ok(!out.content.includes("warmth rated"), out.content);
});

test("AW-10 — no corrected output across all cases asserts amber absence", () => {
  const cases: Array<[string, string[]]> = [
    [`[PRODUCT:${TERRE}] brings refinement without any amber warmth.`, [TERRE, SAUV]],
    [`[PRODUCT:${TERRE}] has zero amber warmth.`, [TERRE]],
    [`[PRODUCT:${BR540}] offers no amber warmth.`, [BR540]],
    [`[PRODUCT:${TERRE}] is refined without the amber warmth.`, [TERRE]],
  ];
  for (const [raw, pool] of cases) {
    const out = run(raw, pool);
    assert.ok(out.content.includes("warmth rated"), `not corrected: ${out.content}`);
    assert.ok(!assertsAmberAbsence(out.content) && !/amber/i.test(out.content), `amber absence/claim in: ${out.content}`);
  }
});

test("AW-11 — phrase inside double-quoted customer text (not at the quote start) is preserved", () => {
  const raw = `[PRODUCT:${TERRE}] is a strong choice. You said "I need something without any amber warmth".`;
  const out = run(raw, [TERRE]);
  assert.ok(out.content.includes(`You said "I need something without any amber warmth".`), out.content);
  assert.ok(!out.content.includes("warmth rated"), out.content);
});

test("AW-12 — phrase inside single-quoted customer text is preserved", () => {
  const raw = `[PRODUCT:${TERRE}] is a strong choice. You said 'no amber warmth'.`;
  const out = run(raw, [TERRE]);
  assert.ok(out.content.includes(`You said 'no amber warmth'.`), out.content);
  assert.ok(!out.content.includes("warmth rated"), out.content);
});

test("AW-13 — only Terre rendered; a separate BR540 paragraph does not receive Terre's score", () => {
  const raw = `[PRODUCT:${TERRE}] is mineral and woody.\n\n${name(BR540)} feels opulent without any amber warmth.`;
  const out = run(raw, [TERRE]);
  assert.deepEqual(out.fragrances.map((f) => f.slug), [TERRE]);
  assert.ok(out.content.includes(`${name(BR540)} feels opulent without any amber warmth.`), out.content);
  assert.ok(!out.content.includes(`warmth rated ${score(TERRE)}/5`), out.content);
});

test("AW-14 — apostrophes (d'Hermes, isn't) are not treated as quotation marks", () => {
  const raw = `[PRODUCT:${TERRE}] isn't heavy; it is refined without any amber warmth.`;
  const out = run(raw, [TERRE]);
  assert.ok(out.content.includes(`refined with warmth rated ${score(TERRE)}/5.`), out.content);
});

test("AW-07 — supported note descriptions and unrelated 'without' phrases are unchanged", () => {
  const raw = `[PRODUCT:${TERRE}] rests on a warm Benzoin base, vivid without sharpness and refined without heaviness.`;
  const out = run(raw, [TERRE]);
  assert.equal(out.content, `${name(TERRE)} rests on a warm Benzoin base, vivid without sharpness and refined without heaviness.`);
});

test("AW-08 — no-match anchored response is unchanged (no cards, deterministic message)", () => {
  const meta = { anchorName: name(SAUV), anchorSlug: SAUV, dimension: "sweetness", direction: "less", anchorScore: 1, strictMatches: false, catalogueBoundary: true };
  const out = run(`[PRODUCT:${TERRE}] without any amber warmth.`, [TERRE], "anchored_refinement",
    { ...PLAN, action: "anchored_refinement", nextIntent: "anchored_refinement" } as ConversationPlan,
    { anchoredMeta: meta } as unknown as Partial<RetrievalContext>);
  assert.equal(out.fragrances.length, 0);
  assert.ok(!/amber/i.test(out.content) && out.content.includes(name(SAUV)), out.content);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
