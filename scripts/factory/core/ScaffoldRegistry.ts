/**
 * Knowledge Factory — Scaffold Registry
 *
 * Maps ProductCategory to a category-specific scaffolder function.
 * The orchestrator resolves the correct scaffolder at runtime instead of
 * directly calling category-specific scaffold logic.
 *
 * Mirrors the patterns of CatalogueRegistry and ProducerRegistry:
 *   - One scaffolder registered per category.
 *   - Duplicate category registration throws.
 *   - Missing category resolution throws before any AI generation begins.
 *   - No silent fallback.
 *
 * CategoryScaffolder is typed to ProductIntake → ScaffoldResult.
 * With ProductIntake = FragranceIntake (current one-member union), this is
 * equivalent to the fragrance-specific contract. When a second category is
 * added to the union, TypeScript will surface any scaffolder that cannot safely
 * handle the new intake type, guiding the required update.
 */

import type { ProductCategory } from "../../../app/lib/mkc/types";
import type { ProductIntake }   from "../types";
import type { ScaffoldResult }  from "../types";

// ── Types ──────────────────────────────────────────────────────────────────────

export type CategoryScaffolder = (intake: ProductIntake) => ScaffoldResult;

// ── Registry ───────────────────────────────────────────────────────────────────

export class ScaffoldRegistry {
  private readonly scaffolders = new Map<ProductCategory, CategoryScaffolder>();

  register(category: ProductCategory, scaffolder: CategoryScaffolder): this {
    if (this.scaffolders.has(category)) {
      throw new Error(`Scaffolder already registered for category: ${category}`);
    }
    this.scaffolders.set(category, scaffolder);
    return this;
  }

  getScaffolder(category: ProductCategory): CategoryScaffolder {
    const scaffolder = this.scaffolders.get(category);
    if (!scaffolder) throw new Error(`No scaffolder registered for category: ${category}`);
    return scaffolder;
  }
}
