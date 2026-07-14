/**
 * Customer Intelligence — Learning Metrics
 *
 * Measurement data produced by every LearningEngine run.
 * Supports diagnostics and future learning auditing.
 * Never routed to analytics — measurement contracts only.
 *
 * Integration points:
 *   LearningEngine — produces metrics at the end of run()
 *   LearningResult — carries metrics in both success and failure branches
 */

import type { SignalSource }     from "../signals/SignalSource";
import type { SignalConfidence } from "../signals/SignalConfidence";

export interface LearningMetrics {
  readonly signalsProcessed:       number;
  readonly preferencesProduced:    number;
  readonly processingTimeMs:       number;
  /** Which interpreter processed the signals, or "batch" for multi-interpreter runs. */
  readonly interpreter:            SignalSource | "batch";
  /** Count of resolved candidates per confidence tier. */
  readonly confidenceDistribution: Readonly<Record<SignalConfidence, number>>;
}

export function createEmptyMetrics(
  interpreter: SignalSource | "batch",
  startTime:   number,
): LearningMetrics {
  return {
    signalsProcessed:      0,
    preferencesProduced:   0,
    processingTimeMs:      Date.now() - startTime,
    interpreter,
    confidenceDistribution: { HIGH: 0, MEDIUM: 0, LOW: 0 },
  };
}

export function buildMetrics(
  interpreter: SignalSource | "batch",
  startTime:   number,
  processed:   number,
  candidates:  readonly { readonly confidence: SignalConfidence }[],
): LearningMetrics {
  const dist: Record<SignalConfidence, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const c of candidates) dist[c.confidence]++;

  return {
    signalsProcessed:      processed,
    preferencesProduced:   candidates.length,
    processingTimeMs:      Date.now() - startTime,
    interpreter,
    confidenceDistribution: dist,
  };
}
