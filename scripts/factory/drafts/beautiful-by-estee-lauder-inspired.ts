// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — beautiful-by-estee-lauder-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-10T17:58:24.093Z
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

export const beautifulByEsteeLauderInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "beautiful-by-estee-lauder-inspired",
  slug          : "beautiful-by-estee-lauder-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Beautiful by Estee Lauder Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    // Source: nordstrom.com Estée Lauder Beautiful EDP listing (inspected 2026-10-10; named tier-2 retailer):
    //   Top: rose, mandarin, lily, tuberose, marigold / Middle: orange flower, muguet, jasmine, ylang-ylang /
    //   Base: sandalwood, vetiver, amber. "Lily of the Valley" = muguet. Replaces the uninspected
    //   Fragrantica-attributed pyramid (Bergamot, Carnation, Musk removed; Orange Flower added).
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected): original Estée Lauder Beautiful, EDP.
    top:   ["Rose", "Mandarin", "Lily", "Tuberose", "Marigold"],
    heart: ["Orange Flower", "Lily of the Valley", "Jasmine", "Ylang-Ylang"],
    base:  ["Sandalwood", "Vetiver", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Classic Timeless Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Elegant",
    "Romantic",
    "Sophisticated",
    "Warm",
    "Timeless",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Wedding",
    "Evening",
  ],
  seasons       : ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Classic Floral Elegance", "Timeless Feminine Signature", "Balanced Rose Composition"],
  recommendedFor: [
    "Women seeking a timeless floral signature that suits both day and evening",
    "Those who appreciate classical rose compositions with brightness and warmth in balanced measure",
    "Anyone building a fragrance wardrobe who wants one sophisticated floral that honors tradition while feeling distinctly personal",
    "Women celebrating milestones—weddings, anniversaries, memorable moments—who want a fragrance with a true sense of occasion",
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
  subtitle      : "Timeless Floral Elegance",
  description   : "Rose and mandarin open with luminous, floral warmth—lily, tuberose, and marigold filling out the initial accord. Orange flower and jasmine bloom in the heart alongside ylang-ylang and lily of the valley, a thousand flowers at their fullest. Sandalwood, vetiver, and amber close with timeless, soft warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "jasmine",
    "tuberose",
    "feminine",
    "spring",
    "signature",
    "balanced",
    "wedding",
    "sandalwood",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Floral", season="Spring").
  // sweetness:2 (else), freshness:3 (floral), warmth:2 (else), intensity:2 (Spring), versatility:3 (Spring).
  // Scores are heuristic-derived approximations (knowledgeAdapter.ts line 208). No calibration producer in pipeline.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification.
  // Validator (validator.ts): BOTH alternatives AND wardrobePartners require reciprocity
  // when allRecords is provided — RELATIONSHIP_ALTERNATIVES_NOT_RECIPROCAL and
  // RELATIONSHIP_WARDROBE_PARTNERS_NOT_RECIPROCAL both fire. Empty arrays pass without error.
  // Proposed pairings retained in catalogue-expansion-ledger.json → pending_relationship_proposals.
  // NOTE: j-adore-inspired was also removed (RELATIONSHIP_SLUG_NOT_FOUND — not in native registry).
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
