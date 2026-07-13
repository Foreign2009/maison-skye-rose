/**
 * Knowledge Factory — Batch Progress
 *
 * Tracks per-record results and prints live progress to stdout.
 *
 * Per-record output:
 *   ✓  (12/56)  sauvage-elixir-inspired
 *        complete    PASS  3.4s  6,200 tok  [done:11 failed:0 left:44 ~8m left]
 *
 * Token extraction works by summing producerResults metrics from PipelineResult.
 * Skipped/dry-run records contribute 0 tokens.
 */

import type { PipelineResult } from "../types";

export interface TokenUsage {
  promptTokens:     number;
  completionTokens: number;
  totalTokens:      number;
}

export interface ProgressSnapshot {
  total:            number;
  completed:        number;
  success:          number;
  failed:           number;
  skipped:          number;
  promptTokens:     number;
  completionTokens: number;
  totalTokens:      number;
  elapsedMs:        number;
  estRemainingMs:   number;
}

function extractTokens(result: PipelineResult): TokenUsage {
  if (!result.state?.producerResults) {
    return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  }
  let promptTokens = 0;
  let completionTokens = 0;
  for (const pr of result.state.producerResults) {
    promptTokens     += pr.metrics.promptTokens;
    completionTokens += pr.metrics.completionTokens;
  }
  return { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens };
}

export class BatchProgress {
  private readonly total:      number;
  private completed            = 0;
  private success              = 0;
  private failed               = 0;
  private skipped              = 0;
  private promptTokens         = 0;
  private completionTokens     = 0;
  private readonly startedAt   = Date.now();

  constructor(total: number) {
    this.total = total;
  }

  recordResult(slug: string, result: PipelineResult): void {
    this.completed++;
    const tokens = extractTokens(result);
    this.promptTokens     += tokens.promptTokens;
    this.completionTokens += tokens.completionTokens;

    if (result.status === "skipped") {
      this.skipped++;
    } else if (result.status === "failed") {
      this.failed++;
    } else {
      this.success++;
    }

    this.printLine(slug, result, tokens);
  }

  recordFailed(slug: string, error: string, durationMs: number): void {
    this.completed++;
    this.failed++;
    const snap = this.snapshot();
    console.log(`  ✗  (${snap.completed}/${snap.total})  ${slug}`);
    console.log(`       failed      ${(durationMs / 1000).toFixed(1)}s  [done:${snap.success} failed:${snap.failed} left:${snap.total - snap.completed} ~${fmtMs(snap.estRemainingMs)} left]  ${error}`);
  }

  snapshot(): ProgressSnapshot {
    const elapsedMs      = Date.now() - this.startedAt;
    const done           = this.completed;
    const avgMs          = done > 0 ? elapsedMs / done : 0;
    const estRemainingMs = avgMs * (this.total - done);

    return {
      total:            this.total,
      completed:        done,
      success:          this.success,
      failed:           this.failed,
      skipped:          this.skipped,
      promptTokens:     this.promptTokens,
      completionTokens: this.completionTokens,
      totalTokens:      this.promptTokens + this.completionTokens,
      elapsedMs,
      estRemainingMs,
    };
  }

  private printLine(slug: string, result: PipelineResult, tokens: TokenUsage): void {
    const snap    = this.snapshot();
    const icon    = result.status === "skipped" ? "→" : result.status === "failed" ? "✗" : "✓";
    const valStat = result.state?.validationResult?.status ?? "—";
    const tokStr  = tokens.totalTokens > 0
      ? `  ${tokens.totalTokens.toLocaleString()} tok`
      : "";
    const durStr  = `${(result.durationMs / 1000).toFixed(1)}s`;
    const tail    = `[done:${snap.success} failed:${snap.failed} left:${snap.total - snap.completed} ~${fmtMs(snap.estRemainingMs)} left]`;

    console.log(`  ${icon}  (${snap.completed}/${snap.total})  ${slug}`);
    console.log(`       ${result.status.padEnd(10)}  ${valStat}  ${durStr}${tokStr}  ${tail}`);
  }
}

function fmtMs(ms: number): string {
  if (ms <= 0)         return "—";
  if (ms < 60_000)     return `${Math.ceil(ms / 1000)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return s > 0 ? `${m}m${s}s` : `${m}m`;
}
