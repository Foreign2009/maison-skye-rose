import type { FragranceKnowledge } from "./types";

/**
 * Derives three lifestyle bullets from MKC fields only.
 * No invented content — all values are structured transforms of existing knowledge.
 * Shared by FragranceQuickView and ProductDetail.
 */
export function generateWhyYoullLikeIt(k: FragranceKnowledge): [string, string, string] {
  const topNote = k.notes.top[0]?.toLowerCase();
  const scent   = k.scentCharacter;

  const openingWord =
    scent === "Fresh & Light"         ? "Fresh"
    : scent === "Deep & Intense"      ? "Deep"
    : scent === "Rich & Full-Bodied" ? "Warm"
    : "Refined";

  const bullet1 = topNote
    ? `${openingWord} ${topNote} opening`
    : `${openingWord} ${(k.family[0] ?? "signature").toLowerCase()} character`;

  const characterMap: Record<string, string> = {
    "Fresh & Light":       "Light, effortless everyday character",
    "Balanced Signature":  "Refined, balanced signature scent",
    "Rich & Full-Bodied": "Rich, expressive character — full-bodied presence that deepens through the dry-down",
    "Deep & Intense":      "Bold, intense projection",
  };

  const occasionMap: Record<string, string> = {
    "Daily Wear":      k.season === "All Season"
                         ? "Easy, versatile everyday wear"
                         : `Effortless for ${k.season.toLowerCase()} days`,
    "Office":          "Confident, polished presence",
    "Date Night":      "Made for memorable evenings",
    "Wedding":         "Elegant for special occasions",
    "Vacation":        "Carefree summer companion",
    "Summer Days":     "Bright and airy for warm days",
    "Winter Evenings": "Warm and inviting on cold nights",
  };

  const bullet3 =
    occasionMap[k.occasions[0] ?? ""] ??
    (k.season === "All Season"
      ? "Wears beautifully year-round"
      : `Perfect for ${k.season.toLowerCase()} wear`);

  return [
    bullet1,
    characterMap[scent] ?? "Distinctive fragrance character",
    bullet3,
  ];
}
