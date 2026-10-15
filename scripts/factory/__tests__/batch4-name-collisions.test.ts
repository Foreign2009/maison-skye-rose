/**
 * Wave 9 Batch 4 name-collision checks (W9-B4-P1, updated W9-B4-P2 after local promotion).
 *
 * Runs against the live native catalogue, which now includes the four promoted Batch 4 records
 * (212 Sexy Men, 212 VIP Men, Burberry Body, Armani Diamonds). Confirms each name resolves to
 * exactly the intended identity alongside the existing 212, Burberry and Armani records; that
 * gender-qualified phrasings ("212 Sexy for men", "212 Men Sexy", "the men's 212 Sexy",
 * "212 VIP for men") reach the men's records while unqualified "212 Sexy" stays the women's;
 * that the supplier text "212 VIP Carolina Herrera" assigns no identity or gender; and that the
 * real Concierge card-planning path shows the right product card for these enquiries.
 *
 * Run: npx tsx scripts/factory/__tests__/batch4-name-collisions.test.ts
 */
import assert from "node:assert/strict";
import { resolveIntent, explicitSingleEntity } from "../../../app/lib/concierge/intentResolver";
import { planRetrieval } from "../../../app/lib/concierge/retrievalPlanner";
import { planConversation, resolveAnchorSlug } from "../../../app/lib/concierge/conversationPlanner";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import { buildContext } from "../../../app/lib/concierge/contextBuilder";
import { planResponse } from "../../../app/lib/concierge/responsePlanner";
import { formatResponse } from "../../../app/lib/concierge/responseFormatter";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import type { ConversationState } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}
const resolve = (q: string) => resolveIntent(q, {});
function expectEntity(q: string, slug: string | undefined) {
  const r = resolve(q);
  assert.equal(r.entitySlug, slug, `"${q}" → entity ${r.entitySlug ?? "-"}, expected ${slug ?? "-"}`);
  assert.deepEqual(r.compareSlug, [], `"${q}" → unexpected comparison ${JSON.stringify(r.compareSlug)}`);
}
function expectCompare(q: string, slugs: string[]) {
  const r = resolve(q);
  assert.deepEqual([...r.compareSlug].sort(), [...slugs].sort(), `"${q}" → compare ${JSON.stringify(r.compareSlug)}`);
}

// Mirrors app/api/concierge/route.ts steps 1–8 for a fresh conversation with a canned reply (no LLM call).
const STATE = { turns: [], profile: {}, context: {}, lastRecommendationSlugs: [], comparisonSlugs: [], clarificationTurnCount: 0 } as unknown as ConversationState;
function cardsFor(message: string, raw: string): string[] {
  let plan: ConversationPlan = planConversation(message, STATE);
  let resolved = resolveIntent(message, {});
  if (!plan.requiresRetrieval) plan = { ...plan, action: "new_search", requiresRetrieval: true, requiresClarification: false };
  const ar = resolveAnchorSlug({ plan, entitySlug: resolved.entitySlug, compareSlugCount: resolved.compareSlug.length,
    currentAnchorSlug: undefined, resolvedOrdinalSlug: undefined, message });
  if (ar.upgradeToAnchored) { plan = { ...plan, action: "anchored_refinement" as const }; resolved = { ...resolved, intent: "anchored_refinement" as const }; }
  const retrieval = planRetrieval(resolved, {}, {}, undefined, undefined, null, undefined, message, ar.anchorSlug);
  buildContext(retrieval, STATE, plan, resolved.intent, null, null, null, message);
  const out = formatResponse(planResponse(raw, resolved.intent, retrieval, plan, {}, explicitSingleEntity(message)));
  for (const f of out.fragrances) assert.equal(f.href, `/product/${f.slug}`);
  return out.fragrances.map((f) => f.slug);
}

const NEW = ["212-sexy-men-inspired", "212-vip-men-inspired", "burberry-body-inspired", "armani-diamonds-inspired"];

console.log("\n── Catalogue state ───────────────────────────────────────────────");

test("B4-01 — catalogue is 283 (Batch 5 promoted, W9-B5-P6) and includes the four promoted Batch 4 records", () => {
  assert.equal(mkcCatalogue.length, 283);
  for (const s of NEW) assert.ok(mkcCatalogue.some((k) => k.slug === s), `${s} not native`);
});

console.log("\n── 212 identities ────────────────────────────────────────────────");

test("B4-10 — unqualified '212 Sexy' stays the women's 212 Sexy", () => {
  expectEntity("Tell me about 212 Sexy.", "212-sexy-inspired");
  expectEntity("Tell me about 212 Sexy for women.", "212-sexy-inspired");
});
test("B4-11 — '212 Sexy Men' identifies the men's record only", () => expectEntity("Tell me about 212 Sexy Men.", "212-sexy-men-inspired"));
test("B4-12 — gender-qualified men's phrasings never reach the women's record", () => {
  expectEntity("Tell me about 212 Sexy for men.", "212-sexy-men-inspired");
  expectEntity("Tell me about 212 Men Sexy.", "212-sexy-men-inspired");
  expectEntity("Tell me about the men's 212 Sexy.", "212-sexy-men-inspired");
  expectEntity("Tell me about the mens 212 Sexy.", "212-sexy-men-inspired");
});
test("B4-13 — naming both 212 Sexy editions compares both", () =>
  expectCompare("Compare 212 Sexy and 212 Sexy Men.", ["212-sexy-inspired", "212-sexy-men-inspired"]));
test("B4-14 — 212 VIP Men (and 'for men') distinct from 212 VIP Black and 212 VIP Rose", () => {
  expectEntity("Tell me about 212 VIP Men.", "212-vip-men-inspired");
  expectEntity("Tell me about 212 VIP for men.", "212-vip-men-inspired");
  expectEntity("Tell me about 212 VIP Black.", "212-vip-black-inspired");
  expectEntity("Tell me about 212 VIP Rose.", "212-vip-rose-inspired");
});
test("B4-15 — supplier text '212 VIP Carolina Herrera' and bare '212 VIP' assign no identity or gender", () => {
  expectEntity("Tell me about 212 VIP Carolina Herrera.", undefined);
  expectEntity("Tell me about 212 VIP.", undefined);
});

console.log("\n── Burberry, Armani and preserved corrections ────────────────────");

test("B4-20 — Burberry Body distinct from Burberry Her, Goddess and London", () => {
  expectEntity("Tell me about Burberry Body.", "burberry-body-inspired");
  expectEntity("Tell me about Burberry Her.", "burberry-her-inspired");
  expectEntity("Tell me about Burberry Goddess.", "burberry-goddess-inspired");
});
test("B4-21 — Armani Diamonds distinct from Armani Si; 'Diamonds' alone resolves nothing", () => {
  expectEntity("Tell me about Armani Diamonds.", "armani-diamonds-inspired");
  expectEntity("Tell me about Armani Si.", "armani-si-inspired");
  expectEntity("Tell me about Diamonds.", undefined);
});
test("B4-22 — W9-C3 corrections preserved (Ani, vanilla, Armani, Black Opium)", () => {
  expectEntity("Tell me about Ani.", "ani-inspired");
  expectEntity("I love vanilla scents.", undefined);
  expectEntity("Tell me about Armani Code Parfum.", "armani-code-parfum-inspired");
  expectEntity("Tell me about Black Opium.", "black-opium-inspired");
  expectCompare("Compare Black Opium and Opium.", ["black-opium-inspired", "opium-inspired"]);
});
test(`B4-23 — every native name resolves to itself alone (${mkcCatalogue.length})`, () => {
  const problems: string[] = [];
  for (const k of mkcCatalogue) {
    const bare = k.name.replace(/ Inspired$/, "");
    for (const q of [`Tell me about ${bare}`, `Tell me about ${k.name}`]) {
      const r = resolve(q);
      if (r.entitySlug !== k.slug || r.compareSlug.length) problems.push(`${q} → ${r.entitySlug ?? "-"} ${JSON.stringify(r.compareSlug)}`);
    }
  }
  assert.equal(problems.length, 0, `${problems.length} misresolved:\n     ${problems.slice(0, 10).join("\n     ")}`);
});

console.log("\n── Concierge product-card planning path ──────────────────────────");

test("B4-30 — '212 Sexy for men' shows the men's card only", () =>
  assert.deepEqual(cardsFor("Tell me about 212 Sexy for men.", "212 Sexy Men opens with mandarin and bergamot over cardamom and black pepper."), ["212-sexy-men-inspired"]));
test("B4-31 — '212 Sexy' shows the women's card only", () =>
  assert.deepEqual(cardsFor("Tell me about 212 Sexy.", "212 Sexy opens with mandarin and pink pepper over gardenia."), ["212-sexy-inspired"]));
test("B4-32 — '212 VIP for men' shows the 212 VIP Men card", () =>
  assert.deepEqual(cardsFor("Tell me about 212 VIP for men.", "It opens with caviar lime and frozen mint over ginger."), ["212-vip-men-inspired"]));
test("B4-33 — named Burberry Body and Armani Diamonds enquiries show their own cards", () => {
  assert.deepEqual(cardsFor("Tell me about Burberry Body.", "Burberry Body opens with green absinthe, peach and freesia."), ["burberry-body-inspired"]);
  assert.deepEqual(cardsFor("Tell me about Armani Diamonds.", "Armani Diamonds opens with lychee and raspberry."), ["armani-diamonds-inspired"]);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);
