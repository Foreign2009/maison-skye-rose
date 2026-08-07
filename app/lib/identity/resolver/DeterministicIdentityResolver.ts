/**
 * Maison Identity Platform — Deterministic Identity Resolver
 *
 * Five-stage deterministic pipeline for resolving supplier names to
 * registered IdentityRecord entries.
 *
 * Pipeline:
 *   Stage 0 — Filter eligible candidate universe (category boundary + rejected exclusion)
 *   Stage 1 — Exact normalized alias lookup
 *   Stage 2 — Exact normalized canonical name match
 *   Stage 3 — Attribution suffix strip + retry exact match
 *   Stage 4 — Deterministic token overlap scoring
 *   Stage 5 — No match
 *
 * At every successful Stage 1–4 match, identity lifecycle status controls
 * whether the result becomes "resolved" or "candidate".
 * Only "verified" identities may produce status "resolved".
 *
 * Purity guarantee:
 *   same ResolutionInput + same IdentityRegistry state → identical ResolutionResult
 *   No timestamps. No randomness. No side effects. No AI.
 *
 * Non-mutation guarantee:
 *   The resolver never calls register(), addAlias(), addEvidence(), or appendHistory().
 *   The registry is read-only from the resolver's perspective.
 */

import type { IdentityRecord, IdentityStatus } from "../types";
import type { IdentityRegistry }               from "../IdentityRegistry";
import { normalizeIdentityString }             from "../normalizer";
import { strip }                               from "./suffixStripper";
import { scoreTokens, buildTokenSet }          from "./tokenScorer";
import type {
  IdentityResolver,
  ResolutionInput,
  ResolutionResult,
  ResolutionStrategy,
  ResolutionSignal,
  ResolutionSignalType,
  CandidateMatch,
  IdentityProjection,
} from "./types";

// ── Internal helpers ──────────────────────────────────────────────────────────

function toProjection(record: IdentityRecord): IdentityProjection {
  return {
    identityId:     record.id,
    canonicalName:  record.canonicalIdentity.canonicalName,
    canonicalBrand: record.canonicalIdentity.canonicalBrand,
    category:       record.canonicalIdentity.category,
    identityStatus: record.status,
  };
}

function isAutoResolvable(status: IdentityStatus): boolean {
  return status === "verified";
}

function lifecycleSignal(record: IdentityRecord): ResolutionSignal {
  const statusSignals: Record<IdentityStatus, [ResolutionSignalType, string]> = {
    "verified":       ["identity-verified",    "Identity is verified — eligible for auto-resolution."],
    "candidate":      ["identity-unverified",  "Identity is candidate — not eligible for auto-resolution; requires editorial review."],
    "pending-review": ["identity-unverified",  "Identity is pending-review — not eligible for auto-resolution; awaiting editorial decision."],
    "disputed":       ["identity-disputed",    "Identity is disputed — never auto-resolve; conflicting evidence must be resolved editorially."],
    "deprecated":     ["identity-deprecated",  "Identity is deprecated — surfaced as historical candidate only; do not use as current truth."],
    "rejected":       ["identity-rejected",    "Identity is rejected — excluded from positive resolution pool."],
  };
  const [type, detail] = statusSignals[record.status];
  return { type, detail, weight: 0 };
}

function categorySignal(category: string): ResolutionSignal {
  return { type: "category-match", detail: `Category "${category}" matched.`, weight: 0 };
}

// ── Ambiguity threshold ───────────────────────────────────────────────────────
// If the top candidate and runner-up are within this many points of each other,
// the result is "ambiguous" rather than choosing a winner.
const AMBIGUITY_MARGIN = 15;

// ── Minimum score for a candidate to appear in "candidate" results ────────────
const CANDIDATE_THRESHOLD = 35;

// ── Minimum score for token-match to produce "resolved" ──────────────────────
const TOKEN_RESOLVE_THRESHOLD = 55;

// ── Resolver ──────────────────────────────────────────────────────────────────

export class DeterministicIdentityResolver implements IdentityResolver {

  constructor(private readonly registry: IdentityRegistry) {}

  resolve(input: ResolutionInput): ResolutionResult {
    const normalizedInput = normalizeIdentityString(input.supplierName);

    // Pre-build supplier brand token set (empty if no brand supplied)
    const supplierBrandTokens = input.supplierBrand
      ? buildTokenSet(input.supplierBrand)
      : new Set<string>();

    // ── Stage 0: Build eligible candidate universe ──────────────────────────
    // Hard category boundary: candidates must match input.category exactly.
    // Rejected identities are excluded from all positive resolution.
    const eligible = this.registry
      .list()
      .filter(r =>
        r.canonicalIdentity.category === input.category &&
        r.status !== "rejected"
      );

    // ── Stage 1: Exact alias lookup ─────────────────────────────────────────
    // Uses the registry's O(1) alias index. The alias index is global (all categories).
    // We must verify the matched identity belongs to the requested category.
    try {
      const aliasMatch = this.registry.findByAlias(normalizedInput);

      if (aliasMatch !== null) {
        if (aliasMatch.canonicalIdentity.category !== input.category) {
          // Cross-category alias: hard boundary violation — do not resolve for this request.
          // Fall through to Stage 2; the alias belongs to a different institutional domain.
        } else if (aliasMatch.status === "rejected") {
          // Rejected identity with an alias: excluded from positive resolution.
          // Fall through silently — treated as alias not found for this request.
        } else {
          const signals: ResolutionSignal[] = [
            { type: "alias-hit", detail: `Normalized input "${normalizedInput}" matched registered alias exactly.`, weight: 20 },
            categorySignal(input.category),
            lifecycleSignal(aliasMatch),
          ];

          if (isAutoResolvable(aliasMatch.status)) {
            return this._makeResolved("alias-exact", 95, aliasMatch, signals, normalizedInput, input);
          }
          return this._makeCandidate("alias-exact", 85, aliasMatch, signals, normalizedInput, input,
            `Exact alias matched "${normalizedInput}", but identity is not verified (status: ${aliasMatch.status}). Editorial confirmation required.`
          );
        }
      }
    } catch {
      return this._makeBlocked(normalizedInput, input, "Registry error during alias lookup.");
    }

    // ── Stage 2: Exact canonical name match ─────────────────────────────────
    // Searches only eligible same-category records (not rejected, same category).
    const exactNameMatches = eligible.filter(
      r => normalizeIdentityString(r.canonicalIdentity.canonicalName) === normalizedInput
    );

    if (exactNameMatches.length === 1) {
      const match = exactNameMatches[0];
      const signals: ResolutionSignal[] = [
        { type: "canonical-name-exact", detail: `Normalized input "${normalizedInput}" matched canonical name exactly.`, weight: 20 },
        categorySignal(input.category),
        lifecycleSignal(match),
      ];

      if (isAutoResolvable(match.status)) {
        return this._makeResolved("canonical-exact", 90, match, signals, normalizedInput, input);
      }
      return this._makeCandidate("canonical-exact", 80, match, signals, normalizedInput, input,
        `Canonical name matched exactly for "${normalizedInput}", but identity is not verified (status: ${match.status}).`
      );
    }

    if (exactNameMatches.length > 1) {
      // Attempt brand disambiguation when supplier brand is provided
      if (input.supplierBrand) {
        const normalizedSupplierBrand = normalizeIdentityString(input.supplierBrand);
        const brandFiltered = exactNameMatches.filter(
          r =>
            r.canonicalIdentity.canonicalBrand !== undefined &&
            normalizeIdentityString(r.canonicalIdentity.canonicalBrand) === normalizedSupplierBrand
        );
        if (brandFiltered.length === 1) {
          const match = brandFiltered[0];
          const signals: ResolutionSignal[] = [
            { type: "canonical-name-exact", detail: `Canonical name "${normalizedInput}" disambiguated via brand.`, weight: 20 },
            { type: "brand-token-match", detail: `Brand "${normalizedSupplierBrand}" resolved ambiguity among ${exactNameMatches.length} canonical matches.`, weight: 10 },
            categorySignal(input.category),
            lifecycleSignal(match),
          ];
          if (isAutoResolvable(match.status)) {
            return this._makeResolved("canonical-exact", 90, match, signals, normalizedInput, input);
          }
          return this._makeCandidate("canonical-exact", 80, match, signals, normalizedInput, input,
            `Canonical name + brand matched, but identity is not verified (status: ${match.status}).`
          );
        }
      }

      // Still ambiguous after brand filter
      const candidates: CandidateMatch[] = exactNameMatches.map(r => ({
        identity: toProjection(r),
        score:    90,
        signals:  [
          { type: "canonical-name-exact" as const, detail: `Canonical name "${normalizedInput}" matched.`, weight: 20 },
          lifecycleSignal(r),
        ],
      }));
      const topSignals: ResolutionSignal[] = [
        { type: "canonical-name-exact", detail: `Canonical name "${normalizedInput}" matched ${exactNameMatches.length} identities.`, weight: 20 },
      ];
      return {
        supplierName:    input.supplierName,
        normalizedInput,
        category:        input.category,
        status:          "ambiguous",
        strategy:        "canonical-exact",
        identity:        null,
        candidates,
        score:           90,
        signals:         topSignals,
        explanation:     `Multiple identities share canonical name "${normalizedInput}". Supply a brand to disambiguate.`,
      };
    }

    // ── Stage 3: Attribution suffix strip + retry ───────────────────────────
    // Strips only genuine attribution noise (e.g., " Inspired", " Inspired By").
    // Concentration/flanker markers (Extrait, Le Parfum, EDP, etc.) are NEVER stripped.
    const { stripped, appliedSuffix } = strip(input.supplierName);

    if (appliedSuffix !== null) {
      const normalizedStripped = normalizeIdentityString(stripped);

      // Retry Stage 1 with stripped name
      try {
        const strippedAlias = this.registry.findByAlias(normalizedStripped);
        if (
          strippedAlias !== null &&
          strippedAlias.canonicalIdentity.category === input.category &&
          strippedAlias.status !== "rejected"
        ) {
          const signals: ResolutionSignal[] = [
            { type: "suffix-stripped", detail: `Stripped suffix "${appliedSuffix}" from "${input.supplierName}" → "${stripped}".`, weight: 0 },
            { type: "alias-hit", detail: `Stripped name "${normalizedStripped}" matched registered alias.`, weight: 20 },
            categorySignal(input.category),
            lifecycleSignal(strippedAlias),
          ];
          if (isAutoResolvable(strippedAlias.status)) {
            return this._makeResolved("strip-suffix", 85, strippedAlias, signals, normalizedInput, input);
          }
          return this._makeCandidate("strip-suffix", 75, strippedAlias, signals, normalizedInput, input,
            `Alias matched after suffix strip, but identity is not verified (status: ${strippedAlias.status}).`
          );
        }
      } catch {
        // Alias lookup failed; continue to canonical name retry
      }

      // Retry Stage 2 with stripped name
      const strippedNameMatches = eligible.filter(
        r => normalizeIdentityString(r.canonicalIdentity.canonicalName) === normalizedStripped
      );

      if (strippedNameMatches.length === 1) {
        const match = strippedNameMatches[0];
        const signals: ResolutionSignal[] = [
          { type: "suffix-stripped", detail: `Stripped suffix "${appliedSuffix}" from "${input.supplierName}" → "${stripped}".`, weight: 0 },
          { type: "canonical-name-exact", detail: `Stripped canonical name "${normalizedStripped}" matched exactly.`, weight: 20 },
          categorySignal(input.category),
          lifecycleSignal(match),
        ];
        if (isAutoResolvable(match.status)) {
          return this._makeResolved("strip-suffix", 85, match, signals, normalizedInput, input);
        }
        return this._makeCandidate("strip-suffix", 75, match, signals, normalizedInput, input,
          `Canonical name matched after suffix strip, but identity is not verified (status: ${match.status}).`
        );
      }

      if (strippedNameMatches.length > 1) {
        // Brand disambiguation attempt
        if (input.supplierBrand) {
          const normalizedSupplierBrand = normalizeIdentityString(input.supplierBrand);
          const brandFiltered = strippedNameMatches.filter(
            r =>
              r.canonicalIdentity.canonicalBrand !== undefined &&
              normalizeIdentityString(r.canonicalIdentity.canonicalBrand) === normalizedSupplierBrand
          );
          if (brandFiltered.length === 1) {
            const match = brandFiltered[0];
            const signals: ResolutionSignal[] = [
              { type: "suffix-stripped", detail: `Stripped "${appliedSuffix}" → "${stripped}".`, weight: 0 },
              { type: "canonical-name-exact", detail: `Canonical name matched with brand disambiguation.`, weight: 20 },
              { type: "brand-token-match", detail: `Brand "${normalizedSupplierBrand}" resolved ambiguity.`, weight: 10 },
              categorySignal(input.category),
              lifecycleSignal(match),
            ];
            if (isAutoResolvable(match.status)) {
              return this._makeResolved("strip-suffix", 85, match, signals, normalizedInput, input);
            }
            return this._makeCandidate("strip-suffix", 75, match, signals, normalizedInput, input,
              `Name + brand matched after suffix strip, but identity is not verified (status: ${match.status}).`
            );
          }
        }
        // Ambiguous after suffix strip
        const candidates: CandidateMatch[] = strippedNameMatches.map(r => ({
          identity: toProjection(r),
          score:    85,
          signals:  [
            { type: "suffix-stripped" as const, detail: `Stripped "${appliedSuffix}" → "${stripped}".`, weight: 0 },
            { type: "canonical-name-exact" as const, detail: `Canonical name "${normalizedStripped}" matched.`, weight: 20 },
            lifecycleSignal(r),
          ],
        }));
        const topSignals: ResolutionSignal[] = [
          { type: "suffix-stripped", detail: `Stripped "${appliedSuffix}" → "${stripped}".`, weight: 0 },
          { type: "canonical-name-exact", detail: `Canonical name "${normalizedStripped}" matched ${strippedNameMatches.length} identities.`, weight: 20 },
        ];
        return {
          supplierName:    input.supplierName,
          normalizedInput,
          category:        input.category,
          status:          "ambiguous",
          strategy:        "strip-suffix",
          identity:        null,
          candidates,
          score:           85,
          signals:         topSignals,
          explanation:     `Multiple identities share canonical name "${normalizedStripped}" after suffix strip. Supply a brand to disambiguate.`,
        };
      }
    }

    // ── Stage 4: Token overlap scorer ───────────────────────────────────────
    // Scans all eligible records and scores by token overlap.
    // Conservative auto-resolution policy: requires all of:
    //   - verified identity
    //   - perfect name token coverage (no meaningful token mismatch)
    //   - no digit conflict
    //   - query has > 1 meaningful token (short-name protection)
    //   - single unambiguous winner (no close competitor)

    const queryTokens = buildTokenSet(input.supplierName);
    const isShortQuery = queryTokens.size <= 1;

    type ScoredRecord = {
      readonly record:                IdentityRecord;
      readonly score:                 number;
      readonly signals:               ResolutionSignal[];
      readonly hasMeaningfulMismatch: boolean;
      readonly hasDigitConflict:      boolean;
    };

    const scoredAll: ScoredRecord[] = eligible.map(record => {
      const candidateNameTokens  = buildTokenSet(record.canonicalIdentity.canonicalName);
      const candidateBrandTokens = record.canonicalIdentity.canonicalBrand
        ? buildTokenSet(record.canonicalIdentity.canonicalBrand)
        : new Set<string>();

      const result = scoreTokens({
        queryTokens,
        candidateNameTokens,
        candidateBrandTokens,
        supplierBrandTokens,
      });

      const allSignals: ResolutionSignal[] = [
        categorySignal(input.category),
        ...result.signals,
        lifecycleSignal(record),
      ];

      if (isShortQuery) {
        allSignals.push({
          type:   "short-name-protected",
          detail: `Query yields ${queryTokens.size} meaningful token(s). Token-match alone cannot auto-resolve short queries.`,
          weight: 0,
        });
      }

      return {
        record,
        score:                 result.score,
        signals:               allSignals,
        hasMeaningfulMismatch: result.hasMeaningfulMismatch,
        hasDigitConflict:      result.hasDigitConflict,
      };
    });

    // Stable sort: score descending, then identityId ascending (deterministic tie-break)
    const sorted = [...scoredAll].sort((a, b) =>
      b.score - a.score || a.record.id.localeCompare(b.record.id)
    );

    const aboveThreshold = sorted.filter(s => s.score >= CANDIDATE_THRESHOLD);

    if (aboveThreshold.length === 0) {
      return this._makeNoMatch(normalizedInput, input);
    }

    const top    = aboveThreshold[0];
    const second = aboveThreshold.length > 1 ? aboveThreshold[1] : undefined;

    // Ambiguity: top and runner-up within AMBIGUITY_MARGIN points of each other
    if (second !== undefined && (top.score - second.score) <= AMBIGUITY_MARGIN) {
      const allCandidates: CandidateMatch[] = aboveThreshold.map(s => ({
        identity: toProjection(s.record),
        score:    s.score,
        signals:  s.signals,
      }));
      return {
        supplierName:    input.supplierName,
        normalizedInput,
        category:        input.category,
        status:          "ambiguous",
        strategy:        "token-match",
        identity:        null,
        candidates:      allCandidates,
        score:           top.score,
        signals:         top.signals,
        explanation:     `Multiple candidates with similar token scores (top: ${top.score}, runner-up: ${second.score}). Editorial review required.`,
      };
    }

    // Single winner — check conservative auto-resolution criteria
    const canAutoResolve =
      isAutoResolvable(top.record.status) &&
      !isShortQuery &&
      !top.hasDigitConflict &&
      !top.hasMeaningfulMismatch &&
      top.score >= TOKEN_RESOLVE_THRESHOLD;

    if (canAutoResolve) {
      return this._makeResolved("token-match", top.score, top.record, top.signals, normalizedInput, input);
    }

    // Candidate — explain why auto-resolution was blocked
    let reason: string;
    if (!isAutoResolvable(top.record.status)) {
      reason = `Identity is not verified (status: ${top.record.status}).`;
    } else if (isShortQuery) {
      reason = `Short-name query (${queryTokens.size} token) cannot auto-resolve via token matching alone.`;
    } else if (top.hasDigitConflict) {
      reason = "Digit conflict detected — digit token sets differ between query and candidate.";
    } else if (top.hasMeaningfulMismatch) {
      reason = "Meaningful token mismatch — possible flanker or qualifier difference; not safe to auto-resolve.";
    } else {
      reason = `Score ${top.score} is below the token-match auto-resolution threshold (${TOKEN_RESOLVE_THRESHOLD}).`;
    }

    return {
      supplierName:    input.supplierName,
      normalizedInput,
      category:        input.category,
      status:          "candidate",
      strategy:        "token-match",
      identity:        null,
      candidates:      [{ identity: toProjection(top.record), score: top.score, signals: top.signals }],
      score:           top.score,
      signals:         top.signals,
      explanation:     `Top candidate "${top.record.canonicalIdentity.canonicalName}" scored ${top.score}. ${reason}`,
    };
  }

  // ── Stage 5 helpers ────────────────────────────────────────────────────────

  private _makeResolved(
    strategy: ResolutionStrategy,
    score:    number,
    record:   IdentityRecord,
    signals:  ResolutionSignal[],
    normalizedInput: string,
    input:    ResolutionInput,
  ): ResolutionResult {
    return {
      supplierName:    input.supplierName,
      normalizedInput,
      category:        input.category,
      status:          "resolved",
      strategy,
      identity:        toProjection(record),
      candidates:      [],
      score,
      signals,
      explanation:     `Resolved to "${record.canonicalIdentity.canonicalName}" via ${strategy} (score: ${score}).`,
    };
  }

  private _makeCandidate(
    strategy:    ResolutionStrategy,
    score:       number,
    record:      IdentityRecord,
    signals:     ResolutionSignal[],
    normalizedInput: string,
    input:       ResolutionInput,
    explanation: string,
  ): ResolutionResult {
    return {
      supplierName:    input.supplierName,
      normalizedInput,
      category:        input.category,
      status:          "candidate",
      strategy,
      identity:        null,
      candidates:      [{ identity: toProjection(record), score, signals }],
      score,
      signals,
      explanation,
    };
  }

  private _makeNoMatch(normalizedInput: string, input: ResolutionInput): ResolutionResult {
    return {
      supplierName:    input.supplierName,
      normalizedInput,
      category:        input.category,
      status:          "no-match",
      strategy:        "none",
      identity:        null,
      candidates:      [],
      score:           0,
      signals:         [],
      explanation:     "No identity found after exhausting all resolution strategies. The identity may not be registered, or the supplier name differs too significantly from registered canonical names and aliases.",
    };
  }

  private _makeBlocked(normalizedInput: string, input: ResolutionInput, reason: string): ResolutionResult {
    return {
      supplierName:    input.supplierName,
      normalizedInput,
      category:        input.category,
      status:          "blocked",
      strategy:        "none",
      identity:        null,
      candidates:      [],
      score:           0,
      signals:         [],
      explanation:     `Resolution blocked: ${reason}`,
    };
  }
}
