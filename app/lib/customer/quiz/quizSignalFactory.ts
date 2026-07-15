/**
 * Customer Intelligence — Quiz Signal Factory
 *
 * Pure function: maps raw quiz answers to CustomerSignal[].
 * Uses buildSignal() as the sole creation path — no direct object construction.
 *
 * All quiz signals carry:
 *   source:     "quiz"     — canonical signal origin
 *   confidence: "HIGH"     — explicit customer statement (highest tier)
 *
 * Signal type mapping:
 *   gender    → gender_preference
 *   occasion  → occasion_preference
 *   family    → family_preference
 *   character → character_preference  (vibe co-located in payload)
 *   vibe      → character_preference  (when character is absent)
 *
 * "vibe" has no dedicated SignalType. It is stored in the character_preference
 * payload so the PreferenceLearningEngine can surface it without a schema change.
 */

import { buildSignal } from "../signals/SignalBuilder";
import type { CustomerSignal } from "../signals/CustomerSignal";

export interface QuizAnswers {
  readonly gender?:    string;
  readonly occasion?:  string;
  readonly vibe?:      string;
  readonly family?:    string;
  readonly character?: string;
}

export function buildQuizSignals(answers: QuizAnswers): CustomerSignal[] {
  const signals: CustomerSignal[] = [];

  if (answers.gender) {
    signals.push(
      buildSignal({
        source:     "quiz",
        type:       "gender_preference",
        payload:    { gender: answers.gender.toLowerCase() },
        confidence: "HIGH",
      }),
    );
  }

  if (answers.occasion) {
    signals.push(
      buildSignal({
        source:     "quiz",
        type:       "occasion_preference",
        payload:    { occasion: answers.occasion },
        confidence: "HIGH",
      }),
    );
  }

  if (answers.family) {
    signals.push(
      buildSignal({
        source:     "quiz",
        type:       "family_preference",
        payload:    { family: answers.family },
        confidence: "HIGH",
      }),
    );
  }

  if (answers.character || answers.vibe) {
    signals.push(
      buildSignal({
        source:     "quiz",
        type:       "character_preference",
        payload:    {
          ...(answers.character ? { character: answers.character } : {}),
          ...(answers.vibe      ? { vibe:      answers.vibe      } : {}),
        },
        confidence: "HIGH",
      }),
    );
  }

  return signals;
}
