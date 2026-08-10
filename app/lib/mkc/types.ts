/**
 * Maison Knowledge Catalogue — Canonical Fragrance Model
 *
 * FragranceKnowledge is the single source of truth for all fragrance data.
 * Existing consumer models (DisplayFragrance, Fragrance) are projected from
 * this interface via the adapters in displayAdapter.ts and recommendationAdapter.ts.
 *
 * Multi-category foundation (EP2-P7D):
 *   ProductCategory and GuestAvailabilityStatus establish the type vocabulary
 *   for future non-fragrance product categories. Both fields are optional on
 *   FragranceKnowledge — existing records default via productDefaults.ts.
 *   The full ProductRecord / FragranceProfile separation (Option B) is deferred
 *   to EP2-P7F when the first non-fragrance product is ready to author.
 */

// ── Multi-category foundation ─────────────────────────────────────────────────

/**
 * Governed product category registry.
 * Extend this union when a new category is formally introduced.
 * Do not add a value until a concrete product record requires it.
 */
export type ProductCategory =
  | "fragrance"
  | "body-care"
  | "personal-care"
  | "home-fragrance"
  | "bottles-packaging"
  | "accessories"
  | "lifestyle";

/**
 * Guest-facing availability status.
 * Describes what a guest can do with a product right now.
 * Intentionally separate from internal lifecycle (status field).
 *
 *   online       — in the browsable collection, purchasable immediately
 *   on-request   — sourced via WhatsApp; not in the browsable collection
 *   coming-soon  — announced but not yet available
 *   seasonal     — available only within a defined seasonal window
 *   limited      — purchasable but quantity-constrained (honest scarcity only)
 */
export type GuestAvailabilityStatus =
  | "online"
  | "on-request"
  | "coming-soon"
  | "seasonal"
  | "limited";

// ── Fragrance Knowledge record ────────────────────────────────────────────────

export type FragranceKnowledge = {

  // ── Identity ──────────────────────────────────────────────────────────────────
  id: string;
  slug: string;
  brand: string;
  name: string;
  collection: "Skye" | "Rose" | "Elite";
  catalogVersion?: string;
  status?: string;

  // ── Multi-category foundation (EP2-P7D) ───────────────────────────────────────
  // Optional on existing records. Defaults resolved via productDefaults.ts.
  // Absence implies "fragrance" for category and "online" for availabilityStatus.
  category?:           ProductCategory;
  availabilityStatus?: GuestAvailabilityStatus;

  // ── Classification ────────────────────────────────────────────────────────────
  gender: "male" | "female" | "unisex";
  family: string[];
  scentCharacter:
    | "Fresh & Light"
    | "Balanced Signature"
    | "Rich & Full-Bodied"
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

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships?: {
    evolutionOf?:      string;    // slug of the direct predecessor in this fragrance line
    evolutions?:       string[];  // slugs of fragrances that evolved FROM this record
    alternatives?:     string[];  // slugs of comparable alternatives in a similar register
    wardrobePartners?: string[];  // slugs recommended to own alongside this fragrance
  };

  // ── Intelligence ──────────────────────────────────────────────────────────────
  sweetness: number;
  freshness: number;
  warmth: number;
  intensity: number;
  versatility: number;
  popularity: number;
};
