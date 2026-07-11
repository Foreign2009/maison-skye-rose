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
 */

import type { AcademyArticle } from "./types";
import type { JourneyTopic }   from "../discovery/discoveryIntelligence";
import { academyCatalogue }    from "./catalogue";

// ── Topic → article slug mapping ──────────────────────────────────────────────
// Academy owns this mapping. Extend here as the article library grows.
// Topics may map to multiple slugs — priority order within each topic is preserved.

const TOPIC_SLUG_MAP: Record<JourneyTopic, string[]> = {
  "fragrance-families":  ["guide-to-fragrance-families"],
  "seasonal-fragrance":  ["choosing-your-season-scent"],
  "signature-scent":     ["what-makes-a-signature-scent"],
  "fragrance-wearing":   ["how-to-wear-fragrance"],
  "note-pyramid":        ["the-note-pyramid-explained"],
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
