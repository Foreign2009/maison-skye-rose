// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — cool-water-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:05:02.635Z
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

export const coolWaterInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "cool-water-inspired",
  slug          : "cool-water-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Cool Water Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aquatic"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aquatic Fougère",
  season        : "Summer",
  notes: {
    top:   [
      "Sea Water",
      "Lavender",
      "Mint",
      "Green Notes",
      "Rosemary",
      "Calone",
      "Coriander",
    ],
    heart: ["Sandalwood", "Neroli", "Geranium", "Jasmine"],
    base:  [
      "Musk",
      "Tobacco",
      "Oakmoss",
      "Cedar",
      "Amber",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aquatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Coastal",
    "Bright",
    "Mineral",
    "Crisp",
  ],
  occasions     : [
    "Daily Wear",
    "Casual",
    "Weekend",
    "Travel",
    "Vacation",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Aquatic Freshness", "Salt & Mineral", "Summer Staple"],
  recommendedFor: [
    "Men seeking a fresh, mineral aquatic for summer travel and warm-weather escapes",
    "Those who prefer clean, salty, and herbal over sweet or heavy fragrances",
    "Anyone looking for a moderate-projection daily fragrance that feels crisp without demanding attention",
    "Men drawn to coastal and seaside aesthetics who want a signature tied to outdoor freshness",
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
  subtitle      : "Salt and Stone",
  description   : "A cool aquatic that opens with sea salt and lavender, anchored by neroli and sandalwood in its core. Musk and oakmoss ground the composition in quiet, mineral depth—a fragrance that feels clean without being sterile.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "the-note-pyramid-explained", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style", "the-note-pyramid"],
  educationTags : [
    "aquatic",
    "fougère",
    "fresh",
    "light",
    "lavender",
    "mint",
    "calone",
    "summer",
    "daily-wear",
    "masculine",
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
    alternatives:     ["aqua-di-gio-inspired", "invictus-inspired", "hawas-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "ombre-nomade-inspired"],
  },
};
