/**
 * Maison Identity Platform — Token Scorer
 *
 * Deterministic token overlap scoring for Stage 4 of the resolution pipeline.
 *
 * Score model (three components):
 *   1. Name token overlap  — Jaccard similarity on canonical name tokens (max 60 pts)
 *   2. Brand alignment     — token overlap between supplier and canonical brand (max 20 pts)
 *   3. Digit preservation  — hard conflict penalty when digit token sets differ (-30 pts)
 *
 * Maximum theoretical score: 60 + 20 + 0 = 80 points.
 * Minimum after penalty:     0 + 0 - 30 = clamped to 0.
 *
 * Key flags (returned alongside score):
 *   hasMeaningfulMismatch — any tokens present on one side but not the other (flanker protection)
 *   hasDigitConflict      — digit token sets differ (hard block on auto-resolution)
 *
 * These flags are used by the resolver to apply conservative auto-resolution policy.
 * A high score with hasMeaningfulMismatch or hasDigitConflict cannot produce "resolved".
 */

import { normalizeIdentityString } from "../normalizer";
import { tokenize }                 from "./tokenizer";
import type { ResolutionSignal }    from "./types";

// ── Public types ──────────────────────────────────────────────────────────────

export type TokenScorerInput = {
  readonly queryTokens:          ReadonlySet<string>;
  readonly candidateNameTokens:  ReadonlySet<string>;
  readonly candidateBrandTokens: ReadonlySet<string>;   // Empty Set if no canonicalBrand
  readonly supplierBrandTokens:  ReadonlySet<string>;   // Empty Set if no supplierBrand supplied
};

export type TokenScorerOutput = {
  readonly score:                 number;                       // 0–80, clamped
  readonly signals:               readonly ResolutionSignal[];
  readonly hasMeaningfulMismatch: boolean;  // Any token differs between query and candidate name
  readonly hasDigitConflict:      boolean;  // Digit token sets differ
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function isDigitToken(t: string): boolean {
  return /^\d+$/.test(t);
}

// ── Scorer ────────────────────────────────────────────────────────────────────

/**
 * Scores a single candidate against the query using the three-component model.
 * Deterministic: identical inputs always produce identical outputs.
 */
export function scoreTokens(input: TokenScorerInput): TokenScorerOutput {
  const { queryTokens, candidateNameTokens, candidateBrandTokens, supplierBrandTokens } = input;
  const signals: ResolutionSignal[] = [];
  let score = 0;

  // Component 1: Jaccard name token overlap (max 60 points)
  const nameIntersect = [...queryTokens].filter(t => candidateNameTokens.has(t));
  const nameUnion = new Set([...queryTokens, ...candidateNameTokens]);
  const jaccard = nameUnion.size > 0 ? nameIntersect.length / nameUnion.size : 0;
  const nameScore = jaccard * 60;
  score += nameScore;

  if (nameIntersect.length > 0) {
    signals.push({
      type:   "name-token-overlap",
      detail: `${nameIntersect.length}/${nameUnion.size} name tokens matched (Jaccard ${(jaccard * 100).toFixed(0)}%)`,
      weight: nameScore,
    });
  }

  // Component 2: Brand alignment (max 20 points; 0 if either brand is absent)
  if (supplierBrandTokens.size > 0 && candidateBrandTokens.size > 0) {
    const brandIntersect = [...supplierBrandTokens].filter(t => candidateBrandTokens.has(t));
    const denominator = Math.max(supplierBrandTokens.size, candidateBrandTokens.size);
    const brandOverlap = brandIntersect.length / denominator;
    const brandScore = brandOverlap * 20;
    score += brandScore;

    if (brandScore > 0) {
      signals.push({
        type:   "brand-token-match",
        detail: `Brand tokens matched: [${brandIntersect.join(", ")}]`,
        weight: brandScore,
      });
    } else {
      signals.push({
        type:   "brand-mismatch",
        detail: `Supplier brand [${[...supplierBrandTokens].join(", ")}] did not match candidate brand [${[...candidateBrandTokens].join(", ")}]`,
        weight: 0,
      });
    }
  }

  // Component 3: Digit preservation guard
  const queryDigits     = [...queryTokens].filter(isDigitToken);
  const candidateDigits = [...candidateNameTokens].filter(isDigitToken);
  const missingFromCandidate = queryDigits.filter(d => !candidateDigits.includes(d));
  const extraInCandidate     = candidateDigits.filter(d => !queryDigits.includes(d));
  const hasDigitConflict = missingFromCandidate.length > 0 || extraInCandidate.length > 0;

  if (hasDigitConflict) {
    const penalty = -30;
    score += penalty;
    signals.push({
      type:   "digit-mismatch",
      detail: `Digit conflict: query [${queryDigits.join(", ") || "none"}] vs candidate [${candidateDigits.join(", ") || "none"}]`,
      weight: penalty,
    });
  } else if (queryDigits.length > 0) {
    signals.push({
      type:   "digit-preserved",
      detail: `Digit tokens matched exactly: [${queryDigits.join(", ")}]`,
      weight: 0,
    });
  }

  // Meaningful token mismatch — flanker protection flag
  // Any token present on one side but not the other → potential flanker qualifier difference
  const extraInCandidateName = [...candidateNameTokens].filter(t => !queryTokens.has(t));
  const extraInQuery         = [...queryTokens].filter(t => !candidateNameTokens.has(t));
  const hasMeaningfulMismatch = extraInCandidateName.length > 0 || extraInQuery.length > 0;

  if (hasMeaningfulMismatch) {
    const conflictTokens = [
      ...extraInCandidateName.map(t => `candidate-only:"${t}"`),
      ...extraInQuery.map(t => `query-only:"${t}"`),
    ];
    signals.push({
      type:   "meaningful-token-mismatch",
      detail: `Non-matching tokens: ${conflictTokens.join(", ")}`,
      weight: 0,
    });
  }

  const clampedScore = Math.max(0, Math.min(80, score));
  return { score: clampedScore, signals, hasMeaningfulMismatch, hasDigitConflict };
}

// ── Token set builder ─────────────────────────────────────────────────────────

/**
 * Builds a token set from any identity string value.
 * Normalizes first, then tokenizes. Used by the resolver to build
 * query token sets and candidate token sets for comparison.
 */
export function buildTokenSet(value: string): ReadonlySet<string> {
  return new Set(tokenize(normalizeIdentityString(value)));
}
