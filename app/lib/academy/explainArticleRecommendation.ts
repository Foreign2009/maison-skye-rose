import type { FragranceKnowledge } from "../mkc/types";
import { ARTICLE_REGISTRY } from "./registry";

// Module-level index — O(1) lookups; built once at module initialisation.
const REGISTRY_INDEX = new Map(ARTICLE_REGISTRY.map((e) => [e.slug, e]));

/**
 * Generates a short, one-line explanation of why an Academy article was
 * recommended for a given fragrance.
 *
 * Returns null when:
 *   - the article has no family or occasion specificity (universal articles)
 *   - the article's families/occasions don't intersect with the fragrance
 *
 * Never fabricates a reason. Consumers should omit the explanation line when
 * this function returns null.
 *
 * Priority order:
 *   1. Family + occasion combined match  → "Perfect for Amber evening fragrances"
 *   2. Multiple family matches           → "Relevant to Amber & Vanilla fragrances"
 *   3. Single family match               → "Recommended for Amber fragrances"
 *   4. Occasion match only               → "Recommended for Evening fragrances"
 */
export function explainArticleRecommendation(
  fragrance: FragranceKnowledge,
  article: { slug: string },
): string | null {
  const entry = REGISTRY_INDEX.get(article.slug);
  if (!entry) return null;

  // Articles with no family or occasion specificity → no explanation to surface
  if (entry.families.length === 0 && entry.occasions.length === 0) return null;

  // Family intersection: registry families (title-case) vs fragrance families (title-case)
  const matchedFamilies = entry.families.length > 0
    ? fragrance.family.filter((f) => entry.families.includes(f))
    : [];

  // Occasion intersection: registry occasions are lowercase; fragrance occasions are title-case
  const fragOccasionSet = new Set(fragrance.occasions.map((o) => o.toLowerCase()));
  const matchedOccasions = entry.occasions.length > 0
    ? entry.occasions.filter((o) => fragOccasionSet.has(o))
    : [];

  // No match on either dimension → don't fabricate
  if (matchedFamilies.length === 0 && matchedOccasions.length === 0) return null;

  // Priority 1: Family + occasion combined
  if (matchedFamilies.length > 0 && matchedOccasions.length > 0) {
    return `Perfect for ${matchedFamilies[0]} ${matchedOccasions[0]} fragrances`;
  }

  // Priority 2: Multiple family matches
  if (matchedFamilies.length >= 2) {
    return `Relevant to ${matchedFamilies[0]} & ${matchedFamilies[1]} fragrances`;
  }

  // Priority 3: Single family match
  if (matchedFamilies.length === 1) {
    return `Recommended for ${matchedFamilies[0]} fragrances`;
  }

  // Priority 4: Occasion match only — title-case the display label
  const occDisplay = matchedOccasions[0]
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `Recommended for ${occDisplay} fragrances`;
}
