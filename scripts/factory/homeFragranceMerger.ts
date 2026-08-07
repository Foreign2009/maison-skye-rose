/**
 * Knowledge Factory — Home Fragrance Merger
 *
 * Consolidates HomeFragranceProducerResult outputs onto the scaffold record.
 * Only "success" producer results contribute their fields.
 * Failed and degraded results are both skipped (EP4-P3CR).
 *
 * Policy (EP4-P3CR):
 *   success  → contributes fields
 *   skipped  → contributes nothing (fields are always {})
 *   failed   → skipped — invalid output must not enter the record
 *   degraded → skipped — validation errors disqualify the result
 *
 * Mirrors the fragrance merger.ts pattern, typed for HomeFragranceKnowledge.
 *
 * Type safety: overrides are accumulated as Partial<HomeFragranceKnowledge> and
 * applied via Object.assign. Object.assign returns HomeFragranceKnowledge &
 * Partial<HomeFragranceKnowledge>, which is structurally assignable to
 * HomeFragranceKnowledge — no unchecked assertion is required.
 */

import type { HomeFragranceKnowledge } from "../../app/lib/mkc/homeFragranceTypes";
import type { HomeFragranceProducerResult } from "./core/types";

export function mergeHomeFragrance(
  scaffold: HomeFragranceKnowledge,
  ...producerResults: HomeFragranceProducerResult[]
): HomeFragranceKnowledge {
  let accumulated: Partial<HomeFragranceKnowledge> = {};
  for (const result of producerResults) {
    if (result.status === "failed" || result.status === "degraded") continue;
    accumulated = { ...accumulated, ...result.fields };
  }
  return Object.assign({ ...scaffold }, accumulated);
}
