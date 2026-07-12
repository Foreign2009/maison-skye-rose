/**
 * Knowledge Factory — Merger
 *
 * Consolidates producer outputs into the final FragranceKnowledge record.
 *
 * Contract (per FACTORY_CONTRACT.md):
 *   - "failed" producer fields are never applied
 *   - "degraded" producer fields ARE applied (with draft annotations)
 *   - "skipped" producer fields (empty {}) are not applied
 *   - Producers are applied in order; later producers override earlier ones
 *     for the same field (only relevant when producers overlap, which they
 *     should not — each producer owns distinct field groups)
 */

import type { FragranceKnowledge } from "../../app/lib/mkc/types";
import type { ProducerResult }     from "./core/types";

export function merge(
  scaffold: FragranceKnowledge,
  ...producerResults: ProducerResult[]
): FragranceKnowledge {
  let record: FragranceKnowledge = { ...scaffold };

  for (const result of producerResults) {
    if (result.status === "failed") continue;

    // Spread producer fields onto the record.
    // Partial<FragranceKnowledge> only contains keys present in FragranceKnowledge,
    // so this is type-safe. Required fields from scaffold are preserved.
    record = { ...record, ...result.fields } as FragranceKnowledge;
  }

  return record;
}
