/**
 * Comparison-routing regression suite
 *
 * Mocking strategy (Part A — handler-level tests):
 *   The @anthropic-ai/sdk module is replaced in Node.js require.cache BEFORE
 *   route.ts is loaded via createRequire. This ensures `const client = new Anthropic()`
 *   in route.ts constructs a MockAnthropic whose `messages.create` reads from a
 *   shared `_mock` controller object. No test-only exports in production code.
 *
 * Part A — Handler-level tests (T-H-*):
 *   Call the actual POST handler. Assertions are on the final JSON response, not on
 *   intermediate routing state. `_mock` controls what the injected Anthropic returns.
 *
 * Part B — Function-level tests (T-F-*):
 *   Direct tests of callClaude, resolveIntent, planConversation. Cover behavior that
 *   is not visible from the response JSON (exact compareSlug contents, accent parity,
 *   flanker slug identity, and/& variant equivalence).
 *
 * Covers:
 *   T-H-01  Generic three-fragrance comparison (cached path) — exact scores + occasions
 *   T-H-02  Explicit three-fragrance comparison (empty state) — exact scores + occasions
 *   T-H-03  Explicit selection overrides stale recs — named frags present, stale absent
 *   T-H-04  Hermès/Hermes equivalence — identical response.content
 *   T-H-05  Provider max_tokens → TRUNCATION_FALLBACK in final JSON + empty fragrances
 *   T-H-06  Prose replaced by deterministic output with all three names + exact scores
 *   T-H-07  Insufficient selection — no /5 scores, deterministic guard does not fire
 *
 *   T-F-01  callClaude: max_tokens → TRUNCATION_FALLBACK
 *   T-F-02  callClaude: end_turn → model text preserved
 *   T-F-03  resolveIntent: accented Hermès — all three compareSlug entries
 *   T-F-04  resolveIntent: unaccented Hermes — all three compareSlug entries
 *   T-F-05  accented and unaccented produce identical compareSlug
 *   T-F-06  Flanker safety: exact slugs sauvage-elixir-inspired vs sauvage-inspired
 *   T-F-07  and/& normalization: spaced "and", spaced "&", unspaced "&" — identical
 *   T-F-08  Clarification routing: vague first turn → clarification action
 *
 * Run: npx tsx scripts/factory/__tests__/comparison-routing.test.ts
 */

import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { NextRequest }   from "next/server";

import { resolveIntent }    from "../../../app/lib/concierge/intentResolver";
import { planConversation } from "../../../app/lib/concierge/conversationPlanner";
import {
  callClaude,
  TRUNCATION_FALLBACK,
  MAX_TOKENS,
}                           from "../../../app/lib/concierge/claudeClient";
import type Anthropic       from "@anthropic-ai/sdk";
import type {
  ConversationState,
  ConversationProfile,
}                           from "../../../app/lib/concierge/types";

// ── @anthropic-ai/sdk mock ────────────────────────────────────────────────────
// Installed in require.cache before route.ts is loaded so that
// `const client = new Anthropic()` in route.ts receives a controllable mock.
//
// The static imports above may cause the real SDK to land in require.cache.
// Overwriting that entry here is intentional — the real SDK is only needed for
// the type import (which is erased at runtime) and for callClaude unit tests
// that pass their own mock client directly.

const _mock = {
  stopReason: "end_turn" as "end_turn" | "max_tokens",
  text: "",
  set(stopReason: "end_turn" | "max_tokens", text = "") {
    this.stopReason = stopReason;
    this.text = text;
  },
};

const _req = createRequire(import.meta.url);
const _sdkPath = _req.resolve("@anthropic-ai/sdk");

class _MockAnthropic {
  messages = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create: async (_params: unknown) => ({
      stop_reason: _mock.stopReason,
      content: _mock.stopReason === "end_turn"
        ? [{ type: "text", text: _mock.text }]
        : [],
    }),
  };
}

// Overwrite require.cache with the mock module.
// `__esModule: true` is required: tsx wraps CJS requires with __toESM(), which
// only honours an existing `default` property when __esModule is set. Without it,
// __toESM sets default = the whole exports object and _MockAnthropic is lost.
import { dirname } from "node:path";
(_req.cache as Record<string, unknown>)[_sdkPath] = {
  id:       _sdkPath,
  filename: _sdkPath,
  loaded:   true,
  exports:  { __esModule: true, default: _MockAnthropic, Anthropic: _MockAnthropic },
  paths:    [],
  children: [],
  parent:   null,
  require:  _req,
  path:     dirname(_sdkPath),
};

// Load route.ts AFTER the mock is in place.
// `const client = new Anthropic()` at route module-load time will call _MockAnthropic.
type PostFn = (req: NextRequest) => Promise<Response>;
const { POST } = _req("../../../app/api/concierge/route") as { POST: PostFn };

// ── Harness ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError ? err.message : String(err);
    console.error(`  ✗  ${name}\n     ${msg}`);
    failed++;
  }
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const EMPTY_PROFILE: ConversationProfile = {
  gender:        undefined,
  occasions:     [],
  families:      [],
  vibes:         [],
  rejectedSlugs: [],
  price:         undefined,
};

const EMPTY_STATE: ConversationState = {
  turns:                   [],
  profile:                 EMPTY_PROFILE,
  context:                 {},
  lastRecommendationSlugs: [],
  selectedSlug:            undefined,
  comparisonSlugs:         [],
  lastArticleSlug:         undefined,
  lastCollection:          undefined,
  clarificationTurnCount:  0,
  consultationPlan:        undefined,
};

const THREE_REC_SLUGS = ["oud-wood-inspired", "sauvage-inspired", "terre-d'hermes-inspired"];
const STALE_SLUGS     = ["baccarat-rouge-540-inspired", "black-orchid-inspired"];

function makeStateWithRecs(slugs: string[]): ConversationState {
  return {
    ...EMPTY_STATE,
    turns: [
      { role: "user",      content: "I want something woody for evenings." },
      { role: "assistant", content: "Here are three options.", retrievedSlugs: slugs },
    ],
    lastRecommendationSlugs: slugs,
  };
}

// ── Helper to call POST and parse JSON ────────────────────────────────────────

function makeReq(message: string, state: ConversationState): NextRequest {
  return new NextRequest("http://localhost/api/concierge", {
    method:  "POST",
    body:    JSON.stringify({ message, state }),
    headers: { "content-type": "application/json" },
  });
}

async function post(message: string, state: ConversationState): Promise<Record<string, unknown>> {
  const res = await POST(makeReq(message, state));
  return res.json() as Promise<Record<string, unknown>>;
}

// Function-level callClaude mock (separate from handler mock — passed directly)
function fnMockClient(stopReason: "end_turn" | "max_tokens", text = ""): Anthropic {
  return {
    messages: {
      create: async () => ({
        stop_reason: stopReason,
        content: stopReason === "end_turn" ? [{ type: "text", text }] : [],
      }),
    },
  } as unknown as Anthropic;
}

// ── Shared messages ───────────────────────────────────────────────────────────

// Generic back-reference (cached path)
const MSG_GENERIC    = "Compare all three fragrances you just recommended, including their sweetness, freshness, intensity and suitable occasions.";
// Explicit named (accented and unaccented)
const MSG_ACCENTED   = "Compare Oud Wood Inspired, Sauvage Inspired and Terre d'Hermès Inspired by sweetness, freshness, intensity and suitable occasions.";
const MSG_UNACCENTED = "Compare Oud Wood Inspired, Sauvage Inspired and Terre d'Hermes Inspired by sweetness, freshness, intensity and suitable occasions.";

// Expected exact score strings from catalogue data (verified: sw=1,fr=1,int=4 / sw=1,fr=5,int=4 / sw=1,fr=3,int=3)
const SCORE_OUD   = "Oud Wood Inspired: sweetness 1/5, freshness 1/5, intensity 4/5";
const SCORE_SAUV  = "Sauvage Inspired: sweetness 1/5, freshness 5/5, intensity 4/5";
const SCORE_TERRE = "Terre d'Hermes Inspired: sweetness 1/5, freshness 3/5, intensity 3/5";

// Expected first occasion for absence-of-stale check
const OCC_OUD_FIRST  = "occasions: Formal Events";
const OCC_SAUV_FIRST = "occasions: Daily Wear";

// Neutral probe text (passes safety validation, contains no /5 score patterns)
const PROSE_MOCK = "These three options each have their own character. It really depends on your taste.";

// ── Part A: Handler-level tests ───────────────────────────────────────────────

async function runHandlerTests(): Promise<void> {

// ── T-H-01: Generic comparison after recommendations (cached path) ─────────────

console.log("\n  ── T-H-01  Generic comparison (cached path) — exact scores ──");

await test("T-H-01-a  exact Oud Wood score row present", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_GENERIC, makeStateWithRecs(THREE_REC_SLUGS));
  assert.ok((body.content as string).includes(SCORE_OUD),
    `content must include "${SCORE_OUD}"`);
});

await test("T-H-01-b  exact Sauvage score row present", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_GENERIC, makeStateWithRecs(THREE_REC_SLUGS));
  assert.ok((body.content as string).includes(SCORE_SAUV),
    `content must include "${SCORE_SAUV}"`);
});

await test("T-H-01-c  exact Terre d'Hermes score row present", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_GENERIC, makeStateWithRecs(THREE_REC_SLUGS));
  assert.ok((body.content as string).includes(SCORE_TERRE),
    `content must include "${SCORE_TERRE}"`);
});

await test("T-H-01-d  catalogue occasions present (Oud Wood first occasion)", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_GENERIC, makeStateWithRecs(THREE_REC_SLUGS));
  assert.ok((body.content as string).includes(OCC_OUD_FIRST),
    `content must include "${OCC_OUD_FIRST}"`);
});

await test("T-H-01-e  model prose replaced (content !== PROSE_MOCK)", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_GENERIC, makeStateWithRecs(THREE_REC_SLUGS));
  assert.notEqual(body.content, PROSE_MOCK, "model prose must be replaced by catalogue comparison");
});

// ── T-H-02: Explicit three-fragrance comparison, empty state ──────────────────

console.log("\n  ── T-H-02  Explicit comparison (empty state) — exact scores ──");

await test("T-H-02-a  exact Oud Wood score row present", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, EMPTY_STATE);
  assert.ok((body.content as string).includes(SCORE_OUD),    `must include "${SCORE_OUD}"`);
});

await test("T-H-02-b  exact Sauvage score row present", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, EMPTY_STATE);
  assert.ok((body.content as string).includes(SCORE_SAUV),   `must include "${SCORE_SAUV}"`);
});

await test("T-H-02-c  exact Terre d'Hermes score row present", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, EMPTY_STATE);
  assert.ok((body.content as string).includes(SCORE_TERRE),  `must include "${SCORE_TERRE}"`);
});

await test("T-H-02-d  catalogue occasions present (Sauvage first occasion)", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, EMPTY_STATE);
  assert.ok((body.content as string).includes(OCC_SAUV_FIRST),
    `must include "${OCC_SAUV_FIRST}"`);
});

// ── T-H-03: Explicit comparison overrides stale recommendations ───────────────

console.log("\n  ── T-H-03  Named comparison overrides stale recommendations ──");

await test("T-H-03-a  named frags: all three exact score rows present", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, makeStateWithRecs(STALE_SLUGS));
  const c = body.content as string;
  assert.ok(c.includes(SCORE_OUD),   `must include Oud Wood scores`);
  assert.ok(c.includes(SCORE_SAUV),  `must include Sauvage scores`);
  assert.ok(c.includes(SCORE_TERRE), `must include Terre scores`);
});

await test("T-H-03-b  stale recs not in comparison rows: Baccarat Rouge 540 absent before first /5", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, makeStateWithRecs(STALE_SLUGS));
  const c = body.content as string;
  // Deterministic rows start immediately; stale names must not appear as row headers
  // Pattern: "Baccarat Rouge 540 Inspired:" would only appear if it were a comparison candidate
  assert.ok(!c.includes("Baccarat Rouge 540 Inspired:"),
    "Baccarat Rouge 540 Inspired must not appear as a score-row header");
  assert.ok(!c.includes("Black Orchid Inspired:"),
    "Black Orchid Inspired must not appear as a score-row header");
});

// ── T-H-04: Hermès/Hermes equivalence through handler ────────────────────────

console.log("\n  ── T-H-04  Hermès/Hermes equivalence ──");

await test("T-H-04-a  accented and unaccented produce identical response.content", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const bodyA = await post(MSG_ACCENTED,   EMPTY_STATE);
  _mock.set("end_turn", PROSE_MOCK);
  const bodyU = await post(MSG_UNACCENTED, EMPTY_STATE);
  assert.equal(bodyA.content, bodyU.content,
    "accented Hermès and unaccented Hermes must produce identical response.content");
});

await test("T-H-04-b  Terre d'Hermes exact score row present for unaccented input", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_UNACCENTED, EMPTY_STATE);
  assert.ok((body.content as string).includes(SCORE_TERRE),
    `unaccented input must still produce "${SCORE_TERRE}"`);
});

// ── T-H-05: Provider max_tokens → TRUNCATION_FALLBACK ────────────────────────

console.log("\n  ── T-H-05  max_tokens → TRUNCATION_FALLBACK ──");

await test("T-H-05-a  response.content === TRUNCATION_FALLBACK", async () => {
  _mock.set("max_tokens");
  const body = await post(MSG_GENERIC, makeStateWithRecs(THREE_REC_SLUGS));
  assert.equal(body.content, TRUNCATION_FALLBACK,
    "response.content must be TRUNCATION_FALLBACK on max_tokens");
});

await test("T-H-05-b  fragrances array is empty on TRUNCATION_FALLBACK", async () => {
  _mock.set("max_tokens");
  const body = await post(MSG_GENERIC, makeStateWithRecs(THREE_REC_SLUGS));
  assert.equal((body.fragrances as unknown[]).length, 0,
    "fragrances must be empty when provider returns max_tokens");
});

// ── T-H-06: Prose replaced by deterministic output — exact rows ───────────────

console.log("\n  ── T-H-06  Deterministic output: exact names + scores ──");

await test("T-H-06-a  exact Oud Wood row: name, sweetness 1/5, freshness 1/5, intensity 4/5", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, EMPTY_STATE);
  assert.ok((body.content as string).includes(SCORE_OUD), `"${SCORE_OUD}" must be in output`);
});

await test("T-H-06-b  exact Sauvage row: name, sweetness 1/5, freshness 5/5, intensity 4/5", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, EMPTY_STATE);
  assert.ok((body.content as string).includes(SCORE_SAUV), `"${SCORE_SAUV}" must be in output`);
});

await test("T-H-06-c  exact Terre row: name, sweetness 1/5, freshness 3/5, intensity 3/5", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post(MSG_ACCENTED, EMPTY_STATE);
  assert.ok((body.content as string).includes(SCORE_TERRE), `"${SCORE_TERRE}" must be in output`);
});

// ── T-H-07: Insufficient selection — deterministic guard does not fire ─────────

console.log("\n  ── T-H-07  Insufficient selection: prose passes through ──");

await test("T-H-07-a  'compare them' with empty state: no score rows (/5 absent)", async () => {
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post("compare them — which is more intense?", EMPTY_STATE);
  assert.ok(!(body.content as string).includes("/5"),
    "no /5 scores when fewer than 2 candidates resolved");
});

await test("T-H-07-b  single named frag: no score rows (/5 absent)", async () => {
  // Message names one fragrance and carries comparison intent ("compare") but has
  // no direction signal ("fresher", "warmer", etc.) — avoids the anchored_refinement
  // upgrade that fires when a direction signal + single entity are both present and
  // would invoke buildNoMatchResponse (which emits a boundary "/5" score string).
  _mock.set("end_turn", PROSE_MOCK);
  const body = await post("compare sauvage inspired to other fragrances in the range", EMPTY_STATE);
  assert.ok(!(body.content as string).includes("/5"),
    "no /5 scores when only one fragrance is resolvable");
});

} // end runHandlerTests

// ── Part B: Function-level tests ─────────────────────────────────────────────

async function runFunctionTests(): Promise<void> {

// ── T-F-01 / T-F-02: callClaude unit ─────────────────────────────────────────

console.log("\n  ── T-F-01/02  callClaude (function-level, own mock client) ──");

await test("T-F-01  max_tokens → TRUNCATION_FALLBACK", async () => {
  const res = await callClaude(fnMockClient("max_tokens"), [], "sys", MAX_TOKENS);
  assert.equal(res, TRUNCATION_FALLBACK);
});

await test("T-F-02  end_turn → model text preserved", async () => {
  const text = "Sauvage has freshness 5/5.";
  const res  = await callClaude(fnMockClient("end_turn", text), [], "sys", MAX_TOKENS);
  assert.equal(res, text);
});

// ── T-F-03/04/05: resolveIntent accent normalization ─────────────────────────

console.log("\n  ── T-F-03/04/05  Accent normalization (resolveIntent) ──");

await test("T-F-03  accented Hermès: all three compareSlug including Terre", () => {
  const ri = resolveIntent(MSG_ACCENTED, {});
  assert.equal(ri.compareSlug.length, 3,
    `compareSlug must have 3 entries, got ${ri.compareSlug.length}: [${ri.compareSlug.join(", ")}]`);
  assert.ok(ri.compareSlug.includes("terre-d'hermes-inspired"),
    "terre-d'hermes-inspired must be in compareSlug for accented input");
});

await test("T-F-04  unaccented Hermes: all three compareSlug including Terre", () => {
  const ri = resolveIntent(MSG_UNACCENTED, {});
  assert.equal(ri.compareSlug.length, 3,
    `compareSlug must have 3 entries, got ${ri.compareSlug.length}: [${ri.compareSlug.join(", ")}]`);
  assert.ok(ri.compareSlug.includes("terre-d'hermes-inspired"),
    "terre-d'hermes-inspired must be in compareSlug for unaccented input");
});

await test("T-F-05  accented and unaccented produce identical compareSlug (sorted)", () => {
  const a = resolveIntent(MSG_ACCENTED,   {}).compareSlug.slice().sort();
  const u = resolveIntent(MSG_UNACCENTED, {}).compareSlug.slice().sort();
  assert.deepEqual(a, u, "sorted compareSlug must be identical for both inputs");
});

// ── T-F-06: Flanker safety — exact slug identity ──────────────────────────────

console.log("\n  ── T-F-06  Flanker safety (exact slug identity) ──");

await test("T-F-06-a  exact two slugs: sauvage-elixir-inspired and sauvage-inspired", () => {
  const ri = resolveIntent(
    "compare sauvage elixir inspired and sauvage inspired, which is fresher?", {}
  );
  assert.equal(ri.compareSlug.length, 2,
    `compareSlug must have exactly 2 entries, got ${ri.compareSlug.length}: [${ri.compareSlug.join(", ")}]`);
  assert.ok(ri.compareSlug.includes("sauvage-elixir-inspired"),
    "sauvage-elixir-inspired must be present");
  assert.ok(ri.compareSlug.includes("sauvage-inspired"),
    "sauvage-inspired must be present");
  // Neither duplicate
  assert.notEqual(ri.compareSlug[0], ri.compareSlug[1],
    "the two entries must be distinct slugs (flanker not consumed by shorter prefix)");
});

await test("T-F-06-b  sauvage alone does not absorb sauvage elixir (forward order)", () => {
  const ri = resolveIntent(
    "how does sauvage elixir inspired compare to sauvage inspired for daytime?", {}
  );
  assert.ok(ri.compareSlug.includes("sauvage-elixir-inspired"),
    "sauvage-elixir-inspired must appear");
  assert.ok(ri.compareSlug.includes("sauvage-inspired"),
    "sauvage-inspired must appear");
  assert.equal(
    ri.compareSlug.filter(s => s === "sauvage-elixir-inspired").length, 1,
    "sauvage-elixir-inspired must appear exactly once (not duplicated)"
  );
});

// ── T-F-07: and/& normalization variants ─────────────────────────────────────

console.log("\n  ── T-F-07  and/& normalization variants ──");

await test("T-F-07-a  spaced ' and ' resolves both slugs", () => {
  const ri = resolveIntent("compare sauvage inspired and oud wood inspired for evenings", {});
  assert.ok(ri.compareSlug.includes("sauvage-inspired"),  "sauvage-inspired with spaced 'and'");
  assert.ok(ri.compareSlug.includes("oud-wood-inspired"), "oud-wood-inspired with spaced 'and'");
});

await test("T-F-07-b  spaced ' & ' resolves both slugs", () => {
  const ri = resolveIntent("compare sauvage inspired & oud wood inspired for evenings", {});
  assert.ok(ri.compareSlug.includes("sauvage-inspired"),  "sauvage-inspired with spaced '&'");
  assert.ok(ri.compareSlug.includes("oud-wood-inspired"), "oud-wood-inspired with spaced '&'");
});

await test("T-F-07-c  unspaced '&' resolves both slugs", () => {
  const ri = resolveIntent("compare sauvage inspired&oud wood inspired for evenings", {});
  assert.ok(ri.compareSlug.includes("sauvage-inspired"),  "sauvage-inspired with unspaced '&'");
  assert.ok(ri.compareSlug.includes("oud-wood-inspired"), "oud-wood-inspired with unspaced '&'");
});

await test("T-F-07-d  all three variants produce identical compareSlug (sorted)", () => {
  const a = resolveIntent("compare sauvage inspired and oud wood inspired", {}).compareSlug.slice().sort();
  const b = resolveIntent("compare sauvage inspired & oud wood inspired", {}).compareSlug.slice().sort();
  const c = resolveIntent("compare sauvage inspired&oud wood inspired",   {}).compareSlug.slice().sort();
  assert.deepEqual(a, b, "spaced 'and' vs spaced '&' must produce identical compareSlug");
  assert.deepEqual(b, c, "spaced '&' vs unspaced '&' must produce identical compareSlug");
});

// ── T-F-08: Clarification routing ─────────────────────────────────────────────

console.log("\n  ── T-F-08  Clarification routing ──");

await test("T-F-08  vague first turn → clarification action, requiresComparison=false", () => {
  const plan = planConversation("I need a new fragrance", EMPTY_STATE);
  assert.equal(plan.action, "clarification",
    `plan.action must be clarification, got: ${plan.action}`);
  assert.equal(plan.requiresComparison, false,
    "requiresComparison must be false on a clarification turn");
});

} // end runFunctionTests

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  try {
    await runHandlerTests();
    await runFunctionTests();
  } finally {
    const total = passed + failed;
    console.log(`\n  ${total} tests — ${passed} passed, ${failed} failed`);
    console.log(`  Part A (handler-level): T-H-01 through T-H-07`);
    console.log(`  Part B (function-level): T-F-01 through T-F-08`);
    if (failed > 0) process.exit(1);
  }
})();
