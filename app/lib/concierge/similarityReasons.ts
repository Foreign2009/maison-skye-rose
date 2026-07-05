import type { FragranceKnowledge } from "../mkc/types";
import type { SimilarityResult } from "../discovery/types";

/**
 * Derives customer-facing reasons why a fragrance is similar to the source.
 * Extracted from ProductDetail to be reusable across the Concierge and PDP.
 */
export function deriveSimilarityReasons(
  source: FragranceKnowledge,
  result: SimilarityResult
): string[] {
  const reasons: string[] = [];
  const { breakdown, fragrance: f } = result;

  if (breakdown.family > 0) {
    const sharedFamily = source.family.find((fam) => f.family.includes(fam));
    reasons.push(
      sharedFamily
        ? `Shares the same ${sharedFamily.toLowerCase()} character`
        : "Belongs to a similar fragrance family"
    );
  }
  if (breakdown.character > 0) reasons.push("Matching overall scent personality");
  if (breakdown.occasion > 0)  reasons.push("Perfect for the same moments and occasions");
  if (breakdown.season > 0)    reasons.push(`Both shine in ${f.season.toLowerCase()} conditions`);
  if (breakdown.notes > 0)     reasons.push("Shares similar fragrance notes");
  if (breakdown.projection > 0) reasons.push("Comparable strength and presence");
  if (breakdown.collection > 0) reasons.push("From the same Maison collection");
  if (f.bestSeller)             reasons.push("One of our most loved fragrances");

  while (reasons.length < 2) reasons.push("Thoughtfully selected to complement your choice");
  return reasons.slice(0, 3);
}
