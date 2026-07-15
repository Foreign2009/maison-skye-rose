/**
 * Recommendation Intelligence — Recommendation Reason Builder
 *
 * Implements RecommendationExplainerContract with real intelligence.
 * Replaces the placeholder createNullExplainer() from EP10.0-P5.
 *
 * explain(candidate, context) is called per candidate by the pipeline
 * (only on the top-limit slice, typically ≤6 candidates — not the full pool).
 * buildPreferenceProfile() and buildConnectionSets() are therefore called
 * at most 6 times per recommend() invocation. Acceptable for the catalogue size.
 *
 * Rules (deterministic, additive — all matching rules fire):
 *   wardrobe_partner   — candidate is a wardrobe partner of currentSlug or saved slug (weight 0.9)
 *   similar_to_saved   — candidate is graph-connected to any saved slug (weight 0.8)
 *   family_match       — candidate family overlaps with preferredFamilies (weight 0.8)
 *   quiz_match         — candidate family matches quiz-derived families (weight 0.7)
 *   similar_to_viewed  — candidate is graph-connected to any viewed slug (weight 0.7)
 *   occasion_match     — candidate occasions overlap with preferredOccasions (weight 0.6)
 *   season_match       — candidate seasons overlap with preferredSeasons (weight 0.6)
 *   collection_affinity — candidate is from the dominant saved collection (weight 0.6)
 *   relationship_graph — candidate is graph-connected to currentSlug (weight 0.5)
 *   discovery_pathway  — strategy is "discovery" and discoveryReadiness ≥ 0.70 (weight 0.4)
 *   popularity         — candidate is a best seller and no other reasons matched (weight 0.3)
 *
 * buildExplanation() is the full API: builds reasons + confidence + trace + humanText.
 * It is NOT part of the pipeline — callers that need it invoke it directly.
 *
 * Integration points:
 *   RecommendationPipeline       — createDefaultPipeline() uses createReasonBuilder()
 *   RecommendationExplainerContract — implements explain(candidate, context)
 *   PreferenceScorer             — buildPreferenceProfile()
 *   RelationshipScorer           — buildConnectionSets(), GRAPH_INDEX
 *   RecommendationConfidence     — calculateConfidence()
 *   RecommendationTrace          — buildTrace()
 *   ExplanationTemplate          — EXPLANATION_TEMPLATES
 *   RecommendationExplanation    — buildExplanation() return type
 */

import type { RecommendationExplainerContract } from "./RecommendationExplainer";
import type { RecommendationCandidate }         from "./RecommendationCandidate";
import type { RecommendationContext }           from "./RecommendationContext";
import type { RecommendationReason }            from "./RecommendationReason";
import type { RecommendationExplanation }       from "./RecommendationExplanation";
import { buildPreferenceProfile, getSummaryForSlug } from "./PreferenceScorer";
import { buildConnectionSets, GRAPH_INDEX }          from "./RelationshipScorer";
import { calculateConfidence }                        from "./RecommendationConfidence";
import { buildTrace }                                 from "./RecommendationTrace";
import { EXPLANATION_TEMPLATES }                      from "./ExplanationTemplate";

// ── Reason construction helper ────────────────────────────────────────────────

function makeReason(
  type:   keyof typeof EXPLANATION_TEMPLATES,
  weight: number,
  ctx?:   string,
): RecommendationReason {
  return {
    type,
    description: EXPLANATION_TEMPLATES[type](ctx),
    weight,
  };
}

// ── Core reason derivation ────────────────────────────────────────────────────

function deriveReasons(
  candidate: RecommendationCandidate,
  context:   RecommendationContext,
): readonly RecommendationReason[] {
  const { summary } = candidate;
  const { profile, strategy, currentSlug } = context;

  const prefProfile = buildPreferenceProfile(context);
  const connSets    = buildConnectionSets(context);

  const reasons: RecommendationReason[] = [];

  // ── Wardrobe partner ──────────────────────────────────────────────────────

  if (connSets.wardrobeOfPivot.has(candidate.slug)) {
    const pivotRecord = currentSlug ? GRAPH_INDEX.get(currentSlug) : undefined;
    reasons.push(makeReason("wardrobe_partner", 0.9, pivotRecord?.name));
  } else if (connSets.wardrobeOfSaved.has(candidate.slug)) {
    reasons.push(makeReason("wardrobe_partner", 0.9));
  }

  // ── Similar to saved ─────────────────────────────────────────────────────

  if (connSets.allConnectedSaved.has(candidate.slug)) {
    const matchSlug = profile.savedSlugs.find((s) => {
      const r = GRAPH_INDEX.get(s);
      if (!r) return false;
      const rel = r.relationships;
      if (!rel) return false;
      return (
        rel.wardrobePartners?.includes(candidate.slug) ||
        rel.alternatives?.includes(candidate.slug) ||
        rel.evolutions?.includes(candidate.slug) ||
        rel.evolutionOf === candidate.slug
      );
    });
    const matchName = matchSlug ? getSummaryForSlug(matchSlug)?.name : undefined;
    reasons.push(makeReason("similar_to_saved", 0.8, matchName));
  }

  // ── Family match ─────────────────────────────────────────────────────────

  const matchedFamily = summary.family.find((f) => prefProfile.preferredFamilies.has(f));
  if (matchedFamily) {
    reasons.push(makeReason("family_match", 0.8, matchedFamily));
  }

  // ── Quiz match ───────────────────────────────────────────────────────────

  if (profile.lastQuizSlugs.length > 0) {
    const quizFamilies = new Set<string>();
    for (const slug of profile.lastQuizSlugs) {
      const s = getSummaryForSlug(slug);
      if (s) for (const f of s.family) quizFamilies.add(f);
    }
    const hasQuizFamilyMatch = summary.family.some((f) => quizFamilies.has(f));
    if (hasQuizFamilyMatch) {
      reasons.push(makeReason("quiz_match", 0.7));
    }
  }

  // ── Similar to viewed ────────────────────────────────────────────────────

  if (connSets.allConnectedViewed.has(candidate.slug)) {
    const matchSlug = profile.recentlyViewed.find((s) => {
      const r = GRAPH_INDEX.get(s);
      if (!r) return false;
      const rel = r.relationships;
      if (!rel) return false;
      return (
        rel.wardrobePartners?.includes(candidate.slug) ||
        rel.alternatives?.includes(candidate.slug) ||
        rel.evolutions?.includes(candidate.slug) ||
        rel.evolutionOf === candidate.slug
      );
    });
    const matchName = matchSlug ? getSummaryForSlug(matchSlug)?.name : undefined;
    reasons.push(makeReason("similar_to_viewed", 0.7, matchName));
  }

  // ── Occasion match ───────────────────────────────────────────────────────

  const matchedOccasion = summary.occasions.find((o) => prefProfile.preferredOccasions.has(o));
  if (matchedOccasion) {
    reasons.push(makeReason("occasion_match", 0.6, matchedOccasion));
  }

  // ── Season match ─────────────────────────────────────────────────────────

  const matchedSeason = summary.seasons.find((s) => prefProfile.preferredSeasons.has(s));
  if (matchedSeason) {
    reasons.push(makeReason("season_match", 0.6, matchedSeason));
  }

  // ── Collection affinity ──────────────────────────────────────────────────

  if (profile.savedSlugs.length >= 2) {
    const savedCollections = profile.savedSlugs
      .map((s) => getSummaryForSlug(s)?.collection)
      .filter((c): c is "Skye" | "Rose" | "Elite" => c !== undefined);
    const counts = new Map<string, number>();
    for (const c of savedCollections) counts.set(c, (counts.get(c) ?? 0) + 1);
    const topEntry = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topEntry && summary.collection === topEntry[0]) {
      reasons.push(makeReason("collection_affinity", 0.6, topEntry[0]));
    }
  }

  // ── Relationship graph (general connection to pivot) ──────────────────────

  if (
    connSets.hasPivot &&
    connSets.allConnectedPivot.has(candidate.slug) &&
    !connSets.wardrobeOfPivot.has(candidate.slug)
  ) {
    reasons.push(makeReason("relationship_graph", 0.5));
  }

  // ── Discovery pathway ────────────────────────────────────────────────────

  if (strategy === "discovery" && summary.discoveryReadiness >= 0.70) {
    reasons.push(makeReason("discovery_pathway", 0.4));
  }

  // ── Popularity (fallback when no other signals fired) ────────────────────

  if (summary.bestSeller && reasons.length === 0) {
    reasons.push(makeReason("popularity", 0.3));
  }

  return reasons.slice().sort((a, b) => b.weight - a.weight);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function createReasonBuilder(): RecommendationExplainerContract {
  return {
    explain(
      candidate: RecommendationCandidate,
      context:   RecommendationContext,
    ): readonly RecommendationReason[] {
      return deriveReasons(candidate, context);
    },
  };
}

export function buildExplanation(
  candidate: RecommendationCandidate,
  context:   RecommendationContext,
  now?:      number,
): RecommendationExplanation {
  const reasons    = deriveReasons(candidate, context);
  const confidence = calculateConfidence(candidate, context);
  const trace      = buildTrace(candidate, context, now);

  const topReason = reasons[0];
  const humanText = topReason
    ? topReason.description
    : `A ${candidate.summary.collection} collection fragrance curated for you`;

  return { confidence, reasons, trace, humanText };
}
