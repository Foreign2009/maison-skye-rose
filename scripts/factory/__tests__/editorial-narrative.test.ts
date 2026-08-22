/**
 * EP-CAT-P12-R1: Editorial Narrative-Only Mode — Regression Tests
 *
 * Validates the BRAND_NARRATIVE_ONLY discriminator and the narrative-only
 * editorial path that prevents note invention when no authoritative evidence exists.
 *
 * Run: npx tsx scripts/factory/__tests__/editorial-narrative.test.ts
 */

import assert from "node:assert/strict";
import { isNarrativeOnlyMode } from "../producers/EditorialProducer";
import { EditorialProducer }   from "../producers/EditorialProducer";
import type { FactoryContext, FactoryConfig, FragranceKnowledge } from "../core/types";
import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError
      ? `${err.message}`
      : String(err);
    console.error(`  ✗  ${name}\n     ${msg}`);
    failed++;
  }
}

// ── Subclass to expose protected buildPrompt ──────────────────────────────────

class TestableEditorialProducer extends EditorialProducer {
  public exposeBuildPrompt(ctx: FactoryContext) {
    return this.buildPrompt(ctx);
  }
}

// ── Fixture builders ──────────────────────────────────────────────────────────

const TEST_CONFIG: FactoryConfig = {
  defaultProvider: "claude",
  providers: {
    claude: {
      name:         "claude",
      modelId:      "claude-haiku-4-5-20251001",
      apiKeyEnvVar: "ANTHROPIC_API_KEY",
    },
  },
  producers: {
    EditorialProducer: {
      enabled:       true,
      temperature:   0.8,
      maxTokens:     512,
      promptVersion: "1.1.0",
      promptFallback: "fail",
    },
  },
  maxSessionTokens:     50_000,
  maxProducerTokens:    5_000,
  dryRun:               false,
  logLevel:             "normal",
  logProducerArtifacts: false,
  generationTimeout:    30_000,
  producerTimeout:      60_000,
  maxAttempts:          3,
  backoffStrategy:      "exponential",
  backoffBaseMs:        1_000,
};

function makeRecord(overrides: Partial<FragranceKnowledge> & {
  notesTop?:    string[];
  notesHeart?:  string[];
  notesBase?:   string[];
} = {}): FragranceKnowledge {
  const { notesTop = [], notesHeart = [], notesBase = [], ...rest } = overrides;
  return {
    id:             "torino24-inspired",
    slug:           "torino24-inspired",
    brand:          "Maison Skye & Rose",
    name:           "Torino24 Inspired",
    collection:     "Elite",
    catalogVersion: "1.0",
    status:         "active",
    gender:         "unisex",
    family:         ["Fruity"],
    scentCharacter: "Balanced Signature",
    projection:     "moderate",
    profile:        "Fruity Gourmand",
    season:         "Year-Round",
    notes: {
      top:   notesTop,
      heart: notesHeart,
      base:  notesBase,
    },
    notesEvidenceLocked: true,
    mood:           "Fruity Gourmand",
    vibe:           [],
    occasions:      ["Daily Wear"],
    seasons:        ["Spring", "Summer", "Autumn", "Winter"],
    signatureStyle: ["Inspired by Xerjoff TORINO24"],
    recommendedFor: [],
    prices:         { "5ml": 60, "10ml": 100, "30ml": 250 },
    images:         { "5ml": "", "10ml": "", "30ml": "" },
    bestSeller:     false,
    newArrival:     false,
    subtitle:       "Inspired by Xerjoff TORINO24",
    sweetness:      2,
    freshness:      2,
    warmth:         2,
    intensity:      3,
    versatility:    3,
    popularity:     5,
    ...rest,
  };
}

function makeDisplay(overrides: Partial<DisplayFragrance> = {}): DisplayFragrance {
  return {
    title:      "Torino24 Inspired",
    collection: "Elite",
    subtitle:   "Inspired by Xerjoff TORINO24",
    mood:       "Fruity Gourmand",
    profile:    "Fruity Gourmand",
    season:     "Year-Round",
    notes:      [],
    bestSeller: false,
    newArrival: false,
    prices:     { "5ml": 60, "10ml": 100, "30ml": 250 },
    images:     { "5ml": "", "10ml": "", "30ml": "" },
    notesEvidenceLocked: true,
    notesStructured:     { top: [], heart: [], base: [] },
    ...overrides,
  };
}

function makeContext(
  displayFrag: DisplayFragrance,
  record: FragranceKnowledge,
  configOverrides: Partial<FactoryConfig> = {},
): FactoryContext {
  return {
    runId:            "test-run-id",
    factoryVersion:   "0.5.0",
    wave:             null,
    startedAt:        new Date(),
    slug:             record.slug,
    name:             record.name,
    collection:       record.collection,
    displayFrag,
    scaffoldRecord:   record,
    currentRecord:    record,
    nativeFragrances: new Map(),
    catalogueSize:    0,
    config:           { ...TEST_CONFIG, ...configOverrides },
  };
}

// ── Tests: isNarrativeOnlyMode discriminator ──────────────────────────────────

console.log("\nEP-CAT-P12-R1 — Editorial Narrative-Only Mode Regression Tests\n");
console.log("── isNarrativeOnlyMode discriminator ──\n");

// TEST 1: BRAND_NARRATIVE_ONLY condition — all tiers empty, evidence-locked → narrative mode
test("TEST 1 — discriminator: true for notesEvidenceLocked=true + all empty tiers (Torino24 case)", () => {
  assert.equal(
    isNarrativeOnlyMode(true, [], [], []),
    true,
    "Must return true for evidence-locked record with all empty note tiers",
  );
});

// TEST 2: evidence-locked + non-empty top tier → standard mode
test("TEST 2 — discriminator: false for notesEvidenceLocked=true + non-empty top tier", () => {
  assert.equal(
    isNarrativeOnlyMode(true, ["Bergamot"], [], []),
    false,
    "Must return false when top tier has notes — standard pyramid path applies",
  );
});

// TEST 3: evidence-locked + non-empty heart tier → standard mode
test("TEST 3 — discriminator: false for notesEvidenceLocked=true + non-empty heart tier", () => {
  assert.equal(
    isNarrativeOnlyMode(true, [], ["Rose", "Jasmine"], []),
    false,
    "Must return false when heart tier has notes — standard pyramid path applies",
  );
});

// TEST 4: evidence-locked + non-empty base tier → standard mode
test("TEST 4 — discriminator: false for notesEvidenceLocked=true + non-empty base tier", () => {
  assert.equal(
    isNarrativeOnlyMode(true, [], [], ["Sandalwood"]),
    false,
    "Must return false when base tier has notes — standard pyramid path applies",
  );
});

// TEST 5: not evidence-locked + all empty → standard mode (not narrative)
test("TEST 5 — discriminator: false for notesEvidenceLocked=false + all empty tiers", () => {
  assert.equal(
    isNarrativeOnlyMode(false, [], [], []),
    false,
    "Must return false when not evidence-locked — standard CompositionProducer path applies",
  );
});

// TEST 6: evidence-locked undefined + all empty → standard mode
test("TEST 6 — discriminator: false for notesEvidenceLocked=undefined + all empty tiers", () => {
  assert.equal(
    isNarrativeOnlyMode(undefined, [], [], []),
    false,
    "Must return false when notesEvidenceLocked is absent — standard path applies",
  );
});

// TEST 7: UNORDERED_GOVERNED_NOTES pattern — evidence-locked + non-empty heart → standard mode
// Guards that UNORDERED entries (e.g. Jo Malone) are NOT treated as narrative-only.
test("TEST 7 — discriminator: false for UNORDERED_GOVERNED_NOTES (heart-only bouquet)", () => {
  const governed = ["Fig Leaf", "Lotus Flower", "Vetiver"];
  assert.equal(
    isNarrativeOnlyMode(true, [], governed, []),
    false,
    "UNORDERED_GOVERNED_NOTES must NOT be treated as narrative-only — heart[] has governed notes",
  );
});

// TEST 8: SPARSE pyramid — evidence-locked + 1-per-tier → standard mode
// Guards that SPARSE entries (e.g. Scandal Pour Homme) are NOT narrative-only.
test("TEST 8 — discriminator: false for SPARSE structured pyramid (1-1-1 case)", () => {
  assert.equal(
    isNarrativeOnlyMode(true, ["Geranium"], ["Tonka Bean"], ["Sandalwood"]),
    false,
    "SPARSE pyramid with 1 note per tier must NOT be narrative-only",
  );
});

// ── Tests: buildPrompt narrative-only path ────────────────────────────────────

console.log("\n── buildPrompt narrative-only path ──\n");

const producer = new TestableEditorialProducer();

// TEST 9: Narrative path uses promptVersion "1.2.0-narrative"
test("TEST 9 — narrative path: promptVersion is '1.2.0-narrative'", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.equal(task.promptVersion, "1.2.0-narrative",
    `Expected promptVersion '1.2.0-narrative'; got '${task.promptVersion}'`);
});

// TEST 10: Narrative path does NOT include "Notes pyramid:" in user message
test("TEST 10 — narrative path: user message does not contain 'Notes pyramid:'", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.ok(
    !task.userMessage.includes("Notes pyramid:"),
    "Narrative-only user message must NOT contain 'Notes pyramid:' — notes are absent",
  );
});

// TEST 11: Narrative path does NOT include "not yet set" in user message
test("TEST 11 — narrative path: user message does not contain 'not yet set'", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.ok(
    !task.userMessage.includes("not yet set"),
    "Narrative-only user message must NOT contain 'not yet set' — prevents model from reading empty tiers",
  );
});

// TEST 12: Narrative path user message contains the Mood field
test("TEST 12 — narrative path: user message contains Mood field", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.ok(
    task.userMessage.includes("Mood:"),
    "Narrative-only user message must contain 'Mood:' — mood is the primary creative input",
  );
});

// TEST 13: Narrative path user message contains the Profile field
test("TEST 13 — narrative path: user message contains Profile field", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.ok(
    task.userMessage.includes("Profile:"),
    "Narrative-only user message must contain 'Profile:' — used as character anchor",
  );
});

// TEST 14: Narrative path system prompt does NOT contain "evocative notes"
test("TEST 14 — narrative path: system prompt does not contain 'evocative notes'", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.ok(
    !task.systemPrompt.toLowerCase().includes("evocative notes"),
    "Narrative-only system prompt must NOT contain 'evocative notes' — this instruction causes note invention",
  );
});

// TEST 15: Narrative path system prompt does NOT contain "Name the most"
test("TEST 15 — narrative path: system prompt does not contain 'Name the most'", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.ok(
    !task.systemPrompt.includes("Name the most"),
    "Narrative-only system prompt must NOT contain 'Name the most' — unsafe instruction for note invention",
  );
});

// TEST 16: Standard path still uses promptVersion from config (not "1.2.0-narrative")
test("TEST 16 — standard path: non-narrative fragrance uses configured promptVersion", () => {
  const display = makeDisplay({
    notesEvidenceLocked: true,
    notesStructured: { top: ["Bergamot"], heart: ["Rose"], base: ["Sandalwood"] },
    notes: ["Bergamot", "Rose", "Sandalwood"],
  });
  const record = makeRecord({ notesTop: ["Bergamot"], notesHeart: ["Rose"], notesBase: ["Sandalwood"] });
  const ctx    = makeContext(display, record);
  const task   = producer.exposeBuildPrompt(ctx);
  assert.notEqual(task.promptVersion, "1.2.0-narrative",
    "Standard path must NOT use narrative promptVersion");
  assert.equal(task.promptVersion, "1.1.0",
    `Standard path must use config promptVersion '1.1.0'; got '${task.promptVersion}'`);
});

// TEST 17: Standard path includes "Notes pyramid:" in user message
test("TEST 17 — standard path: user message contains 'Notes pyramid:' when notes present", () => {
  const display = makeDisplay({
    notesEvidenceLocked: true,
    notesStructured: { top: ["Bergamot"], heart: ["Rose"], base: ["Sandalwood"] },
    notes: ["Bergamot", "Rose", "Sandalwood"],
  });
  const record = makeRecord({ notesTop: ["Bergamot"], notesHeart: ["Rose"], notesBase: ["Sandalwood"] });
  const ctx    = makeContext(display, record);
  const task   = producer.exposeBuildPrompt(ctx);
  assert.ok(
    task.userMessage.includes("Notes pyramid:"),
    "Standard path must include 'Notes pyramid:' when notes are present",
  );
});

// TEST 18: Narrative path promptName is still "editorial"
test("TEST 18 — narrative path: promptName is 'editorial' (same producer namespace)", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.equal(task.promptName, "editorial",
    `Narrative path must keep promptName 'editorial'; got '${task.promptName}'`);
});

// TEST 19: Narrative path user message contains Collection field
test("TEST 19 — narrative path: user message contains Collection field", () => {
  const ctx  = makeContext(makeDisplay(), makeRecord());
  const task = producer.exposeBuildPrompt(ctx);
  assert.ok(
    task.userMessage.includes("Collection:"),
    "Narrative-only user message must contain 'Collection:' for collection-character context",
  );
});

// TEST 20: Non-evidence-locked + empty tiers (normal pre-AI state) → standard path, not narrative
// This guards the transition window between scaffold and CompositionProducer execution.
test("TEST 20 — standard path: non-evidence-locked empty tiers use standard path (pre-AI scaffold state)", () => {
  const display = makeDisplay({ notesEvidenceLocked: undefined, notesStructured: undefined, notes: [] });
  const record  = makeRecord({ notesEvidenceLocked: undefined, notesTop: [], notesHeart: [], notesBase: [] });
  const ctx     = makeContext(display, record);
  const task    = producer.exposeBuildPrompt(ctx);
  assert.notEqual(task.promptVersion, "1.2.0-narrative",
    "Non-evidence-locked empty tiers must use standard path — CompositionProducer runs first");
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error(`\n  FAIL — ${failed} test(s) did not pass.\n`);
  process.exit(1);
} else {
  console.log(`\n  PASS — all ${passed} editorial narrative-only regression tests passed.\n`);
}
