/**
 * Knowledge Factory — Controlled Home Fragrance Generation
 *
 * EP4-P3D — First controlled real Home Fragrance AI draft.
 *
 * Invocation:
 *   npm run mkc:home-fragrance:controlled
 *
 * Safety constraints (all enforced by this script):
 *   • Exactly one product per invocation — APPROVED_INTAKE constant or stop.
 *   • No batch mode. No wildcard. No "all" products.
 *   • ANTHROPIC_API_KEY required for real generation.
 *   • Composition + Editorial only (no Discovery, Relationships, Education).
 *   • No promotion. No native write. No guest-facing publication.
 *   • Script halts immediately after draft write — ABSOLUTE_STOP_AFTER_WRITE.
 *   • Human review report printed before process exits.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

import { scaffoldHomeFragrance }        from "./homeFragranceScaffold";
import { HOME_FRAGRANCE_PRODUCER_SET }  from "./homeFragrancePipeline";
import { mergeHomeFragrance }           from "./homeFragranceMerger";
import { validateHomeFragranceRecord }  from "../../app/lib/mkc/homeFragranceValidator";
import { buildHomeFragranceDraft }      from "./HomeFragranceDraftBuilder";
import { HomeFragranceContextBuilder }  from "./core/HomeFragranceContextBuilder";
import { GenerationEngine }             from "./core/GenerationEngine";
import { ClaudeProvider }               from "./core/providers/ClaudeProvider";
import { FACTORY_VERSION }              from "./version";

import type { HomeFragranceIntake, StageEntry } from "./types";
import type { FactoryConfig, HomeFragranceProducerResult } from "./core/types";

// ═════════════════════════════════════════════════════════════════════════════
// FOUNDER-APPROVED PRODUCT SPECIFICATION
// ═════════════════════════════════════════════════════════════════════════════
//
// Populate this constant with the founder-approved HomeFragranceIntake before
// invoking the controlled generation.
//
// DO NOT invent product facts. Every field must be founder-provided source
// truth. Run `npm run mkc:home-fragrance:controlled` (with this set to null)
// to see the complete required field specification.
//
// When ready, replace `null` with the approved intake object, for example:
//
//   const APPROVED_INTAKE: HomeFragranceIntake = {
//     category:    "home-fragrance",
//     productType: "candle",
//     range:       "Maison Home",
//     title:       "Rose & Oud Candle",
//     subtitle:    "Warm Intimacy",
//     mood:        "A warm, grounding atmosphere of intimacy and quiet luxury.",
//     profile:     "Woody Floral",
//     season:      "Autumn",
//     notes:       ["Rose", "Oud", "Sandalwood"],
//     prices:      { "150g": 299 },
//     images:      { "150g": "/images/home/rose-oud-candle-150g.png" },
//     bestSeller:  false,
//     newArrival:  true,
//   };

const APPROVED_INTAKE: HomeFragranceIntake | null = null;

// ═════════════════════════════════════════════════════════════════════════════

// Draft location: category-specific subdirectory, separate from fragrance drafts.
// Import path adjusted for the extra directory level (4 levels to project root).
const DRAFT_DIR   = path.join(process.cwd(), "scripts", "factory", "drafts", "home-fragrance");
const IMPORT_BASE = "../../../../app/lib/mkc";

const PROVIDER_NAME = "claude";
const MODEL_ID      = "claude-haiku-4-5-20251001";

const HF_FACTORY_CONFIG: FactoryConfig = {
  defaultProvider: PROVIDER_NAME,
  providers: {
    [PROVIDER_NAME]: {
      name:         PROVIDER_NAME,
      modelId:      MODEL_ID,
      apiKeyEnvVar: "ANTHROPIC_API_KEY",
    },
  },
  producers: {
    HomeFragranceCompositionProducer: {
      enabled:       true,
      temperature:   0.7,
      maxTokens:     512,
      promptVersion: "1.0.0",
    },
    HomeFragranceEditorialProducer: {
      enabled:       true,
      temperature:   0.8,
      maxTokens:     512,
      promptVersion: "1.0.0",
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

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const SEP = "═".repeat(70);
  const DIV = "─".repeat(70);

  console.log(`\n${SEP}`);
  console.log("EP4-P3D — Controlled Home Fragrance Generation");
  console.log(`Factory: ${FACTORY_VERSION}   Provider: ${PROVIDER_NAME}   Model: ${MODEL_ID}`);
  console.log(DIV);

  // ── SELF-REVIEW GATE 1: Is there a founder-approved product? ─────────────
  if (APPROVED_INTAKE === null) {
    printNoProductReport(SEP, DIV);
    process.exit(0);
  }

  const intake: HomeFragranceIntake = APPROVED_INTAKE;

  // ── SELF-REVIEW GATE 2: ANTHROPIC_API_KEY present? ───────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("\nSTOP: ANTHROPIC_API_KEY is not set.");
    console.error("Real generation requires a valid API key.\n");
    process.exit(1);
  }

  // ── Print product being processed ────────────────────────────────────────
  console.log(`\n  Product:  ${intake.title}`);
  console.log(`  Type:     ${intake.productType}`);
  console.log(`  Range:    ${intake.range}`);
  console.log(`  Profile:  ${intake.profile}`);
  console.log(`  Season:   ${intake.season}`);
  console.log(`  Notes:    ${intake.notes.join(", ")}`);
  console.log(`  Prices:   ${JSON.stringify(intake.prices)}`);
  console.log(`  Images:   ${JSON.stringify(intake.images)}`);

  // ── Phase 1: Scaffold ─────────────────────────────────────────────────────
  console.log(`\n${DIV}`);
  console.log("Phase 1 — Scaffold");

  const scaffoldResult = scaffoldHomeFragrance(intake);
  if (scaffoldResult.degraded) {
    console.error("STOP: scaffoldHomeFragrance returned degraded. Review intake.\n");
    process.exit(1);
  }
  const scaffoldRecord = scaffoldResult.record;
  console.log(`  slug:        ${scaffoldRecord.slug}`);
  console.log(`  category:    ${scaffoldRecord.category}`);
  console.log(`  productType: ${scaffoldRecord.productType}`);
  console.log("  ✓ Scaffold complete");

  // ── Draft existence guard ─────────────────────────────────────────────────
  const draftPath = path.join(DRAFT_DIR, `${scaffoldRecord.slug}.ts`);
  if (existsSync(draftPath)) {
    console.log(`\n  Draft already exists at:\n    ${draftPath}`);
    console.log("  Delete the existing draft before regenerating.\n");
    process.exit(0);
  }

  // ── Phase 2: Engine setup ─────────────────────────────────────────────────
  console.log(`\n${DIV}`);
  console.log("Phase 2 — Engine Setup");
  console.log(`  Provider: ${PROVIDER_NAME}`);
  console.log(`  Model:    ${MODEL_ID}`);
  console.log(`  Composition maxTokens: 512   Editorial maxTokens: 512`);
  console.log(`  maxAttempts: 3   backoff: exponential`);
  console.log(`  Expected calls: 2 (Composition + Editorial) + bounded retry`);

  const engine = new GenerationEngine(HF_FACTORY_CONFIG);
  engine.registerProvider(new ClaudeProvider(apiKey));

  // ── Phase 3: Composition ──────────────────────────────────────────────────
  console.log(`\n${DIV}`);
  console.log("Phase 3 — Composition Producer");

  const pipelineState = {
    slug:           scaffoldRecord.slug,
    record:         scaffoldRecord,
    stageLog:       [] as StageEntry[],
    factoryVersion: FACTORY_VERSION,
  };
  let ctx = HomeFragranceContextBuilder.build(pipelineState, HF_FACTORY_CONFIG);

  const compositionProducer = HOME_FRAGRANCE_PRODUCER_SET.producers[0];
  console.log(`  Running ${compositionProducer.name} v${compositionProducer.version}...`);

  const compResult: HomeFragranceProducerResult = await compositionProducer.run(ctx, engine);

  console.log(`  Status:    ${compResult.status}`);
  if (compResult.errors.length > 0)   console.log(`  Errors:    ${compResult.errors.join("; ")}`);
  if (compResult.warnings.length > 0) console.log(`  Warnings:  ${compResult.warnings.join("; ")}`);
  console.log(`  Tokens:    ${compResult.metrics.totalTokens} (prompt: ${compResult.metrics.promptTokens}, completion: ${compResult.metrics.completionTokens})`);
  console.log(`  Attempts:  ${compResult.metrics.attempts}`);

  // ── SELF-REVIEW GATE 3: Composition must succeed ──────────────────────────
  if (compResult.status !== "success") {
    console.error(`\nSTOP: Composition ${compResult.status}. No draft written.`);
    process.exit(1);
  }

  const notes = compResult.fields.notes!;
  console.log(`\n  Generated notes pyramid:`);
  console.log(`    Top:   ${notes.top.join(", ")}`);
  console.log(`    Heart: ${notes.heart.join(", ")}`);
  console.log(`    Base:  ${notes.base.join(", ")}`);

  // ── Composition quality gate ──────────────────────────────────────────────
  let compFail = false;
  if (notes.top.length < 2 || notes.top.length > 4)    { console.error(`  FAIL: top ${notes.top.length} notes (must be 2-4)`);    compFail = true; }
  if (notes.heart.length < 2 || notes.heart.length > 4) { console.error(`  FAIL: heart ${notes.heart.length} notes (must be 2-4)`); compFail = true; }
  if (notes.base.length < 2 || notes.base.length > 4)   { console.error(`  FAIL: base ${notes.base.length} notes (must be 2-4)`);   compFail = true; }
  if (compFail) {
    console.error("\nSTOP: Composition quality gate failed. No draft written.");
    process.exit(1);
  }
  console.log("  ✓ Notes pyramid within bounds (2-4 per tier)");

  // ── Merge Composition → context ───────────────────────────────────────────
  const postCompRecord = mergeHomeFragrance(scaffoldRecord, compResult);
  ctx = HomeFragranceContextBuilder.withMergedRecord(ctx, postCompRecord);

  // ── Phase 4: Editorial ────────────────────────────────────────────────────
  console.log(`\n${DIV}`);
  console.log("Phase 4 — Editorial Producer");

  const editorialProducer = HOME_FRAGRANCE_PRODUCER_SET.producers[1];
  console.log(`  Running ${editorialProducer.name} v${editorialProducer.version}...`);

  const editResult: HomeFragranceProducerResult = await editorialProducer.run(ctx, engine);

  console.log(`  Status:    ${editResult.status}`);
  if (editResult.errors.length > 0)   console.log(`  Errors:    ${editResult.errors.join("; ")}`);
  if (editResult.warnings.length > 0) console.log(`  Warnings:  ${editResult.warnings.join("; ")}`);
  console.log(`  Tokens:    ${editResult.metrics.totalTokens} (prompt: ${editResult.metrics.promptTokens}, completion: ${editResult.metrics.completionTokens})`);
  console.log(`  Attempts:  ${editResult.metrics.attempts}`);

  // ── SELF-REVIEW GATE 4: Editorial must succeed ────────────────────────────
  if (editResult.status !== "success") {
    console.error(`\nSTOP: Editorial ${editResult.status}. No draft written.`);
    if (editResult.errors.length > 0) console.error(`  Errors: ${editResult.errors.join("; ")}`);
    process.exit(1);
  }

  console.log(`\n  Generated editorial:`);
  console.log(`    Subtitle:    ${editResult.fields.subtitle ?? "(not set)"}`);
  console.log(`    Description: ${editResult.fields.description?.slice(0, 100) ?? "(not set)"}${(editResult.fields.description?.length ?? 0) > 100 ? "..." : ""}`);

  // ── Phase 5: Final merge + validate ──────────────────────────────────────
  console.log(`\n${DIV}`);
  console.log("Phase 5 — Final Merge + Validation");

  const finalRecord     = mergeHomeFragrance(scaffoldRecord, compResult, editResult);
  const validationResult = validateHomeFragranceRecord(finalRecord);

  console.log(`  Status:   ${validationResult.status}`);
  console.log(`  Errors:   ${validationResult.totalErrors}`);
  console.log(`  Warnings: ${validationResult.totalWarnings}`);

  // ── SELF-REVIEW GATE 5: Zero validation errors ────────────────────────────
  if (validationResult.totalErrors > 0) {
    console.error("\nSTOP: Final validation has errors. No draft written.");
    for (const e of validationResult.errors) {
      console.error(`  ERROR [${e.code}] ${e.field}: ${e.message}`);
    }
    process.exit(1);
  }

  if (validationResult.totalWarnings > 0) {
    console.log("\n  Warnings (expected at this stage — review before promotion):");
    for (const w of validationResult.warnings) {
      console.log(`    WARN [${w.code}] ${w.field}: ${w.message}`);
    }
  }
  console.log("\n  ✓ 0 validation errors — draft eligible for write");

  // ── Phase 6: Persist exactly ONE draft ───────────────────────────────────
  console.log(`\n${DIV}`);
  console.log("Phase 6 — Draft Write");

  const sessionCost = engine.getSessionCost();

  mkdirSync(DRAFT_DIR, { recursive: true });
  const draftContent = buildHomeFragranceDraft(
    finalRecord,
    validationResult,
    FACTORY_VERSION,
    IMPORT_BASE,
  );
  writeFileSync(draftPath, draftContent, "utf-8");

  console.log(`  ✓ Draft written: ${path.relative(process.cwd(), draftPath)}`);
  console.log(`    Bytes: ${Buffer.byteLength(draftContent, "utf-8")}`);

  // ══════════════════════════════════════════════════════════════════════════
  // ABSOLUTE_STOP_AFTER_WRITE
  // Nothing below this boundary may: promote, write native records,
  // modify application code, update catalogues, or process a second product.
  // ══════════════════════════════════════════════════════════════════════════

  printHumanReviewReport({
    intake,
    compResult,
    editResult,
    finalRecord,
    validationResult,
    sessionCost,
    draftPath:  path.relative(process.cwd(), draftPath),
    modelId:    MODEL_ID,
    providerName: PROVIDER_NAME,
    SEP,
    DIV,
  });

  console.log(`\n${SEP}`);
  console.log("EP4-P3D — STOP.");
  console.log("One draft written. Human review required before any further action.");
  console.log("DO NOT promote until the review questions below are answered.");
  console.log(`${SEP}\n`);
}

// ── No-product report ─────────────────────────────────────────────────────────

function printNoProductReport(SEP: string, DIV: string): void {
  console.log(`\n${SEP}`);
  console.log("EP4-P3D — STOP: No Founder-Approved Product Specification Found");
  console.log(DIV);
  console.log(`
No HomeFragranceIntake has been set in APPROVED_INTAKE (currently null).

Per EP4-P3D governance:
  The first real Home Fragrance AI call must be based on actual
  founder-provided product truth. No product may be invented to
  satisfy the type contract. No AI call has been made. No cost incurred.

To proceed:
  1. Open: scripts/factory/run-home-fragrance-controlled.ts
  2. Find: const APPROVED_INTAKE: HomeFragranceIntake | null = null;
  3. Replace null with the approved HomeFragranceIntake object.
  4. Re-run: npm run mkc:home-fragrance:controlled

${DIV}
REQUIRED PRODUCT FIELDS (HomeFragranceIntake)
${DIV}

  category:    "home-fragrance"           (fixed — do not change)

  productType: "candle"                   (required — choose one)
               "diffuser"
               "room-spray"

  range:       string                     e.g. "Maison Home"
               The product range or collection name within Maison.

  title:       string                     e.g. "Rose & Oud Candle"
               Exact product name. Used to derive the slug.

  subtitle:    string                     e.g. "Warm Intimacy"
               2–6 word positioning line. Scaffold seed for Editorial.

  mood:        string
               Describe the emotional atmosphere of the room.
               Use ambient/space language — NOT personal-wear language.
               No "wearer", "skin", "wearing time", "projection".
               e.g. "A warm, grounding atmosphere of intimacy and quiet luxury."

  profile:     string                     e.g. "Woody Floral"
               Olfactory family. Used to frame composition and editorial.

  season:      string                     e.g. "Autumn", "All-Season", "Winter"
               Seasonal context for the fragrance character.

  notes:       string[]                   e.g. ["Rose", "Oud", "Sandalwood"]
               2–5 seed scent notes. The AI enriches these into a full pyramid.
               Must be specific ingredient names in Title Case.
               NOT categories like "Floral" or "Citrus".

  prices:      Record<string, number>     e.g. { "150g": 299 }
               At least one price variant with a positive number.
               Keys must be home fragrance size labels.
               NOT "5ml", "10ml", "30ml" (those are personal fragrance sizes).

  images:      Record<string, string>     e.g. { "150g": "/images/home/product-150g.png" }
               At least one image path variant.
               Image files must exist or be planned for promotion.

  bestSeller:  boolean                    Commercial status flag.
  newArrival:  boolean                    Commercial status flag.

${DIV}
EXAMPLE (illustrative only — do not use as a real product)
${DIV}

  const APPROVED_INTAKE: HomeFragranceIntake = {
    category:    "home-fragrance",
    productType: "candle",
    range:       "Maison Home",
    title:       "Rose & Oud Candle",
    subtitle:    "Warm Intimacy",
    mood:        "A warm, grounding atmosphere of intimacy and quiet luxury.",
    profile:     "Woody Floral",
    season:      "Autumn",
    notes:       ["Rose", "Oud", "Sandalwood"],
    prices:      { "150g": 299, "300g": 499 },
    images:      {
      "150g": "/images/home/rose-oud-candle-150g.png",
      "300g": "/images/home/rose-oud-candle-300g.png",
    },
    bestSeller:  false,
    newArrival:  true,
  };

${DIV}
No AI call has been made.
No cost has been incurred.
${SEP}
`);
}

// ── Human review report ───────────────────────────────────────────────────────

function printHumanReviewReport(opts: {
  intake:           HomeFragranceIntake;
  compResult:       HomeFragranceProducerResult;
  editResult:       HomeFragranceProducerResult;
  finalRecord:      import("../../app/lib/mkc/homeFragranceTypes").HomeFragranceKnowledge;
  validationResult: import("../../app/lib/mkc/validator").ValidationResult;
  sessionCost:      { totalTokens: number; totalPromptTokens: number; totalCompletionTokens: number; callCount: number };
  draftPath:        string;
  modelId:          string;
  providerName:     string;
  SEP:              string;
  DIV:              string;
}): void {
  const { intake, compResult, editResult, finalRecord, validationResult, sessionCost, draftPath, modelId, providerName, SEP, DIV } = opts;
  const notes = finalRecord.notes;

  console.log(`\n${SEP}`);
  console.log("EP4-P3D — HUMAN REVIEW PACKAGE");
  console.log(DIV);

  console.log(`
SOURCE INPUT
  Product name:  ${intake.title}
  Product type:  ${intake.productType}
  Range:         ${intake.range}
  Profile:       ${intake.profile}
  Mood:          ${intake.mood}
  Season:        ${intake.season}
  Seed notes:    ${intake.notes.join(", ")}
  Prices:        ${JSON.stringify(intake.prices)}
  Images:        ${JSON.stringify(intake.images)}
  Best seller:   ${String(intake.bestSeller)}
  New arrival:   ${String(intake.newArrival)}`);

  console.log(`\n${DIV}`);
  console.log(`COMPOSITION OUTPUT`);
  console.log(`  Top notes:   ${notes.top.join(", ")}`);
  console.log(`  Heart notes: ${notes.heart.join(", ")}`);
  console.log(`  Base notes:  ${notes.base.join(", ")}`);

  console.log(`\n${DIV}`);
  console.log(`EDITORIAL OUTPUT`);
  console.log(`  Subtitle:    ${finalRecord.subtitle}`);
  console.log(`  Description:`);
  const descLines = (finalRecord.description ?? "(not set)").match(/.{1,80}/g) ?? [];
  for (const line of descLines) console.log(`    ${line}`);

  console.log(`\n${DIV}`);
  console.log(`VALIDATION`);
  console.log(`  Status:   ${validationResult.status}`);
  console.log(`  Errors:   ${validationResult.totalErrors}`);
  console.log(`  Warnings: ${validationResult.totalWarnings}`);
  if (validationResult.totalWarnings > 0) {
    for (const w of validationResult.warnings) {
      console.log(`    WARN [${w.code}] ${w.field}: ${w.message}`);
    }
  }

  console.log(`\n${DIV}`);
  console.log(`PROVENANCE`);
  console.log(`  Provider:                      ${providerName}`);
  console.log(`  Model:                         ${modelId}`);
  console.log(`  Composition producer version:  ${compResult.producerVersion}`);
  console.log(`  Composition prompt version:    ${compResult.promptVersion ?? "unknown"}`);
  console.log(`  Editorial producer version:    ${editResult.producerVersion}`);
  console.log(`  Editorial prompt version:      ${editResult.promptVersion ?? "unknown"}`);
  console.log(`  Total API calls:               ${sessionCost.callCount}`);
  console.log(`  Prompt tokens:                 ${sessionCost.totalPromptTokens}`);
  console.log(`  Completion tokens:             ${sessionCost.totalCompletionTokens}`);
  console.log(`  Total tokens:                  ${sessionCost.totalTokens}`);
  const haiku4_5InputRate  = 0.00000080;  // $0.80 per 1M input tokens
  const haiku4_5OutputRate = 0.00000400;  // $4.00 per 1M output tokens
  const estimatedCost = (sessionCost.totalPromptTokens * haiku4_5InputRate) +
                        (sessionCost.totalCompletionTokens * haiku4_5OutputRate);
  console.log(`  Estimated cost (USD):          $${estimatedCost.toFixed(6)}  (Haiku 4.5 list rates)`);

  console.log(`\n${DIV}`);
  console.log(`DRAFT`);
  console.log(`  Path:     ${draftPath}`);
  console.log(`  Status:   WRITTEN — awaiting human review`);
  console.log(`  Promoted: NO`);
  console.log(`  Native:   NO`);

  console.log(`\n${DIV}`);
  console.log(`REVIEW QUESTIONS`);
  console.log(`
  1. Are the generated notes believable for the intended product?
     Top:   ${notes.top.join(", ")}
     Heart: ${notes.heart.join(", ")}
     Base:  ${notes.base.join(", ")}

  2. Does the description sound like Maison Skye & Rose?
     ${(finalRecord.description ?? "(not set)").slice(0, 120)}${(finalRecord.description?.length ?? 0) > 120 ? "..." : ""}

  3. Is the subtitle appropriate?
     "${finalRecord.subtitle}"

  4. Did the AI introduce any product fact not supplied by the founder?
     (Check: burn time, throw distance, coverage area, ingredients, materials)

  5. Should the draft be:
     a) APPROVED — proceed to further development (EP4-P4 Discovery)
     b) REGENERATE — re-run the controlled generation for different output
     c) MANUALLY CORRECT — edit the draft file before further development
     d) REJECT — discard; do not develop further

  Communicate your decision before any further development begins.`);
}

// ── Entry point ───────────────────────────────────────────────────────────────

main().catch((err: unknown) => {
  console.error(
    `\n[mkc:home-fragrance:controlled] ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
