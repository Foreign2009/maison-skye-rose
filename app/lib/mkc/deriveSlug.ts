/**
 * Maison Knowledge Catalogue — Canonical Slug Derivation
 *
 * Single authoritative implementation shared by both:
 *   - app/lib/mkc/ (validator slug formula checks)
 *   - scripts/factory/ (intake, scaffold, dashboard, batch, lifecycle)
 *
 * scripts/factory/core/deriveSlug.ts re-exports from here so that all
 * factory consumers continue resolving through their existing import paths
 * without change.
 *
 * Algorithm: lowercase + collapse whitespace to hyphens.
 * Do not change without verifying all derived slugs remain identical.
 */

export function deriveSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
