/**
 * Maison Knowledge Catalogue — Canonical Fragrance Model
 *
 * FragranceKnowledge is the single source of truth for all fragrance data.
 * Existing consumer models (DisplayFragrance, Fragrance) are projected from
 * this interface via the adapters in displayAdapter.ts and recommendationAdapter.ts.
 */

export type FragranceKnowledge = {

  // ── Identity ──────────────────────────────────────────────────────────────────
  id: string;
  slug: string;
  brand: string;
  name: string;
  collection: "Skye" | "Rose" | "Elite";
  catalogVersion?: string;
  status?: string;

  // ── Classification ────────────────────────────────────────────────────────────
  gender: "male" | "female" | "unisex";
  family: string[];
  scentCharacter:
    | "Fresh & Light"
    | "Balanced Signature"
    | "Rich & Long Wearing"
    | "Deep & Intense";
  projection: "soft" | "moderate" | "strong";

  // ── Composition ───────────────────────────────────────────────────────────────
  profile: string;
  season: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  mood: string;

  // ── Discovery ─────────────────────────────────────────────────────────────────
  vibe: string[];
  occasions: string[];
  seasons: string[];
  signatureStyle: string[];
  recommendedFor: string[];

  // ── Merchandising ─────────────────────────────────────────────────────────────
  prices: { "5ml": number; "10ml": number; "30ml": number };
  images: { "5ml": string; "10ml": string; "30ml": string };
  bestSeller: boolean;
  newArrival: boolean;
  featured?: boolean;

  // ── Education ─────────────────────────────────────────────────────────────────
  subtitle?: string;
  description?: string;

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds?: string[];  // Explicit Academy article slugs; overrides scoring engine
  academyCategories?: string[];  // Academy category slugs relevant to this fragrance
  educationTags?: string[];      // Tags shared with Academy Registry for cross-referencing
  learningPath?: string[];       // Ordered article slugs for a guided learning experience

  // ── Intelligence ──────────────────────────────────────────────────────────────
  sweetness: number;
  freshness: number;
  warmth: number;
  intensity: number;
  versatility: number;
  popularity: number;
  longevitySignal?: "moderate" | "long" | "exceptional";
};
