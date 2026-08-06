/**
 * Knowledge Factory — Producer Registry
 *
 * Maps ProductCategory to an ordered ProducerSet.
 * The orchestrator resolves the correct set at runtime instead of
 * hardcoding individual producers.
 *
 * One ProducerSet is registered per category. Producers within a set
 * run in array order; each receives the accumulated context from all
 * preceding producers in the same set.
 */

import type { ProductCategory } from "../../../app/lib/mkc/types";
import type { BaseProducer }    from "./BaseProducer";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ProducerSet = {
  readonly category: ProductCategory;
  readonly producers: readonly BaseProducer[];
};

// ── Registry ───────────────────────────────────────────────────────────────────

export class ProducerRegistry {
  private readonly sets = new Map<ProductCategory, ProducerSet>();

  register(set: ProducerSet): this {
    this.sets.set(set.category, set);
    return this;
  }

  getProducerSet(category: ProductCategory): ProducerSet {
    const set = this.sets.get(category);
    if (!set) throw new Error(`No ProducerSet registered for category: ${category}`);
    return set;
  }
}
