/**
 * Temporary mapping layer.
 *
 * TODO:
 * Replace with MKC-driven Academy recommendation engine.
 *
 * Future implementation should derive Academy
 * recommendations directly from FragranceKnowledge.
 */

import type { FragranceKnowledge } from "../mkc/types";

const ALWAYS: string[] = [
  "the-note-pyramid-explained",
  "guide-to-fragrance-families",
];

export function getDiscoverMoreSlugs(knowledge: FragranceKnowledge): string[] {
  const season = (knowledge.season ?? "").toLowerCase();
  const occasions = knowledge.occasions.map((o) => o.toLowerCase()).join(" ");

  const isSignatureWear =
    occasions.includes("everyday") ||
    occasions.includes("office") ||
    occasions.includes("work") ||
    occasions.includes("signature");

  const isSeasonSpecific =
    season.length > 0 &&
    !season.includes("all season") &&
    !season.includes("year-round");

  const slot3 = isSignatureWear
    ? "what-makes-a-signature-scent"
    : isSeasonSpecific
    ? "choosing-your-season-scent"
    : "how-to-wear-fragrance";

  const slot4 =
    slot3 === "how-to-wear-fragrance"
      ? "how-to-layer-fragrances"
      : slot3 === "what-makes-a-signature-scent"
      ? "how-to-wear-fragrance"
      : "what-makes-a-signature-scent";

  return [...ALWAYS, slot3, slot4];
}
