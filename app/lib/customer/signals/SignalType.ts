/**
 * Customer Intelligence — Signal Type
 *
 * Canonical enumeration of what dimension a CustomerSignal carries information
 * about. A single interaction event may emit multiple signals of different types.
 */

export type SignalType =
  | "family_preference"
  | "family_avoidance"
  | "note_preference"
  | "note_avoidance"
  | "occasion_preference"
  | "season_preference"
  | "gender_preference"
  | "budget_preference"
  | "character_preference"
  | "collection_affinity"
  | "fragrance_engagement"
  | "fragrance_purchase"
  | "fragrance_save"
  | "search_query"
  | "discovery_path";

export const SIGNAL_TYPES: readonly SignalType[] = [
  "family_preference",
  "family_avoidance",
  "note_preference",
  "note_avoidance",
  "occasion_preference",
  "season_preference",
  "gender_preference",
  "budget_preference",
  "character_preference",
  "collection_affinity",
  "fragrance_engagement",
  "fragrance_purchase",
  "fragrance_save",
  "search_query",
  "discovery_path",
] as const;
