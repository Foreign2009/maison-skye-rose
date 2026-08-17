// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dunhill-fresh-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:09:27.374Z
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

export const dunhillFreshInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dunhill-fresh-inspired",
  slug          : "dunhill-fresh-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Dunhill Fresh Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Fresh", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Fresh Aromatic",
  season        : "Summer",
  notes: {
    top:   [
      "Green Notes",
      "Mint",
      "Basil",
      "Lavender",
      "Freesia",
      "Sage",
    ],
    heart: ["Violet", "Iris", "Mimosa", "Freesia"],
    base:  [
      "Vetiver",
      "Cedar",
      "Oakmoss",
      "Patchouli",
      "Amber",
      "Coumarin",
    ],
  },
  mood          : "Fresh Aromatic Clean",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Clean",
    "Fresh",
    "Herbal",
    "Bright",
    "Refined",
    "Cool",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Casual",
    "Weekend",
    "Travel",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Herbal Aromatic", "Fresh Clarity", "Summer Sophistication"],
  recommendedFor: [
    "Men seeking a crisp, herbal signature for warm weather that feels effortlessly refined and natural",
    "Those who prefer green and aromatic over sweet, wanting clarity and freshness with substance",
    "Anyone building a summer rotation who values versatility across casual, professional, and leisure settings",
    "Fragrance enthusiasts drawn to mint, basil, and sage—seeking an aromatic composition with sophistication",
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
  subtitle      : "Herbal Clarity",
  description   : "Green basil and mint open with crystalline freshness, sharpened by sage and lavender into a cool, herbal clarity. Violet and iris settle the composition into a refined aromatic stillness, grounded by vetiver and cedar that sustain the fragrance's composed, woody elegance.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "fresh",
    "woody",
    "mint",
    "basil",
    "vetiver",
    "cedar",
    "summer",
    "daily-wear",
    "clean",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["y-inspired", "sauvage-inspired"],
    wardrobePartners: ["prada-l'homme-inspired"],
  },
};
