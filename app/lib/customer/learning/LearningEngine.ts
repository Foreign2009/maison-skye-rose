/**
 * Customer Intelligence — Learning Engine
 *
 * Concrete orchestrator that owns the Preference Learning lifecycle.
 * Mirrors the role of BatchRunner in the Knowledge Factory.
 *
 * Non-overridable lifecycle (run()):
 *   1. interpret  — each signal → matching interpreter → PreferenceCandidate[]
 *   2. accumulate — candidates  → PreferenceAccumulator → AccumulatedPreference[]
 *   3. resolve    — accumulated → PreferenceResolver    → PreferenceCandidate[]
 *   4. measure    — build LearningMetrics
 *   5. return LearningResult
 *
 * All policies are injected — the engine owns no business logic.
 * Individual interpreter errors are caught and logged; they do not abort the run.
 *
 * Integration points:
 *   BaseInterpreter          — interpreter registry keyed by SignalSource
 *   PreferenceAccumulatorContract — accumulates candidates by dimension + value
 *   PreferenceResolverContract    — resolves groups to a final candidate set
 *   LearningLoggerContract        — diagnostic logging sink
 *   LearningResult                — returned from run()
 */

import type { CustomerSignal }               from "../signals/CustomerSignal";
import type { SignalSource }                 from "../signals/SignalSource";
import type { LearningContext }              from "./LearningContext";
import type { LearningResult }              from "./LearningResult";
import type { PreferenceCandidate }         from "./PreferenceCandidate";
import type { PreferenceAccumulatorContract } from "./PreferenceAccumulator";
import type { PreferenceResolverContract }   from "./PreferenceResolver";
import type { LearningLoggerContract }       from "./LearningLogger";
import { BaseInterpreter }                   from "./BaseInterpreter";
import { createDefaultAccumulator }          from "./PreferenceAccumulator";
import { createPassthroughResolver,
         createAccumulatedResolver }         from "./PreferenceResolver";
import { createNullLogger }                  from "./LearningLogger";
import { createCompositingCalculator }       from "./ConfidenceCalculator";
import { buildMetrics }                      from "./LearningMetrics";
import {
  QuizInterpreter,
  ConciergeInterpreter,
  PurchaseInterpreter,
  FavoriteInterpreter,
  CartInterpreter,
  SearchInterpreter,
  ViewInterpreter,
  DiscoveryInterpreter,
} from "./SignalInterpreter";

// ── Configuration ─────────────────────────────────────────────────────────────

export interface LearningEngineConfig {
  readonly accumulator?: PreferenceAccumulatorContract;
  readonly resolver?:    PreferenceResolverContract;
  readonly logger?:      LearningLoggerContract;
}

// ── Engine ────────────────────────────────────────────────────────────────────

export class LearningEngine {
  private readonly interpreters: Map<SignalSource, BaseInterpreter>;
  private readonly accumulator:  PreferenceAccumulatorContract;
  private readonly resolver:     PreferenceResolverContract;
  private readonly logger:       LearningLoggerContract;

  constructor(
    interpreters: readonly BaseInterpreter[],
    config: LearningEngineConfig = {},
  ) {
    this.interpreters = new Map<SignalSource, BaseInterpreter>();
    for (const interpreter of interpreters) {
      this.interpreters.set(interpreter.source, interpreter);
    }
    this.accumulator = config.accumulator ?? createDefaultAccumulator();
    this.resolver    = config.resolver    ?? createPassthroughResolver();
    this.logger      = config.logger      ?? createNullLogger();
  }

  run(
    signals: readonly CustomerSignal[],
    context: LearningContext,
  ): LearningResult {
    const startTime = Date.now();

    // ── Interpret ─────────────────────────────────────────────────────────────
    const allCandidates: PreferenceCandidate[] = [];
    let signalsProcessed = 0;

    for (const signal of signals) {
      const interpreter = this.interpreters.get(signal.source);
      if (!interpreter || !interpreter.canInterpret(signal)) continue;

      try {
        const candidates = interpreter.interpret(signal, context);
        allCandidates.push(...candidates);
        signalsProcessed++;

        this.logger.log({
          level:     "info",
          message:   `Interpreted ${signal.source}:${signal.type}`,
          data:      { signalId: signal.id, candidatesProduced: candidates.length },
          timestamp: Date.now(),
        });
      } catch (err) {
        this.logger.log({
          level:     "error",
          message:   `Interpreter error for signal ${signal.id}`,
          data:      { source: signal.source, type: signal.type, error: String(err) },
          timestamp: Date.now(),
        });
      }
    }

    // ── Accumulate ────────────────────────────────────────────────────────────
    const accumulated = this.accumulator.accumulate(allCandidates);

    // ── Resolve ───────────────────────────────────────────────────────────────
    const resolved = this.resolver.resolve(accumulated);

    // ── Measure ───────────────────────────────────────────────────────────────
    const metrics = buildMetrics("batch", startTime, signalsProcessed, resolved);

    this.logger.log({
      level:     "info",
      message:   "Learning run complete",
      data:      {
        signalsProcessed,
        preferencesProduced: resolved.length,
        processingTimeMs:    metrics.processingTimeMs,
      },
      timestamp: Date.now(),
    });

    return { success: true, candidates: resolved, metrics };
  }
}

// ── Default engine factory ────────────────────────────────────────────────────

/**
 * Pre-wired engine with all 8 interpreters and default policies.
 * 7 active: Quiz, Concierge, Favorite, Cart, Search, View, Discovery.
 * 1 deferred: Purchase (no fragrance_purchase signals emitted yet).
 *
 * Default policies (EP20-P3):
 *   accumulator — createCompositingCalculator(): multiple weak signals compound
 *   resolver    — createAccumulatedResolver(): group confidence propagates to output
 *
 * Inject custom policies via LearningEngineConfig if needed.
 */
export function createDefaultLearningEngine(
  config: LearningEngineConfig = {},
): LearningEngine {
  return new LearningEngine(
    [
      new QuizInterpreter(),
      new ConciergeInterpreter(),
      new PurchaseInterpreter(),
      new FavoriteInterpreter(),
      new CartInterpreter(),
      new SearchInterpreter(),
      new ViewInterpreter(),
      new DiscoveryInterpreter(),
    ],
    {
      accumulator: config.accumulator ?? createDefaultAccumulator(createCompositingCalculator()),
      resolver:    config.resolver    ?? createAccumulatedResolver(),
      logger:      config.logger      ?? createNullLogger(),
    },
  );
}
