/**
 * Comparison-chip guard — "Compare these" (and other multi-fragrance chips) must only
 * be offered when the final response shows two or more distinct fragrance cards.
 * Article cards never count as fragrances.
 *
 * Exercises the real planResponse → formatResponse path with canned model output
 * (no LLM call), plus planConversation routing for explicit comparisons.
 *
 * Run: npx tsx scripts/factory/__tests__/comparison-chip-guard.test.ts
 */
import assert from "node:assert/strict";
import { planResponse, requiresMultipleFragrances } from "../../../app/lib/concierge/responsePlanner";
import { formatResponse } from "../../../app/lib/concierge/responseFormatter";
import { planConversation } from "../../../app/lib/concierge/conversationPlanner";
import { buildCachedRetrieval } from "../../../app/lib/concierge/retrievalPlanner";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import { academyCatalogue } from "../../../app/lib/academy/catalogue";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import type { ConversationIntent, ConversationState } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const BEAUTIFUL = "beautiful-by-estee-lauder-inspired";
if (!mkcCatalogue.some((f) => f.slug === BEAUTIFUL)) { console.error(`${BEAUTIFUL} not in catalogue — aborting`); process.exit(1); }
const [F2, F3] = mkcCatalogue.filter((f) => f.slug !== BEAUTIFUL && f.gender === "female").slice(0, 2).map((f) => f.slug);
const [A1, A2] = academyCatalogue.slice(0, 2).map((a) => a.slug);

const SEARCH_PLAN = {
  action: "new_search", requiresRetrieval: true, requiresClarification: false,
  requiresComparison: false, reuseRecommendations: false, nextIntent: "general_discovery",
} as ConversationPlan;

function retrievalFor(fragranceSlugs: string[], articleSlugs: string[] = [A1, A2]): RetrievalContext {
  return {
    fragrances: fragranceSlugs.map((s) => mkcCatalogue.find((f) => f.slug === s)!),
    articles:   articleSlugs.map((s) => academyCatalogue.find((a) => a.slug === s)!),
    collectionName: "Rose",
  } as unknown as RetrievalContext;
}

function run(raw: string, pool: string[], intent: ConversationIntent = "similar_to", plan: ConversationPlan = SEARCH_PLAN) {
  return formatResponse(planResponse(raw, intent, retrievalFor(pool), plan));
}

const hasCompareChip = (chips: string[]) => chips.some(requiresMultipleFragrances);
const articleMarkers = `See [ARTICLE:${A1}] and [ARTICLE:${A2}].`;

console.log("\n── Comparison-chip guard ─────────────────────────────────────────");

test("CCG-01 — one fragrance + two articles: no comparison chip", () => {
  const out = run(`[PRODUCT:${BEAUTIFUL}] is a timeless floral. ${articleMarkers}`, [BEAUTIFUL, F2, F3]);
  assert.equal(out.fragrances.length, 1, `expected 1 fragrance card, got ${out.fragrances.length}`);
  assert.equal(out.articles.length, 2, `expected 2 article cards, got ${out.articles.length}`);
  assert.ok(!hasCompareChip(out.followUpSuggestions), `comparison chip offered with 1 card: [${out.followUpSuggestions.join(", ")}]`);
});

test("CCG-02 — zero fragrance cards: no comparison chip", () => {
  const out = run(`Here are two guides for you. ${articleMarkers}`, [F2, F3]);
  assert.equal(out.fragrances.length, 0, `expected 0 fragrance cards, got ${out.fragrances.length}`);
  assert.ok(!hasCompareChip(out.followUpSuggestions), `comparison chip offered with 0 cards: [${out.followUpSuggestions.join(", ")}]`);
});

test("CCG-03 — two distinct fragrances: comparison chip retained", () => {
  const out = run(`[PRODUCT:${BEAUTIFUL}] and [PRODUCT:${F2}] both suit you. ${articleMarkers}`, [BEAUTIFUL, F2, F3]);
  assert.equal(new Set(out.fragrances.map((f) => f.slug)).size, 2);
  assert.ok(out.followUpSuggestions.includes("Compare these"), `"Compare these" missing: [${out.followUpSuggestions.join(", ")}]`);
});

test("CCG-04 — three distinct fragrances: comparison chip retained", () => {
  const out = run(`[PRODUCT:${BEAUTIFUL}], [PRODUCT:${F2}] and [PRODUCT:${F3}] fit. ${articleMarkers}`, [BEAUTIFUL, F2, F3]);
  assert.equal(new Set(out.fragrances.map((f) => f.slug)).size, 3);
  assert.ok(out.followUpSuggestions.includes("Compare these"), `"Compare these" missing: [${out.followUpSuggestions.join(", ")}]`);
});

test("CCG-05a — duplicate product markers do not satisfy the two-fragrance threshold", () => {
  const out = run(`[PRODUCT:${BEAUTIFUL}] is lovely. Truly, [PRODUCT:${BEAUTIFUL}] is a classic. ${articleMarkers}`, [BEAUTIFUL, F2, F3]);
  assert.equal(new Set(out.fragrances.map((f) => f.slug)).size, 1);
  assert.ok(!hasCompareChip(out.followUpSuggestions), `comparison chip offered for a duplicated slug: [${out.followUpSuggestions.join(", ")}]`);
});

test("CCG-05b — duplicate slugs reaching the formatter do not satisfy the threshold", () => {
  const out = formatResponse({
    content: "x", intent: "similar_to",
    recommendedSlugs: [BEAUTIFUL, BEAUTIFUL], articleSlugs: [A1, A2],
    followUpSuggestions: ["Compare these", "Show me another option"],
  });
  assert.deepEqual(out.followUpSuggestions, ["Show me another option"]);
});

test("CCG-06 — a comparison chip from any upstream source cannot bypass the final guard", () => {
  const out = formatResponse({
    content: "x", intent: "similar_to",
    recommendedSlugs: [BEAUTIFUL], articleSlugs: [A1, A2],
    followUpSuggestions: ["Compare these", "Which is better for evenings?", "Show me another option"],
  });
  assert.deepEqual(out.followUpSuggestions, ["Show me another option"],
    `final guard let a comparison chip through: [${out.followUpSuggestions.join(", ")}]`);
});

test("CCG-07 — Beautiful single-product response keeps an alternative follow-up", () => {
  const out = run(`[PRODUCT:${BEAUTIFUL}] opens with rose and mandarin. ${articleMarkers}`, [BEAUTIFUL, F2, F3]);
  assert.ok(out.followUpSuggestions.includes("Show me another option"),
    `alternative follow-up missing: [${out.followUpSuggestions.join(", ")}]`);
  assert.equal(out.followUpSuggestions.length, 2, `expected 2 chips, got [${out.followUpSuggestions.join(", ")}]`);
});

test("CCG-08 — cache-reuse path with one card: no comparison chip, alternatives kept", () => {
  const reusePlan = { ...SEARCH_PLAN, action: "follow_up", requiresRetrieval: false, reuseRecommendations: true } as ConversationPlan;
  const out = run(`[PRODUCT:${BEAUTIFUL}] is the one to try. ${articleMarkers}`, [BEAUTIFUL, F2], "similar_to", reusePlan);
  assert.ok(!hasCompareChip(out.followUpSuggestions), `reuse path offered comparison: [${out.followUpSuggestions.join(", ")}]`);
  assert.ok(out.followUpSuggestions.length > 0);
});

const KNOWN_COMPARISON_CHIPS = ["Compare these", "Which is better for evenings?"];
const UNRELATED_COMPARE_CHIPS = ["Compare fragrance families", "Compare these articles"];

test("CCG-09 — guard matches exactly the fragrance-comparison chips used by the static pools", () => {
  for (const c of KNOWN_COMPARISON_CHIPS) {
    assert.ok(requiresMultipleFragrances(c), `should be treated as fragrance-comparison: "${c}"`);
  }
  for (const c of [...UNRELATED_COMPARE_CHIPS, "Compare", "Compare these two", "Compare all three",
                   "Show me another option", "Tell me more about this one", "Find something fresher",
                   "Show me something different", "Teach me more", "Show best sellers"]) {
    assert.ok(!requiresMultipleFragrances(c), `should NOT be treated as fragrance-comparison: "${c}"`);
  }
});

test("CCG-13 — known comparison chips suppressed at 0–1 distinct cards, retained at 2–3", () => {
  const pool = [BEAUTIFUL, F2, F3];
  for (let n = 0; n <= 3; n++) {
    const out = formatResponse({
      content: "x", intent: "similar_to",
      recommendedSlugs: pool.slice(0, n), articleSlugs: [A1, A2],
      followUpSuggestions: [...KNOWN_COMPARISON_CHIPS, "Show me another option"],
    });
    assert.equal(new Set(out.fragrances.map((f) => f.slug)).size, n);
    for (const chip of KNOWN_COMPARISON_CHIPS) {
      assert.equal(out.followUpSuggestions.includes(chip), n >= 2,
        `${n} card(s): "${chip}" ${n >= 2 ? "missing" : "present"} — [${out.followUpSuggestions.join(", ")}]`);
    }
    assert.ok(out.followUpSuggestions.includes("Show me another option"), `${n} card(s): alternative chip lost`);
  }
});

test("CCG-14 — unrelated educational 'Compare …' chips are left unchanged at every card count", () => {
  for (const slugs of [[], [BEAUTIFUL], [BEAUTIFUL, F2]]) {
    const out = formatResponse({
      content: "x", intent: "education",
      recommendedSlugs: slugs, articleSlugs: [A1, A2],
      followUpSuggestions: [...UNRELATED_COMPARE_CHIPS],
    });
    assert.deepEqual(out.followUpSuggestions, UNRELATED_COMPARE_CHIPS,
      `${slugs.length} card(s): unrelated chips altered — [${out.followUpSuggestions.join(", ")}]`);
  }
});

test("CCG-15 — an unknown product slug dropped by formatResponse does not count toward the threshold", () => {
  const UNKNOWN = "not-a-real-fragrance-inspired";
  assert.ok(!mkcCatalogue.some((f) => f.slug === UNKNOWN));
  const out = formatResponse({
    content: "x", intent: "similar_to",
    recommendedSlugs: [BEAUTIFUL, UNKNOWN], articleSlugs: [A1, A2],
    followUpSuggestions: ["Compare these", "Show me another option"],
  });
  assert.deepEqual(out.fragrances.map((f) => f.slug), [BEAUTIFUL], "unknown slug should not render a card");
  assert.deepEqual(out.followUpSuggestions, ["Show me another option"],
    `comparison chip survived with 1 real card: [${out.followUpSuggestions.join(", ")}]`);
});

console.log("\n── Explicit comparisons still route (planner unchanged) ──────────");

function stateWith(slugs: string[]): ConversationState {
  return {
    sessionId: "test", selectedSlug: slugs[0], lastRecommendationSlugs: slugs,
    turns: [
      { role: "user", content: "Show me florals", timestamp: 1 },
      { role: "assistant", content: "Here are your recommendations:", timestamp: 2, intent: "similar_to" },
    ],
    context: { mentionedSlug: slugs[0] },
  };
}

test("CCG-10 — 'Compare all three you just recommended' routes to a 3-way comparison", () => {
  const slugs = [BEAUTIFUL, F2, F3];
  const state = stateWith(slugs);
  const plan = planConversation("Compare all three you just recommended", state);
  assert.equal(plan.requiresComparison, true, `requiresComparison false; action="${plan.action}"`);
  const ctx = buildCachedRetrieval(state).fragrances.map((f) => f.slug).sort();
  assert.deepEqual(ctx, [...slugs].sort());
});

test("CCG-11 — 'Compare these two' with two cached cards routes to comparison", () => {
  const plan = planConversation("Compare these two", stateWith([BEAUTIFUL, F2]));
  assert.equal(plan.requiresComparison, true, `requiresComparison false; action="${plan.action}"`);
});

test("CCG-12 — completed comparison response does not offer 'Compare these' again", () => {
  const cmpPlan = { ...SEARCH_PLAN, action: "comparison", requiresComparison: true, reuseRecommendations: true, nextIntent: "comparison" } as ConversationPlan;
  const out = run(`[PRODUCT:${BEAUTIFUL}] versus [PRODUCT:${F2}].`, [BEAUTIFUL, F2], "comparison", cmpPlan);
  assert.ok(!out.followUpSuggestions.includes("Compare these"));
  assert.ok(out.followUpSuggestions.length > 0);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
