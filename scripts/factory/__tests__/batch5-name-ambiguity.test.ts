/**
 * Wave 9 Batch 5 conversational-name safety (W9-B5-P5A, 2026-10-15).
 *
 * "This Is Him" and "This Is Her" are also everyday phrases. With both drafts present,
 * product requests must resolve to them and gifting sentences ("this is her first perfume")
 * must not. The drafts are added to this test process's in-memory catalogue only — before
 * the resolver, shop search and Concierge modules load and index it. Nothing is written to
 * app/lib/mkc/native and the native registry is checked to be unchanged.
 *
 * Run: npx tsx scripts/factory/__tests__/batch5-name-ambiguity.test.ts
 */
import assert from "node:assert/strict";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import { nativeFragrances } from "../../../app/lib/mkc/native/index";
import { thisIsHimInspired } from "../drafts/this-is-him-inspired";
import { thisIsHerInspired } from "../drafts/this-is-her-inspired";

// ── Isolated test catalogue: drafts appended in memory before dependent modules load ──
const NATIVE_SIZE = nativeFragrances.size;
mkcCatalogue.push(thisIsHimInspired, thisIsHerInspired);

/* eslint-disable @typescript-eslint/no-require-imports */
const { resolveIntent, explicitSingleEntity, fragrancesNamedIn } =
  require("../../../app/lib/concierge/intentResolver") as typeof import("../../../app/lib/concierge/intentResolver");
const { findNamedFragrances, resolveShopQuery } =
  require("../../../app/lib/shopSearch") as typeof import("../../../app/lib/shopSearch");
const { catalogueMaps } = require("../../../app/lib/discovery") as typeof import("../../../app/lib/discovery");
const { planRetrieval, buildCachedRetrieval } =
  require("../../../app/lib/concierge/retrievalPlanner") as typeof import("../../../app/lib/concierge/retrievalPlanner");
const { planConversation, resolveAnchorSlug } =
  require("../../../app/lib/concierge/conversationPlanner") as typeof import("../../../app/lib/concierge/conversationPlanner");
const { buildContext } = require("../../../app/lib/concierge/contextBuilder") as typeof import("../../../app/lib/concierge/contextBuilder");
const { planResponse } = require("../../../app/lib/concierge/responsePlanner") as typeof import("../../../app/lib/concierge/responsePlanner");
const { formatResponse } = require("../../../app/lib/concierge/responseFormatter") as typeof import("../../../app/lib/concierge/responseFormatter");
/* eslint-enable @typescript-eslint/no-require-imports */
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import type { ConversationIntent, ConversationState } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e) { console.log(`  ✗  ${name}\n     ${(e as Error).message}`); failed++; }
}

const HIM = thisIsHimInspired.slug;
const HER = thisIsHerInspired.slug;
const BATCH5 = [HIM, HER];
const noBatch5 = (slugs: string[]) => slugs.filter((s) => BATCH5.includes(s));
const TITLE: Record<string, string> = { [HIM]: thisIsHimInspired.name, [HER]: thisIsHerInspired.name };
const shopTitles = (q: string) => findNamedFragrances(q).map((d) => d.title);

const STATE = {
  turns: [], profile: {}, context: {}, lastRecommendationSlugs: [], comparisonSlugs: [], clarificationTurnCount: 0,
} as unknown as ConversationState;

// Mirrors app/api/concierge/route.ts steps 1–8 for a fresh conversation (as single-product-cards.test.ts).
function respond(message: string, raw: string) {
  let plan: ConversationPlan = planConversation(message, STATE);
  let resolved: ReturnType<typeof resolveIntent> | undefined;
  if (!plan.requiresRetrieval && plan.action === "clarification") {
    const pre = resolveIntent(message, {});
    if (pre.entitySlug || pre.compareSlug.length >= 2) {
      plan = { ...plan, action: "new_search", requiresRetrieval: true, requiresClarification: false };
      resolved = pre;
    }
  }
  if (plan.requiresComparison && !plan.requiresRetrieval) {
    if (!resolved) resolved = resolveIntent(message, {});
    if (resolved.compareSlug.length >= 2) plan = { ...plan, requiresRetrieval: true };
  }
  let retrieval: RetrievalContext;
  if (plan.requiresRetrieval) {
    if (!resolved) resolved = resolveIntent(message, {});
    if (!plan.requiresComparison && resolved.intent === "comparison" && resolved.compareSlug.length >= 2) {
      plan = { ...plan, requiresComparison: true, action: "comparison" as const, nextIntent: "comparison" as const };
    }
    const ar = resolveAnchorSlug({ plan, entitySlug: resolved.entitySlug, compareSlugCount: resolved.compareSlug.length,
      currentAnchorSlug: undefined, resolvedOrdinalSlug: undefined, message });
    if (ar.upgradeToAnchored) plan = { ...plan, action: "anchored_refinement" as const, nextIntent: "anchored_refinement" as const, requiresRetrieval: true };
    if (plan.action === "anchored_refinement") resolved = { ...resolved, intent: "anchored_refinement" as const };
    retrieval = planRetrieval(resolved, {}, {}, undefined, undefined, null, undefined, message, ar.anchorSlug);
  } else {
    retrieval = buildCachedRetrieval(STATE, {});
  }
  const intent: ConversationIntent = resolved?.intent ?? plan.nextIntent;
  buildContext(retrieval, STATE, plan, intent, null, null, null, message);
  const out = formatResponse(planResponse(raw, intent, retrieval, plan, {}, explicitSingleEntity(message)));
  return { intent, retrieval, cards: out.fragrances.map((f) => f.slug), out };
}

console.log("\n── Isolated catalogue ────────────────────────────────────────────");

test("B5A-00 — drafts present in this process only; native registry unchanged", () => {
  assert.equal(mkcCatalogue.length, NATIVE_SIZE + 2);
  assert.equal(nativeFragrances.size, NATIVE_SIZE);
  assert.ok(!nativeFragrances.has(HIM) && !nativeFragrances.has(HER));
  assert.equal(catalogueMaps.bySlug.get(HIM)?.collection, "Skye");
  assert.equal(catalogueMaps.bySlug.get(HER)?.collection, "Rose");
  assert.equal(new Set(mkcCatalogue.map((k) => k.slug)).size, mkcCatalogue.length, "duplicate slug");
});

console.log("\n── Product requests resolve ──────────────────────────────────────");

const POSITIVE: Array<[string, string]> = [
  ["Tell me about This Is Him.", HIM],
  ["Tell me about This Is Her.", HER],
  ["Do you have This Is Her?", HER],
  ["I'm looking for This Is Him.", HIM],
  ["Can you recommend This Is Her?", HER],
  ["This Is Her Inspired", HER],
  ["This Is Him!", HIM],
  ["this is him", HIM],
  ["Tell me about This Is Him Inspired, please.", HIM],
];
POSITIVE.forEach(([q, slug], i) => test(`B5A-P${String(i + 1).padStart(2, "0")} — "${q}" → ${slug}`, () => {
  const r = resolveIntent(q, {});
  assert.equal(r.entitySlug, slug, `entity ${r.entitySlug}`);
  assert.equal(explicitSingleEntity(q), slug);
  const k = catalogueMaps.bySlug.get(slug)!;
  assert.equal(k.collection, slug === HIM ? "Skye" : "Rose");
  assert.equal(k.gender, slug === HIM ? "male" : "female");
}));

// W9-B5-P5B edge cases: product requests phrased as purchase / stock / show enquiries.
const POSITIVE_P5B: Array<[string, string]> = [
  ["Do you have This Is Her?", HER],
  ["Can I buy This Is Him?", HIM],
  ["Tell me about This Is Her.", HER],
  ["Show me This Is Her Inspired.", HER],
  ["Do you stock This Is Him?", HIM],
  ["I'm looking for This Is Her.", HER],
  ["Do you have This Is Her in 30ml?", HER],
];
POSITIVE_P5B.forEach(([q, slug], i) => test(`B5A-E${String(i + 1).padStart(2, "0")} — "${q}" → ${slug}`, () => {
  assert.equal(resolveIntent(q, {}).entitySlug, slug);
  assert.equal(explicitSingleEntity(q), slug);
}));
test('B5A-E08 — "This Is Him vs This Is Her." → comparison of both', () =>
  assert.deepEqual([...resolveIntent("This Is Him vs This Is Her.", {}).compareSlug].sort(), [HER, HIM]));

test('B5A-C01 — "Compare This Is Him and This Is Her." → comparison of both', () => {
  const r = resolveIntent("Compare This Is Him and This Is Her.", {});
  assert.deepEqual([...r.compareSlug].sort(), [HER, HIM]);
  assert.equal(r.intent, "comparison");
});
test('B5A-C02 — "This Is Him vs This Is Her" → comparison of both', () =>
  assert.deepEqual([...resolveIntent("This Is Him vs This Is Her", {}).compareSlug].sort(), [HER, HIM]));
test('B5A-C03 — "Which is better, Sauvage or This Is Him?" → Sauvage and This Is Him', () => {
  const named = fragrancesNamedIn("Which is better, Sauvage or This Is Him?");
  assert.ok(named.includes(HIM) && named.includes("sauvage-inspired"), JSON.stringify(named));
});

console.log("\n── Everyday phrases do not resolve ───────────────────────────────");

const NEGATIVE = [
  "This is her first perfume, what would you suggest?",
  "This is her birthday gift, something floral please.",
  "I think this is her style: warm and sweet.",
  "My husband loves woody scents, this is him all over.",
  "This is her favourite season.",
  "This is him speaking.",
  "Something for her.",
  "A gift for him.",
  "Is this for her?",
  "I love Sauvage and this is him all over.",
  "Do you have something for her? This is her first perfume.",
  "The smell of this is her favourite thing.",
  // W9-B5-P5B edge cases
  "Do you have this is her size?",
  "I want to know if this is her first perfume.",
  "Can you tell me if this is her favourite scent?",
  "I love this fragrance and this is her reaction.",
  "This is her first order.",
  "This is him speaking about his gift.",
  "I want something for her.",
  "Compare these scents for her.",
  "I want to buy this for her.",
];
NEGATIVE.forEach((q, i) => test(`B5A-N${String(i + 1).padStart(2, "0")} — "${q}"`, () => {
  const r = resolveIntent(q, {});
  assert.ok(!BATCH5.includes(r.entitySlug ?? ""), `entity ${r.entitySlug}`);
  assert.deepEqual(noBatch5(r.compareSlug), []);
  assert.deepEqual(noBatch5(fragrancesNamedIn(q)), []);
  assert.ok(!BATCH5.includes(explicitSingleEntity(q) ?? ""));
}));

test("B5A-NFLOW — gifting sentences still reach their normal flows (no entity at all)", () => {
  for (const q of NEGATIVE.slice(0, 9)) {
    const r = resolveIntent(q, {});
    assert.equal(r.entitySlug, undefined, `"${q}" → ${r.entitySlug}`);
    assert.deepEqual(r.compareSlug, [], q);
  }
});

console.log("\n── Downstream card selection ─────────────────────────────────────");

test("B5A-D01 — named enquiry: This Is Her card leads (reply uses the bare name, no marker)", () => {
  const { cards } = respond("Tell me about This Is Her.", "This Is Her is a floral woody: jasmine sambac and pink berry over chestnut, vanilla and sandalwood.");
  assert.deepEqual(cards, [HER]);
});
test("B5A-D02 — named enquiry: This Is Him card leads", () => {
  const { cards, out } = respond("Do you have This Is Him?", "Yes — This Is Him opens with black pepper and grapefruit before incense and vanilla.");
  assert.deepEqual(cards, [HIM]);
  assert.equal(out.fragrances[0].price, thisIsHimInspired.prices["10ml"]);
  assert.equal(out.fragrances[0].href, `/product/${HIM}`);
});
test("B5A-D03 — comparison request shows both Batch 5 cards", () => {
  const { cards, intent } = respond("Compare This Is Him and This Is Her.",
    `[PRODUCT:${HIM}] is the spicier, woodier of the two; [PRODUCT:${HER}] is a softer floral woody.`);
  assert.equal(intent, "comparison");
  assert.deepEqual([...cards].sort(), [HER, HIM]);
});
const NEG_REPLY = "Since this is her first perfume, a soft floral is a gentle place to start — something easy to wear every day.";
for (const q of [...NEGATIVE.slice(0, 6), ...NEGATIVE.slice(12)]) {
  test(`B5A-D — no Batch 5 card for "${q}"`, () => {
    const { cards } = respond(q, NEG_REPLY);
    assert.deepEqual(noBatch5(cards), [], `cards ${JSON.stringify(cards)}`);
  });
}

console.log("\n── Shop search ───────────────────────────────────────────────────");

test("B5A-S01 — exact names find the product", () => {
  assert.deepEqual(shopTitles("This Is Her"), [TITLE[HER]]);
  assert.deepEqual(shopTitles("this is him"), [TITLE[HIM]]);
  assert.deepEqual(shopTitles("This is Her!"), [TITLE[HER]]);
  assert.deepEqual(shopTitles("This Is Him Inspired"), [TITLE[HIM]]);
});
test("B5A-S02 — partial queries list both (partial-name behaviour)", () =>
  assert.deepEqual(shopTitles("this is").sort(), [TITLE[HER], TITLE[HIM]]));
test("B5A-S03 — sentences and preferences name no Batch 5 product", () => {
  for (const q of ["this is her birthday gift", "for her", "for him", "her", "him"]) {
    const titles = shopTitles(q);
    assert.ok(!titles.includes(TITLE[HIM]) && !titles.includes(TITLE[HER]), `${q} → ${JSON.stringify(titles)}`);
  }
  assert.equal(resolveShopQuery("for her").mode, 1);
});

console.log("\n── Existing names unaffected (with drafts present) ───────────────");

test("B5A-R01 — full, short and gender-qualified names", () => {
  assert.equal(resolveIntent("Tell me about Wonderlust.", {}).entitySlug, "wonderlust-by-michael-kors-inspired");
  assert.equal(resolveIntent("Tell me about 212 Sexy for men.", {}).entitySlug, "212-sexy-men-inspired");
  assert.equal(resolveIntent("Tell me about 212 Sexy.", {}).entitySlug, "212-sexy-inspired");
  assert.equal(resolveIntent("Tell me about Black Opium.", {}).entitySlug, "black-opium-inspired");
  assert.equal(resolveIntent("Tell me about Burberry Body.", {}).entitySlug, "burberry-body-inspired");
});
test("B5A-R02 — comparison of existing products", () =>
  assert.deepEqual([...resolveIntent("Compare Sauvage and Bleu de Chanel", {}).compareSlug].sort(),
    ["bleu-de-chanel-inspired", "sauvage-inspired"]));

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);
