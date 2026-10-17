/**
 * Batch 5 availability recognition (W9-B5-P17, 2026-10-17).
 *
 * "This Is Her" / "This Is Him" are also everyday phrases, so their bare names count only in a
 * product context. Live acceptance (W9-B5-P15) found explicit availability, size and price
 * questions — "Is This Is Her available in 10ml?" — resolving to no product: the turn stayed a
 * no-product clarification and the reply cast doubt on a live fragrance. The resolver now also
 * accepts an availability question about the name (question frame before it AND availability cue
 * after it). These checks follow the real route steps (planning, resolveIntent, the route's
 * clarification-to-lookup upgrade, retrieval, prompt) without a model call.
 *
 * Run: npx tsx scripts/factory/__tests__/batch5-availability-recognition.test.ts
 */
import assert from "node:assert/strict";
import { resolveIntent, explicitSingleEntity, fragrancesNamedIn } from "../../../app/lib/concierge/intentResolver";
import { planRetrieval, buildCachedRetrieval } from "../../../app/lib/concierge/retrievalPlanner";
import { planConversation, resolveAnchorSlug } from "../../../app/lib/concierge/conversationPlanner";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import { buildContext, renderContext } from "../../../app/lib/concierge/contextBuilder";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import { buildSystemPrompt } from "../../../app/lib/concierge/safetyGuard";
import type { ConversationState } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e) { console.log(`  ✗  ${name}\n     ${(e as Error).message}`); failed++; }
}

const HIM = "this-is-him-inspired", HER = "this-is-her-inspired";
const BATCH5 = [HIM, HER];
const SIZE_SENTENCE = "Every Maison Skye & Rose fragrance is available in 5ml, 10ml and 30ml (5ml R60 · 10ml R100 · 30ml R250).";
const STATE = {
  turns: [], profile: {}, context: {}, lastRecommendationSlugs: [], comparisonSlugs: [], clarificationTurnCount: 0,
} as unknown as ConversationState;

// app/api/concierge/route.ts steps 1–5 for a fresh conversation (as concierge-product-facts.test.ts).
function route(message: string) {
  const planned: ConversationPlan = planConversation(message, STATE);
  let plan = planned;
  let resolved: ReturnType<typeof resolveIntent> | undefined;
  let upgraded = false;
  if (!plan.requiresRetrieval && plan.action === "clarification") {
    const pre = resolveIntent(message, {});
    if (pre.entitySlug || pre.compareSlug.length >= 2) {
      plan = { ...plan, action: "new_search", requiresRetrieval: true, requiresClarification: false };
      resolved = pre;
      upgraded = true;
    }
  }
  let retrieval: RetrievalContext;
  if (plan.requiresRetrieval) {
    if (!resolved) resolved = resolveIntent(message, {});
    const ar = resolveAnchorSlug({ plan, entitySlug: resolved.entitySlug, compareSlugCount: resolved.compareSlug.length,
      currentAnchorSlug: undefined, resolvedOrdinalSlug: undefined, message });
    if (ar.upgradeToAnchored) plan = { ...plan, action: "anchored_refinement" as const, nextIntent: "anchored_refinement" as const, requiresRetrieval: true };
    if (plan.action === "anchored_refinement") resolved = { ...resolved, intent: "anchored_refinement" as const };
    retrieval = planRetrieval(resolved, {}, {}, undefined, undefined, null, undefined, message, ar.anchorSlug);
  } else {
    retrieval = buildCachedRetrieval(STATE, {});
  }
  const intent = resolved?.intent ?? plan.nextIntent;
  const prompt = buildSystemPrompt(renderContext(buildContext(retrieval, STATE, plan, intent, null, null, null, message)));
  return { planned: planned.action, action: plan.action, upgraded, retrieval: plan.requiresRetrieval,
    context: retrieval.fragrances.map((f) => f.slug), prompt };
}

// Founder-approved positive matrix (W9-B5-P17 §6).
const POSITIVE: Array<[string, string]> = [
  ["Is This Is Her available in 10ml?", HER],
  ["Do you have This Is Her in 5ml?", HER],
  ["How much is This Is Her in 30ml?", HER],
  ["What sizes does This Is Her come in?", HER],
  ["Can I get This Is Her in 10ml?", HER],
  ["Could I get This Is Her in 5ml?", HER],
  ["Is \"This Is Her\" available in 10ml?", HER],
  ["Is This Is Her! available in 10ml?", HER],
  ["is this is her available in 10ml", HER],
  ["Is This Is Her Inspired available in 10ml?", HER],
  ["Is This Is Him available in 30ml?", HIM],
  ["Do you have This Is Him in 30ml?", HIM],
  ["How much is This Is Him?", HIM],
  ["Is This Is Him in stock?", HIM],
  ["Can I get This Is Him Inspired in 10ml?", HIM],
];

// Founder-approved negative matrix (W9-B5-P17 §7) — must never name a Batch 5 product.
const NEGATIVE = [
  "This is her first perfume.",
  "Do you have this is her size?",
  "I'm buying something for him.",
  "Is this for her?",
  "This is him choosing a gift.",
  "What size should I get for her?",
  "Is this is her style?",
  "how much is this, is her size ok?",
  "This is her available budget, what can I get?",
  "This is him in a nutshell.",
  "What should I get? This is her first fragrance.",
  "This is her price range.",
  "Is this her available budget?",
  "This is him in stock footage.",
  "Can I get this? Is her size available?",
];

console.log("\n── Explicit availability, size and price questions ───────────────");

POSITIVE.forEach(([q, slug], i) => test(`AV-P${String(i + 1).padStart(2, "0")} — "${q}" → ${slug}`, () => {
  const r = resolveIntent(q, {});
  assert.equal(r.entitySlug, slug, `entity ${r.entitySlug}`);
  assert.equal(explicitSingleEntity(q), slug, "explicit single entity");
  const other = slug === HIM ? HER : HIM;
  assert.ok(!fragrancesNamedIn(q).includes(other), `opposing Batch 5 product named: ${other}`);
  const t = route(q);
  assert.ok(t.retrieval, `retrieval not triggered (action ${t.action})`);
  if (t.planned === "clarification") assert.ok(t.upgraded, "clarification turn must be upgraded to a product lookup");
  assert.ok(t.context.includes(slug), `${slug} missing from context [${t.context.join(", ")}]`);
  assert.ok(t.prompt.includes(SIZE_SENTENCE), "product facts retained in the system prompt");
}));

console.log("\n── Ordinary language (no Batch 5 product) ────────────────────────");

NEGATIVE.forEach((q, i) => test(`AV-N${String(i + 1).padStart(2, "0")} — "${q}"`, () => {
  const r = resolveIntent(q, {});
  assert.ok(!BATCH5.includes(r.entitySlug ?? ""), `entity ${r.entitySlug}`);
  assert.deepEqual(r.compareSlug.filter((s) => BATCH5.includes(s)), [], `compare ${JSON.stringify(r.compareSlug)}`);
  assert.deepEqual(fragrancesNamedIn(q).filter((s) => BATCH5.includes(s)), [], "named");
  assert.ok(!BATCH5.includes(explicitSingleEntity(q) ?? ""), "explicit single entity");
  const t = route(q);
  assert.ok(!t.upgraded, "must not be upgraded to a product lookup by a Batch 5 name");
}));

console.log("\n── Rule boundaries ───────────────────────────────────────────────");

test("AV-B01 — the question frame must be the whole clause before the name", () => {
  for (const q of ["What I want to know is this is her available in 10ml.", "My question is this is him available?"]) {
    assert.ok(!BATCH5.includes(resolveIntent(q, {}).entitySlug ?? ""), q);
  }
});
test("AV-B02 — a frame without an availability cue does not count", () => {
  for (const q of ["Is this is her favourite?", "Does this is him matter?", "Can I get this is her a gift?"]) {
    assert.ok(!BATCH5.includes(resolveIntent(q, {}).entitySlug ?? ""), q);
  }
});
test("AV-B03 — an availability cue without the frame does not count", () => {
  for (const q of ["This is her available in 10ml?", "this is him in 30ml please", "This is her cost estimate."]) {
    assert.ok(!BATCH5.includes(resolveIntent(q, {}).entitySlug ?? ""), q);
  }
});
test("AV-B04 — 'how much is' may end at the name, but other frames may not", () => {
  assert.equal(resolveIntent("How much is This Is Her?", {}).entitySlug, HER);
  assert.ok(!BATCH5.includes(resolveIntent("Is This Is Her?", {}).entitySlug ?? ""), "bare 'Is X?' is not an availability question");
});
test("AV-B05 — existing recognition paths are unchanged", () => {
  assert.equal(resolveIntent("Tell me about This Is Him.", {}).entitySlug, HIM);
  assert.equal(resolveIntent("Do you have This Is Her?", {}).entitySlug, HER);
  assert.deepEqual([...resolveIntent("Compare This Is Him and This Is Her.", {}).compareSlug].sort(), [HER, HIM]);
  assert.equal(resolveIntent("This Is Him!", {}).entitySlug, HIM);
  assert.equal(resolveIntent("Tell me about Wonderlust.", {}).entitySlug, "wonderlust-by-michael-kors-inspired");
  assert.equal(resolveIntent("Tell me about 212 Sexy for men.", {}).entitySlug, "212-sexy-men-inspired");
});
test("AV-B06 — a stock question names the product but adds no stock facts to the prompt", () => {
  const t = route("Is This Is Him in stock?");
  assert.ok(t.context.includes(HIM));
  assert.ok(!/\bin stock\b|\bunits?\b|\bquantity on hand\b/i.test(t.prompt.replace("Is This Is Him in stock?", "")),
    "system prompt must not assert inventory");
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);
