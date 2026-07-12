/**
 * Knowledge Factory — Context Builder
 *
 * The single assembly point for FactoryContext.
 * The only factory module allowed to import from app/lib/mkc/native/index.
 *
 * Producers receive FactoryContext and must not call this module or
 * import from app/ themselves.
 */

import crypto                from "crypto";
import type { PipelineState } from "../types";
import { nativeFragrances }   from "../../../app/lib/mkc/native/index";
import type { FactoryContext, FactoryConfig, FragranceKnowledge } from "./types";

export class ContextBuilder {
  static build(state: PipelineState, config: FactoryConfig): FactoryContext {
    return {
      runId:            crypto.randomUUID(),
      factoryVersion:   state.factoryVersion,
      wave:             null,
      startedAt:        new Date(),
      slug:             state.slug,
      name:             state.record.name,
      collection:       state.record.collection,
      displayFrag:      state.displayFrag,
      scaffoldRecord:   state.record,
      currentRecord:    state.record,
      nativeFragrances: nativeFragrances as ReadonlyMap<string, FragranceKnowledge>,
      catalogueSize:    nativeFragrances.size,
      config,
    };
  }

  static withMergedRecord(ctx: FactoryContext, record: FragranceKnowledge): FactoryContext {
    return { ...ctx, currentRecord: record };
  }
}
