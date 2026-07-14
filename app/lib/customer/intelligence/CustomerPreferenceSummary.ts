/**
 * Customer Intelligence — Customer Preference Summary
 *
 * Structured projection of what the customer has expressed interest in.
 * Populated from PreferenceCandidates produced by the LearningEngine.
 *
 * All arrays are empty and hasPreferences is false until EP10.0-P5+ implements
 * concrete interpreter rules. The type and builder are stable now so the
 * Learning Engine integration is already wired.
 *
 * Integration points:
 *   CustomerIntelligenceEngine — built from LearningEngine.run() candidates
 *   CustomerInsights           — embedded as sub-component
 *   PreferenceCandidate        — source of all preference data
 */

import type { CustomerReadModel }  from "./CustomerReadModel";
import type { PreferenceCandidate } from "../learning/PreferenceCandidate";

export interface CustomerPreferenceSummary extends CustomerReadModel {
  readonly preferredFamilies:  readonly string[];
  readonly avoidedFamilies:    readonly string[];
  readonly preferredOccasions: readonly string[];
  readonly preferredSeasons:   readonly string[];
  readonly dominantGender:     "male" | "female" | "unisex" | null;
  readonly totalPreferences:   number;
  readonly hasPreferences:     boolean;
}

export function buildCustomerPreferenceSummary(
  customerId: string,
  candidates: readonly PreferenceCandidate[],
  now:        number,
): CustomerPreferenceSummary {
  const preferredFamilies:  string[] = [];
  const avoidedFamilies:    string[] = [];
  const preferredOccasions: string[] = [];
  const preferredSeasons:   string[] = [];
  let dominantGender: "male" | "female" | "unisex" | null = null;

  for (const c of candidates) {
    if (c.type === "family_preference" && c.positive) {
      if (!preferredFamilies.includes(c.value)) preferredFamilies.push(c.value);
    } else if (c.type === "family_avoidance" || (c.type === "family_preference" && !c.positive)) {
      if (!avoidedFamilies.includes(c.value)) avoidedFamilies.push(c.value);
    } else if (c.type === "occasion_preference" && c.positive) {
      if (!preferredOccasions.includes(c.value)) preferredOccasions.push(c.value);
    } else if (c.type === "season_preference" && c.positive) {
      if (!preferredSeasons.includes(c.value)) preferredSeasons.push(c.value);
    } else if (c.type === "gender_preference" && c.positive) {
      if (c.value === "male" || c.value === "female" || c.value === "unisex") {
        dominantGender = c.value;
      }
    }
  }

  return {
    customerId,
    generatedAt:         now,
    preferredFamilies,
    avoidedFamilies,
    preferredOccasions,
    preferredSeasons,
    dominantGender,
    totalPreferences:    candidates.length,
    hasPreferences:      candidates.length > 0,
  };
}
