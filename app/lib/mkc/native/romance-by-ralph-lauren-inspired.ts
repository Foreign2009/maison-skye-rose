// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — romance-by-ralph-lauren-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-10T17:57:24.492Z
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

import type { FragranceKnowledge } from "../types";

export const romanceByRalphLaurenInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "romance-by-ralph-lauren-inspired",
  slug          : "romance-by-ralph-lauren-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Romance by Ralph Lauren Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  // PROPOSED EDITORIAL PROFILE (2026-10-11, for review — not a supplier confirmation or promotion approval):
  //   retain "Floral Fresh", supported by the recorded Ulta (authorised retailer) family "Fresh Floral".
  //   Conflicting classification kept on record: brand copy via mazenonline.com "Floral, Woody" (brand page 403).
  //   family and scentCharacter are derived by knowledgeAdapter from this profile.
  profile       : "Floral Fresh",
  season        : "Spring",
  notes: {
    // Source: ulta.com Romance EDP listing (inspected 2026-10-10; authorised retailer):
    //   Top - Mandarin Essence, Pink Pepper, White Violet Leaves / Middle - Rose, Jasmine, Marigold,
    //   Geranium / Base - Patchouli, Oakmoss, Musks; Fragrance Family: Fresh Floral.
    // Corroborated by Ralph Lauren brand copy (mazenonline.com) and nordstrom.com key notes. Replaces the
    //   uninspected Fragrantica-attributed pyramid (Chamomile, Ginger, Lemon, Freesia, Lily, Lotus, Carnation).
    // Remaining conflict: brand copy gives family "Floral, Woody" and base "soft woods" (not patchouli).
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected): original Ralph Lauren Romance, EDP.
    top:   ["Mandarin", "Pink Pepper", "Violet Leaves"],
    heart: ["Rose", "Jasmine", "Marigold", "Geranium"],
    base:  ["Patchouli", "Oakmoss", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Romantic Classic Lush",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Fresh",
    "Luminous",
    "Elegant",
    "Sophisticated",
    "Soft",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Wedding",
    "Evening",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Romantic Luminosity", "Classical Floristry", "Fresh Floral Elegance"],
  recommendedFor: [
    "Women seeking a romantic floral that feels fresh and natural rather than heavy or cloying",
    "Those who love classic rose fragrances but want brightness and luminosity alongside the romance",
    "Anyone looking for an elegant everyday fragrance that suits both the office and the evening",
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
  subtitle      : "Romantic Luminosity",
  description   : "Mandarin and pink pepper open with a bright, sparkling lift, violet leaves adding a dewy green edge. Rose and jasmine settle into the heart with classical poise, while marigold and geranium lend a fresh, herbal brightness. Patchouli and oakmoss ground the composition with quiet, earthy depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "fresh",
    "jasmine",
    "spring",
    "romantic",
    "daily-wear",
    "patchouli",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Floral Fresh", season="Spring").
  // Profile "Floral Fresh": ulta.com family "Fresh Floral"; brand copy (non-authorised retailer) says "Floral, Woody" — conflict recorded.
  // sweetness:1 (fresh), freshness:5 (fresh), warmth:1 (fresh), intensity:2 (Spring), versatility:3 (Spring).
  // scentCharacter "Fresh & Light" per deriveScentCharacter (has "fresh").
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
