/**
 * Knowledge Factory — Home Fragrance Foundation Validator
 *
 * Deterministic proof that:
 *   (a) The home-fragrance category is correctly wired in the intake and
 *       scaffold layers and stops cleanly at ProducerRegistry.
 *   (b) HomeFragranceKnowledge, HomeFragranceFactoryContext, and
 *       HomeFragranceProducerResult are correctly typed and structurally
 *       distinct from their fragrance equivalents.
 *   (c) validateHomeFragranceRecord() correctly gates quality at the
 *       scaffold → validate → draft chain.
 *   (d) mergeHomeFragrance() applies passing producer fields and skips failed.
 *   (e) buildHomeFragranceDraft() renders a HomeFragranceKnowledge draft
 *       with no fragrance-specific fields or size labels.
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
 *   Validator — validateHomeFragranceRecord
 *     24. PASS_WITH_WARNINGS on pre-AI fixture (0 errors, all warnings)
 *     25. 0 errors on pre-AI fixture
 *     26. composition group has single-note quality warnings
 *     27. editorial group has DESCRIPTION_NOT_SET warning
 *     28. discovery group has warnings-only for empty arrays
 *
 *   Merger — mergeHomeFragrance
 *     29. merged fields from passing producer appear in result
 *     30. failed producer fields are not applied
 *
 *   Draft — buildHomeFragranceDraft (pure string render)
 *     31. draft contains "HomeFragranceKnowledge"
 *     32. draft contains category value "home-fragrance"
 *     33. draft contains productType value "candle"
 *     34. draft contains range value "Maison Home"
 *     35. draft contains price key "150g"
 *     36. draft contains notes section
 *     37. draft contains subtitle "Warm & Intimate"
 *     38. draft does NOT contain ": FragranceKnowledge"
 *     39. draft does NOT contain "collection:"
 *     40. draft does NOT contain "gender:"
 *     41. draft does NOT contain "projection:"
 *     42. draft does NOT contain "scentCharacter:"
 *     43. draft does NOT contain "sweetness:"
 *     44. draft does NOT contain '"5ml":' price key
 *     45. draft does NOT contain '"10ml":' price key
 *     46. draft does NOT contain '"30ml":' price key
 *
 *   Negative validator cases
 *     47. empty top notes → NOTES_TOP_REQUIRED error
 *     48. zero price → PRICE_INVALID error
 *     49. empty image → IMAGE_MISSING error
 *     50. missing description → DESCRIPTION_NOT_SET warning (not error)
 *     51. empty range → RANGE_REQUIRED error
 *     52. invalid category → CATEGORY_INVALID error
 *
 *   EP4-P3BR corrections
 *     53. mergeHomeFragrance — merged result has all required HomeFragranceKnowledge fields
 *     54. draft WITHOUT catalogVersion — absent catalogVersion rendered as comment (not property)
 *     55. draft WITHOUT status — absent status rendered as comment (not property)
 *     56. draft WITH catalogVersion "1.0" — value rendered as property
 *     57. draft WITH status "active" — value rendered as property
 *     58. validator — CATALOG_VERSION_MISSING warning present in identity group
 *     59. validator — STATUS_NOT_SET warning present in identity group
 *     60. deriveSlug — "Rose Oud Candle" → "rose-oud-candle" (canonical derivation)
 *     61. validator slug formula — discrepant slug produces SLUG_FORMULA error
 *
 * No AI. No file writes. No factory log. No native records. No persistent state.
 */

import { CatalogueRegistry }             from "./core/CatalogueRegistry";
import { defaultCatalogueRegistry }      from "./intake";
import { defaultRegistry }               from "./orchestrator";
import { scaffoldHomeFragrance }         from "./homeFragranceScaffold";
import { HomeFragranceContextBuilder }   from "./core/HomeFragranceContextBuilder";
import { validateHomeFragranceRecord }   from "../../app/lib/mkc/homeFragranceValidator";
import { mergeHomeFragrance }            from "./homeFragranceMerger";
import { buildHomeFragranceDraft }       from "./HomeFragranceDraftBuilder";
import { deriveSlug }                    from "../../app/lib/mkc/deriveSlug";
import type { HomeFragranceIntake }      from "./types";
import type { HomeFragranceProducerResult, FactoryConfig } from "./core/types";
import type { HomeFragrancePipelineState } from "./types";
import type { HomeFragranceKnowledge }   from "../../app/lib/mkc/homeFragranceTypes";

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
  console.log("\n[mkc:validate:home-fragrance] EP4-P3B — scaffold → validate → draft chain\n");
  console.log("  Intake + Scaffold + Context + Registry\n");

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

  // ── 24–28. Validator — validateHomeFragranceRecord ─────────────────────────

  console.log("\n  Validator\n");

  const validationResult = validateHomeFragranceRecord(record);

  // 24. Status
  assertEq(
    "validateHomeFragranceRecord — status is PASS_WITH_WARNINGS",
    "PASS_WITH_WARNINGS",
    validationResult.status,
  );

  // 25. Zero errors on pre-AI fixture
  assertEq(
    "validateHomeFragranceRecord — 0 errors on pre-AI fixture",
    0,
    validationResult.totalErrors,
  );

  // 26. Composition group has single-note quality warnings
  {
    const g = validationResult.groups.composition;
    const hasSingleNoteWarn = g.issues.some(
      (i) =>
        (i.code === "NOTES_TOP_SINGLE" ||
         i.code === "NOTES_HEART_SINGLE" ||
         i.code === "NOTES_BASE_SINGLE") &&
        i.severity === "warning",
    );
    if (!hasSingleNoteWarn) {
      throw new Error(
        "FAIL [composition quality warnings]: expected NOTES_*_SINGLE warnings in composition group",
      );
    }
    pass("validateHomeFragranceRecord — composition group has single-note quality warnings");
  }

  // 27. Editorial group has DESCRIPTION_NOT_SET warning
  {
    const g = validationResult.groups.editorial;
    const hasDescWarn = g.issues.some((i) => i.code === "DESCRIPTION_NOT_SET");
    if (!hasDescWarn) {
      throw new Error(
        "FAIL [editorial description warning]: DESCRIPTION_NOT_SET not found in editorial group",
      );
    }
    pass("validateHomeFragranceRecord — editorial group has DESCRIPTION_NOT_SET warning");
  }

  // 28. Discovery group has warnings-only (empty arrays at scaffold stage)
  {
    const g = validationResult.groups.discovery;
    const allWarnings = g.issues.length > 0 && g.issues.every((i) => i.severity === "warning");
    if (!allWarnings) {
      throw new Error(
        "FAIL [discovery warnings]: expected warnings-only for empty discovery arrays",
      );
    }
    pass("validateHomeFragranceRecord — discovery group has warnings-only for empty arrays");
  }

  // ── 29–30. Merger — mergeHomeFragrance ─────────────────────────────────────

  console.log("\n  Merger\n");

  const mockPassingResult: HomeFragranceProducerResult = {
    producerName:    "MockEditorialProducer",
    producerVersion: "0.0.0",
    promptVersion:   null,
    status:          "success",
    fields: {
      description: "A luxurious candle with warm rose and oud.",
      vibe:        ["Warm", "Intimate", "Grounding"],
    },
    confidence:   0.9,
    errors:       [],
    warnings:     [],
    metrics: {
      durationMs:       0,
      attempts:         1,
      promptTokens:     0,
      completionTokens: 0,
      totalTokens:      0,
      modelId:          "",
      cached:           false,
    },
    artifacts: [],
  };

  // 29. Passing producer fields appear in merged record
  const merged = mergeHomeFragrance(record, mockPassingResult);
  if (merged.description !== "A luxurious candle with warm rose and oud.") {
    throw new Error(
      `FAIL [mergeHomeFragrance — description]: expected merged description, got "${merged.description ?? "(undefined)"}"`
    );
  }
  pass("mergeHomeFragrance — description field merged from passing producer");

  // 30. Failed producer fields are not applied
  const mockFailedResult: HomeFragranceProducerResult = {
    ...mockPassingResult,
    producerName: "MockFailedProducer",
    status:       "failed",
    fields:       { description: "SHOULD NOT APPEAR" },
  };
  const mergedWithFailed = mergeHomeFragrance(record, mockPassingResult, mockFailedResult);
  if (mergedWithFailed.description !== "A luxurious candle with warm rose and oud.") {
    throw new Error(
      `FAIL [mergeHomeFragrance — failed skip]: description was overwritten by failed producer`,
    );
  }
  pass("mergeHomeFragrance — failed producer fields are not applied");

  // ── 31–46. Draft — buildHomeFragranceDraft ─────────────────────────────────

  console.log("\n  Draft\n");

  const draft = buildHomeFragranceDraft(record, validationResult, "ep4-p3b-test");

  // 31–37. Positive content checks

  if (!draft.includes("HomeFragranceKnowledge")) {
    throw new Error('FAIL [draft]: missing "HomeFragranceKnowledge"');
  }
  pass('draft — contains "HomeFragranceKnowledge"');

  if (!draft.includes('"home-fragrance"')) {
    throw new Error('FAIL [draft]: missing category value "home-fragrance"');
  }
  pass('draft — contains category value "home-fragrance"');

  if (!draft.includes('"candle"')) {
    throw new Error('FAIL [draft]: missing productType value "candle"');
  }
  pass('draft — contains productType value "candle"');

  if (!draft.includes('"Maison Home"')) {
    throw new Error('FAIL [draft]: missing range value "Maison Home"');
  }
  pass('draft — contains range value "Maison Home"');

  if (!draft.includes('"150g"')) {
    throw new Error('FAIL [draft]: missing price key "150g"');
  }
  pass('draft — contains home fragrance price key "150g"');

  if (!draft.includes("notes: {")) {
    throw new Error('FAIL [draft]: missing notes section');
  }
  pass('draft — contains notes section');

  if (!draft.includes('"Warm & Intimate"')) {
    throw new Error('FAIL [draft]: missing subtitle "Warm & Intimate"');
  }
  pass('draft — contains subtitle "Warm & Intimate"');

  // 38–46. Negative content checks

  if (draft.includes(": FragranceKnowledge")) {
    throw new Error('FAIL [draft]: must not reference ": FragranceKnowledge" (use HomeFragranceKnowledge)');
  }
  pass('draft — does not reference ": FragranceKnowledge"');

  if (draft.includes("collection:")) {
    throw new Error('FAIL [draft]: must not contain "collection:"');
  }
  pass('draft — does not contain "collection:"');

  if (draft.includes("gender:")) {
    throw new Error('FAIL [draft]: must not contain "gender:"');
  }
  pass('draft — does not contain "gender:"');

  if (draft.includes("projection:")) {
    throw new Error('FAIL [draft]: must not contain "projection:"');
  }
  pass('draft — does not contain "projection:"');

  if (draft.includes("scentCharacter:")) {
    throw new Error('FAIL [draft]: must not contain "scentCharacter:"');
  }
  pass('draft — does not contain "scentCharacter:"');

  if (draft.includes("sweetness:")) {
    throw new Error('FAIL [draft]: must not contain "sweetness:"');
  }
  pass('draft — does not contain "sweetness:"');

  if (draft.includes('"5ml":')) {
    throw new Error('FAIL [draft]: must not contain fragrance price key "5ml"');
  }
  pass('draft — does not contain fragrance price key "5ml"');

  if (draft.includes('"10ml":')) {
    throw new Error('FAIL [draft]: must not contain fragrance price key "10ml"');
  }
  pass('draft — does not contain fragrance price key "10ml"');

  if (draft.includes('"30ml":')) {
    throw new Error('FAIL [draft]: must not contain fragrance price key "30ml"');
  }
  pass('draft — does not contain fragrance price key "30ml"');

  // ── 47–52. Negative validator cases ────────────────────────────────────────

  console.log("\n  Negative cases\n");

  // 47. Empty top notes → error (not warning)
  {
    const r = { ...record, notes: { top: [], heart: record.notes.heart, base: record.notes.base } };
    const result = validateHomeFragranceRecord(r);
    if (!result.errors.some((i) => i.code === "NOTES_TOP_REQUIRED")) {
      throw new Error("FAIL [negative — empty top notes]: expected NOTES_TOP_REQUIRED error");
    }
    pass("validateHomeFragranceRecord — empty top notes → NOTES_TOP_REQUIRED error");
  }

  // 48. Zero price → error
  {
    const r = { ...record, prices: { "150g": 0 } };
    const result = validateHomeFragranceRecord(r);
    if (!result.errors.some((i) => i.code === "PRICE_INVALID")) {
      throw new Error("FAIL [negative — zero price]: expected PRICE_INVALID error");
    }
    pass("validateHomeFragranceRecord — zero price → PRICE_INVALID error");
  }

  // 49. Empty image path → error
  {
    const r = { ...record, images: { "150g": "" } };
    const result = validateHomeFragranceRecord(r);
    if (!result.errors.some((i) => i.code === "IMAGE_MISSING")) {
      throw new Error("FAIL [negative — empty image]: expected IMAGE_MISSING error");
    }
    pass("validateHomeFragranceRecord — empty image path → IMAGE_MISSING error");
  }

  // 50. Missing description → warning, not error
  {
    const descErrors   = validationResult.errors.filter((i) => i.code === "DESCRIPTION_NOT_SET");
    const descWarnings = validationResult.warnings.filter((i) => i.code === "DESCRIPTION_NOT_SET");
    if (descErrors.length > 0) {
      throw new Error("FAIL [negative — description severity]: DESCRIPTION_NOT_SET must be a warning, not an error");
    }
    if (descWarnings.length === 0) {
      throw new Error("FAIL [negative — description severity]: DESCRIPTION_NOT_SET warning not found");
    }
    pass("validateHomeFragranceRecord — missing description is a warning (not an error)");
  }

  // 51. Empty range → error
  {
    const r = { ...record, range: "" };
    const result = validateHomeFragranceRecord(r);
    if (!result.errors.some((i) => i.code === "RANGE_REQUIRED")) {
      throw new Error("FAIL [negative — empty range]: expected RANGE_REQUIRED error");
    }
    pass("validateHomeFragranceRecord — empty range → RANGE_REQUIRED error");
  }

  // 52. Invalid category → error
  {
    const r = { ...record, category: "fragrance" } as unknown as typeof record;
    const result = validateHomeFragranceRecord(r);
    if (!result.errors.some((i) => i.code === "CATEGORY_INVALID")) {
      throw new Error("FAIL [negative — invalid category]: expected CATEGORY_INVALID error");
    }
    pass("validateHomeFragranceRecord — invalid category → CATEGORY_INVALID error");
  }

  // ── 53–61. EP4-P3BR Corrections ────────────────────────────────────────────

  console.log("\n  EP4-P3BR Corrections\n");

  // 53. mergeHomeFragrance — all required HomeFragranceKnowledge fields present in merged result.
  //     This is the runtime counterpart to the compilation proof: Object.assign returns
  //     HomeFragranceKnowledge & Partial<HomeFragranceKnowledge>, which is structurally
  //     assignable to HomeFragranceKnowledge — no type assertion was required.
  {
    const mergedEmpty = mergeHomeFragrance(record);
    const requiredFields: Array<keyof HomeFragranceKnowledge> = [
      "id", "slug", "brand", "name", "category", "productType", "range",
      "profile", "season", "mood", "notes", "subtitle",
      "vibe", "seasons", "signatureStyle", "recommendedFor",
      "prices", "images", "bestSeller", "newArrival",
    ];
    for (const field of requiredFields) {
      if (!(field in mergedEmpty)) {
        throw new Error(`FAIL [merger structural integrity]: merged result missing required field "${field}"`);
      }
    }
    pass("mergeHomeFragrance — merged result has all required HomeFragranceKnowledge fields");
  }

  // 54. Draft WITHOUT catalogVersion — absent catalogVersion rendered as comment, not property.
  //     FIXTURE record has catalogVersion: undefined (not set by scaffold).
  if (!draft.includes("// catalogVersion:")) {
    throw new Error('FAIL [draft absent catalogVersion]: expected "// catalogVersion:" comment for absent field');
  }
  if (draft.includes('catalogVersion: "')) {
    throw new Error('FAIL [draft absent catalogVersion]: must not render absent catalogVersion as a property value');
  }
  pass("draft — absent catalogVersion rendered as comment (not fabricated property)");

  // 55. Draft WITHOUT status — absent status rendered as comment, not property.
  //     FIXTURE record has status: undefined (not set by scaffold).
  if (!draft.includes("// status:")) {
    throw new Error('FAIL [draft absent status]: expected "// status:" comment for absent field');
  }
  if (draft.includes('catalogVersion: "') || draft.includes('status        : "')) {
    throw new Error('FAIL [draft absent status]: must not render absent status as a property value');
  }
  pass("draft — absent status rendered as comment (not fabricated property)");

  // 56–57. Draft WITH catalogVersion and status — renders the supplied exact values.
  {
    const recordWithMeta = { ...record, catalogVersion: "1.0", status: "active" };
    const validWithMeta  = validateHomeFragranceRecord(recordWithMeta);
    const draftWithMeta  = buildHomeFragranceDraft(recordWithMeta, validWithMeta, "ep4-p3br-test");

    // 56. catalogVersion "1.0" rendered as property (no fabrication — this IS the record value)
    if (!draftWithMeta.includes('catalogVersion: "1.0"')) {
      throw new Error('FAIL [draft with catalogVersion]: expected catalogVersion: "1.0" in draft');
    }
    if (draftWithMeta.includes("// catalogVersion:")) {
      throw new Error('FAIL [draft with catalogVersion]: must not render present catalogVersion as comment');
    }
    pass('draft — supplied catalogVersion "1.0" rendered as property');

    // 57. status "active" rendered as property.
    //     fieldLine pads "status" to 14 chars, producing `  status        : "active",`.
    if (!draftWithMeta.includes('"active"')) {
      throw new Error('FAIL [draft with status]: expected status value "active" in draft');
    }
    if (draftWithMeta.includes("// status:")) {
      throw new Error('FAIL [draft with status]: must not render present status as comment');
    }
    pass('draft — supplied status "active" rendered as property');
  }

  // 58. Validator — CATALOG_VERSION_MISSING warning in identity group.
  {
    const hasCatVerWarn = validationResult.groups.identity.issues.some(
      (i) => i.code === "CATALOG_VERSION_MISSING" && i.severity === "warning",
    );
    if (!hasCatVerWarn) {
      throw new Error("FAIL [validator identity]: CATALOG_VERSION_MISSING warning not found");
    }
    pass("validator — CATALOG_VERSION_MISSING warning in identity group");
  }

  // 59. Validator — STATUS_NOT_SET warning in identity group.
  {
    const hasStatusWarn = validationResult.groups.identity.issues.some(
      (i) => i.code === "STATUS_NOT_SET" && i.severity === "warning",
    );
    if (!hasStatusWarn) {
      throw new Error("FAIL [validator identity]: STATUS_NOT_SET warning not found");
    }
    pass("validator — STATUS_NOT_SET warning in identity group");
  }

  // 60. Canonical slug derivation: "Rose Oud Candle" → "rose-oud-candle".
  assertEq(
    "deriveSlug('Rose Oud Candle') → 'rose-oud-candle'",
    "rose-oud-candle",
    deriveSlug("Rose Oud Candle"),
  );

  // 61. Validator slug formula uses canonical deriveSlug behaviour:
  //     a record with a discrepant slug must produce SLUG_FORMULA error.
  {
    const wrongSlugRecord: HomeFragranceKnowledge = { ...record, slug: "wrong-slug", id: "wrong-slug" };
    const wrongSlugResult = validateHomeFragranceRecord(wrongSlugRecord);
    if (!wrongSlugResult.errors.some((i) => i.code === "SLUG_FORMULA")) {
      throw new Error("FAIL [validator slug formula]: expected SLUG_FORMULA error for discrepant slug");
    }
    pass("validator slug formula — discrepant slug detected via canonical deriveSlug");
  }

  console.log("\n  All proofs passed.\n");
}

main().catch((err: unknown) => {
  console.error(
    `\n[mkc:validate:home-fragrance] ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
