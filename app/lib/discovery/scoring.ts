import type { FragranceKnowledge } from "../mkc/types";
import {
  FAMILY_WEIGHT,
  NOTE_WEIGHT,
  SEASON_WEIGHT,
  ADJACENT_SEASON_W,
  OCCASION_WEIGHT,
  CHARACTER_WEIGHT,
  PROJECTION_WEIGHT,
  COLLECTION_WEIGHT,
  POPULARITY_WEIGHT,
} from "./weights";

// ── Constants ─────────────────────────────────────────────────────────────────

const NOTE_MATCH_CAP = 3;

const ADJACENT_SEASONS: Record<string, string | undefined> = {
  Spring: "Summer",
  Summer: "Spring",
  Autumn: "Winter",
  Winter: "Autumn",
};

// ── Shared scoring helpers ────────────────────────────────────────────────────
// Every discovery engine imports from here. No scoring logic lives elsewhere.

export function scoreFamily(
  source: FragranceKnowledge,
  candidate: FragranceKnowledge
): number {
  let score = 0;
  for (const fam of source.family) {
    if (candidate.family.includes(fam)) score += FAMILY_WEIGHT;
  }
  return score;
}

export function scoreNotes(
  source: FragranceKnowledge,
  candidate: FragranceKnowledge
): number {
  const sourceNotes = new Set([
    ...source.notes.top,
    ...source.notes.heart,
    ...source.notes.base,
  ]);
  const candidateNotes = [
    ...candidate.notes.top,
    ...candidate.notes.heart,
    ...candidate.notes.base,
  ];
  let matches = 0;
  for (const note of candidateNotes) {
    if (sourceNotes.has(note)) {
      matches++;
      if (matches >= NOTE_MATCH_CAP) break;
    }
  }
  return matches * NOTE_WEIGHT;
}

export function scoreSeason(
  source: FragranceKnowledge,
  candidate: FragranceKnowledge
): number {
  if (source.season === candidate.season) return SEASON_WEIGHT;
  if (ADJACENT_SEASONS[source.season] === candidate.season) return ADJACENT_SEASON_W;
  return 0;
}

export function scoreOccasion(
  source: FragranceKnowledge,
  candidate: FragranceKnowledge
): number {
  let score = 0;
  for (const occ of source.occasions) {
    if (candidate.occasions.includes(occ)) score += OCCASION_WEIGHT;
  }
  return score;
}

export function scoreCharacter(
  source: FragranceKnowledge,
  candidate: FragranceKnowledge
): number {
  return source.scentCharacter === candidate.scentCharacter ? CHARACTER_WEIGHT : 0;
}

export function scoreProjection(
  source: FragranceKnowledge,
  candidate: FragranceKnowledge
): number {
  return source.projection === candidate.projection ? PROJECTION_WEIGHT : 0;
}

export function scoreCollection(
  source: FragranceKnowledge,
  candidate: FragranceKnowledge
): number {
  return source.collection === candidate.collection ? COLLECTION_WEIGHT : 0;
}

export function scorePopularity(candidate: FragranceKnowledge): number {
  return candidate.popularity * POPULARITY_WEIGHT;
}
