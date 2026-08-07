/**
 * Knowledge Factory — Home Fragrance Merger
 *
 * Consolidates HomeFragranceProducerResult outputs onto the scaffold record.
 * Failed producer results are skipped. All other statuses contribute their fields.
 *
 * Mirrors the fragrance merger.ts pattern, typed for HomeFragranceKnowledge.
 */

import type { HomeFragranceKnowledge } from "../../app/lib/mkc/homeFragranceTypes";
import type { HomeFragranceProducerResult } from "./core/types";

export function mergeHomeFragrance(
  scaffold: HomeFragranceKnowledge,
  ...producerResults: HomeFragranceProducerResult[]
): HomeFragranceKnowledge {
  let record: HomeFragranceKnowledge = { ...scaffold };
  for (const result of producerResults) {
    if (result.status === "failed") continue;
    record = { ...record, ...result.fields } as HomeFragranceKnowledge;
  }
  return record;
}
