/**
 * Knowledge Factory — Orchestrator
 *
 * Controls the pipeline lifecycle for a single record.
 *
 * Pipeline stages:
 *   1. Intake         — locate record in supplier catalogue
 *   2. Scaffold       — derive all deterministic fields
 *   3. Composition    — AI: generate notes pyramid (CompositionProducer)
 *   4. Editorial      — AI: generate description + subtitle (EditorialProducer)
 *   5. Relationships  — AI: generate graph edges (RelationshipProducer)
 *   6. Education      — AI: assign academy metadata (EducationProducer)
 *   7. Discovery      — AI: generate discovery intelligence (DiscoveryProducer)
 *   8. Merge          — consolidate all producer outputs
 *   9. Validate       — run MKC validator on merged record
 *  10. DraftBuild     — write TypeScript draft file
 *  11. Log            — record run to factory-log.json
 */

import path from "path";
import { intake }              from "./intake";
import { scaffold }            from "./scaffold";
import { merge }               from "./merger";
import { buildDraft }          from "./draftBuilder";
import { logRun }              from "./metrics/factoryLogger";
import { ContextBuilder }        from "./core/ContextBuilder";
import { GenerationEngine }      from "./core/GenerationEngine";
import { ClaudeProvider }        from "./core/providers/ClaudeProvider";
import { ProducerRegistry }      from "./core/ProducerRegistry";
import { CompositionProducer }   from "./producers/CompositionProducer";
import { EditorialProducer }     from "./producers/EditorialProducer";
import { RelationshipProducer }  from "./producers/RelationshipProducer";
import { EducationProducer }     from "./producers/EducationProducer";
import { DiscoveryProducer }     from "./producers/DiscoveryProducer";
import { validateKnowledgeRecord } from "../../app/lib/mkc/validator";
import type { FactoryConfig, ProducerResult } from "./core/types";
import type { PipelineInput, PipelineResult, PipelineState, StageEntry } from "./types";

// ── Constants ─────────────────────────────────────────────────────────────────

export const FACTORY_VERSION = "0.5.0";

// ── Producer Registry ─────────────────────────────────────────────────────────

export const FRAGRANCE_PRODUCER_SET = {
  category:  "fragrance" as const,
  producers: [
    new CompositionProducer(),
    new EditorialProducer(),
    new RelationshipProducer(),
    new EducationProducer(),
    new DiscoveryProducer(),
  ],
} as const;

export const defaultRegistry = new ProducerRegistry();
defaultRegistry.register(FRAGRANCE_PRODUCER_SET);

const ROOT      = process.cwd();
const DRAFT_DIR = path.join(ROOT, "scripts", "factory", "drafts");

const DEFAULT_FACTORY_CONFIG: FactoryConfig = {
  defaultProvider:      "claude",
  providers: {
    claude: {
      name:         "claude",
      modelId:      "claude-haiku-4-5-20251001",
      apiKeyEnvVar: "ANTHROPIC_API_KEY",
    },
  },
  producers: {
    CompositionProducer:  { enabled: true, temperature: 0.7, maxTokens: 512,  promptVersion: "1.0.0", promptFallback: "fail" },
    EditorialProducer:    { enabled: true, temperature: 0.8, maxTokens: 512,  promptVersion: "1.0.0", promptFallback: "fail" },
    RelationshipProducer: { enabled: true, temperature: 0.3, maxTokens: 1024, promptVersion: "1.0.0", promptFallback: "fail" },
    EducationProducer:    { enabled: true, temperature: 0.4, maxTokens: 512,  promptVersion: "1.0.0", promptFallback: "fail" },
    DiscoveryProducer:    { enabled: true, temperature: 0.5, maxTokens: 768,  promptVersion: "1.0.0", promptFallback: "fail" },
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

// ── Pipeline runner ───────────────────────────────────────────────────────────

export async function run(input: PipelineInput): Promise<PipelineResult> {
  const { slug, force } = input;
  const startedAt = Date.now();
  const stageLog:  StageEntry[] = [];
  const log = (msg: string): void => { if (!input.silent) console.log(msg); };

  function stage(name: string, status: StageEntry["status"], durationMs: number, message?: string): void {
    stageLog.push({ stage: name, status, durationMs, message });
    const icon = status === "pass" ? "✓" : status === "degraded" ? "⚠" : "✗";
    const suffix = message ? `  (${message})` : "";
    log(`  ${icon}  ${name.padEnd(12)} ${status.padStart(8)}  ${durationMs}ms${suffix}`);
  }

  log(`\n[mkc:factory] ${slug}`);

  // ── Stage 1: Intake ─────────────────────────────────────────────────────────
  {
    const t0     = Date.now();
    const result = intake({ slug, force });
    const ms     = Date.now() - t0;

    if (result.status === "not_found") {
      stage("intake", "fail", ms, "record not found in supplier catalogue");
      return {
        status:     "failed",
        slug,
        draftPath:  null,
        state:      null,
        message:    `Record not found in supplier catalogue: ${slug}`,
        durationMs: Date.now() - startedAt,
      };
    }

    if (result.status === "already_native") {
      stage("intake", "skip", ms, "already in native registry — use --force to override");
      return {
        status:     "skipped",
        slug,
        draftPath:  null,
        state:      null,
        message:    `${slug} is already in the native registry. Use --force to override.`,
        durationMs: Date.now() - startedAt,
      };
    }

    if (result.status === "already_drafted") {
      stage("intake", "skip", ms, "draft already exists — use --force to regenerate");
      return {
        status:     "skipped",
        slug,
        draftPath:  path.join(DRAFT_DIR, `${slug}.ts`),
        state:      null,
        message:    `Draft already exists at scripts/factory/drafts/${slug}.ts. Use --force to regenerate.`,
        durationMs: Date.now() - startedAt,
      };
    }

    stage("intake", "pass", ms);

    // ── Stage 2: Scaffold ───────────────────────────────────────────────────
    const t1 = Date.now();
    const { record: scaffolded, degraded } = scaffold(result.displayFrag!);
    const ms1 = Date.now() - t1;

    stage("scaffold", degraded ? "degraded" : "pass", ms1, degraded ? "knowledgeAdapter fallback used" : undefined);

    // ── Stages 3–7: AI Producers (registry-resolved) ────────────────────────
    const hasApiKey    = Boolean(process.env.ANTHROPIC_API_KEY);
    const factoryConfig: FactoryConfig = { ...DEFAULT_FACTORY_CONFIG, dryRun: input.dryRun || !hasApiKey };

    const ctx0   = ContextBuilder.build(
      { slug, displayFrag: result.displayFrag!, record: scaffolded, validationResult: null, stageLog, factoryVersion: FACTORY_VERSION },
      factoryConfig,
    );
    const engine = new GenerationEngine(factoryConfig);
    if (hasApiKey) engine.registerProvider(new ClaudeProvider());

    const producerResults: ProducerResult[] = [];
    const producerSet = defaultRegistry.getProducerSet("fragrance");
    let   currentCtx  = ctx0;

    for (const producer of producerSet.producers) {
      const tProducer      = Date.now();
      const producerResult = await producer.run(currentCtx, engine);
      producerResults.push(producerResult);

      stage(
        toStageName(producer.name),
        producerResult.status === "success"  ? "pass"
          : producerResult.status === "degraded" ? "degraded"
          : producerResult.status === "skipped"  ? "skip"
          : "fail",
        Date.now() - tProducer,
        producerResult.status === "skipped"
          ? producerResult.skippedReason
          : `${producerResult.metrics.totalTokens} tokens  conf:${producerResult.confidence.toFixed(2)}`,
      );

      // Update context so each subsequent producer sees all accumulated fields
      if (producerResult.status !== "failed" && producerResult.status !== "skipped") {
        currentCtx = ContextBuilder.withMergedRecord(currentCtx, merge(scaffolded, ...producerResults));
      }
    }

    // ── Stage 8: Merge ───────────────────────────────────────────────────────
    const t2     = Date.now();
    const record = merge(scaffolded, ...producerResults);
    stage("merge", "pass", Date.now() - t2,
      hasApiKey ? `${engine.getSessionCost().totalTokens} tokens total` : "dry-run");

    // ── Stage 9: Validate ───────────────────────────────────────────────────
    const t3            = Date.now();
    const validationResult = validateKnowledgeRecord(record);
    const ms3           = Date.now() - t3;
    const valStatus     = validationResult.status;

    stage(
      "validate",
      valStatus === "PASS"               ? "pass"
      : valStatus === "PASS_WITH_WARNINGS" ? "degraded"
      : "fail",
      ms3,
      `${valStatus}  [${validationResult.totalErrors} errors, ${validationResult.totalWarnings} warnings]`,
    );

    // ── Build PipelineState ─────────────────────────────────────────────────
    const state: PipelineState = {
      slug,
      displayFrag:      result.displayFrag!,
      record,
      validationResult,
      stageLog,
      factoryVersion:   FACTORY_VERSION,
      producerResults,
    };

    // ── Stage 10: Draft Build ────────────────────────────────────────────────
    const t4 = Date.now();
    let draftResult: { path: string };
    if (factoryConfig.dryRun) {
      draftResult = { path: path.join(DRAFT_DIR, `${slug}.ts`) };
      stage("draft", "pass", Date.now() - t4, "dry-run — skipped");
    } else {
      draftResult = buildDraft({ state, draftDir: DRAFT_DIR });
      stage("draft", "pass", Date.now() - t4);
    }

    // ── Stage 11: Log ────────────────────────────────────────────────────────
    const t5 = Date.now();
    if (!factoryConfig.dryRun) logRun({
      slug,
      name:             record.name,
      wave:             null,
      startedAt:        new Date(startedAt).toISOString(),
      completedAt:      new Date().toISOString(),
      factoryVersion:   FACTORY_VERSION,
      stages:           stageLog,
      validationStatus: validationResult.status,
      promotedAt:       null,
    });
    stage("log", "pass", Date.now() - t5);

    // ── Summary ─────────────────────────────────────────────────────────────
    const totalMs  = Date.now() - startedAt;
    const relPath  = `scripts/factory/drafts/${slug}.ts`;

    log(`\n[mkc:factory] Complete — ${(totalMs / 1000).toFixed(2)}s`);
    log(`              Draft:    ${relPath}`);
    log(`              Status:   ${valStatus}  [${validationResult.totalErrors} errors, ${validationResult.totalWarnings} warnings]`);
    log(`              Promote:  npm run mkc:factory:promote -- ${slug}\n`);

    return {
      status:     degraded ? "degraded" : "complete",
      slug,
      draftPath:  draftResult.path,
      state,
      message:    `Draft created: ${relPath}  Validation: ${valStatus}`,
      durationMs: totalMs,
    };
  }
}

// ── Module helpers ─────────────────────────────────────────────────────────────

/**
 * Derives the stage log name from a producer class name.
 * Convention: strip "Producer" suffix and lowercase.
 * Exception: RelationshipProducer → "relationships" (established plural form).
 */
function toStageName(producerName: string): string {
  const base = producerName.replace(/Producer$/, "").toLowerCase();
  return base === "relationship" ? "relationships" : base;
}
