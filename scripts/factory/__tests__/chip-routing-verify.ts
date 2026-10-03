/**
 * Verify that the two no-match follow-up chips route correctly through the
 * same conversationPlanner → resolveIntent → resolveAnchorSlug → planRetrieval
 * pipeline that route.ts executes.
 *
 * Uses ConversationState shaped exactly as route.ts produces it after a
 * no-match anchored_refinement turn (selectedSlug set to the anchor,
 * lastRecommendationSlugs empty, previous assistant turn has intent).
 *
 * Meaningful assertions:
 *   - Neither chip re-triggers anchored_refinement (impossible constraint not repeated)
 *   - Both chips produce a non-empty retrieval pool (guest is not left empty-handed)
 *   - The anchor exclusion note is documented (limitation, not enforced at retrieval layer)
 *
 * Run: npx tsx scripts/factory/__tests__/chip-routing-verify.ts
 */
import assert from "node:assert/strict";
import { planConversation, resolveAnchorSlug } from "../../../app/lib/concierge/conversationPlanner";
import { resolveIntent }  from "../../../app/lib/concierge/intentResolver";
import { planRetrieval, buildCachedRetrieval } from "../../../app/lib/concierge/retrievalPlanner";
import { mkcCatalogue }   from "../../../app/lib/mkc/catalogue";
import type { ConversationState, ConversationContext } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const SAUVAGE = mkcCatalogue.find(k => k.slug === "sauvage-inspired");
if (!SAUVAGE) { console.error("sauvage-inspired not in catalogue — aborting"); process.exit(1); }

// State as route.ts produces it after a no-match anchored_refinement turn:
//   selectedSlug    = anchor (set at route.ts line 343–344)
//   lastRecommendationSlugs = [] (zero cards returned)
//   previous assistant turn carries intent = "anchored_refinement"
const POST_NO_MATCH_CONTEXT: ConversationContext = {
  mentionedSlug: "sauvage-inspired",
};
const POST_NO_MATCH_STATE: ConversationState = {
  sessionId:                "test",
  selectedSlug:             "sauvage-inspired",   // route.ts line 343
  lastRecommendationSlugs:  [],                   // zero cards shown
  turns: [
    { role: "user",      content: "I love Sauvage Inspired but would like something less sweet", timestamp: 1 },
    { role: "assistant", content: "Sauvage Inspired is already at the lower end of sweetness (1/5)…",
      timestamp: 2, intent: "anchored_refinement" },
  ],
  context: POST_NO_MATCH_CONTEXT,
};

function runPipeline(message: string) {
  // Mirrors route.ts steps 1, 1c, 2 (EP-AI-C4 + EP-AI-C4-R1)
  const plan = planConversation(message, POST_NO_MATCH_STATE);

  // Anchor slug as route.ts resolves it for a post-no-match turn:
  // plan.action is NOT "anchored_refinement" here (no direction signal), so anchorSlug starts undefined.
  let anchorSlug: string | undefined = plan.action === "anchored_refinement"
    ? (POST_NO_MATCH_STATE.selectedSlug ?? POST_NO_MATCH_STATE.lastRecommendationSlugs?.[0])
    : undefined;

  const resolved = resolveIntent(message, POST_NO_MATCH_CONTEXT);

  const ar = resolveAnchorSlug({
    plan,
    entitySlug:          resolved.entitySlug,
    compareSlugCount:    resolved.compareSlug.length,
    currentAnchorSlug:   anchorSlug,
    resolvedOrdinalSlug: undefined,
    message,
  });
  anchorSlug = ar.anchorSlug;
  const effectivePlan = ar.upgradeToAnchored
    ? { ...plan, action: "anchored_refinement" as const, nextIntent: "anchored_refinement" as const, requiresRetrieval: true }
    : plan;

  const retrieval = planRetrieval(
    { ...resolved, intent: effectivePlan.action === "anchored_refinement" ? "anchored_refinement" as const : resolved.intent },
    POST_NO_MATCH_CONTEXT,
    undefined,           // no profile
    undefined,           // no affectedRoles
    undefined,           // no explorationTarget
    null,                // no unifiedProfile
    undefined,           // no cumulativeExcludeSlugs
    message,
    anchorSlug,
  );
  return { plan: effectivePlan, retrieval, anchorSlug };
}

console.log("\n── Chip routing: no-match follow-up chips ────────────────────────");

test("CR-01 — 'Try a different direction' does not re-trigger anchored_refinement", () => {
  const { plan } = runPipeline("Try a different direction");
  assert.notEqual(plan.action, "anchored_refinement",
    `CR-01 — action="${plan.action}" re-triggers the impossible constraint`);
});

test("CR-02 — 'Explore the catalogue' does not re-trigger anchored_refinement", () => {
  const { plan } = runPipeline("Explore the catalogue");
  assert.notEqual(plan.action, "anchored_refinement",
    `CR-02 — action="${plan.action}" re-triggers the impossible constraint`);
});

test("CR-03 — 'Try a different direction' returns a non-empty retrieval pool", () => {
  const { retrieval, plan } = runPipeline("Try a different direction");
  assert.ok(retrieval.fragrances.length > 0,
    `CR-03 — zero fragrances returned (action="${plan.action}") — guest left empty-handed`);
  console.log(`         → action="${plan.action}", pool size=${retrieval.fragrances.length}`);
});

test("CR-04 — 'Explore the catalogue' returns a non-empty retrieval pool", () => {
  const { retrieval, plan } = runPipeline("Explore the catalogue");
  assert.ok(retrieval.fragrances.length > 0,
    `CR-04 — zero fragrances returned (action="${plan.action}") — guest left empty-handed`);
  console.log(`         → action="${plan.action}", pool size=${retrieval.fragrances.length}`);
});

// Anchor exclusion note: context.mentionedSlug="sauvage-inspired" persists so
// the general retrieval may include Sauvage as a candidate. This is a known limitation:
// the chip labels do not promise anchor exclusion and the retrieval layer does not
// enforce it. The model's conversation context from the prior no-match turn makes
// re-recommending the anchor unlikely, but this is not enforced by the pipeline.
test("CR-05 — anchor exclusion limitation documented (not a hard pipeline guarantee)", () => {
  for (const msg of ["Try a different direction", "Explore the catalogue"]) {
    const { retrieval } = runPipeline(msg);
    const hasAnchor = retrieval.fragrances.some(f => f.slug === "sauvage-inspired");
    if (hasAnchor) {
      console.log(`         ℹ  "${msg}": Sauvage Inspired in pool — anchor exclusion not enforced at retrieval layer`);
    }
    // Not a failure: the label promises a different plan direction, not a different pool
    assert.ok(retrieval.fragrances.length > 0,
      `CR-05 — "${msg}" returned empty pool`);
  }
});

// ── CR-06/07: "Compare these" next-turn routing with 2 and 3 cached cards ──────
// Verifies the full planConversation + buildCachedRetrieval pipeline:
//   - "Compare these" always routes to requiresComparison=true
//   - buildCachedRetrieval returns ALL cached slugs, not a selected pair
// This covers the routing gap the chip-count assertion (T-LF-07b/c) does not test.

console.log("\n── Chip routing: 'Compare these' next-turn ───────────────────────");

function makeCompareState(slugs: string[]): ConversationState {
  return {
    sessionId:               "test",
    selectedSlug:            slugs[0],
    lastRecommendationSlugs: slugs,
    turns: [
      { role: "user",      content: "Show me something less sweet",   timestamp: 1 },
      { role: "assistant", content: "Here are your recommendations:", timestamp: 2,
        intent: "anchored_refinement" },
    ],
    context: { mentionedSlug: slugs[0] },
  };
}

test("CR-06 — 'Compare these' with 2 cached slugs: action=comparison, both slugs retained", () => {
  const slugs = mkcCatalogue.slice(0, 2).map((f) => f.slug);
  const state = makeCompareState(slugs);

  const plan = planConversation("Compare these", state);
  assert.equal(plan.requiresComparison, true,
    `CR-06 — requiresComparison must be true; got action="${plan.action}"`);
  assert.equal(plan.reuseRecommendations, true,
    `CR-06 — reuseRecommendations must be true; got action="${plan.action}"`);

  const retrieval = buildCachedRetrieval(state);
  const returnedSlugs = retrieval.fragrances.map((f) => f.slug).sort();
  const expectedSlugs = [...slugs].sort();
  assert.deepEqual(returnedSlugs, expectedSlugs,
    `CR-06 — both cached slugs must appear in retrieval context; got: [${returnedSlugs.join(", ")}]`);
  console.log(`         → action="${plan.action}", context slugs=[${returnedSlugs.join(", ")}]`);
});

test("CR-07 — 'Compare these' with 3 cached slugs: action=comparison, all 3 slugs retained", () => {
  const slugs = mkcCatalogue.slice(0, 3).map((f) => f.slug);
  const state = makeCompareState(slugs);

  const plan = planConversation("Compare these", state);
  assert.equal(plan.requiresComparison, true,
    `CR-07 — requiresComparison must be true; got action="${plan.action}"`);
  assert.equal(plan.reuseRecommendations, true,
    `CR-07 — reuseRecommendations must be true; got action="${plan.action}"`);

  const retrieval = buildCachedRetrieval(state);
  const returnedSlugs = retrieval.fragrances.map((f) => f.slug).sort();
  const expectedSlugs = [...slugs].sort();
  assert.deepEqual(returnedSlugs, expectedSlugs,
    `CR-07 — all 3 cached slugs must appear in retrieval context; got: [${returnedSlugs.join(", ")}]`);
  console.log(`         → action="${plan.action}", context slugs=[${returnedSlugs.join(", ")}]`);
  // Document: pipeline passes all 3 slugs to the model with "Compare the previous recommendations
  // directly." — no pair selection is enforced. The model handles the 3-way comparison.
  console.log(`         ℹ  3-card comparison: model receives all 3 slugs; no pipeline-enforced pair selection`);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
