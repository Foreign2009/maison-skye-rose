/**
 * Single-product cards — a guest who names one fragrance and asks about it gets that
 * fragrance's product card, even when the model's reply uses a short name ("Wonderlust",
 * "Ani") or no name and emits no [PRODUCT:slug] marker.
 *
 * Exercises the real route sequence without an LLM call: planConversation → entity
 * gates → resolveIntent → resolveAnchorSlug → planRetrieval → buildContext →
 * planResponse (with explicitSingleEntity, as route.ts passes it) → formatResponse,
 * using canned model replies. Discovery, education, comparison and ambiguity guards
 * confirm no card is introduced where none belongs.
 *
 * Run: npx tsx scripts/factory/__tests__/single-product-cards.test.ts
 */
import assert from "node:assert/strict";
import { resolveIntent, explicitSingleEntity } from "../../../app/lib/concierge/intentResolver";
import { planRetrieval, buildCachedRetrieval } from "../../../app/lib/concierge/retrievalPlanner";
import { planConversation, resolveAnchorSlug } from "../../../app/lib/concierge/conversationPlanner";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import { buildContext } from "../../../app/lib/concierge/contextBuilder";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import { planResponse } from "../../../app/lib/concierge/responsePlanner";
import { formatResponse } from "../../../app/lib/concierge/responseFormatter";
import { TRUNCATION_FALLBACK } from "../../../app/lib/concierge/claudeClient";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import type { ConversationIntent, ConversationState } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const STATE = {
  turns: [], profile: {}, context: {}, lastRecommendationSlugs: [], comparisonSlugs: [], clarificationTurnCount: 0,
} as unknown as ConversationState;

// Mirrors app/api/concierge/route.ts steps 1–8 for a fresh conversation, with a canned reply.
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
  return { intent, retrieval, out, cards: out.fragrances.map((f) => f.slug) };
}

function expectCards(message: string, raw: string, slugs: string[]) {
  const { out, cards } = respond(message, raw);
  assert.deepEqual(cards, slugs, `"${message}" → cards ${JSON.stringify(cards)}, expected ${JSON.stringify(slugs)}`);
  assert.equal(new Set(cards).size, cards.length, "duplicate cards");
  for (const f of out.fragrances) {
    const k = mkcCatalogue.find((x) => x.slug === f.slug)!;
    assert.equal(f.href, `/product/${k.slug}`, `href ${f.href}`);
    assert.equal(f.price, k.prices["10ml"], `price ${f.price} not catalogue 10ml price`);
    assert.equal(f.name, k.name, `name ${f.name}`);
  }
}

const WONDERLUST = "wonderlust-by-michael-kors-inspired";

console.log("\n── Named single-product enquiries ────────────────────────────────");

test("SPC-01 — Wonderlust: short-name reply without marker shows the Wonderlust card", () =>
  expectCards("Tell me about Wonderlust.", "Wonderlust is a sophisticated floral amber with bergamot, jasmine and sandalwood.", [WONDERLUST]));
test("SPC-02 — Wonderlust by Michael Kors", () =>
  expectCards("Tell me about Wonderlust by Michael Kors.", "Wonderlust by Michael Kors Inspired opens with Italian bergamot.", [WONDERLUST]));
test("SPC-03 — Prada Candy", () =>
  expectCards("Tell me about Prada Candy.", "Prada Candy is a playful gourmand of caramel, benzoin and white musk.", ["prada-candy-inspired"]));
test("SPC-04 — Vetiver & Golden Vanilla: reply names no fragrance (note word 'grapefruit' ignored)", () =>
  expectCards("Tell me about Vetiver & Golden Vanilla.", "It opens with cardamom and grapefruit tea before vetiver, lavender and clary sage.", ["vetiver-golden-vanilla-inspired"]));
test("SPC-05 — Black Opium (no phantom Opium card)", () =>
  expectCards("Tell me about Black Opium.", "Black Opium is espresso and pink pepper over rose and vanilla.", ["black-opium-inspired"]));
test("SPC-06 — Ani (short name below the 5-character prose threshold)", () =>
  expectCards("Tell me about Ani.", "Ani is a warm, spiced vanilla with ginger and bergamot.", ["ani-inspired"]));
test("SPC-07 — 212 Sexy", () =>
  expectCards("Tell me about 212 Sexy.", "212 Sexy opens with mandarin and pink pepper.", ["212-sexy-inspired"]));
test("SPC-08 — model marker for the named product: single card, no duplicate", () =>
  expectCards("Tell me about Wonderlust.", `**[PRODUCT:${WONDERLUST}]** is a floral amber. Wonderlust suits evenings.`, [WONDERLUST]));
test("SPC-09 — plain marker for the named product: single card", () =>
  expectCards("Tell me about Wonderlust.", `[PRODUCT:${WONDERLUST}] is a sophisticated floral amber.`, [WONDERLUST]));
test("SPC-10 — model marks a different in-context product: that card kept, Wonderlust not added", () =>
  expectCards("Tell me about Wonderlust.", "[PRODUCT:212-sexy-inspired] is the better choice for your preferences.", ["212-sexy-inspired"]));

console.log("\n── Discovery and education guards ────────────────────────────────");

for (const [id, msg, raw] of [
  ["SPC-20", "I love vanilla scents.", "Vanilla is versatile. Do you prefer creamy or spicy vanilla?"],
  ["SPC-21", "Recommend something fresh for summer.", "For summer, citrus and aquatic notes work beautifully. Sporty or elegant?"],
  ["SPC-22", "Explain fragrance families.", "Fragrance families group scents by character: floral, woody, amber, fresh and gourmand."],
  ["SPC-23", "What are top, heart and base notes?", "Top notes are the first impression, heart notes the core and base notes the depth."],
  ["SPC-24", "Explain amber fragrances.", "Amber fragrances are warm and resinous, built on labdanum, vanilla and benzoin."],
] as const) {
  test(`${id} — "${msg}" gains no product card`, () => {
    assert.equal(explicitSingleEntity(msg), undefined, "message must not name a single fragrance");
    expectCards(msg, raw, []);
  });
}
test("SPC-25 — vanilla preference is not anchored to Ani", () => {
  const { intent, retrieval } = respond("I love vanilla scents.", "Vanilla is versatile.");
  assert.notEqual(intent, "education");
  assert.notEqual(retrieval.fragrances[0]?.slug, "ani-inspired");
});

console.log("\n── Comparison guards ─────────────────────────────────────────────");

test("SPC-30 — Compare Prada Candy and Wonderlust", () =>
  expectCards("Compare Prada Candy and Wonderlust.", `[PRODUCT:prada-candy-inspired] is creamier; [PRODUCT:${WONDERLUST}] is more floral.`,
    ["prada-candy-inspired", WONDERLUST]));
test("SPC-31 — Compare Black Opium and Opium", () =>
  expectCards("Compare Black Opium and Opium.", "[PRODUCT:black-opium-inspired] is coffee-led; [PRODUCT:opium-inspired] is spicier.",
    ["black-opium-inspired", "opium-inspired"]));
test("SPC-32 — Compare Sauvage Elixir and Sauvage", () =>
  expectCards("Compare Sauvage Elixir and Sauvage.", "[PRODUCT:sauvage-elixir-inspired] is denser than [PRODUCT:sauvage-inspired].",
    ["sauvage-elixir-inspired", "sauvage-inspired"]));
test("SPC-33 — comparison messages name more than one fragrance, so no single-entity card", () => {
  assert.equal(explicitSingleEntity("Compare Prada Candy and Wonderlust."), undefined);
});

console.log("\n── Ambiguity and reply-attribution safeguards ────────────────────");

for (const msg of ["Tell me about Euphoria.", "Tell me about Perfect.", "Tell me about Beautiful.", "Tell me about Romance."]) {
  test(`SPC-40 — "${msg}" names no single fragrance and gains no card`, () => {
    assert.equal(explicitSingleEntity(msg), undefined);
    expectCards(msg, "That name could refer to more than one fragrance. Which one do you mean?", []);
  });
}
test("SPC-41 — reply recommending a different in-context fragrance does not force the named card", () =>
  expectCards("Tell me about Wonderlust.", "If you want something sweeter, 212 Sexy Inspired is the better choice for you.", ["212-sexy-inspired"]));
test("SPC-42 — truncation fallback never gains a card", () => {
  const { cards } = respond("Tell me about Wonderlust.", TRUNCATION_FALLBACK);
  assert.deepEqual(cards, []);
});
test("SPC-43 — non-education intent (similar_to) is unaffected by the named-product rule", () => {
  const retrieval = planRetrieval(resolveIntent("Something like Black Opium", {}), {}, {});
  const plan = { action: "new_search", requiresRetrieval: true, requiresClarification: false, requiresComparison: false,
    reuseRecommendations: false, nextIntent: "similar_to" } as ConversationPlan;
  const planned = planResponse("Here are some alternatives with a similar coffee warmth.", "similar_to", retrieval, plan, {}, "black-opium-inspired");
  assert.ok(planned.recommendedSlugs[0] !== "black-opium-inspired" || retrieval.fragrances.length === 1,
    `named product forced as lead card on a similar_to turn: ${JSON.stringify(planned.recommendedSlugs)}`);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);
