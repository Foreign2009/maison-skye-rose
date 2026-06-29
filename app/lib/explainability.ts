import { Fragrance } from "../data/types";
import { IntentSignals } from "./intentParser";

export type ExplanationResult = {
  reasons: string[];
  matchStrength: "strong" | "moderate" | "partial";
};

const FALLBACK_REASONS: string[] = [
  "Recommended by Maison AI",
  "Carefully curated for your style",
];

// Match conditions mirror the scoring weights in recommendFragrances.ts exactly.
// A reason fires if and only if that dimension awarded points in the scorer,
// so explanations remain consistent with actual ranking behaviour.
export function generateReasons(
  signals: IntentSignals,
  fragrance: Fragrance
): ExplanationResult {
  const reasons: string[] = [];
  let signalMatchCount = 0;

  // Family (+20 in scorer) — checks if any fragrance family token appears inside signals.family
  if (
    signals.family &&
    fragrance.family.some((f) =>
      signals.family!.toLowerCase().includes(f.toLowerCase())
    )
  ) {
    reasons.push(`Matches your ${signals.family} scent profile`);
    signalMatchCount++;
  }

  // Vibe (+20 in scorer) — case-insensitive equality against fragrance.vibe[]
  if (
    signals.vibe &&
    fragrance.vibe.some((v) => v.toLowerCase() === signals.vibe!.toLowerCase())
  ) {
    reasons.push(`Delivers the ${signals.vibe} experience you're looking for`);
    signalMatchCount++;
  }

  // Occasion (+20 in scorer) — exact match against fragrance.occasions[]
  if (signals.occasion && fragrance.occasions.includes(signals.occasion)) {
    reasons.push(`Well suited for ${signals.occasion}`);
    signalMatchCount++;
  }

  // Gender (+25 in scorer) — direct equality (both use lowercase literals)
  if (signals.gender && fragrance.gender === signals.gender) {
    reasons.push("Curated for your scent direction");
    signalMatchCount++;
  }

  // Character (+15 in scorer) — direct equality
  if (signals.character && fragrance.scentCharacter === signals.character) {
    reasons.push("Matches your preferred scent character");
    signalMatchCount++;
  }

  // Best seller — not a signal dimension; does not count toward matchStrength
  if (fragrance.bestSeller) {
    reasons.push("One of our most loved fragrances");
  }

  // Cap at 4 reasons, preserving priority order (family → vibe → occasion → gender → character → bestSeller)
  const capped = reasons.slice(0, 4);

  // Ensure minimum 2 reasons
  let i = 0;
  while (capped.length < 2 && i < FALLBACK_REASONS.length) {
    capped.push(FALLBACK_REASONS[i]);
    i++;
  }

  const matchStrength: ExplanationResult["matchStrength"] =
    signalMatchCount >= 3 ? "strong" : signalMatchCount >= 1 ? "moderate" : "partial";

  return { reasons: capped, matchStrength };
}
