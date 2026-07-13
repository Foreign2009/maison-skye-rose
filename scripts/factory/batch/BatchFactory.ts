/**
 * Knowledge Factory — Batch Factory
 *
 * Top-level coordinator for batch generation runs.
 *
 * Responsibilities:
 *   1. Build the work queue from the supplier catalogue
 *   2. Initialise resume state
 *   3. Run the BatchRunner (promise pool)
 *   4. Build and print the batch report
 *   5. Write batch-log.json
 *   6. Clear resume state on clean completion
 */

import { FACTORY_VERSION }      from "../orchestrator";
import { BatchQueue }           from "./BatchQueue";
import { BatchProgress }        from "./BatchProgress";
import { BatchRunner }          from "./BatchRunner";
import { buildReport, printReport } from "./BatchReport";
import { writeBatchLog }        from "./BatchLogger";
import {
  saveResumeState,
  loadResumeState,
  clearResumeState,
}                               from "./ResumeState";
import type { BatchConfig }     from "./BatchConfig";
import type { BatchReport }     from "./BatchReport";

export interface BatchInput {
  config: BatchConfig;
}

export class BatchFactory {

  async run(input: BatchInput): Promise<BatchReport> {
    const { config } = input;
    const startedAt  = new Date();
    const batchId    = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);

    // ── Header ──────────────────────────────────────────────────────────────────
    console.log(`\n[mkc:batch] ${batchId}`);
    console.log(`[mkc:batch] Factory ${FACTORY_VERSION}  concurrency:${config.maxConcurrency}${config.dryRun ? "  DRY-RUN" : ""}${config.force ? "  FORCE" : ""}${config.stopOnFailure ? "  STOP-ON-FAILURE" : ""}`);

    // ── Resume state ─────────────────────────────────────────────────────────────
    const skipSlugs = new Set<string>();

    if (config.resumeMode) {
      const prior = loadResumeState();
      if (prior) {
        for (const s of prior.completed) skipSlugs.add(s);
        console.log(`[mkc:batch] Resume — skipping ${prior.completed.length} already-completed record(s)`);
      } else {
        console.log(`[mkc:batch] Resume — no prior state found, starting fresh`);
      }
    }

    // ── Queue ─────────────────────────────────────────────────────────────────────
    const queue = BatchQueue.build(config, skipSlugs);

    if (queue.size() === 0) {
      console.log(`[mkc:batch] Nothing to process — all records are already generated or native.\n`);
      const empty = buildReport({
        batchId,
        startedAt,
        completedAt:       new Date(),
        snapshot:          { total: 0, completed: 0, success: 0, failed: 0, skipped: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0, elapsedMs: 0, estRemainingMs: 0 },
        validationSummary: { pass: 0, passWithWarnings: 0, fail: 0, unknown: 0 },
        failures:          [],
      });
      printReport(empty);
      return empty;
    }

    console.log(`[mkc:batch] Queue: ${queue.size()} record(s)\n`);

    if (config.collection) {
      console.log(`[mkc:batch] Collection filter: ${config.collection}`);
    }

    // ── Initialise resume state ───────────────────────────────────────────────────
    if (!config.dryRun) {
      saveResumeState({
        batchId,
        startedAt: startedAt.toISOString(),
        total:     queue.size(),
        completed: [...skipSlugs],
        failed:    [],
      });
    }

    // ── Run ───────────────────────────────────────────────────────────────────────
    const progress = new BatchProgress(queue.size());
    const runner   = new BatchRunner();

    const { failures, validationSummary } = await runner.run(queue, config, progress);

    // ── Report ────────────────────────────────────────────────────────────────────
    const completedAt = new Date();
    const snap        = progress.snapshot();

    const report = buildReport({
      batchId,
      startedAt,
      completedAt,
      snapshot:         snap,
      validationSummary,
      failures,
    });

    printReport(report);

    // ── Log ───────────────────────────────────────────────────────────────────────
    if (!config.dryRun) {
      writeBatchLog({
        batchId,
        startedAt:   startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        config: {
          maxConcurrency: config.maxConcurrency,
          dryRun:         config.dryRun,
          force:          config.force,
          collection:     config.collection,
          limit:          config.limit,
        },
        report,
      });
    }

    // ── Clear resume state on clean run ───────────────────────────────────────────
    if (!config.dryRun && failures.length === 0) clearResumeState();

    return report;
  }
}
