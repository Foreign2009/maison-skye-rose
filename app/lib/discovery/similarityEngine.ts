import type { FragranceKnowledge } from "../mkc/types";
import type { SimilarityResult, DiscoveryContext } from "./types";
import {
  scoreFamily,
  scoreNotes,
  scoreSeason,
  scoreOccasion,
  scoreCharacter,
  scoreProjection,
  scoreCollection,
  scorePopularity,
} from "./scoring";
import { mkcCatalogue } from "../mkc/catalogue";

/**
 * Returns fragrances most similar to the source, ranked by characteristic
 * similarity. Scoring is ~95% fragrance characteristics, ~5% popularity
 * (tie-break only — see weights.ts for exact values).
 *
 * The breakdown field is reserved for Explainability and Maison AI.
 * Consumers may ignore it until those features are implemented.
 */
export function getSimilarFragrances(
  source: FragranceKnowledge,
  context: DiscoveryContext = {},
  catalogue: FragranceKnowledge[] = mkcCatalogue
): SimilarityResult[] {
  const { excludeSlug = source.slug, count = 3 } = context;

  return catalogue
    .filter((candidate) => candidate.slug !== excludeSlug)
    .map((candidate) => {
      const family     = scoreFamily(source, candidate);
      const notes      = scoreNotes(source, candidate);
      const season     = scoreSeason(source, candidate);
      const occasion   = scoreOccasion(source, candidate);
      const character  = scoreCharacter(source, candidate);
      const projection = scoreProjection(source, candidate);
      const collection = scoreCollection(source, candidate);
      const popularity = scorePopularity(candidate);

      return {
        fragrance:  candidate,
        totalScore: family + notes + season + occasion + character + projection + collection + popularity,
        breakdown:  { family, notes, season, occasion, character, projection, collection, popularity },
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, count);
}
