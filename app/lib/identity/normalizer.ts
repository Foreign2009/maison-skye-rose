/**
 * Maison Identity Platform — Identity String Normalizer
 *
 * Provides stable, deterministic normalization for identity registry lookups.
 * Used internally by IdentityRegistry for canonical name deduplication and
 * alias collision detection. Not persisted — computed at lookup time.
 *
 * Contract:
 *   - Trims leading/trailing whitespace
 *   - Converts to lowercase
 *   - Collapses internal whitespace sequences to a single space
 *
 * Explicitly does NOT:
 *   - Remove digits ("Kayali Freedom Musk Latte 41" stays intact)
 *   - Remove brand names or flanker words
 *   - Perform fuzzy matching or edit-distance comparisons
 *   - Correct spelling or translate
 *   - Stem or lemmatize
 *   - Remove punctuation (hyphens, apostrophes, accents preserved as-is)
 *
 * The normalizer is for stable lookup, not semantic interpretation.
 * Semantic interpretation belongs to the resolver engine (EP5-P2+).
 */

/**
 * Normalizes an identity string for registry lookup.
 * Returns a stable, lowercased, whitespace-collapsed form.
 *
 * Examples:
 *   "  MFK A La Rose  "  →  "mfk a la rose"
 *   "Kayali Freedom Musk Latte 41"  →  "kayali freedom musk latte 41"
 *   "À la rose"  →  "à la rose"        (accents preserved)
 *   "Baccarat Rouge 540"  →  "baccarat rouge 540"  (digit preserved)
 */
export function normalizeIdentityString(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Builds the registry key for canonical duplicate detection.
 * Only called when canonicalBrand is present.
 *
 * Format: normalize(brand) + "::" + normalize(name) + "::" + category
 */
export function buildCanonicalKey(
  canonicalBrand: string,
  canonicalName: string,
  category: string,
): string {
  return (
    normalizeIdentityString(canonicalBrand) +
    "::" +
    normalizeIdentityString(canonicalName) +
    "::" +
    category
  );
}
