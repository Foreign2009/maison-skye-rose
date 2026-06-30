import { Fragrance } from "../data/types";

export type QuizAnswers = {
  gender?: string;
  occasion?: string;
  vibe?: string;
  family?: string;
  character?: string;
};

export type RecommendationResults = {
  bestMatch: Fragrance | null;

  similarMatches: Fragrance[];

  luxuryUpgrade: Fragrance | null;

  hiddenGem: Fragrance | null;
};

export function recommendFragrances(
  fragrances: Fragrance[],
  answers: QuizAnswers
): RecommendationResults {

  const scored = fragrances
    .map((fragrance) => {

      let score = 0;

      // GENDER
      if (
        answers.gender &&
        fragrance.gender ===
          answers.gender.toLowerCase()
      ) {
        score += 25;
      }

      // OCCASION
      if (
        answers.occasion &&
        fragrance.occasions.includes(
          answers.occasion
        )
      ) {
        score += 20;
      }

      // VIBE
      if (
        answers.vibe &&
        fragrance.vibe.some(
          (v) =>
            v.toLowerCase() ===
            answers.vibe?.toLowerCase()
        )
      ) {
        score += 20;
      }

      // FAMILY
      if (
        answers.family &&
        fragrance.family.some(
          (family) =>
            answers.family
              ?.toLowerCase()
              .includes(
                family.toLowerCase()
              )
        )
      ) {
        score += 20;
      }

      // SCENT CHARACTER
      if (
        answers.character &&
        fragrance.scentCharacter ===
          answers.character
      ) {
        score += 15;
      }

      // POPULARITY BONUS
      score += fragrance.popularity;

      return {
        ...fragrance,
        score,
      };

    })
    .sort(
      (a, b) =>
        b.score - a.score
    );

  const bestMatch =
    scored[0] || null;

  const similarMatches =
    scored.slice(1, 4);

  const luxuryUpgrade =
    scored.slice(1).find(
      (item) =>
        item.collection === "Elite"
    ) ||
    null;

  const hiddenGem =
    scored.slice(1).find(
      (item) =>
        item.popularity <= 6 && item.gender !== "unisex"
    ) ||
    null;

  return {
    bestMatch,

    similarMatches,

    luxuryUpgrade,

    hiddenGem,
  };
}