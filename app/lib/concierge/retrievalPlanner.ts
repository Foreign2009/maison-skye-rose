/**
 * Maison Concierge — Retrieval Planner
 *
 * Maps a resolved intent to a RetrievalContext containing the fragrances and
 * Academy articles most relevant to the customer's query. Never accesses raw
 * catalogue data directly — uses the discovery layer and search engine.
 */

import { getSimilarFragrances, getCollection, catalogueMaps, COLLECTION_SPECS } from "../discovery";
import { recommendAcademyArticles } from "../academy/recommendAcademyArticles";
import { academyCatalogue } from "../academy/catalogue";
import { mkcCatalogue } from "../mkc/catalogue";
import { search } from "../search/searchEngine";
import { buildSearchIndex } from "../search/indexBuilder";
import { getKnowledgeQuality } from "../mkc/knowledgeQuality";
import { recommendForProfile } from "../customer/recommendations";
import type { UnifiedCustomerProfile } from "../customer/profile/UnifiedCustomerProfile";
import type { SearchIndex } from "../search/types";
import type { FragranceKnowledge } from "../mkc/types";
import type { AcademyArticle } from "../academy/types";
import type { ConversationContext, ConversationState, ConversationProfile, ConsultationRole, ExplorationTarget, ConfidenceClassification } from "./types";
import type { ResolvedIntent } from "./intentResolver";
import type { RetrievalContext, AnchoredMeta } from "./contextBuilder";
import { planCollection } from "./collectionPlanner";

// ── Intelligence score accessor (EP18-P2) ─────────────────────────────────────

type IntelligenceDim = "sweetness" | "freshness" | "warmth" | "intensity" | "versatility";
const INTELLIGENCE_DIMS: IntelligenceDim[] = ["sweetness", "freshness", "warmth", "intensity", "versatility"];

// ── Anchored refinement direction map (EP-AI-C4) ──────────────────────────────
// Maps guest language to a governed MKC intelligence dimension (0–5 numeric field
// on FragranceKnowledge). Only terms with unambiguous, deterministic mappings are
// included. Deferred (no governed field): "elegant", "sophisticated", "versatile",
// "better for office", "better for date", "more complex".
const DIRECTION_MAP: Array<{
  patterns:  string[];
  dimension: IntelligenceDim;
  direction: "more" | "less";
}> = [
  // freshness (FragranceKnowledge.freshness, 0–5)
  { patterns: ["fresher", "more fresh", "airier", "more airy"],                              dimension: "freshness", direction: "more" },
  { patterns: ["less fresh"],                                                                  dimension: "freshness", direction: "less" },
  // sweetness (FragranceKnowledge.sweetness, 0–5)
  { patterns: ["less sweet", "less sweetness", "drier", "more dry"],                         dimension: "sweetness", direction: "less" },
  { patterns: ["sweeter", "more sweet", "more sweetness"],                                    dimension: "sweetness", direction: "more" },
  // warmth (FragranceKnowledge.warmth, 0–5)
  { patterns: ["warmer", "more warm", "more warmth", "richer", "more rich"],                 dimension: "warmth",    direction: "more" },
  { patterns: ["cooler", "less warm", "less warmth"],                                         dimension: "warmth",    direction: "less" },
  // intensity (FragranceKnowledge.intensity, 0–5)
  // "lighter" defaults to intensity:less (lighter sillage); "fresher" handles olfactory lightness.
  { patterns: ["more intense", "more intensity", "bolder", "stronger", "more powerful"],     dimension: "intensity", direction: "more" },
  { patterns: ["less intense", "less intensity", "lighter", "softer", "subtler"],            dimension: "intensity", direction: "less" },
];

function extractDirectionHint(
  rawMessage: string,
): { dimension: IntelligenceDim; direction: "more" | "less" } | null {
  const q = rawMessage.toLowerCase();
  for (const entry of DIRECTION_MAP) {
    if (entry.patterns.some((p) => q.includes(p))) {
      return { dimension: entry.dimension, direction: entry.direction };
    }
  }
  return null;
}

/**
 * Builds a candidate pool anchored to a specific fragrance, filtered by the
 * direction signal. Returns `strictMatches: true` only when ≥3 candidates
 * genuinely satisfy the directional request (i.e. score strictly better in the
 * requested dimension than the anchor). When fewer than 3 strict matches exist,
 * the pool is supplemented with nearest alternatives and strictMatches is false.
 *
 * Anchor intelligence governance: all dimensions map to numeric 0–5 fields on
 * FragranceKnowledge (sweetness, freshness, warmth, intensity). See DIRECTION_MAP.
 */
function buildAnchoredPool(
  anchorSlug: string,
  hint:       { dimension: IntelligenceDim; direction: "more" | "less" } | null,
  profile:    ConversationProfile | undefined,
): { fragrances: FragranceKnowledge[]; strictMatches: boolean } {
  const anchor           = catalogueMaps.bySlug.get(anchorSlug);
  const genderConstraint = getEffectiveGenderConstraint(profile);
  const avoidedFamilies  = (profile?.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
  const avoidedNotes     = (profile?.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());
  const rejectedSlugs    = profile?.rejectedSlugs ?? [];

  // Base candidates: all fragrances except anchor, respecting hard constraints
  const baseCandidates = mkcCatalogue.filter((k) => {
    if (k.slug === anchorSlug) return false;
    if (genderConstraint && k.gender !== genderConstraint && k.gender !== "unisex") return false;
    if (rejectedSlugs.includes(k.slug)) return false;
    if (avoidedFamilies.some((af) =>
      k.family.some((f) => f.toLowerCase().includes(af) || af.includes(f.toLowerCase()))
    )) return false;
    if (avoidedNotes.some((an) =>
      [...k.notes.top, ...k.notes.heart, ...k.notes.base]
        .some((n) => n.toLowerCase().includes(an) || an.includes(n.toLowerCase()))
    )) return false;
    return true;
  });

  if (!hint || !anchor) {
    return { fragrances: baseCandidates.sort(sortByQuality).slice(0, 6), strictMatches: false };
  }

  const anchorScore = getIntelligenceScore(anchor, hint.dimension);
  if (anchorScore === null) {
    return { fragrances: baseCandidates.sort(sortByQuality).slice(0, 6), strictMatches: false };
  }

  // Strict directional candidates: score strictly in the requested direction
  const strict = baseCandidates.filter((k) => {
    const kScore = getIntelligenceScore(k, hint.dimension);
    return kScore !== null && (
      hint.direction === "less" ? kScore < anchorScore : kScore > anchorScore
    );
  });

  if (strict.length >= 3) {
    // Full strict set: sort strongest-direction-first
    strict.sort((a, b) => {
      const aScore = getIntelligenceScore(a, hint.dimension) ?? anchorScore;
      const bScore = getIntelligenceScore(b, hint.dimension) ?? anchorScore;
      return hint.direction === "less" ? aScore - bScore : bScore - aScore;
    });
    return { fragrances: strict.slice(0, 6), strictMatches: true };
  }

  if (strict.length > 0) {
    // Some strict matches but < 3 — supplement with non-strict; mark as mixed (false)
    strict.sort((a, b) => {
      const aScore = getIntelligenceScore(a, hint.dimension) ?? anchorScore;
      const bScore = getIntelligenceScore(b, hint.dimension) ?? anchorScore;
      return hint.direction === "less" ? aScore - bScore : bScore - aScore;
    });
    const strictSlugs = new Set(strict.map((k) => k.slug));
    const supplement  = baseCandidates
      .filter((k) => !strictSlugs.has(k.slug))
      .sort(sortByQuality)
      .slice(0, 6 - strict.length);
    return { fragrances: [...strict, ...supplement], strictMatches: false };
  }

  // No strict matches — return quality-sorted base pool
  return { fragrances: baseCandidates.sort(sortByQuality).slice(0, 6), strictMatches: false };
}

function getIntelligenceScore(k: FragranceKnowledge, dimension: string): number | null {
  if (!INTELLIGENCE_DIMS.includes(dimension as IntelligenceDim)) return null;
  const val = k[dimension as IntelligenceDim];
  return typeof val === "number" ? val : null;
}

// ── Quality-aware sort (EP25-P3) ───────────────────────────────────────────────
// Bestseller priority is preserved. Knowledge quality breaks ties before
// popularity, biasing the context window toward knowledge-rich records.
// No record is excluded — sort order shifts, not the candidate set.

function sortByQuality(a: FragranceKnowledge, b: FragranceKnowledge): number {
  if (a.bestSeller && !b.bestSeller) return -1;
  if (!a.bestSeller && b.bestSeller)  return 1;
  const scoreA = getKnowledgeQuality(a.slug)?.overallScore ?? 0;
  const scoreB = getKnowledgeQuality(b.slug)?.overallScore ?? 0;
  if (scoreA !== scoreB) return scoreB - scoreA;
  return b.popularity - a.popularity;
}

// ── Fit scoring (EP-AI-C2-R1) ─────────────────────────────────────────────────
// Scores a candidate's relevance to current session signals and accumulated
// profile preferences. Merchandising signals (bestSeller, popularity) are NOT
// included — they serve as tiebreakers only via sortByQuality.
// FIT FIRST. DIVERSITY SECOND. MERCHANDISING THIRD.

type FitSignals = { family?: string; vibe?: string; occasion?: string };

function scoreFit(
  k: FragranceKnowledge,
  signals: FitSignals,
  profile: ConversationProfile | undefined,
): number {
  let score = 0;

  // Family match: accumulated profile preferences + current-request family signal → +0.40
  const wantedFamilies = [
    ...(profile?.preferredFamilies?.value ?? []),
    ...(signals.family ? [signals.family] : []),
  ].map((f) => f.toLowerCase());
  if (wantedFamilies.length > 0) {
    const kFamilies = k.family.map((f) => f.toLowerCase());
    if (wantedFamilies.some((wf) => kFamilies.some((kf) => kf.includes(wf) || wf.includes(kf)))) {
      score += 0.40;
    }
  }

  // Vibe match: current-request vibe signal → +0.30
  if (signals.vibe) {
    const vibe = signals.vibe.toLowerCase();
    if (
      k.vibe.some((v) => v.toLowerCase().includes(vibe) || vibe.includes(v.toLowerCase())) ||
      k.mood.toLowerCase().includes(vibe) ||
      k.profile.toLowerCase().includes(vibe)
    ) {
      score += 0.30;
    }
  }

  // Occasion match: accumulated profile preferences + current-request occasion → +0.20
  const wantedOccasions = [
    ...(profile?.preferredOccasions?.value ?? []),
    ...(signals.occasion ? [signals.occasion] : []),
  ].map((o) => o.toLowerCase());
  if (wantedOccasions.length > 0) {
    const kOccasions = k.occasions.map((o) => o.toLowerCase());
    if (wantedOccasions.some((wo) => kOccasions.some((ko) => ko.includes(wo) || wo.includes(ko)))) {
      score += 0.20;
    }
  }

  // Season match: accumulated profile preferences → +0.10
  const wantedSeasons = (profile?.preferredSeasons?.value ?? []).map((s) => s.toLowerCase());
  if (wantedSeasons.length > 0) {
    const kSeasons = k.seasons.map((s) => s.toLowerCase());
    if (wantedSeasons.some((ws) => kSeasons.some((ks) => ks.includes(ws) || ws.includes(ks)))) {
      score += 0.10;
    }
  }

  return Math.min(score, 1.0);
}

function makeFitComparator(
  signals: FitSignals,
  profile: ConversationProfile | undefined,
): (a: FragranceKnowledge, b: FragranceKnowledge) => number {
  return (a, b) => {
    const fitA = scoreFit(a, signals, profile);
    const fitB = scoreFit(b, signals, profile);
    // Meaningful fit difference → rank by fit first
    if (Math.abs(fitA - fitB) > 0.05) return fitB - fitA;
    // Equal fit → merchandising quality tiebreaker
    return sortByQuality(a, b);
  };
}

// ── Diversity controls (EP-AI-C2-R1) ─────────────────────────────────────────
// Applied after gender filter. These functions reorder candidates — they never
// exclude eligible records. Fit order and gender constraint are always preserved.

function applyFamilyDiversity(
  candidates: FragranceKnowledge[],
  maxPerPrimaryFamily: number = 2,
): FragranceKnowledge[] {
  const familyCounts: Record<string, number> = {};
  const selected: FragranceKnowledge[] = [];
  const deferred: FragranceKnowledge[] = [];
  for (const k of candidates) {
    const primary = (k.family[0] ?? "other").toLowerCase();
    const count = familyCounts[primary] ?? 0;
    if (count < maxPerPrimaryFamily) {
      selected.push(k);
      familyCounts[primary] = count + 1;
    } else {
      deferred.push(k);
    }
  }
  return [...selected, ...deferred];
}

function applySameBrandPenalty(
  candidates: FragranceKnowledge[],
  maxPerBrand: number = 2,
): FragranceKnowledge[] {
  const brandCounts: Record<string, number> = {};
  const selected: FragranceKnowledge[] = [];
  const deferred: FragranceKnowledge[] = [];
  for (const k of candidates) {
    const brand = k.brand.toLowerCase();
    const count = brandCounts[brand] ?? 0;
    if (count < maxPerBrand) {
      selected.push(k);
      brandCounts[brand] = count + 1;
    } else {
      deferred.push(k);
    }
  }
  return [...selected, ...deferred];
}

// ── Recommendation roles (EP-AI-C2-R1) ───────────────────────────────────────
// Deterministic role labels based on fit score and position. Embedded in
// context rendering so the LLM uses them to frame its explanation — not to
// select candidates. The candidate selection order always determines the role.

function assignRecommendationRoles(
  candidates: FragranceKnowledge[],
  signals: FitSignals,
  profile: ConversationProfile | undefined,
): string[] {
  const hasSignals = !!(
    signals.family || signals.vibe || signals.occasion ||
    (profile?.preferredFamilies?.value.length ?? 0) > 0 ||
    (profile?.preferredOccasions?.value.length ?? 0) > 0
  );
  return candidates.map((k, i) => {
    const fit = scoreFit(k, signals, profile);
    if (!hasSignals) {
      if (i === 0) return k.bestSeller ? "Best Seller Pick" : "Top Recommendation";
      if (i === 1) return "You May Also Love";
      return "Discover Something New";
    }
    if (fit >= 0.35) return i === 0 ? "Perfect Match" : "You May Also Love";
    if (i === 0) return "Top Recommendation";
    if (k.bestSeller) return "Popular Choice";
    return "Discover Something New";
  });
}

// ── Broad pool builder (EP-AI-C2 / EP-AI-C3) ─────────────────────────────────
// For generic discovery and gift intents when no signal-specific rawQuery is
// available. Sorts by fit score (using current signals + accumulated profile)
// first, merchandising quality second. Pre-filters by gender constraint and
// profile avoidances so the post-switch hard filters are idempotent.

function buildBroadPool(
  profile: ConversationProfile | undefined,
  signals: FitSignals,
  maxCount: number = 8,
): FragranceKnowledge[] {
  const genderConstraint = getEffectiveGenderConstraint(profile);
  const avoidedFamilies  = (profile?.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
  const avoidedNotes     = (profile?.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());
  const comparator       = makeFitComparator(signals, profile);

  return mkcCatalogue
    .filter((k) => {
      if (genderConstraint && k.gender !== genderConstraint && k.gender !== "unisex") return false;
      // Hard-exclude avoided families
      if (avoidedFamilies.length > 0 && avoidedFamilies.some((af) =>
        k.family.some((f) => f.toLowerCase().includes(af) || af.includes(f.toLowerCase()))
      )) return false;
      // Hard-exclude avoided notes (zero-note records pass because note arrays are empty)
      if (avoidedNotes.length > 0 && avoidedNotes.some((an) =>
        [...k.notes.top, ...k.notes.heart, ...k.notes.base]
          .some((n) => n.toLowerCase().includes(an) || an.includes(n.toLowerCase()))
      )) return false;
      return true;
    })
    .sort(comparator)
    .slice(0, maxCount);
}

// ── Search index singleton (rebuilt once per server process) ──────────────────

let _searchIndex: SearchIndex | null = null;
function getSearchIndex(): SearchIndex {
  if (!_searchIndex) _searchIndex = buildSearchIndex();
  return _searchIndex;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function articlesBySlug(slugs: (string | undefined)[]): AcademyArticle[] {
  return slugs
    .filter((s): s is string => !!s)
    .map((slug) => academyCatalogue.find((a) => a.slug === slug))
    .filter((a): a is AcademyArticle => !!a);
}

function fragrancesByQuery(rawQuery: string, limit = 5): FragranceKnowledge[] {
  const groups = search(rawQuery, getSearchIndex());
  const fragGroup = groups.find((g) => g.type === "fragrance");
  if (!fragGroup) return [];
  return fragGroup.matches
    .map((m) => catalogueMaps.bySlug.get(m.document.slug))
    .filter((k): k is FragranceKnowledge => !!k)
    .slice(0, limit);
}

function articlesFromSearch(rawQuery: string, limit = 2): AcademyArticle[] {
  const groups = search(rawQuery, getSearchIndex());
  const artGroup = groups.find((g) => g.type === "article");
  if (!artGroup) return [];
  return artGroup.matches
    .map((m) => academyCatalogue.find((a) => a.slug === m.document.slug))
    .filter((a): a is AcademyArticle => !!a)
    .slice(0, limit);
}

// ── Public API ────────────────────────────────────────────────────────────────

// ── Hidden-gem signal detection ───────────────────────────────────────────────
// Recognises explicit long-tail / hidden-gem discovery requests in the raw message.
// Used within the general_discovery default path only — consultation-specific paths
// (explorationTarget, affectedRoles) take precedence.

const HIDDEN_GEM_SIGNALS = [
  "hidden gem", "hidden gems",
  "less popular", "less well known", "less mainstream",
  "less obvious", "not the obvious",
  "underrated", "overlooked",
  "something unusual", "something unexpected",
  "give me something unexpected",
  "not a bestseller", "not bestsellers",
  "beyond the obvious", "beyond the bestsellers",
];

// ── Variety signals (EP-AI-C3) ────────────────────────────────────────────────
// Explicit guest requests for alternatives / different options.
// When detected AND unseen constrained candidates are available, the session-
// diversity block restricts FRAGRANCES IN CONTEXT to unseen candidates only —
// preventing the LLM from re-recommending previously presented fragrances.

const VARIETY_SIGNALS = [
  "different options", "something else", "other options",
  "show me alternatives", "alternatives please", "completely different",
  "different fragrances", "something different", "other fragrances",
  "different ones", "other ones", "show me other",
  "none of those", "none of these",
  // EP-AI-C6-P2-A: hidden-gem variety — prefer unseen when session history exists
  "less obvious", "less common", "more obscure", "a hidden gem",
];

// ── Confidence classification (EP-AI-C5) ──────────────────────────────────────
// Classifies each candidate by how strongly its fit score reflects known signals.
// Separate from profile completeness — this is candidate-specific, not session-wide.
// Thresholds: STRONG_MATCH ≥ 0.35, GOOD_MATCH ≥ 0.10, EXPLORATORY < 0.10.

function computeConfidenceClassifications(
  candidates: FragranceKnowledge[],
  signals:    FitSignals,
  profile:    ConversationProfile | undefined,
): ConfidenceClassification[] {
  return candidates.map((k) => {
    const fit = scoreFit(k, signals, profile);
    if (fit >= 0.35) return "STRONG_MATCH";
    if (fit >= 0.10) return "GOOD_MATCH";
    return "EXPLORATORY";
  });
}

// ── Exported scoring helpers (EP-AI-C2-R1) ────────────────────────────────────
// Exported for deterministic evaluation harness — do not inline.
export { scoreFit, applyFamilyDiversity, applySameBrandPenalty, assignRecommendationRoles, computeConfidenceClassifications };
export type { FitSignals };

// ── Gender constraint helpers (EP-AI-C1) ─────────────────────────────────────
// Exported for deterministic evaluation harness — do not inline.

/**
 * Resolves the effective gender constraint for candidate pool filtering.
 * When shopping for a gift, the recipient's gender overrides personal preference.
 * Returns null when constraint is "unisex" (no hard filter) or when not set.
 */
export function getEffectiveGenderConstraint(
  profile: ConversationProfile | undefined,
): "male" | "female" | null {
  if (!profile) return null;
  if (profile.shoppingIntent?.value === "gift" && profile.recipientGender?.value) {
    const g = profile.recipientGender.value;
    if (g === "male" || g === "female") return g;
    return null;
  }
  if (profile.preferredGender?.value) {
    const g = profile.preferredGender.value;
    if (g === "male" || g === "female") return g;
    return null;
  }
  return null;
}

/**
 * Filters candidates to those matching the gender constraint (gender === constraint
 * OR gender === "unisex"). NEVER falls back to the opposite gender — returns empty
 * array when zero matches, which surfaces a clarification response from the route.
 */
export function applyGenderConstraint(
  candidates: FragranceKnowledge[],
  constraint: "male" | "female" | null,
): FragranceKnowledge[] {
  if (!constraint) return candidates;
  return candidates.filter(
    (k) => k.gender === constraint || k.gender === "unisex"
  );
}

export function planRetrieval(
  resolved:           ResolvedIntent,
  context:            ConversationContext,
  profile?:           ConversationProfile,
  affectedRoles?:     ConsultationRole[],
  explorationTarget?: ExplorationTarget,
  unifiedProfile?:    UnifiedCustomerProfile | null,
  excludeSlugs?:      Set<string>,
  rawMessage?:        string,
  anchorSlug?:        string,  // EP-AI-C4: anchor for anchored_refinement path
): RetrievalContext {
  const { intent, signals, entitySlug, compareSlug } = resolved;

  // Fit signals — passed to buildBroadPool and makeFitComparator throughout
  const fitSignals: FitSignals = {
    family:   signals.family,
    vibe:     signals.vibe,
    occasion: signals.occasion,
  };

  let fragrances:          FragranceKnowledge[]     = [];
  let articles:            AcademyArticle[]         = [];
  let collectionName:      string | undefined;
  let isHiddenGemRequest = false;
  // EP-AI-C4: anchored refinement metadata, populated only in anchored_refinement path
  let anchoredMeta: AnchoredMeta | undefined;

  // Variety-request detection (EP-AI-C3): when guest asks for alternatives,
  // the session-diversity block will restrict candidates to unseen-only so the
  // LLM cannot re-surface previously recommended fragrances.
  const isVarietyRequest = rawMessage
    ? VARIETY_SIGNALS.some((p) => rawMessage.toLowerCase().includes(p))
    : false;

  const sourceKnowledge = entitySlug ? catalogueMaps.bySlug.get(entitySlug) : undefined;

  switch (intent) {

    case "similar_to": {
      if (sourceKnowledge) {
        fragrances = getSimilarFragrances(sourceKnowledge, { count: 5, excludeSlug: sourceKnowledge.slug })
          .map((r) => r.fragrance);
        articles = recommendAcademyArticles(sourceKnowledge, 2);
      } else {
        fragrances = buildBroadPool(profile, fitSignals, 8);
      }
      break;
    }

    case "comparison": {
      const slugsToCompare = compareSlug.length >= 2
        ? compareSlug
        : [entitySlug, context.compareSlug?.[0]].filter(Boolean) as string[];

      fragrances = slugsToCompare
        .map((slug) => catalogueMaps.bySlug.get(slug))
        .filter((k): k is FragranceKnowledge => !!k);

      if (fragrances.length >= 2) {
        const additional = getSimilarFragrances(fragrances[0], { count: 3, excludeSlug: fragrances[0].slug })
          .map((r) => r.fragrance)
          .filter((f) => !fragrances.find((x) => x.slug === f.slug));
        fragrances = [...fragrances, ...additional];
      }
      break;
    }

    case "education": {
      if (sourceKnowledge) {
        articles   = recommendAcademyArticles(sourceKnowledge, 4);
        fragrances = getSimilarFragrances(sourceKnowledge, { count: 3 }).map((r) => r.fragrance);
      } else {
        const topic = context.learningTopic ?? signals.family ?? "fragrance";
        articles   = articlesFromSearch(topic, 4);
        fragrances = fragrancesByQuery(topic, 3);
      }
      break;
    }

    case "occasion_search": {
      const occasion = signals.occasion ?? context.occasion ?? "";
      fragrances = fragrancesByQuery(occasion, 5);

      const matchedSpec = COLLECTION_SPECS.find((s) =>
        s.tags.some((t) => t.toLowerCase().includes(occasion.toLowerCase())) ||
        s.name.toLowerCase().includes(occasion.toLowerCase())
      );
      if (matchedSpec) {
        const collectionFragrances = getCollection(matchedSpec.id).slice(0, 5);
        if (fragrances.length === 0) fragrances = collectionFragrances;
        collectionName = matchedSpec.name;
      }
      break;
    }

    case "seasonal": {
      // Determine the guest-requested season using a three-tier priority:
      // 1. signals.occasion (from fragranceOccasions vocab — e.g. "Summer Days")
      // 2. rawMessage bare keyword — "summer fragrances", "fresh summer vibes", "winter scents"
      // 3. profile.preferredSeasons — accumulated across turns (preserves season on target pivot)
      // Defaults to "All Season" only when none of the above resolve a season.
      const seasonKeywords: Record<string, string> = {
        summer: "Summer", winter: "Winter", spring: "Spring", autumn: "Autumn", fall: "Autumn",
      };
      let season = "All Season";

      // Tier 1: signals.occasion (e.g. "Summer Days" in fragranceOccasions)
      for (const [kw, val] of Object.entries(seasonKeywords)) {
        if (resolved.signals.occasion?.toLowerCase().includes(kw) ||
            (typeof context.season === "string" && context.season.toLowerCase() === kw)) {
          season = val;
          break;
        }
      }

      // Tier 2: raw message — parse bare season keyword directly
      // Handles: "summer fragrances", "fresh summer vibes", "winter scents", etc.
      if (season === "All Season" && rawMessage) {
        const msgLower = rawMessage.toLowerCase();
        for (const [kw, val] of Object.entries(seasonKeywords)) {
          if (msgLower.includes(kw)) {
            season = val;
            break;
          }
        }
      }

      // Tier 3: accumulated profile preferred season (cross-turn persistence)
      // Preserves the requested season when a target pivot ("and female") follows a seasonal turn.
      if (season === "All Season") {
        const profileSeason = (profile?.preferredSeasons?.value ?? [])[0];
        if (profileSeason) {
          for (const [kw, val] of Object.entries(seasonKeywords)) {
            if (profileSeason.toLowerCase().includes(kw)) {
              season = val;
              break;
            }
          }
        }
      }

      // Build a gender- and avoidance-aware candidate pool before sorting and slicing so the
      // slice count is not degraded by the post-switch gender filter. This ensures the
      // five-card contract can be met when ≥5 relevant governed candidates exist.
      const genderForSeasonal = getEffectiveGenderConstraint(profile);
      const avoidedForSeasonal = (profile?.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
      fragrances = mkcCatalogue
        .filter((k) => {
          if (k.season !== season && k.season !== "All Season") return false;
          if (genderForSeasonal && k.gender !== genderForSeasonal && k.gender !== "unisex") return false;
          if (avoidedForSeasonal.some((af) =>
            k.family.some((f) => f.toLowerCase().includes(af) || af.includes(f.toLowerCase()))
          )) return false;
          return true;
        })
        .sort(makeFitComparator(fitSignals, profile))
        .slice(0, 8);

      articles = articlesBySlug(["choosing-your-season-scent"]);
      break;
    }

    case "gift": {
      // buildBroadPool pre-filters by recipient gender (getEffectiveGenderConstraint
      // returns recipientGender when shoppingIntent === "gift"), so this pool is
      // already gender-appropriate before the post-switch hard filter.
      fragrances = buildBroadPool(profile, fitSignals, 8);
      articles = articlesBySlug(["what-makes-a-signature-scent"]);
      break;
    }

    case "anchored_refinement": { // EP-AI-C4
      // Retrieve candidates that score differently in the requested intelligence
      // dimension relative to the anchor fragrance. The anchor's intelligence scores
      // are governed MKC numeric fields (0–5). Hard constraints (gender, avoidances,
      // rejections) are applied inside buildAnchoredPool; the post-switch filters
      // are idempotent. strictMatches signals whether all candidates genuinely satisfy
      // the direction — carried through to contextBuilder for LLM instruction.
      if (anchorSlug) {
        const hint   = rawMessage ? extractDirectionHint(rawMessage) : null;
        const anchor = catalogueMaps.bySlug.get(anchorSlug);
        const pool   = buildAnchoredPool(anchorSlug, hint, profile);
        fragrances   = pool.fragrances;
        if (anchor && hint) {
          anchoredMeta = {
            anchorSlug,
            anchorName:    anchor.name,
            dimension:     hint.dimension,
            direction:     hint.direction,
            anchorScore:   getIntelligenceScore(anchor, hint.dimension) ?? 0,
            strictMatches: pool.strictMatches,
          };
        }
      } else {
        // No anchor resolved — fall back to broad pool
        fragrances = buildBroadPool(profile, fitSignals, 6);
      }
      break;
    }

    default: { // general_discovery | clarification | refinement | alternative_exploration
      // Exploration retrieval (EP18-P2):
      // Fetch candidates for the target role character, excluding the current
      // assignment. Narrows by Intelligence score when a direction hint is
      // available; falls through when no candidates pass the filter.
      if (explorationTarget) {
        const { role, characterPref, intelligenceHint } = explorationTarget;
        const targetCharacter = characterPref ?? role.character;

        let candidates = mkcCatalogue
          .filter((k) => k.scentCharacter === targetCharacter && k.slug !== role.slug)
          .sort(sortByQuality);

        if (intelligenceHint) {
          const currentFrag    = mkcCatalogue.find((k) => k.slug === role.slug);
          const currentScore   = currentFrag ? getIntelligenceScore(currentFrag, intelligenceHint.dimension) : null;
          if (currentScore !== null) {
            const filtered = candidates.filter((k) => {
              const kScore = getIntelligenceScore(k, intelligenceHint.dimension);
              return kScore !== null && (
                intelligenceHint.direction === "less" ? kScore < currentScore : kScore > currentScore
              );
            });
            if (filtered.length > 0) candidates = filtered;
            // Fall through to unfiltered candidates when no hits pass the score threshold
          }
        }

        if (candidates.length > 0) {
          fragrances = candidates.slice(0, 3);
          break;
        }
        // Fall through to standard paths when no candidates found
      }

      // Refinement retrieval (EP18-P1):
      // When specific roles are affected, retrieve compliant candidates for
      // those characters only — filtered to exclude the customer's avoidances
      // and the fragrances being replaced.
      if (affectedRoles && affectedRoles.length > 0) {
        const affectedChars   = [...new Set(affectedRoles.map((r) => r.character))];
        const avoidedNotes    = (profile?.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());
        const avoidedFamilies = (profile?.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
        const replacedSlugs   = new Set(affectedRoles.map((r) => r.slug));

        const candidates = affectedChars.flatMap((char) =>
          mkcCatalogue
            .filter(
              (k) =>
                k.scentCharacter === char &&
                !replacedSlugs.has(k.slug) &&
                !avoidedNotes.some((an) =>
                  [...k.notes.top, ...k.notes.heart, ...k.notes.base]
                    .some((n) => n.toLowerCase().includes(an) || an.includes(n.toLowerCase()))
                ) &&
                !avoidedFamilies.some((af) =>
                  k.family.some(
                    (f) => f.toLowerCase().includes(af) || af.includes(f.toLowerCase())
                  )
                )
            )
            .sort(sortByQuality)
            .slice(0, 3)
        );

        if (candidates.length > 0) {
          fragrances = candidates;
          break;
        }
        // Fall through to standard paths when no compliant candidates found
      }

      // Collection-aware retrieval (EP17-P4):
      // When collection intent is active, retrieve candidates spanning the
      // required scentCharacters so the LLM can assign one fragrance per role.
      if (profile?.collectionType) {
        const brief = planCollection(profile);
        if (brief && brief.roles.length > 0) {
          const roleChars = [...new Set(brief.roles.map((r) => r.character))];
          const candidates = roleChars.flatMap((char) =>
            mkcCatalogue
              .filter((k) => k.scentCharacter === char)
              .sort(sortByQuality)
              .slice(0, 2)
          );
          if (candidates.length > 0) {
            fragrances = candidates;
            break;
          }
        }
      }

      // Explicit long-tail / hidden-gem discovery request
      if (rawMessage && HIDDEN_GEM_SIGNALS.some((p) => rawMessage.toLowerCase().includes(p))) {
        fragrances = getCollection("hidden-gems").slice(0, 4);
        isHiddenGemRequest = true;
        break;
      }

      // Standard discovery fallback
      const rawQuery = [signals.family, signals.occasion, signals.vibe, context.learningTopic]
        .filter(Boolean)
        .join(" ");

      if (rawQuery) {
        fragrances = fragrancesByQuery(rawQuery, 5);
        articles   = articlesFromSearch(rawQuery, 2);
      } else if (
        unifiedProfile &&
        (unifiedProfile.savedSlugs.length > 0 || unifiedProfile.recentlyViewed.length > 0)
      ) {
        // Personalised fallback: use RE when customer has browsing/save history
        const result = recommendForProfile(unifiedProfile, 4);
        if (result.success) {
          const personal = result.recommendations
            .map((r) => catalogueMaps.bySlug.get(r.slug))
            .filter((k): k is FragranceKnowledge => !!k);
          if (personal.length > 0) {
            fragrances = personal;
            break;
          }
        }
        fragrances = buildBroadPool(profile, fitSignals, 8);
      } else {
        fragrances = buildBroadPool(profile, fitSignals, 8);
      }
      break;
    }
  }

  // ── Gender constraint — hard filter (EP-AI-C1 / EP-AI-C6-P1) ────────────────
  // Applied post-retrieval for ALL intents. For comparison, named entity slugs
  // retain authority (guest explicitly requested the comparison) — only
  // supplemental candidates are filtered. NEVER restores opposite-gender
  // candidates on zero match.
  const genderConstraint = getEffectiveGenderConstraint(profile);
  if (intent === "comparison" && genderConstraint) {
    // Entity authority: named comparison slugs pass the gender filter unconditionally.
    // Any supplemental candidates added to the comparison context are constrained.
    const entitySlugsForGender: Set<string> = new Set(
      compareSlug.length >= 2
        ? compareSlug
        : ([entitySlug, context.compareSlug?.[0]].filter(Boolean) as string[])
    );
    const entities    = fragrances.filter((f) =>  entitySlugsForGender.has(f.slug));
    const supplements = fragrances.filter((f) => !entitySlugsForGender.has(f.slug));
    fragrances = [...entities, ...applyGenderConstraint(supplements, genderConstraint)];
  } else {
    fragrances = applyGenderConstraint(fragrances, genderConstraint);

    // ── Minimum breadth guarantee (EP-AI-C2) ────────────────────────────────
    // When a gender constraint is active and the retrieval returned fewer than
    // three candidates, supplement from the broader eligible catalogue WITHOUT
    // relaxing the gender constraint. Signal-based paths can narrow the pool
    // aggressively (e.g. a very specific vibe query); this ensures the LLM
    // always has enough material to form a meaningful recommendation.
    // For hidden-gem / less-obvious requests: supplements prefer non-bestsellers
    // so the clarification candidates don't undermine the intent.
    if (fragrances.length < 3 && genderConstraint) {
      const alreadyIn = new Set(fragrances.map((f) => f.slug));
      const supplement = mkcCatalogue
        .filter(
          (k) =>
            (k.gender === genderConstraint || k.gender === "unisex") &&
            !alreadyIn.has(k.slug)
        )
        .sort(
          isHiddenGemRequest
            // Less-obvious supplement: non-bestsellers first, then by quality
            ? (a, b) => (a.bestSeller ? 1 : 0) - (b.bestSeller ? 1 : 0) || sortByQuality(a, b)
            : sortByQuality
        )
        .slice(0, 3 - fragrances.length);
      fragrances = [...fragrances, ...supplement];
    }

    // ── Diversity controls (EP-AI-C2-R1) ──────────────────────────────────────
    // Applied after hard filter + minimum guarantee. Never excludes records —
    // only reorders so the top slice has family and brand variety.
    fragrances = applyFamilyDiversity(fragrances);
    fragrances = applySameBrandPenalty(fragrances);

  }

  // ── Session-wide diversity (RELEVANCE > NOVELTY) ─────────────────────────────
  // Applies to new retrieval only — comparison intent is exempt.
  //
  // Hierarchy:
  //   1. Return the best RELEVANT + UNSEEN candidates first.
  //   2. If the unseen pool is smaller than needed, fill with RELEVANT + SEEN.
  //   3. If ALL relevant candidates have been seen, reach into the broader
  //      constrained catalogue for fresh records rather than recycling.
  //   4. Only recycle when the constrained catalogue itself is exhausted.

  if (excludeSlugs && excludeSlugs.size > 0 && intent !== "comparison") {
    const unseen = fragrances.filter((f) => !excludeSlugs.has(f.slug));
    if (unseen.length > 0) {
      if (isVarietyRequest && unseen.length >= 2) {
        // On explicit variety / "different options" turns: restrict FRAGRANCES IN
        // CONTEXT to unseen candidates only. This prevents the LLM from re-presenting
        // previously recommended fragrances as new recommendations. (EP-AI-C3 REQUIRED)
        fragrances = unseen;
      } else {
        // Standard session diversity: unseen candidates first, seen deferred to end.
        const seen = fragrances.filter((f) => excludeSlugs.has(f.slug));
        fragrances = [...unseen, ...seen];
      }
    } else if (fragrances.length > 0) {
      // All relevant candidates seen — draw fresh records from the broader catalogue.
      // Use fit-aware sort so session diversity respects accumulated preferences.
      const genderConstraint = getEffectiveGenderConstraint(profile);
      const broader = mkcCatalogue
        .filter((k) =>
          !excludeSlugs.has(k.slug) &&
          (!genderConstraint || k.gender === genderConstraint || k.gender === "unisex")
        )
        .sort(makeFitComparator(fitSignals, profile))
        .slice(0, fragrances.length);
      if (broader.length > 0) fragrances = broader;
      // Final fallback: recycle only when constrained catalogue is itself exhausted.
    }
  }

  // ── EP-AI-C6-P2-C: Bounded bestseller representation ──────────────────────────
  // Placed after session diversity so it covers both the standard path and the
  // broad-catalogue fallback (which bypasses buildBroadPool's ordering). In flat-band
  // results the absolute bestSeller tie-breaker in sortByQuality sweeps every slot;
  // this cap limits bestsellers to Math.ceil(N/2) by pulling non-bestseller equivalents
  // from the eligible catalogue (same fit band ≤ 0.05). Excluded: similar_to,
  // anchored_refinement, comparison — entity relevance must be preserved.
  if (
    intent !== "similar_to" &&
    intent !== "anchored_refinement" &&
    intent !== "comparison" &&
    intent !== "seasonal" &&  // seasonal uses makeFitComparator — cap would pull unconstrained catalogue
    fragrances.length > 0
  ) {
    const N     = fragrances.length;
    const maxBs = Math.ceil(N / 2);
    const bsCnt = fragrances.filter((f) => f.bestSeller).length;
    if (bsCnt > maxBs) {
      const topFit      = scoreFit(fragrances[0], fitSignals, profile);
      const alreadyIn   = new Set(fragrances.map((f) => f.slug));
      const rejectedSet = new Set(profile?.rejectedSlugs ?? []);
      // Pull non-bestseller equivalents crowded out by the bestSeller tie-breaker.
      // Also exclude the session-wide seen set so recycled candidates are not promoted.
      const eligibleNonBs = mkcCatalogue
        .filter((k) =>
          !k.bestSeller &&
          !alreadyIn.has(k.slug) &&
          !rejectedSet.has(k.slug) &&
          !(excludeSlugs?.has(k.slug)) &&
          (!genderConstraint || k.gender === genderConstraint || k.gender === "unisex") &&
          Math.abs(scoreFit(k, fitSignals, profile) - topFit) <= 0.05,
        )
        .sort(makeFitComparator(fitSignals, profile));
      if (eligibleNonBs.length > 0) {
        const bsList    = fragrances.filter((f) => f.bestSeller);
        const nonBsList = fragrances.filter((f) => !f.bestSeller);
        const allowedBs = bsList.slice(0, maxBs);
        const demotedBs = bsList.slice(maxBs);
        const fill      = eligibleNonBs.slice(0, demotedBs.length);
        fragrances      = [...nonBsList, ...allowedBs, ...fill, ...demotedBs].slice(0, N);
      }
    }
  }

  // ── Hard rejection filter (EP-AI-C3) ──────────────────────────────────────────
  // Explicitly rejected product slugs are removed after ALL other filtering.
  // Unlike excludeSlugs (which allows recycling), rejected slugs are NEVER
  // surfaced — not as supplements, not as broad-catalogue fallback candidates.
  const profileRejectedSlugs = profile?.rejectedSlugs ?? [];
  if (profileRejectedSlugs.length > 0) {
    const rejectedSet = new Set(profileRejectedSlugs);
    fragrances = fragrances.filter((f) => !rejectedSet.has(f.slug));
  }

  // ── Universal avoidance filter (EP-AI-C4-P0) ──────────────────────────────────
  // Enforces avoidedFamilies and avoidedNotes on ALL retrieval paths — not just
  // buildBroadPool. Comparison subjects named explicitly by the guest are exempt
  // so the LLM can fulfil the compare request. Zero-note records pass because
  // their note arrays are empty.
  const profileAvoidedFamilies = (profile?.avoidedFamilies?.value ?? []).map((f) => f.toLowerCase());
  const profileAvoidedNotes    = (profile?.avoidedNotes?.value    ?? []).map((n) => n.toLowerCase());

  if (profileAvoidedFamilies.length > 0 || profileAvoidedNotes.length > 0) {
    const comparisonExemptSlugs: Set<string> =
      intent === "comparison"
        ? new Set(
            compareSlug.length >= 2
              ? compareSlug
              : ([entitySlug, context.compareSlug?.[0]].filter(Boolean) as string[])
          )
        : new Set();

    fragrances = fragrances.filter((k) => {
      if (comparisonExemptSlugs.has(k.slug)) return true;
      if (profileAvoidedFamilies.some((af) =>
        k.family.some((f) => f.toLowerCase().includes(af) || af.includes(f.toLowerCase()))
      )) return false;
      if (profileAvoidedNotes.some((an) =>
        [...k.notes.top, ...k.notes.heart, ...k.notes.base]
          .some((n) => n.toLowerCase().includes(an) || an.includes(n.toLowerCase()))
      )) return false;
      return true;
    });
  }

  // ── Source knowledge re-add (EP-AI-C3 / EP-AI-C4-P0 / EP-AI-C6-P1) ──────────
  // sourceKnowledge remains available as reference context for the LLM via
  // state.context / conversation history. It may only enter the final candidate
  // list (resp.fragrances) when it passes all guest constraints — rejectedSlugs,
  // avoidedFamilies, avoidedNotes (EP-AI-C4-P0), and gender (EP-AI-C6-P1).
  // Entity authority exception: education and comparison intents explicitly name
  // this fragrance, so the gender constraint is waived for those intents only.
  const rejectedSourceSlug = profileRejectedSlugs.includes(sourceKnowledge?.slug ?? "");
  const sourceViolatesFamily = profileAvoidedFamilies.some((af) =>
    (sourceKnowledge?.family ?? []).some((f) => f.toLowerCase().includes(af) || af.includes(f.toLowerCase()))
  );
  const sourceViolatesNotes = profileAvoidedNotes.some((an) =>
    [...(sourceKnowledge?.notes.top ?? []), ...(sourceKnowledge?.notes.heart ?? []), ...(sourceKnowledge?.notes.base ?? [])]
      .some((n) => n.toLowerCase().includes(an) || an.includes(n.toLowerCase()))
  );
  const sourceEntityAuthority = intent === "education" || intent === "comparison";
  const sourceViolatesGender =
    !sourceEntityAuthority &&
    genderConstraint !== null &&
    sourceKnowledge !== undefined &&
    sourceKnowledge.gender !== genderConstraint &&
    sourceKnowledge.gender !== "unisex";
  if (
    sourceKnowledge &&
    !fragrances.find((f) => f.slug === sourceKnowledge.slug) &&
    !rejectedSourceSlug &&
    !sourceViolatesFamily &&
    !sourceViolatesNotes &&
    !sourceViolatesGender
  ) {
    fragrances = [sourceKnowledge, ...fragrances].slice(0, 6);
  }

  // ── Recommendation roles (EP-AI-C2-R1) ───────────────────────────────────────
  // Assigned after all filtering and diversity adjustments so roles reflect
  // the final ranked shortlist rather than any intermediate order.
  const fragranceRoles = assignRecommendationRoles(fragrances, fitSignals, profile);

  // ── Confidence classifications (EP-AI-C5) ────────────────────────────────────
  // Derived from fit score against known signals for each final candidate.
  const confidenceClassifications = computeConfidenceClassifications(fragrances, fitSignals, profile);

  // ── Pool exhaustion detection (EP-AI-C5) ─────────────────────────────────────
  // Fires when fewer than 2 eligible candidates remain after all constraints.
  // Signals context builder to instruct the LLM to handle it conversationally.
  const poolExhausted = fragrances.length < 2;

  return { fragrances, articles, collectionName, fragranceRoles, anchoredMeta, confidenceClassifications, poolExhausted };
}

/**
 * Reconstructs a RetrievalContext from cached ConversationState without
 * performing a new catalogue search. Used when ConversationPlanner returns
 * reuseRecommendations = true.
 *
 * EP-AI-C6-P1: accepts the current profile to enforce gender eligibility on
 * cached slugs. A Gift→self transition or late gender declaration would otherwise
 * surface off-gender fragrances from a prior cache entry.
 */
export function buildCachedRetrieval(
  state:    ConversationState,
  profile?: ConversationProfile,
): RetrievalContext {
  const genderConstraint = getEffectiveGenderConstraint(profile);
  const fragrances = applyGenderConstraint(
    (state.lastRecommendationSlugs ?? [])
      .map((slug) => catalogueMaps.bySlug.get(slug))
      .filter((k): k is FragranceKnowledge => !!k),
    genderConstraint,
  );

  const articles = state.lastArticleSlug
    ? [academyCatalogue.find((a) => a.slug === state.lastArticleSlug)].filter(
        (a): a is AcademyArticle => !!a
      )
    : [];

  return { fragrances, articles, collectionName: state.lastCollection };
}
