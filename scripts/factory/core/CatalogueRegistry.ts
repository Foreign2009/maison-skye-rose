/**
 * Knowledge Factory — Catalogue Registry
 *
 * Maps ProductCategory to a catalogue loader function.
 * Each loader resolves a slug against its category's supplier catalogue
 * and returns the typed ProductIntake record, or null if not found.
 *
 * Invariant: product slugs are globally unique across all catalogues.
 * A slug found in more than one catalogue is a data error — the registry
 * throws rather than silently resolving one.
 *
 * One loader is registered per category. Duplicate category registration throws.
 */

import type { ProductCategory } from "../../../app/lib/mkc/types";
import type { ProductIntake }   from "../types";

// ── Types ──────────────────────────────────────────────────────────────────────

export type CatalogueLoader = (slug: string) => ProductIntake | null;

// ── Registry ───────────────────────────────────────────────────────────────────

export class CatalogueRegistry {
  private readonly loaders = new Map<ProductCategory, CatalogueLoader>();

  register(category: ProductCategory, loader: CatalogueLoader): this {
    if (this.loaders.has(category)) {
      throw new Error(`CatalogueLoader already registered for category: ${category}`);
    }
    this.loaders.set(category, loader);
    return this;
  }

  find(slug: string): ProductIntake | null {
    const matches: ProductIntake[] = [];
    for (const loader of this.loaders.values()) {
      const result = loader(slug);
      if (result !== null) matches.push(result);
    }
    if (matches.length > 1) {
      const cats = matches.map(m => m.category).join(", ");
      throw new Error(
        `Slug collision: "${slug}" found in multiple catalogues (${cats}). Product slugs must be globally unique.`,
      );
    }
    return matches[0] ?? null;
  }
}
