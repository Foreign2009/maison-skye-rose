/**
 * Knowledge Factory — Home Fragrance Context Builder
 *
 * The single assembly point for HomeFragranceFactoryContext.
 * Mirrors the role of ContextBuilder for the home fragrance pipeline.
 *
 * Architectural constraints:
 *   - Must NOT import from or wrap the fragrance ContextBuilder.
 *   - Must NOT access nativeFragrances (no home fragrance native registry yet).
 *   - Must NOT manufacture collection, gender, projection, or DisplayFragrance.
 *   - Home fragrance producers receive HomeFragranceFactoryContext and must
 *     not import from ContextBuilder or app/lib/mkc/native/.
 */

import crypto from "crypto";
import type { HomeFragrancePipelineState }                    from "../types";
import type { HomeFragranceFactoryContext, HomeFragranceKnowledge, FactoryConfig } from "./types";

export class HomeFragranceContextBuilder {
  static build(
    state:  HomeFragrancePipelineState,
    config: FactoryConfig,
  ): HomeFragranceFactoryContext {
    const record = state.record;
    return {
      runId:          crypto.randomUUID(),
      factoryVersion: state.factoryVersion,
      startedAt:      new Date(),
      slug:           state.slug,
      name:           record.name,
      category:       "home-fragrance",
      productType:    record.productType,
      range:          record.range,
      scaffoldRecord: record,
      currentRecord:  record,
      config,
    };
  }

  static withMergedRecord(
    ctx:    HomeFragranceFactoryContext,
    record: HomeFragranceKnowledge,
  ): HomeFragranceFactoryContext {
    return { ...ctx, currentRecord: record };
  }
}
