// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — tommy-girl-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-10T17:57:44.834Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: PASS  [0 error(s), 0 warning(s)]
// Projected KQ tier: (not available — requires Intelligence Producer)
// ─────────────────────────────────────────────────────────────────
// REVIEW CHECKLIST
//   □ Notes pyramid verified (≥ 2 per tier, no cross-tier duplicates)
//   □ Description reviewed in Maison editorial voice
//   □ Vibe tags meet minimum of 3 (from approved vocabulary)
//   □ recommendedFor has minimum of 2 persona statements
//   □ All FACTORY_ERROR markers resolved
//   □ All FACTORY_WARN markers reviewed
//   □ Relationship suggestions reviewed (see footer)
//   □ npm run mkc:validate passes before promotion
// ═════════════════════════════════════════════════════════════════

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const tommyGirlInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "tommy-girl-inspired",
  slug          : "tommy-girl-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Tommy Girl Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Citrus", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Citrus Floral",
  season        : "Spring",
  notes: {
    // Pyramid attributed to Fragrantica (Tommy-Girl-3016) — that page was NOT inspected (HTTP 403);
    // earlier corrections were made from search results. Inspected secondary evidence:
    // amcal.com.au EDT listing — all 16 notes match in the same tiers (spelling: Camelia, Black Currant).
    // See wave-9-source-evidence.json.
    top:   ["Apple Tree Blossom", "Mandarin Orange", "Camellia", "Blackcurrant"],
    heart: ["Lemon", "Honeysuckle", "Grapefruit", "Rose", "Lily", "Mint", "Violet"],
    base:  ["Magnolia", "Jasmine", "Cedar", "Sandalwood", "Leather"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Clean Youthful",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Youthful",
    "Bright",
    "Soft",
    "Modern",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Wedding",
    "Casual",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Citrus Clarity", "Fresh Floral Signature", "Modern Youthful Elegance"],
  recommendedFor: [
    "Women seeking a fresh citrus-floral signature that feels effortless and youthful for everyday wear",
    "Those who love clean, bright fragrances with soft florals for spring and summer wear",
    "Anyone looking for a versatile fragrance for weddings, casual outings, and professional settings without heaviness",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Citrus Clarity",
  description   : "Apple blossom and blackcurrant open with youthful brightness, mandarin and camellia softening the fruit-forward opening. Honeysuckle and grapefruit bloom in the heart alongside violet and rose with effortless, breezy freshness. Cedar and sandalwood anchor the composition with a clean, woody finish.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "citrus-floral",
    "apple",
    "blackcurrant",
    "honeysuckle",
    "grapefruit",
    "rose",
    "violet",
    "fresh",
    "light",
    "spring",
    "daily-wear",
    "wedding",
    "youthful",
    "clean",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Citrus Floral", season="Spring").
  // sweetness:1 (citrus), freshness:5 (citrus), warmth:1 (citrus), intensity:2 (Spring), versatility:3 (Spring).
  // Scores are heuristic-derived approximations (knowledgeAdapter.ts line 208). No calibration producer in pipeline.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification.
  // Validator (validator.ts): BOTH alternatives AND wardrobePartners require reciprocity
  // when allRecords is provided — RELATIONSHIP_ALTERNATIVES_NOT_RECIPROCAL and
  // RELATIONSHIP_WARDROBE_PARTNERS_NOT_RECIPROCAL both fire. Empty arrays pass without error.
  // Proposed pairings retained in catalogue-expansion-ledger.json → pending_relationship_proposals.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
