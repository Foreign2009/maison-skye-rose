/**
 * Concierge product facts — sizes and format (W9-B5-P12, 2026-10-16).
 *
 * Live acceptance found the Concierge telling a guest that Maison fragrances "come in a single
 * oil format rather than multiple sizes". The system prompt carried no size or format facts,
 * and size questions are clarification turns with no fragrance in context, so the model
 * improvised. The prompt now carries the catalogue's sizes and forbids format, formulation and
 * concentration claims.
 *
 * These checks are deterministic (prompt construction and routing only — no model call). They
 * prove the facts and guidance reach the model on every turn; they cannot guarantee every
 * generated reply.
 *
 * Run: npx tsx scripts/factory/__tests__/concierge-product-facts.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildSystemPrompt, describeProductSizes, validateResponse } from "../../../app/lib/concierge/safetyGuard";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import type { FragranceKnowledge } from "../../../app/lib/mkc/types";
import { resolveIntent } from "../../../app/lib/concierge/intentResolver";
import { planRetrieval, buildCachedRetrieval } from "../../../app/lib/concierge/retrievalPlanner";
import { planConversation, resolveAnchorSlug } from "../../../app/lib/concierge/conversationPlanner";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";
import { buildContext, renderContext } from "../../../app/lib/concierge/contextBuilder";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import type { ConversationState } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e) { console.log(`  ✗  ${name}\n     ${(e as Error).message}`); failed++; }
}

const STATE = {
  turns: [], profile: {}, context: {}, lastRecommendationSlugs: [], comparisonSlugs: [], clarificationTurnCount: 0,
} as unknown as ConversationState;

// The system prompt app/api/concierge/route.ts builds for a fresh conversation (steps 1–5).
function routePrompt(message: string) {
  let plan: ConversationPlan = planConversation(message, STATE);
  let resolved: ReturnType<typeof resolveIntent> | undefined;
  if (!plan.requiresRetrieval && plan.action === "clarification") {
    const pre = resolveIntent(message, {});
    if (pre.entitySlug || pre.compareSlug.length >= 2) {
      plan = { ...plan, action: "new_search", requiresRetrieval: true, requiresClarification: false };
      resolved = pre;
    }
  }
  let retrieval: RetrievalContext;
  if (plan.requiresRetrieval) {
    if (!resolved) resolved = resolveIntent(message, {});
    const ar = resolveAnchorSlug({ plan, entitySlug: resolved.entitySlug, compareSlugCount: resolved.compareSlug.length,
      currentAnchorSlug: undefined, resolvedOrdinalSlug: undefined, message });
    retrieval = planRetrieval(resolved, {}, {}, undefined, undefined, null, undefined, message, ar.anchorSlug);
  } else {
    retrieval = buildCachedRetrieval(STATE, {});
  }
  const intent = resolved?.intent ?? plan.nextIntent;
  const prompt = buildSystemPrompt(renderContext(buildContext(retrieval, STATE, plan, intent, null, null, null, message)));
  return { action: plan.action, entity: resolved?.entitySlug, fragrances: retrieval.fragrances.length,
    slugs: retrieval.fragrances.map((f) => f.slug), prompt };
}

const SIZE_SENTENCE = "Every Maison Skye & Rose fragrance is available in 5ml, 10ml and 30ml (5ml R60 · 10ml R100 · 30ml R250).";
const OBSERVED_ERROR = "Maison Skye & Rose fragrances come in a single, beautifully crafted oil format rather than multiple sizes.";
const SIZE_QUESTIONS = [
  "What sizes do you have?",
  "Do you sell 30ml bottles?",
  "Are your fragrances oils or sprays?",
  "Do you have this is her size?",
  "Is This Is Her available in 10ml?",
];

console.log("\n── Authoritative sizes ───────────────────────────────────────────");

test("PF-01 — sizes and prices come from the catalogue: every record offers 5ml, 10ml, 30ml at R60/R100/R250", () => {
  assert.equal(describeProductSizes(), SIZE_SENTENCE);
  for (const k of mkcCatalogue) assert.deepEqual(k.prices, { "5ml": 60, "10ml": 100, "30ml": 250 }, k.slug);
});

test("PF-02 — the same three sizes are the ones the product page offers", () => {
  const pdp = fs.readFileSync(path.resolve("app/components/ProductDetail.tsx"), "utf-8");
  const offered = [...pdp.matchAll(/\(\[("5ml",\s*"10ml",\s*"30ml")\] as const\)\.map/g)];
  assert.ok(offered.length >= 1, "ProductDetail size selector must list 5ml, 10ml, 30ml");
});

test("PF-03 — derivation follows the data: non-uniform prices are not stated as one price list", () => {
  const varied = [mkcCatalogue[0], { ...mkcCatalogue[1], prices: { ...mkcCatalogue[1].prices, "30ml": 275 } }] as FragranceKnowledge[];
  const s = describeProductSizes(varied);
  assert.ok(s.includes("5ml, 10ml and 30ml"), s);
  assert.ok(!/R\d/.test(s) && s.includes("product page"), s);
});

console.log("\n── Prompt guidance ───────────────────────────────────────────────");

const prompt = buildSystemPrompt("");

test("PF-04 — the system prompt states the three sizes and their prices", () => {
  assert.ok(prompt.includes("PRODUCT FACTS:"));
  assert.ok(prompt.includes(SIZE_SENTENCE));
  assert.ok(prompt.includes("30ml is one of the available sizes"));
});

test("PF-05 — the prompt forbids denying sizes or claiming a single size/format", () => {
  assert.ok(prompt.includes("Never say a fragrance comes in only one size or in a single format"));
  assert.ok(prompt.includes("never say one of these sizes is unavailable"));
});

test("PF-06 — the prompt forbids unsupported format, formulation, concentration and packaging claims", () => {
  for (const term of ["oils or sprays", "eau de parfum, eau de toilette or extrait", "any concentration", "bottle, atomiser or packaging specifications"]) {
    assert.ok(prompt.includes(term), `missing: ${term}`);
  }
  assert.ok(prompt.includes("not listed in the information available to you"), "limitation wording");
  assert.ok(prompt.includes("WhatsApp"), "support channel");
  assert.ok(prompt.includes("still answer any size question"), "size questions are still answered, not redirected");
});

test("PF-07 — the observed erroneous reply is contradicted on every point by the prompt", () => {
  // "single … format" and "rather than multiple sizes" vs the stated sizes and prohibitions; "oil" vs the format rule.
  assert.ok(/single/.test(OBSERVED_ERROR) && prompt.includes("only one size or in a single format"));
  assert.ok(/multiple sizes/.test(OBSERVED_ERROR) && prompt.includes("5ml, 10ml and 30ml"));
  assert.ok(/oil format/.test(OBSERVED_ERROR) && prompt.includes("Do not describe the fragrances as oils or sprays"));
});

test("PF-08 — existing knowledge and safety rules are unchanged and still present", () => {
  for (const rule of [
    "Only recommend fragrances listed in the FRAGRANCES IN CONTEXT section below.",
    "Never invent fragrance notes, families, or characteristics not present in context.",
    "subset", "Never assume a guest's gender", "GENDER ELIGIBILITY",
    "soft, moderate, or strong projection", "beast mode", "Do not discuss pricing beyond what is available in the catalogue.",
    "Scent Finder",
  ]) assert.ok(prompt.includes(rule), `missing: ${rule}`);
  assert.ok(!prompt.includes("/quiz") && !prompt.includes("/academy"), "no bare paths");
  // Response validation is unchanged: performance claims still rejected, plain size answers accepted.
  assert.equal(validateResponse("This fragrance has strong projection."), false);
  assert.equal(validateResponse("It lasts all day."), false);
  assert.equal(validateResponse("Yes — 30ml is one of our sizes, alongside 5ml and 10ml."), true);
});

console.log("\n── Size questions on clarification turns ─────────────────────────");

for (const q of SIZE_QUESTIONS) {
  test(`PF-09 — "${q}": facts and format guidance reach the model`, () => {
    const r = routePrompt(q);
    assert.ok(r.prompt.includes(SIZE_SENTENCE), "size facts present");
    assert.ok(r.prompt.includes("Do not describe the fragrances as oils or sprays"), "format guidance present");
    if (q === "Is This Is Her available in 10ml?") {
      // W9-B5-P17: an explicit availability question about the product resolves to it and is
      // upgraded from clarification to a product lookup with the product in context.
      assert.equal(r.action, "new_search", `action ${r.action}`);
      assert.equal(r.entity, "this-is-her-inspired", `entity ${r.entity}`);
      assert.ok(r.slugs.includes("this-is-her-inspired"), `this-is-her-inspired missing from context [${r.slugs.join(", ")}]`);
      return;
    }
    // The other size questions name no product: they remain no-product clarification turns.
    assert.equal(r.action, "clarification", `action ${r.action}`);
    assert.equal(r.fragrances, 0, `fragrances in context ${r.fragrances}`);
    assert.equal(r.entity, undefined, `entity ${r.entity}`);
  });
}

test("PF-10 — 'Do you have this is her size?' still names no Batch 5 product", () => {
  const r = resolveIntent("Do you have this is her size?", {});
  assert.equal(r.entitySlug, undefined);
  assert.deepEqual(r.compareSlug, []);
});

test("PF-11 — product requests still resolve and carry the facts (Batch 5 routing preserved)", () => {
  for (const [q, slug] of [["Tell me about This Is Him.", "this-is-him-inspired"], ["Do you have This Is Her?", "this-is-her-inspired"]] as const) {
    const r = routePrompt(q);
    assert.equal(r.entity, slug, q);
    assert.ok(r.prompt.includes(SIZE_SENTENCE), `${q}: size facts present`);
  }
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);
