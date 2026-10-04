/**
 * Maison Concierge — Claude client unit tests
 *
 * Exercises callClaude, selectTokenBudget, TRUNCATION_FALLBACK and the
 * response pipeline using a mock Anthropic client. No real network calls.
 *
 * Run: npx tsx scripts/factory/__tests__/claude-client.test.ts
 */

import assert from "node:assert/strict";
import type Anthropic from "@anthropic-ai/sdk";
import {
  callClaude,
  selectTokenBudget,
  TRUNCATION_FALLBACK,
  MAX_TOKENS,
  MAX_TOKENS_COMPARISON,
} from "../../../app/lib/concierge/claudeClient";
import { planResponse }  from "../../../app/lib/concierge/responsePlanner";
import { formatResponse } from "../../../app/lib/concierge/responseFormatter";
import { mkcCatalogue }  from "../../../app/lib/mkc/catalogue";
import type { RetrievalContext } from "../../../app/lib/concierge/contextBuilder";
import type { ConversationPlan } from "../../../app/lib/concierge/conversationPlanner";

// ── Harness ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

// All tests are collected as promises and awaited together before the summary.
const _tests: Array<Promise<void>> = [];

function test(name: string, fn: () => void | Promise<void>): void {
  _tests.push(
    Promise.resolve().then(fn).then(
      () => { console.log(`  ✓  ${name}`); passed++; },
      (e: unknown) => {
        const msg = e instanceof assert.AssertionError ? e.message : String(e);
        console.error(`  ✗  ${name}\n     ${msg}`);
        failed++;
      },
    ),
  );
}

// ── Mock client builder ───────────────────────────────────────────────────────

// Includes model and max_tokens so tests can assert which model was called.
type MockCreate = (params: { model: string; max_tokens: number }) => Promise<{
  stop_reason: string;
  content: Array<{ type: string; text?: string }>;
}>;

function makeMockClient(create: MockCreate): Anthropic {
  return {
    messages: { create },
  } as unknown as Anthropic;
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const CP_FRAGS = mkcCatalogue.slice(0, 3);
const COMPARISON_PLAN: ConversationPlan = {
  action: "comparison", reason: "test",
  requiresRetrieval: false, requiresComparison: true,
  requiresClarification: false, reuseRecommendations: true,
  nextIntent: "comparison",
};
const CP_RETRIEVAL: RetrievalContext = { fragrances: CP_FRAGS, articles: [] };
const MESSAGES = [{ role: "user" as const, content: "Compare these" }];
const SYSTEM   = "test system prompt";

// ── T-CC-01–04: callClaude provider behaviour ─────────────────────────────────

console.log("\n── CC. Claude client provider handling ──────────────────────────");

test("T-CC-01 — end_turn: returns the model's text unchanged", async () => {
  const modelText = "Aventus Inspired is the bolder choice.";
  const mockClient = makeMockClient(async () => ({
    stop_reason: "end_turn",
    content: [{ type: "text", text: modelText }],
  }));
  const result = await callClaude(mockClient, MESSAGES, SYSTEM);
  assert.equal(result, modelText,
    `T-CC-01 — expected model text, got: "${result}"`);
});

test("T-CC-02 — max_tokens: discards unfinished text, returns TRUNCATION_FALLBACK", async () => {
  const truncated = "Here are the three fragrances. Aventus is bold with pineapple — the birch smokin";
  const mockClient = makeMockClient(async () => ({
    stop_reason: "max_tokens",
    content: [{ type: "text", text: truncated }],
  }));
  const result = await callClaude(mockClient, MESSAGES, SYSTEM);
  assert.equal(result, TRUNCATION_FALLBACK,
    `T-CC-02 — expected TRUNCATION_FALLBACK, got: "${result}"`);
  assert.ok(!result.includes(truncated.slice(-20)),
    `T-CC-02 — truncated text must not leak into fallback`);
});

test("T-CC-03 — primary error: retried on fallback model in order, returns fallback result", async () => {
  const calledModels: string[] = [];
  const mockClient = makeMockClient(async ({ model }) => {
    calledModels.push(model);
    if (calledModels.length === 1) throw new Error("simulated primary error");
    return { stop_reason: "end_turn", content: [{ type: "text", text: "fallback response" }] };
  });
  const result = await callClaude(mockClient, MESSAGES, SYSTEM, MAX_TOKENS, "primary-model", "fallback-model");
  assert.equal(result, "fallback response",
    `T-CC-03 — expected fallback model response`);
  assert.equal(calledModels.length, 2, `T-CC-03 — must have attempted exactly 2 calls`);
  assert.equal(calledModels[0], "primary-model",
    `T-CC-03 — first call must use primary model; got: "${calledModels[0]}"`);
  assert.equal(calledModels[1], "fallback-model",
    `T-CC-03 — second call must use fallback model; got: "${calledModels[1]}"`);
});

test("T-CC-04 — same-model case: throws immediately without retry when primary equals fallback", async () => {
  let callCount = 0;
  const mockClient = makeMockClient(async () => {
    callCount++;
    throw new Error("network error");
  });
  // When primary === fallback the guard fires after the first failure — no second call.
  await assert.rejects(
    () => callClaude(mockClient, MESSAGES, SYSTEM, MAX_TOKENS, "same-model", "same-model"),
    /Claude unavailable/,
    `T-CC-04 — expected "Claude unavailable" when primary === fallback`,
  );
  assert.equal(callCount, 1,
    `T-CC-04 — only one attempt must be made when primary === fallback; got ${callCount}`);
});

test("T-CC-12 — distinct primary and fallback both fail: exactly two calls in order, rejection after second", async () => {
  const calledModels: string[] = [];
  const mockClient = makeMockClient(async ({ model }) => {
    calledModels.push(model);
    throw new Error("network error");
  });
  await assert.rejects(
    () => callClaude(mockClient, MESSAGES, SYSTEM, MAX_TOKENS, "primary-model", "fallback-model"),
    /network error/,
    `T-CC-12 — original error must propagate after both distinct models fail`,
  );
  assert.equal(calledModels.length, 2,
    `T-CC-12 — must have attempted exactly 2 calls; got ${calledModels.length}`);
  assert.equal(calledModels[0], "primary-model",
    `T-CC-12 — first call must use primary model; got: "${calledModels[0]}"`);
  assert.equal(calledModels[1], "fallback-model",
    `T-CC-12 — second call must use fallback model; got: "${calledModels[1]}"`);
});

// ── T-CC-05–06: selectTokenBudget ─────────────────────────────────────────────

console.log("\n── CC-B. Token budget selection ─────────────────────────────────");

test("T-CC-05 — selectTokenBudget(true): comparison → MAX_TOKENS_COMPARISON (700)", () => {
  const budget = selectTokenBudget(true);
  assert.equal(budget, MAX_TOKENS_COMPARISON,
    `T-CC-05 — expected ${MAX_TOKENS_COMPARISON}, got ${budget}`);
  assert.equal(budget, 700, `T-CC-05 — MAX_TOKENS_COMPARISON must be exactly 700`);
});

test("T-CC-06 — selectTokenBudget(false): non-comparison → MAX_TOKENS (400)", () => {
  const budget = selectTokenBudget(false);
  assert.equal(budget, MAX_TOKENS,
    `T-CC-06 — expected ${MAX_TOKENS}, got ${budget}`);
  assert.equal(budget, 400, `T-CC-06 — MAX_TOKENS must be exactly 400`);
});

// ── T-CC-07: max_tokens budget is passed to provider ─────────────────────────

test("T-CC-07 — comparison token budget (700) is forwarded to the provider call", async () => {
  let receivedMaxTokens = 0;
  const mockClient = makeMockClient(async ({ max_tokens }) => {
    receivedMaxTokens = max_tokens;
    return { stop_reason: "end_turn", content: [{ type: "text", text: "done" }] };
  });
  await callClaude(mockClient, MESSAGES, SYSTEM, MAX_TOKENS_COMPARISON);
  assert.equal(receivedMaxTokens, MAX_TOKENS_COMPARISON,
    `T-CC-07 — provider must receive 700, got ${receivedMaxTokens}`);
});

test("T-CC-08 — default token budget (400) is forwarded when maxTokens not specified", async () => {
  let receivedMaxTokens = 0;
  const mockClient = makeMockClient(async ({ max_tokens }) => {
    receivedMaxTokens = max_tokens;
    return { stop_reason: "end_turn", content: [{ type: "text", text: "done" }] };
  });
  await callClaude(mockClient, MESSAGES, SYSTEM);
  assert.equal(receivedMaxTokens, MAX_TOKENS,
    `T-CC-08 — provider must receive 400, got ${receivedMaxTokens}`);
});

// ── T-CC-09–11: fallback pipeline integration ─────────────────────────────────
// Verifies TRUNCATION_FALLBACK through planResponse + formatResponse:
// no unfinished prose, no leaked markers, no invented product cards.

console.log("\n── CC-C. Fallback pipeline integration ──────────────────────────");

test("T-CC-09 — TRUNCATION_FALLBACK through planResponse: no product cards", () => {
  const result = planResponse(TRUNCATION_FALLBACK, "comparison", CP_RETRIEVAL, COMPARISON_PLAN);
  assert.equal(result.recommendedSlugs.length, 0,
    `T-CC-09 — fallback must produce no product cards; got: [${result.recommendedSlugs.join(", ")}]`);
});

test("T-CC-10 — TRUNCATION_FALLBACK through planResponse: no leaked markers", () => {
  const result = planResponse(TRUNCATION_FALLBACK, "comparison", CP_RETRIEVAL, COMPARISON_PLAN);
  assert.ok(!result.content.includes("[PRODUCT:"),
    `T-CC-10 — no [PRODUCT:] must appear in fallback content`);
  assert.ok(!result.content.includes("[ARTICLE:"),
    `T-CC-10 — no [ARTICLE:] must appear in fallback content`);
});

test("T-CC-11 — TRUNCATION_FALLBACK through formatResponse: complete sentence, no ** markers", () => {
  const planned  = planResponse(TRUNCATION_FALLBACK, "comparison", CP_RETRIEVAL, COMPARISON_PLAN);
  const formatted = formatResponse(planned);
  const text = formatted.content;
  assert.ok(!text.includes("**"),
    `T-CC-11 — no ** must appear in formatted fallback`);
  assert.ok(text.trim().endsWith("."),
    `T-CC-11 — fallback must end with a period; ends with: "${text.slice(-15)}"`);
  assert.equal(formatted.fragrances.length, 0,
    `T-CC-11 — fallback must produce no recommendation cards`);
});

// ── Summary ───────────────────────────────────────────────────────────────────

Promise.all(_tests).then(() => {
  const total = passed + failed;
  console.log(`\n${total} checks  |  ${passed} passed  |  ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
});
