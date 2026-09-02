// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — greenley-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:25:15.016Z
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

export const greenleyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "greenley-inspired",
  slug          : "greenley-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Greenley Inspired",
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
    top:   ["Bergamot", "Lemon", "Petitgrain"],
    heart: ["Rose", "Iris", "Violet"],
    base:  ["Sandalwood", "Vetiver", "White Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Floral Green",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Elegant",
    "Delicate",
    "Bright",
    "Sophisticated",
    "Clean",
  ],
  occasions     : ["Daily Wear", "Office", "Wedding", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Luminous Floral Fresh", "Powdered Green Elegance", "Crystalline Iris Rose"],
  recommendedFor: [
    "Anyone seeking a fresh floral signature that feels effortless across seasons and settings—professional mornings, casual weekends, and special occasions alike.",
    "Women and those drawn to florals who want luminous brightness without heaviness—a powdered iris and rose that lifts rather than clings.",
    "Fragrance collectors building a green floral foundation that bridges daily wear and elevated moments with quiet sophistication.",
    "Those who appreciate bergamot-led compositions with restraint—crisp citrus opening into delicate florals, never overpowering or synthetic.",
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
  subtitle      : "Luminous Green Floral",
  description   : "Bergamot and petitgrain open with crystalline brightness, then iris and rose emerge as soft, powdered florals against a whisper of violet. Sandalwood and vetiver anchor the composition with quiet green warmth, creating a fragrance that feels both luminous and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral-fresh",
    "bergamot",
    "rose",
    "iris",
    "violet",
    "sandalwood",
    "spring",
    "daily-wear",
    "wedding",
    "unisex",
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
    alternatives:     ["chance-inspired", "coco-mademoiselle-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
