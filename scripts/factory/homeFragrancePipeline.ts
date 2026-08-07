/**
 * Knowledge Factory — Home Fragrance Pipeline
 *
 * In-memory pipeline runner for the Home Fragrance producer chain.
 * Accepts injected generation infrastructure for deterministic testing.
 *
 * Production pipeline (EP4-P3D+):
 *   Wiring to the orchestrator CLI is deferred to EP4-P3D.
 *   Until then, real generation is only accessible via explicit injection.
 *
 * Safety guarantees:
 *   - No draft is written to disk (buildHomeFragranceDraft returns a string).
 *   - No AI call occurs without an explicitly injected GenerationEngine.
 *   - No ANTHROPIC_API_KEY or other credential is required.
 *   - The standard mkc:factory CLI cannot accidentally invoke this pipeline.
 *
 * Producer sequence: Composition → Editorial (intentional — Editorial must
 * see the enriched composition notes before generating copy).
 */

import { HomeFragranceContextBuilder }        from "./core/HomeFragranceContextBuilder";
import { HomeFragranceCompositionProducer }    from "./producers/HomeFragranceCompositionProducer";
import { HomeFragranceEditorialProducer }      from "./producers/HomeFragranceEditorialProducer";
import { mergeHomeFragrance }                  from "./homeFragranceMerger";
import { validateHomeFragranceRecord }         from "../../app/lib/mkc/homeFragranceValidator";
import { buildHomeFragranceDraft }             from "./HomeFragranceDraftBuilder";
import { FACTORY_VERSION }                     from "./version";
import type { GenerationEngine }               from "./core/GenerationEngine";
import type { HomeFragranceProducerSet }       from "./core/HomeFragranceBaseProducer";
import type { HomeFragrancePipelineState }     from "./types";
import type { HomeFragranceProducerResult, FactoryConfig } from "./core/types";
import type { HomeFragranceKnowledge }         from "../../app/lib/mkc/homeFragranceTypes";
import type { ValidationResult }               from "../../app/lib/mkc/validator";

// ── ProducerSet ───────────────────────────────────────────────────────────────
//
// Exported for use in the validate script and future EP4-P3D CLI.
// NOT registered in defaultRegistry (orchestrator) — that registration would
// expose home fragrance to the production Claude provider before EP4-P3D.
// The fragrance defaultRegistry still rejects "home-fragrance" (proof 23).

export type { HomeFragranceProducerSet } from "./core/HomeFragranceBaseProducer";

export const HOME_FRAGRANCE_PRODUCER_SET: HomeFragranceProducerSet = {
  category:  "home-fragrance",
  producers: [
    new HomeFragranceCompositionProducer(),
    new HomeFragranceEditorialProducer(),
  ],
};

// ── Pipeline result ───────────────────────────────────────────────────────────

export interface HomeFragrancePipelineMemoryResult {
  readonly record:           HomeFragranceKnowledge;
  readonly validationResult: ValidationResult;
  readonly draft:            string;
  readonly producerResults:  HomeFragranceProducerResult[];
}

// ── Pipeline runner ───────────────────────────────────────────────────────────

export async function runHomeFragrancePipeline(
  state:       HomeFragrancePipelineState,
  producerSet: HomeFragranceProducerSet,
  engine:      GenerationEngine,
  config:      FactoryConfig,
): Promise<HomeFragrancePipelineMemoryResult> {
  const producerResults: HomeFragranceProducerResult[] = [];
  const scaffoldRecord = state.record;

  let ctx = HomeFragranceContextBuilder.build(state, config);

  for (const producer of producerSet.producers) {
    const result = await producer.run(ctx, engine);
    producerResults.push(result);

    if (result.status === "success") {
      // Merge clean output and update context for the next producer.
      const merged = mergeHomeFragrance(scaffoldRecord, ...producerResults);
      ctx = HomeFragranceContextBuilder.withMergedRecord(ctx, merged);
    } else if (result.status === "failed" || result.status === "degraded") {
      // Invalid output must not propagate. Stop the producer chain so that
      // downstream producers never receive composition fields that failed
      // Composition validation. The final merge will skip this result.
      break;
    }
    // status === "skipped": continue without merging (preCheck declined the run).
  }

  const record           = mergeHomeFragrance(scaffoldRecord, ...producerResults);
  const validationResult = validateHomeFragranceRecord(record);
  const draft            = buildHomeFragranceDraft(record, validationResult, FACTORY_VERSION);

  return { record, validationResult, draft, producerResults };
}
