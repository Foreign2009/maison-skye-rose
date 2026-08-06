/**
 * Knowledge Factory — Slug Derivation
 *
 * Single authoritative slug-derivation helper for the Knowledge Factory.
 * Used by intake catalogue matching, dashboard coverage calculations,
 * and any other factory module that maps a product title to a URL-safe slug.
 *
 * Algorithm: lowercase + collapse whitespace to hyphens.
 * Do not change without verifying all derived slugs remain identical.
 */

export function deriveSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
