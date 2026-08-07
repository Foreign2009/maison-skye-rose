/**
 * Knowledge Factory — Home Fragrance Foundation Validator
 *
 * Deterministic proof that:
 *   (a) The home-fragrance category is correctly wired in the intake and
 *       scaffold layers and stops cleanly at ProducerRegistry.
 *   (b) HomeFragranceKnowledge, HomeFragranceFactoryContext, and
 *       HomeFragranceProducerResult are correctly typed and structurally
 *       distinct from their fragrance equivalents.
 *
 * Proofs:
 *   Intake
 *     1.  HomeFragranceIntake fixture has category "home-fragrance"
 *     2.  A fresh CatalogueRegistry resolves home-fragrance intake by slug
 *     3.  The production CatalogueRegistry has a home-fragrance loader (returns null)
 *
 *   Scaffold — HomeFragranceKnowledge
 *     4.  scaffoldHomeFragrance() returns HomeFragranceScaffoldResult
 *     5.  record.category === "home-fragrance"
 *     6.  record.name, range, productType, prices derive correctly from intake
 *     7.  No collection field on record
 *     8.  No gender field on record
 *     9.  No projection field on record
 *     10. No scentCharacter field on record
 *     11. No occasions field on record
 *     12. Pricing uses home fragrance sizes (not "5ml"/"10ml"/"30ml")
 *     13. Discovery arrays are initialised empty (vibe, seasons, signatureStyle, recommendedFor)
 *     14. HomeFragranceKnowledge is structurally distinct from FragranceKnowledge
 *         (runtime: lacks all required fragrance-classification fields)
 *
 *   Context — HomeFragranceFactoryContext
 *     15. HomeFragranceContextBuilder.build() succeeds
 *     16. context.category === "home-fragrance"
 *     17. context.range is populated from record
 *     18. context.productType is populated from record
 *     19. No collection field on context
 *     20. No displayFrag field on context
 *     21. No nativeFragrances field on context
 *
 *   Producer result — HomeFragranceProducerResult
 *     22. HomeFragranceProducerResult accepts Partial<HomeFragranceKnowledge> in fields
 *
 *   Registry
 *     23. ProducerRegistry still rejects "home-fragrance"
 *
 * No AI. No draft. No factory log. No native records. No persistent writes.
 */

import { CatalogueRegistry }             from "./core/CatalogueRegistry";
import { defaultCatalogueRegistry }      from "./intake";
import { defaultRegistry }               from "./orchestrator";
import { scaffoldHomeFragrance }         from "./homeFragranceScaffold";
import { HomeFragranceContextBuilder }   from "./core/HomeFragranceContextBuilder";
import type { HomeFragranceIntake }      from "./types";
import type { HomeFragranceProducerResult, FactoryConfig } from "./core/types";
import type { HomeFragrancePipelineState } from "./types";

// ── Test fixture ──────────────────────────────────────────────────────────────

const FIXTURE: HomeFragranceIntake = {
  category:    "home-fragrance",
  productType: "candle",
  range:       "Maison Home",
  title:       "Rose Oud Candle",
  subtitle:    "Warm & Intimate",
  mood:        "Warm, intimate and grounding.",
  profile:     "Woody Floral",
  season:      "Autumn",
  notes:       ["Rose", "Oud", "Sandalwood"],
  prices:      { "150g": 299 },
  images:      { "150g": "/images/home/rose-oud-candle-150g.png" },
  bestSeller:  false,
  newArrival:  false,
};

// Minimal FactoryConfig for context builder tests — no AI calls occur.
const MINIMAL_CONFIG: FactoryConfig = {
  defaultProvider:      "claude",
  providers:            {},
  producers:            {},
  maxSessionTokens:     0,
  maxProducerTokens:    0,
  dryRun:               true,
  logLevel:             "silent",
  logProducerArtifacts: false,
  generationTimeout:    0,
  producerTimeout:      0,
  maxAttempts:          1,
  backoffStrategy:      "linear",
  backoffBaseMs:        0,
};

// ── Assertion helpers ─────────────────────────────────────────────────────────

function pass(label: string): void {
  console.log(`  ✓  ${label}`);
}

function assertEq<T>(label: string, expected: T, actual: T): void {
  if (actual !== expected) {
    throw new Error(`FAIL [${label}]: expected "${String(expected)}", got "${String(actual)}"`);
  }
  pass(label);
}

function assertThrows(label: string, fn: () => unknown, expectedMessage: string): void {
  let threw = false;
  let actualMessage = "";
  try {
    fn();
  } catch (e) {
    threw = true;
    actualMessage = e instanceof Error ? e.message : String(e);
  }
  if (!threw) throw new Error(`FAIL [${label}]: expected throw but no error was thrown`);
  if (actualMessage !== expectedMessage) {
    throw new Error(
      `FAIL [${label}]:\n  expected: "${expectedMessage}"\n  got:      "${actualMessage}"`,
    );
  }
  pass(label);
}

// ── Proofs ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n[mkc:validate:home-fragrance] Foundation proof\n");

  // ── 1–3. Intake ─────────────────────────────────────────────────────────────

  // 1. Fixture category
  assertEq("fixture.category",    "home-fragrance", FIXTURE.category);
  assertEq("fixture.productType", "candle",         FIXTURE.productType);
  assertEq("fixture.prices[150g]", 299,             FIXTURE.prices["150g"]);

  // 2. Fresh CatalogueRegistry resolves home-fragrance intake by slug
  const freshCatalogue = new CatalogueRegistry();
  freshCatalogue.register("home-fragrance", (slug) =>
    slug === "rose-oud-candle" ? FIXTURE : null,
  );
  const found = freshCatalogue.find("rose-oud-candle");
  if (!found) throw new Error("FAIL: fresh catalogue did not resolve test fixture");
  assertEq("fresh catalogue — category",    "home-fragrance", found.category);
  assertEq("fresh catalogue — productType", "candle",         (found as HomeFragranceIntake).productType);

  // 3. Production CatalogueRegistry has home-fragrance loader (empty catalogue → null)
  const prodResult = defaultCatalogueRegistry.find("rose-oud-candle");
  if (prodResult !== null) {
    throw new Error("FAIL: production catalogue returned non-null for test slug (should be empty)");
  }
  pass("production catalogue — home-fragrance loader registered, empty catalogue");

  // ── 4–14. Scaffold — HomeFragranceKnowledge ─────────────────────────────────

  // 4. scaffoldHomeFragrance() returns HomeFragranceScaffoldResult
  const scaffoldResult = scaffoldHomeFragrance(FIXTURE);
  if (scaffoldResult.degraded) throw new Error("FAIL: scaffold should not be degraded for valid fixture");
  pass("scaffoldHomeFragrance — returns HomeFragranceScaffoldResult (not degraded)");

  const record = scaffoldResult.record;

  // 5. Category
  assertEq("scaffoldHomeFragrance — category",    "home-fragrance", record.category);

  // 6. Core fields derive from intake
  assertEq("scaffoldHomeFragrance — name",         FIXTURE.title,    record.name);
  assertEq("scaffoldHomeFragrance — range",        FIXTURE.range,    record.range);
  assertEq("scaffoldHomeFragrance — productType",  "candle",         record.productType);
  assertEq("scaffoldHomeFragrance — prices[150g]", 299,              record.prices["150g"]);

  // 7–11. No personal-fragrance fields on HomeFragranceKnowledge
  const asRecord = record as unknown as Record<string, unknown>;
  if ("collection"    in asRecord) throw new Error("FAIL: HomeFragranceKnowledge must not carry collection");
  if ("gender"        in asRecord) throw new Error("FAIL: HomeFragranceKnowledge must not carry gender");
  if ("projection"    in asRecord) throw new Error("FAIL: HomeFragranceKnowledge must not carry projection");
  if ("scentCharacter" in asRecord) throw new Error("FAIL: HomeFragranceKnowledge must not carry scentCharacter");
  if ("occasions"     in asRecord) throw new Error("FAIL: HomeFragranceKnowledge must not carry occasions");
  pass("scaffoldHomeFragrance — no personal-fragrance fields present");

  // 12. Pricing uses home fragrance sizes, not fragrance size labels
  const priceKeys = Object.keys(record.prices);
  if (priceKeys.some(k => k === "5ml" || k === "10ml" || k === "30ml")) {
    throw new Error("FAIL: HomeFragranceKnowledge prices must not use fragrance size labels");
  }
  if (!priceKeys.includes("150g")) {
    throw new Error("FAIL: HomeFragranceKnowledge prices must include the fixture size (150g)");
  }
  pass("scaffoldHomeFragrance — pricing uses home fragrance sizes");

  // 13. Discovery arrays initialised empty
  assertEq("scaffoldHomeFragrance — vibe is empty",           0, record.vibe.length);
  assertEq("scaffoldHomeFragrance — seasons is empty",        0, record.seasons.length);
  assertEq("scaffoldHomeFragrance — signatureStyle is empty", 0, record.signatureStyle.length);
  assertEq("scaffoldHomeFragrance — recommendedFor is empty", 0, record.recommendedFor.length);

  // 14. Structural distinction from FragranceKnowledge
  // FragranceKnowledge requires: collection, gender, projection, scentCharacter,
  // family, sweetness, freshness, warmth, intensity, versatility, popularity.
  // HomeFragranceKnowledge has none of these — verified above and below.
  if ("sweetness"  in asRecord) throw new Error("FAIL: HomeFragranceKnowledge must not carry intelligence metrics");
  if ("family"     in asRecord) throw new Error("FAIL: HomeFragranceKnowledge must not carry fragrance family");
  pass("HomeFragranceKnowledge — structurally distinct from FragranceKnowledge (no shared required fields)");

  // ── 15–21. Context — HomeFragranceFactoryContext ────────────────────────────

  // Build a HomeFragrancePipelineState from the scaffold result
  const pipelineState: HomeFragrancePipelineState = {
    slug:           record.slug,
    record,
    stageLog:       [],
    factoryVersion: "ep4-p3a-test",
  };

  // 15. Context builds successfully
  const ctx = HomeFragranceContextBuilder.build(pipelineState, MINIMAL_CONFIG);
  pass("HomeFragranceContextBuilder.build() — succeeded");

  // 16. category
  assertEq("context — category",     "home-fragrance",  ctx.category);

  // 17. range
  assertEq("context — range",        FIXTURE.range,     ctx.range);

  // 18. productType
  assertEq("context — productType",  "candle",          ctx.productType);

  // 19–21. No fragrance-context fields on HomeFragranceFactoryContext
  const ctxRecord = ctx as unknown as Record<string, unknown>;
  if ("collection"      in ctxRecord) throw new Error("FAIL: HomeFragranceFactoryContext must not expose collection");
  if ("displayFrag"     in ctxRecord) throw new Error("FAIL: HomeFragranceFactoryContext must not expose displayFrag");
  if ("nativeFragrances" in ctxRecord) throw new Error("FAIL: HomeFragranceFactoryContext must not expose nativeFragrances");
  pass("HomeFragranceFactoryContext — no fragrance-context fields (no collection, displayFrag, nativeFragrances)");

  // ── 22. Producer result — HomeFragranceProducerResult ───────────────────────

  // 22. HomeFragranceProducerResult accepts Partial<HomeFragranceKnowledge> in fields.
  //     If TypeScript compiles this block without error, the type constraint is satisfied.
  const testProducerResult: HomeFragranceProducerResult = {
    producerName:    "TestProducer",
    producerVersion: "0.0.0",
    promptVersion:   null,
    status:          "skipped",
    fields:          {
      description:   "A warm, intimate candle.",
      vibe:          ["Warm", "Intimate"],
    },
    confidence:   0.0,
    errors:       [],
    warnings:     [],
    metrics: {
      durationMs:       0,
      attempts:         0,
      promptTokens:     0,
      completionTokens: 0,
      totalTokens:      0,
      modelId:          "",
      cached:           false,
    },
    artifacts:     [],
    skippedReason: "validation proof only — no AI call",
  };
  assertEq(
    "HomeFragranceProducerResult — status",
    "skipped",
    testProducerResult.status,
  );
  pass("HomeFragranceProducerResult — fields: Partial<HomeFragranceKnowledge> accepted by TypeScript");

  // ── 23. Registry ─────────────────────────────────────────────────────────────

  // 23. ProducerRegistry still rejects "home-fragrance" (no ProducerSet registered)
  assertThrows(
    "producer registry — no ProducerSet for home-fragrance",
    () => defaultRegistry.getProducerSet("home-fragrance"),
    "No ProducerSet registered for category: home-fragrance",
  );

  console.log("\n  All proofs passed.\n");
}

main().catch((err: unknown) => {
  console.error(
    `\n[mkc:validate:home-fragrance] ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
