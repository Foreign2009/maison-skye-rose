/**
 * Personalised Recommendation Engine — Orchestration Layer
 *
 * Stateless orchestration module. All public functions are pure.
 * Composes KIE, CIE (profile), Relationship Graph, and Discovery Intelligence
 * into a unified recommendation result.
 *
 * Architectural contrast with KIE:
 *   KIE  — module-level CATALOGUE_INDEX (static catalogue, precomputed once)
 *   RE   — module-level CATALOGUE_SUMMARIES + GRAPH_INDEX (also static)
 *           profile is dynamic, per-call via RecommendationContext
 *
 * Module-level precomputed state (O(n) once, O(1) per call):
 *   CATALOGUE_SUMMARIES_MAP — KnowledgeSummary per slug
 *   CATALOGUE_MKC_INDEX     — FragranceKnowledge per slug (graph traversal)
 *   CATALOGUE_GRAPH_INDEX   — FragranceIndex for relationship graph
 *   CANDIDATE_POOL          — full pool of zero-scored candidates (immutable)
 *
 * Pool construction (by strategy):
 *   "personalised" / "discovery" / "trending" — full CANDIDATE_POOL
 *   "similar"      — relationship graph connected set for currentSlug
 *   "complementary"— wardrobe partners + alternatives for currentSlug
 *   Falls back to CANDIDATE_POOL if graph returns no connected records.
 *
 * Public API:
 *   recommend(context)                              — primary entry point
 *   recommendForProfile(profile, limit?)            — "personalised" convenience
 *   recommendSimilar(slug, profile, limit?)         — "similar" convenience
 *   recommendComplementary(slug, profile, limit?)   — "complementary" convenience
 *   recommendDiscovery(profile, limit?)             — "discovery" convenience
 *
 * Integration points:
 *   KnowledgeIntelligence  — KnowledgeSummary projection via buildKnowledgeSummary
 *   graph.ts               — buildIndex, getConnectedFragrances, getRelationshipSummary
 *   mkcCatalogue           — source of all candidate records
 *   RecommendationPipeline — owns filter → score → rank → explain lifecycle
 *   UnifiedCustomerProfile — CIE profile; read-only, never mutated
 */

import { mkcCatalogue }              from "../../mkc/catalogue";
import { buildKnowledgeSummary }     from "../../intelligence/KnowledgeSummary";
import {
  buildIndex,
  getConnectedFragrances,
  getRelationshipSummary,
}                                    from "../../mkc/graph";
import type { UnifiedCustomerProfile } from "../profile/UnifiedCustomerProfile";
import type { RecommendationContext }  from "./RecommendationContext";
import type { RecommendationResult }   from "./RecommendationResult";
import type { RecommendationCandidate } from "./RecommendationCandidate";
import { createContext }               from "./RecommendationContext";
import { createZeroScore }             from "./RecommendationScore";
import { buildMetrics, createEmptyMetrics } from "./RecommendationMetrics";
import { createDefaultPipeline }       from "./RecommendationPipeline";
import { DEFAULT_RECOMMENDATION_LIMIT } from "./RecommendationStrategy";

// ── Module-level precomputed state ────────────────────────────────────────────

const CATALOGUE_SUMMARIES_MAP = new Map(
  mkcCatalogue.map((r) => [r.slug, buildKnowledgeSummary(r)]),
);

const CATALOGUE_MKC_INDEX = new Map(
  mkcCatalogue.map((r) => [r.slug, r]),
);

const CATALOGUE_GRAPH_INDEX = buildIndex(mkcCatalogue);

const CANDIDATE_POOL: readonly RecommendationCandidate[] = Object.freeze(
  mkcCatalogue.map((r) => ({
    slug:    r.slug,
    summary: buildKnowledgeSummary(r),
    score:   createZeroScore(),
    reasons: [] as const,
  })),
);

// ── Internal helpers ───────────────────────────────────────────────────────────

function toCandidate(slug: string): RecommendationCandidate | null {
  const summary = CATALOGUE_SUMMARIES_MAP.get(slug);
  if (!summary) return null;
  return { slug, summary, score: createZeroScore(), reasons: [] };
}

function buildGraphPool(currentSlug: string): readonly RecommendationCandidate[] {
  const record = CATALOGUE_MKC_INDEX.get(currentSlug);
  if (!record) return CANDIDATE_POOL;
  const connected = getConnectedFragrances(record, CATALOGUE_GRAPH_INDEX);
  if (connected.length === 0) return CANDIDATE_POOL;
  const candidates = connected.map((r) => toCandidate(r.slug)).filter(
    (c): c is RecommendationCandidate => c !== null,
  );
  return candidates.length > 0 ? candidates : CANDIDATE_POOL;
}

function buildComplementaryPool(currentSlug: string): readonly RecommendationCandidate[] {
  const record = CATALOGUE_MKC_INDEX.get(currentSlug);
  if (!record) return CANDIDATE_POOL;
  const summary = getRelationshipSummary(record, CATALOGUE_GRAPH_INDEX);
  const targets = [...summary.wardrobePartners, ...summary.alternatives];
  if (targets.length === 0) return CANDIDATE_POOL;
  const candidates = targets.map((r) => toCandidate(r.slug)).filter(
    (c): c is RecommendationCandidate => c !== null,
  );
  return candidates.length > 0 ? candidates : CANDIDATE_POOL;
}

function buildPool(context: RecommendationContext): readonly RecommendationCandidate[] {
  if (context.strategy === "similar" && context.currentSlug) {
    return buildGraphPool(context.currentSlug);
  }
  if (context.strategy === "complementary" && context.currentSlug) {
    return buildComplementaryPool(context.currentSlug);
  }
  return CANDIDATE_POOL;
}

// ── Primary API ───────────────────────────────────────────────────────────────

export function recommend(context: RecommendationContext): RecommendationResult {
  const startTime = Date.now();

  try {
    const pool      = buildPool(context);
    const pipeline  = createDefaultPipeline();
    const { recommendations, runMetrics } = pipeline.run(pool, context);

    return {
      success:         true,
      recommendations,
      metrics: buildMetrics(
        context.strategy,
        startTime,
        runMetrics.poolSize,
        runMetrics.filteredSize,
        runMetrics.returnedSize,
      ),
    };
  } catch (err) {
    return {
      success: false,
      error:   String(err),
      metrics: createEmptyMetrics(context.strategy),
    };
  }
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export function recommendForProfile(
  profile: UnifiedCustomerProfile,
  limit:   number = DEFAULT_RECOMMENDATION_LIMIT,
): RecommendationResult {
  return recommend(
    createContext(profile, "personalised", { limit }),
  );
}

export function recommendSimilar(
  slug:    string,
  profile: UnifiedCustomerProfile,
  limit:   number = DEFAULT_RECOMMENDATION_LIMIT,
): RecommendationResult {
  return recommend(
    createContext(profile, "similar", { limit, currentSlug: slug }),
  );
}

export function recommendComplementary(
  slug:    string,
  profile: UnifiedCustomerProfile,
  limit:   number = DEFAULT_RECOMMENDATION_LIMIT,
): RecommendationResult {
  return recommend(
    createContext(profile, "complementary", { limit, currentSlug: slug }),
  );
}

export function recommendDiscovery(
  profile: UnifiedCustomerProfile,
  limit:   number = DEFAULT_RECOMMENDATION_LIMIT,
): RecommendationResult {
  return recommend(
    createContext(profile, "discovery", { limit }),
  );
}
