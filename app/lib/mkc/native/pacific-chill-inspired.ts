// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — pacific-chill-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:28:14.623Z
// Factory version:   0.5.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
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

export const pacificChillInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "pacific-chill-inspired",
  slug          : "pacific-chill-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Pacific Chill Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Fruity", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fresh Fruity",
  season        : "Summer",
  notes: {
    top:   ["Spearmint", "Yuzu", "Pink Pepper"],
    heart: ["Fig Leaf Absolute", "White Peach", "Ambroxan"],
    base:  ["Cedarwood", "Musk", "Vanilla Bourbon"],
  },
  mood          : "Relaxed and modern.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Modern",
    "Relaxed",
    "Luminous",
    "Clean",
    "Elegant",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Casual",
    "Weekend",
    "Travel",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Modern Fruity Freshness", "Luxury Summer Calm", "Skin-Like Clarity"],
  recommendedFor: [
    "Men seeking a clean, modern fragrance that refreshes without heaviness—perfect for warm weather and casual confidence.",
    "Those who love fruity freshness with a tactile, skin-like quality that feels like a second layer rather than a statement.",
    "Anyone looking for a versatile summer signature that bridges relaxed weekends and effortless office presence.",
    "Fragrance explorers who want luminous fruit and herbs over traditional citrus or spice.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Liquid Clarity",
  description   : "Spearmint and yuzu open with a cool clarity, brightened by pink pepper's subtle bite. Fig leaf and white peach create a luminous, skin-like heart that settles into cedarwood and warm musk—a fragrance that feels like air itself, distilled.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "fruity",
    "fresh",
    "yuzu",
    "peach",
    "spearmint",
    "citrus",
    "summer",
    "light",
    "casual",
    "versatile",
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
    alternatives:     ["hawas-inspired", "aqua-di-gio-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
