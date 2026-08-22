// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — omnia-crystalline-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:50:06.120Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: FAIL  [3 error(s), 0 warning(s)]
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

export const omniaCrystallineInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "omnia-crystalline-inspired",
  slug          : "omnia-crystalline-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Omnia Crystalline Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Aquatic", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Aquatic",
  season        : "Summer",
  notes: {
    top:   ["Bamboo", "Pear"],
    heart: ["Lotus", "Tea", "Cassia"],
    base:  ["Musk", "Guaiac Wood", "Oakmoss"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aquatic Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Elegant",
    "Luminous",
    "Soft",
    "Sophisticated",
    "Clean",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Vacation",
    "Weekend",
    "Casual",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Fresh Aquatic Floral", "Luminous Clarity", "Summer Elegance"],
  recommendedFor: [
    "Women seeking a fresh, luminous fragrance that feels like crystalline water and delicate florals for everyday wear",
    "Those who love aquatic fragrances with subtle warmth and want something that breathes rather than announces",
    "Anyone looking for a sophisticated summer signature that transitions seamlessly from office to evening",
    "Fragrance lovers drawn to tea and lotus notes who prefer clarity and restraint over boldness",
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
  subtitle      : "Liquid Clarity",
  description   : "Bamboo and pear open into a luminous heart of lotus and tea, where cassia adds a whisper of warmth. A bed of soft musk and guaiac wood anchors the composition, grounding its aquatic clarity with subtle woody depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aquatic",
    "floral",
    "lotus",
    "pear",
    "tea",
    "musk",
    "fresh",
    "light",
    "summer",
    "daily-wear",
    "vacation",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["omnia-green-jade-inspired", "light-blue-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
