/**
 * Maison Intelligence Layer — Shared Type Definitions
 *
 * app/lib/discovery/ is the platform Intelligence Layer.
 * It is the future home for all fragrance and content discovery services.
 * Future modules: searchRankingEngine.ts, personalizationEngine.ts, aiAdapter.ts
 */

import type { FragranceKnowledge }  from "../mkc/types";
import type { ConversationContext } from "../concierge/types";

// ── Similarity ────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  family:     number;
  notes:      number;
  season:     number;
  occasion:   number;
  character:  number;
  projection: number;
  collection: number;
  popularity: number;
}

export interface SimilarityResult {
  fragrance:  FragranceKnowledge;
  totalScore: number;
  breakdown:  ScoreBreakdown;
}

export type ScoredFragrance = SimilarityResult;

export interface DiscoveryContext {
  excludeSlug?: string;
  count?:       number;
}

// ── Collections ───────────────────────────────────────────────────────────────

export type CollectionFilter =
  | { type: "family";         value: string }
  | { type: "occasion";       value: string }
  | { type: "season";         value: string }
  | { type: "scentCharacter"; value: string }
  | { type: "collection";     value: "Skye" | "Rose" | "Elite" }
  | { type: "bestSeller" }
  | { type: "newArrival" }
  | { type: "popularityMin";  min: number }
  | { type: "notBestSeller" }
  | { type: "notFeatured" }
  | { type: "anyOf";          anyOf: CollectionFilter[] };

export type CollectionBoost =
  | { type: "family";         value: string;                          points: number }
  | { type: "occasion";       value: string;                          points: number }
  | { type: "season";         value: string;                          points: number }
  | { type: "scentCharacter"; value: string;                          points: number }
  | { type: "projection";     value: "soft" | "moderate" | "strong"; points: number }
  | { type: "collection";     value: "Skye" | "Rose" | "Elite";      points: number }
  | { type: "bestSeller";     points: number }
  | { type: "newArrival";     points: number }
  | { type: "popularity";     points: number };  // score += popularity × points / 10

export interface EditorialContent {
  introduction:     string;
  purpose:          string;
  wardrobePurpose:  string;
  academyCopy:      string;
  articleSlugs:     string[];
  conciergeCopy:    string;
  conciergeContext: Partial<ConversationContext>;
}

export interface CollectionSpec {
  id:          string;
  name:        string;
  description: string;
  tags:        string[];
  icon:        string;
  heroImage?:  string;
  accentColor: string;
  featured:    boolean;
  filters:     CollectionFilter[];
  boosts:      CollectionBoost[];
  maxItems:    number;
  editorial?:  EditorialContent;
}

// ── Search ────────────────────────────────────────────────────────────────────

export type SearchResultType = "fragrance" | "article" | "collection" | "future";

export interface SearchResult {
  type:  SearchResultType;
  slug:  string;
  title: string;
  score: number;
}
