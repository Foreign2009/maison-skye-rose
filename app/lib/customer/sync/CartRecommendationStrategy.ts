/**
 * Cart Recommendation Strategy
 *
 * Pure stateless bridge between MiniCart and the Recommendation Platform.
 * MiniCart calls one function only — this module owns all data resolution
 * and RE invocation.
 *
 * Sections produced:
 *   fromFavorites           — saved fragrances not already in cart
 *   recentlyViewed          — recently viewed fragrances not already in cart
 *   completeYourCollection  — RE-powered complementary picks from cart[0]
 *
 * All functions are pure (no side effects, no I/O).
 * Failures are isolated: a bad RE call returns an empty array, never throws.
 *
 * Integration points:
 *   MiniCart.tsx           — sole consumer; imports getCartRecommendations()
 *   catalogueMaps.byName   — title → FragranceKnowledge resolution
 *   catalogueMaps.bySlug   — slug → FragranceKnowledge resolution
 *   toDisplayFragrance()   — FragranceKnowledge → DisplayFragrance projection
 *   recommend()            — RE primary entry point (complementary strategy)
 *   createContext()        — RE context factory
 */

import { catalogueMaps }      from "../../discovery";
import { toDisplayFragrance } from "../../mkc/displayAdapter";
import { recommend }          from "../recommendations/RecommendationEngine";
import { createContext }      from "../recommendations/RecommendationContext";
import { resolveRecommendationStrategy } from "../recommendations/RecommendationStrategyResolver";
import { createProfileMetadata } from "../profile/ProfileMetadata";
import type { DisplayFragrance }       from "../../knowledgeAdapter";
import type { UnifiedCustomerProfile } from "../profile/UnifiedCustomerProfile";

// ── Internal helpers ──────────────────────────────────────────────────────────

function anonymousProfile(): UnifiedCustomerProfile {
  return {
    tier:          "unified",
    identity:      {},
    metadata:      createProfileMetadata(),
    signals:       [],
    recentlyViewed: [],
    savedSlugs:    [],
    lastQuizSlugs: [],
    lastActiveAt:  null,
  };
}

function titleToDisplay(title: string): DisplayFragrance | null {
  const record = catalogueMaps.byName.get(title);
  return record ? toDisplayFragrance(record) : null;
}

function slugToDisplay(slug: string): DisplayFragrance | null {
  const record = catalogueMaps.bySlug.get(slug);
  return record ? toDisplayFragrance(record) : null;
}

// ── Public types ──────────────────────────────────────────────────────────────

export interface CartRecommendationInput {
  readonly cartTitles:    readonly string[];
  readonly savedTitles:   readonly string[];
  readonly recentTitles:  readonly string[];
  readonly limit:         number;
  readonly profile?:      UnifiedCustomerProfile | null;
}

export interface CartRecommendations {
  readonly fromFavorites:          readonly DisplayFragrance[];
  readonly recentlyViewed:         readonly DisplayFragrance[];
  readonly completeYourCollection: readonly DisplayFragrance[];
}

// ── Strategy ──────────────────────────────────────────────────────────────────

export function getCartRecommendations(
  input: CartRecommendationInput,
): CartRecommendations {
  const cartSlugs = input.cartTitles
    .map((t) => catalogueMaps.byName.get(t)?.slug)
    .filter((s): s is string => s !== undefined);

  const cartSlugSet = new Set(cartSlugs);

  return {
    fromFavorites:          resolveSection(input.savedTitles,  cartSlugSet, input.limit),
    recentlyViewed:         resolveSection(input.recentTitles, cartSlugSet, input.limit),
    completeYourCollection: resolveComplementary(cartSlugs, input.limit, input.profile),
  };
}

// ── Section builders ──────────────────────────────────────────────────────────

function resolveSection(
  titles:      readonly string[],
  cartSlugSet: Set<string>,
  limit:       number,
): DisplayFragrance[] {
  const result: DisplayFragrance[] = [];
  for (const title of titles) {
    if (result.length >= limit) break;
    const record = catalogueMaps.byName.get(title);
    if (!record || cartSlugSet.has(record.slug)) continue;
    result.push(toDisplayFragrance(record));
  }
  return result;
}

function resolveComplementary(
  cartSlugs: readonly string[],
  limit:     number,
  profile?:  UnifiedCustomerProfile | null,
): DisplayFragrance[] {
  const pivotSlug = cartSlugs[0];
  if (!pivotSlug) return [];

  try {
    const strategy = resolveRecommendationStrategy("complementary", {
      surfaceId: "minicart-complete-collection",
    }).strategy;
    const result = recommend(
      createContext(profile ?? anonymousProfile(), strategy, {
        limit,
        currentSlug:  pivotSlug,
        excludeSlugs: cartSlugs,
      }),
    );
    if (!result.success) return [];
    return result.recommendations
      .map((r) => slugToDisplay(r.slug))
      .filter((f): f is DisplayFragrance => f !== null);
  } catch {
    return [];
  }
}
