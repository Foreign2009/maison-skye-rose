/**
 * Knowledge Factory — Home Fragrance Merger
 *
 * Consolidates HomeFragranceProducerResult outputs onto the scaffold record.
 * Failed producer results are skipped. All other statuses contribute their fields.
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
    if (result.status === "failed") continue;
    accumulated = { ...accumulated, ...result.fields };
  }
  return Object.assign({ ...scaffold }, accumulated);
}
