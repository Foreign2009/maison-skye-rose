/**
 * Knowledge Factory — Orchestrator (P1)
 *
 * Controls the pipeline lifecycle for a single record.
 * Coordinates all stages in dependency order.
 *
 * P1 pipeline stages:
 *   1. Intake      — locate record in supplier catalogue
 *   2. Scaffold    — derive all deterministic fields
 *   3. Merge       — consolidate (pass-through in P1)
 *   4. Validate    — run existing MKC validator
 *   5. DraftBuild  — write TypeScript draft file
 *   6. Log         — record run to factory-log.json
 *
 * P2 will add AI producer stages between Scaffold and Merge.
 * P3 will add the Relationship Producer to stage 2.
 */

import path from "path";
import { intake }       from "./intake";
import { scaffold }     from "./scaffold";
import { merge }        from "./merger";
import { buildDraft }   from "./draftBuilder";
import { logRun }       from "./metrics/factoryLogger";
import { validateKnowledgeRecord } from "../../app/lib/mkc/validator";
import type { PipelineInput, PipelineResult, PipelineState, StageEntry } from "./types";

// ── Constants ─────────────────────────────────────────────────────────────────

export const FACTORY_VERSION = "0.1.0";

const ROOT      = process.cwd();
const DRAFT_DIR = path.join(ROOT, "scripts", "factory", "drafts");

// ── Pipeline runner ───────────────────────────────────────────────────────────

export async function run(input: PipelineInput): Promise<PipelineResult> {
  const { slug, force } = input;
  const startedAt = Date.now();
  const stageLog:  StageEntry[] = [];

  function stage(name: string, status: StageEntry["status"], durationMs: number, message?: string): void {
    stageLog.push({ stage: name, status, durationMs, message });
    const icon = status === "pass" ? "✓" : status === "degraded" ? "⚠" : "✗";
    const suffix = message ? `  (${message})` : "";
    console.log(`  ${icon}  ${name.padEnd(12)} ${status.padStart(8)}  ${durationMs}ms${suffix}`);
  }

  console.log(`\n[mkc:factory] ${slug}`);

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

    // ── Stage 3: Merge (P1 pass-through) ───────────────────────────────────
    const t2     = Date.now();
    const record = merge(scaffolded);
    stage("merge", "pass", Date.now() - t2);

    // ── Stage 4: Validate ───────────────────────────────────────────────────
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
    };

    // ── Stage 5: Draft Build ────────────────────────────────────────────────
    const t4 = Date.now();
    const draftResult = buildDraft({ state, draftDir: DRAFT_DIR });
    stage("draft", "pass", Date.now() - t4);

    // ── Stage 6: Log ────────────────────────────────────────────────────────
    const t5 = Date.now();
    logRun({
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

    console.log(`\n[mkc:factory] Complete — ${(totalMs / 1000).toFixed(2)}s`);
    console.log(`              Draft:    ${relPath}`);
    console.log(`              Status:   ${valStatus}  [${validationResult.totalErrors} errors, ${validationResult.totalWarnings} warnings]`);
    console.log(`              Promote:  npm run mkc:factory:promote -- ${slug}\n`);

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
