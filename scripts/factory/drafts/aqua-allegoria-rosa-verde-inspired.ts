// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — aqua-allegoria-rosa-verde-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:04:02.793Z
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

export const aquaAllegoriaRosaVerdeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "aqua-allegoria-rosa-verde-inspired",
  slug          : "aqua-allegoria-rosa-verde-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Aqua Allegoria Rosa Verde Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fresh",
  season        : "Spring",
  notes: {
    top:   ["Cucumber", "Mint", "Bergamot"],
    heart: ["Rose", "Violet", "Pear"],
    base:  ["Musk", "Chypre Notes", "Iris"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Green Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Luminous",
    "Delicate",
    "Modern",
    "Clean",
    "Soft",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Wedding"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Green Floral Clarity", "Fresh Unisex Rose", "Luminous Spring Bloom"],
  recommendedFor: [
    "Anyone seeking a fresh, unisex fragrance that blooms with green florals and spring clarity for everyday wear",
    "Women who love rose-based fragrances but want brightness and cooling mint instead of sweetness or warmth",
    "Those drawn to soft florals with an airy, garden-fresh quality that feels like morning dew on petals",
    "Men exploring floral fragrances that feel modern and botanical rather than traditionally feminine",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Green Florals, Quiet Clarity",
  description   : "A verdant rose blooms between cool mint and cucumber, its petals dusted with violet and iris. The fragrance moves with the clarity of spring water, green and luminous, settling into a soft musk base that anchors without weight.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral-fresh",
    "rose",
    "violet",
    "bergamot",
    "mint",
    "unisex",
    "spring",
    "daily-wear",
    "layering",
    "chypre",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

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
    alternatives:     ["chance-eau-fraiche-inspired", "coco-mademoiselle-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
