/**
 * Knowledge Factory — Merger (P1)
 *
 * Consolidates stage outputs into the final FragranceKnowledge record.
 *
 * P1: No AI producers exist. The merger passes the scaffold output through
 *     unchanged. This module is a placeholder for P2 which will merge
 *     Composition, Editorial, Discovery, Education, and Intelligence
 *     producer results into the unified record.
 *
 * P2 signature will be:
 *   merge(scaffold: FragranceKnowledge, ...producerResults: ProducerResult[]): FragranceKnowledge
 */

import type { FragranceKnowledge } from "../../app/lib/mkc/types";

export function merge(scaffold: FragranceKnowledge): FragranceKnowledge {
  return scaffold;
}
