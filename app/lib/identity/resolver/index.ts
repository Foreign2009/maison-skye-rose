/**
 * Maison Identity Platform — Resolver Public API
 *
 * Public barrel export for the Identity Resolver sub-domain.
 *
 * Consumers import from this file, not from individual resolver files.
 * The resolver is a read-only, deterministic, AI-free scoring engine.
 * It does not create, modify, or persist identity records.
 */

export { DeterministicIdentityResolver } from "./DeterministicIdentityResolver";
export { strip }                          from "./suffixStripper";
export { tokenize, STOP_WORDS }           from "./tokenizer";
export { scoreTokens, buildTokenSet }     from "./tokenScorer";

export type {
  IdentityResolver,
  ResolutionInput,
  ResolutionStatus,
  ResolutionStrategy,
  ResolutionSignalType,
  ResolutionSignal,
  IdentityProjection,
  CandidateMatch,
  ResolutionResult,
} from "./types";

export type { KnownSuffix, StripResult }          from "./suffixStripper";
export type { TokenScorerInput, TokenScorerOutput } from "./tokenScorer";
