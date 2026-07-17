/**
 * Academy Journey Resolver
 *
 * Resolves discovery journey topics to Academy articles.
 *
 * Ownership boundary:
 *   Discovery Intelligence (discoveryIntelligence.ts) → derives journey topics
 *   This module                                       → decides which articles satisfy each topic
 *
 * Discovery Intelligence expresses educational intent ("what should the customer
 * learn?"). Academy is responsible for answering that question ("which article
 * covers that?"). These responsibilities must not be merged (EP24-P1, Refinement 2).
 *
 * Scalability: as the Academy article library grows, extend TOPIC_SLUG_MAP.
 * Discovery Intelligence remains stable — no changes required there (Refinement 4).
 *
 * EP24-P1 foundation: five topics, six articles.
 * EP24-P2: adds "fragrance-layering" topic → how-to-layer-fragrances.
 * EP14.0-P3: extends all six topics to cover all 28 Academy articles.
 *   Each topic preserves its original first article — no existing journey regresses.
 *   Topics map to multiple slugs in priority order; resolveJourneyArticles returns ≤ 2.
 */

import type { AcademyArticle } from "./types";
import type { JourneyTopic }   from "../discovery/discoveryIntelligence";
import { academyCatalogue }    from "./catalogue";

// ── Topic → article slug mapping ──────────────────────────────────────────────
// Academy owns this mapping. Extend here as the article library grows.
// Topics may map to multiple slugs — priority order within each topic is preserved.
// Original first entries are unchanged — existing journeys are unaffected.

const TOPIC_SLUG_MAP: Record<JourneyTopic, string[]> = {
  "fragrance-families": [
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "oriental-and-amber-fragrances",
    "woody-fragrances-explained",
    "fresh-citrus-and-aquatic-fragrances",
    "gourmand-fragrances-guide",
    "oud-the-worlds-most-complex-ingredient",
  ],
  "seasonal-fragrance": [
    "choosing-your-season-scent",
    "evening-and-date-night-fragrances",
    "office-and-professional-fragrances",
    "weekend-and-casual-fragrances",
  ],
  "signature-scent": [
    "what-makes-a-signature-scent",
    "building-your-fragrance-wardrobe",
    "fragrance-vocabulary",
    "how-scent-memory-works",
    "how-inspired-fragrances-work",
  ],
  "fragrance-wearing": [
    "how-to-wear-fragrance",
    "projection-and-sillage",
    "fragrance-concentration-explained",
    "how-to-sample-before-you-commit",
    "olfactory-fatigue",
    "storing-and-protecting-your-fragrances",
    "why-fragrances-smell-different-on-everyone",
  ],
  "note-pyramid": [
    "the-note-pyramid-explained",
    "vanilla-and-amber-the-warm-base",
    "musks-the-hidden-foundation",
    "the-science-of-longevity-and-projection",
  ],
  "fragrance-layering": [
    "how-to-layer-fragrances",
  ],
};

/**
 * Resolves journey topics to Academy articles.
 *
 * Topics are resolved in order. Slugs are deduplicated. Articles that do not
 * resolve in the current catalogue are silently skipped. Returns at most 2
 * articles — caller renders none if the result is empty.
 */
export function resolveJourneyArticles(topics: JourneyTopic[]): AcademyArticle[] {
  const slugs = topics.flatMap((topic) => TOPIC_SLUG_MAP[topic] ?? []);
  return [...new Set(slugs)]
    .map((slug) => academyCatalogue.find((a) => a.slug === slug))
    .filter((a): a is AcademyArticle => a !== undefined)
    .slice(0, 2);
}
