/**
 * Knowledge Factory — Home Fragrance Producer Registry
 *
 * Parallel to ProducerRegistry. Typed exclusively around HomeFragranceProducerSet
 * and HomeFragranceBaseProducer. Prevents accidental substitution of fragrance
 * producers into the home fragrance pipeline at TypeScript compile time:
 *
 *   ProducerSet = { category: ProductCategory; producers: readonly BaseProducer[] }
 *   HomeFragranceProducerSet = { category: "home-fragrance"; producers: readonly HomeFragranceBaseProducer[] }
 *
 * These types are structurally incompatible — BaseProducer and HomeFragranceBaseProducer
 * have different abstract method signatures. TypeScript will reject:
 *
 *   registry.register(FRAGRANCE_PRODUCER_SET);  // ← compile error
 *
 * Production AI gate:
 *   HOME_FRAGRANCE_PRODUCER_SET is NOT registered here at module init.
 *   Registration happens only in test infrastructure or explicit CLI callers.
 *   The production orchestrator's defaultRegistry still rejects "home-fragrance"
 *   until EP4-P3D explicitly connects the pipeline.
 */

import type { HomeFragranceProducerSet } from "./HomeFragranceBaseProducer";

// ── Registry ───────────────────────────────────────────────────────────────────

export class HomeFragranceProducerRegistry {
  private set: HomeFragranceProducerSet | null = null;

  register(set: HomeFragranceProducerSet): this {
    if (this.set !== null) {
      throw new Error("HomeFragranceProducerSet already registered");
    }
    this.set = set;
    return this;
  }

  getProducerSet(category: "home-fragrance"): HomeFragranceProducerSet {
    if (this.set === null) {
      throw new Error(`No HomeFragranceProducerSet registered for category: ${category}`);
    }
    return this.set;
  }
}
