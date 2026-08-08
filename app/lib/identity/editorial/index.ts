/**
 * Maison Identity Platform — Editorial Domain Public API
 *
 * SERVER-ONLY MODULE.
 * Re-exports all editorial types and the service class.
 * Also exports production-ready clock and repository factory for use in
 * Server Actions and admin scripts.
 *
 * Usage in production Server Actions:
 *   import { IdentityEditorialService, PRODUCTION_CLOCK, createProductionRepository } from "@/lib/identity/editorial";
 *   const service = new IdentityEditorialService(createProductionRepository(), PRODUCTION_CLOCK);
 */

export { IdentityEditorialService } from "./IdentityEditorialService";

export type {
  // Actions
  IdentityEditorialAction,

  // Infrastructure
  IdentityEditorialClock,
  IdentityEditorialRepository,

  // Errors
  EditorialErrorKind,
  CollisionDetail,

  // Results
  EditorialResult,

  // Inputs
  BaseEditorialInput,
  VerifyInput,
  CorrectCanonicalInput,
  ConfirmAliasInput,
  RequestMoreResearchInput,
  ElevateInput,
  RejectInput,
  DisputeInput,

  // Campaign enrichment
  RecommendedAction,
  CampaignEntry,

  // Projections
  ReviewQueueFilter,
  IdentityReviewSummary,
  IdentityReviewDetail,
} from "./types";

export { StaleReviewError } from "./types";

// ── Production infrastructure ──────────────────────────────────────────────────

import { loadIdentityRegistry, saveIdentityRegistry } from "../persistence";
import type { IdentityEditorialRepository, IdentityEditorialClock } from "./types";

/**
 * Production clock. Uses the system clock.
 * Tests must inject a fixed-timestamp clock instead.
 */
export const PRODUCTION_CLOCK: IdentityEditorialClock = {
  now: () => new Date().toISOString(),
};

/**
 * Creates a production repository adapter wrapping the atomic filesystem
 * persistence functions from persistence.ts.
 *
 * Each call returns a fresh adapter — safe for concurrent Server Action calls
 * because each action does its own load → mutate → save cycle.
 */
export function createProductionRepository(): IdentityEditorialRepository {
  return {
    load: loadIdentityRegistry,
    save: saveIdentityRegistry,
  };
}
