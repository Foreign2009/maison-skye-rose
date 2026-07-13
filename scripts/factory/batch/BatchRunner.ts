/**
 * Knowledge Factory — Batch Runner
 *
 * Executes pipeline runs from a BatchQueue using a promise pool.
 *
 * Concurrency model:
 *   N workers each call queue.next() in a loop. Since Node.js is single-threaded,
 *   the pointer advance is atomic — no two workers receive the same entry.
 *
 * Retry:
 *   Failed records are retried up to config.retryCount times before being marked
 *   retry_exhausted. Skipped records are NOT retried (they succeeded at skip).
 *
 * Stop-on-failure:
 *   When stopOnFailure is true, the shared `shouldStop` flag is set on first
 *   failure. Workers check this flag before dequeuing the next entry. In-flight
 *   records complete normally — only new dequeues are halted.
 */

import { run as runPipeline }   from "../orchestrator";
import type { PipelineResult }  from "../types";
import type { BatchConfig }     from "./BatchConfig";
import type { BatchQueue, QueueEntry } from "./BatchQueue";
import type { BatchProgress }   from "./BatchProgress";
import type { BatchFailure }    from "./FailureReport";
import type { ValidationSummary } from "./BatchReport";
import { updateResumeState }    from "./ResumeState";

export interface BatchRecordResult {
  slug:       string;
  name:       string;
  status:     PipelineResult["status"] | "retry_exhausted";
  result:     PipelineResult | null;
  attempts:   number;
  durationMs: number;
  error?:     string;
}

export class BatchRunner {

  async run(
    queue:    BatchQueue,
    config:   BatchConfig,
    progress: BatchProgress,
  ): Promise<{
    results:           BatchRecordResult[];
    failures:          BatchFailure[];
    validationSummary: ValidationSummary;
  }> {
    const results:    BatchRecordResult[] = [];
    const failures:   BatchFailure[]      = [];
    const valSummary: ValidationSummary   = { pass: 0, passWithWarnings: 0, fail: 0, unknown: 0 };
    let   shouldStop  = false;

    const worker = async (): Promise<void> => {
      while (!shouldStop) {
        const entry = queue.next();
        if (!entry) break;

        const rec = await this.runWithRetry(entry, config);
        results.push(rec);

        if (rec.result) {
          progress.recordResult(entry.slug, rec.result);
          const vs = rec.result.state?.validationResult?.status;
          if      (vs === "PASS")               valSummary.pass++;
          else if (vs === "PASS_WITH_WARNINGS") valSummary.passWithWarnings++;
          else if (vs === "FAIL")               valSummary.fail++;
          else                                  valSummary.unknown++;
        } else {
          progress.recordFailed(entry.slug, rec.error ?? "pipeline failed", rec.durationMs);
          valSummary.unknown++;
        }

        const isFailure = rec.status === "failed" || rec.status === "retry_exhausted";
        if (!config.dryRun) updateResumeState(entry.slug, !isFailure);

        if (isFailure) {
          failures.push({
            slug:       entry.slug,
            name:       entry.name,
            error:      rec.error ?? "pipeline failed",
            attempts:   rec.attempts,
            durationMs: rec.durationMs,
            timestamp:  new Date().toISOString(),
          });
          if (config.stopOnFailure) shouldStop = true;
        }
      }
    };

    const concurrency = Math.max(1, Math.min(config.maxConcurrency, queue.size()));
    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    return { results, failures, validationSummary: valSummary };
  }

  private async runWithRetry(
    entry:   QueueEntry,
    config:  BatchConfig,
    attempt = 1,
  ): Promise<BatchRecordResult> {
    const t0 = Date.now();

    try {
      const result = await runPipeline({
        slug:   entry.slug,
        force:  config.force,
        dryRun: config.dryRun,
        silent: true,
      });

      const durationMs = Date.now() - t0;

      // Retry on failure if attempts remain
      if (result.status === "failed" && attempt <= config.retryCount) {
        return this.runWithRetry(entry, config, attempt + 1);
      }

      return {
        slug:       entry.slug,
        name:       entry.name,
        status:     result.status,
        result,
        attempts:   attempt,
        durationMs,
        error:      result.status === "failed" ? result.message : undefined,
      };

    } catch (err) {
      const durationMs = Date.now() - t0;
      const error      = err instanceof Error ? err.message : String(err);

      if (attempt <= config.retryCount) {
        return this.runWithRetry(entry, config, attempt + 1);
      }

      return {
        slug:       entry.slug,
        name:       entry.name,
        status:     "retry_exhausted",
        result:     null,
        attempts:   attempt,
        durationMs,
        error,
      };
    }
  }
}
