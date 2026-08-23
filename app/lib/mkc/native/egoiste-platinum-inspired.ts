// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — egoiste-platinum-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:51:24.349Z
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

import type { FragranceKnowledge } from "../types";

export const egoistePlatinumInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "egoiste-platinum-inspired",
  slug          : "egoiste-platinum-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Egoiste Platinum Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Floral", "Woody", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Floral Musk",
  season        : "Year-Round",
  notes: {
    top:   ["Lavender", "Rosemary", "Neroli", "Petitgrain"],
    heart: ["Geranium", "Clary Sage", "Galbanum", "Jasmine"],
    base:  [
      "Oakmoss",
      "Vetiver",
      "Cedar",
      "Sandalwood",
      "Amber",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Aromatic Woody Classic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Confident",
    "Elegant",
    "Mature",
    "Clean",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Aromatic Woody Classic", "Refined Herbaceous Signature", "Balanced Sophistication", "Modern Aromatic Tradition"],
  recommendedFor: [
    "Men seeking a refined aromatic signature that balances fresh herbaceous clarity with sophisticated woody depth for everyday wear and professional settings.",
    "Those who appreciate classical lavender-based fragrances with modern woody grounding and want a versatile year-round daily companion.",
    "Fragrance enthusiasts building a collection who recognize the appeal of balanced, mature woody florals over sweet or heavily projected scents.",
    "Anyone looking for a timeless aromatic woody that performs consistently across seasons without demanding special occasions.",
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
  subtitle      : "Aromatic Clarity",
  description   : "Lavender and rosemary open with crystalline clarity, grounded by neroli's bitter brightness. The heart unfolds into a sophisticated interplay of geranium and clary sage, while oakmoss and vetiver anchor the composition in dry, mineral woods that deepen into amber and sandalwood.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody-floral",
    "lavender",
    "jasmine",
    "oakmoss",
    "vetiver",
    "cedar",
    "musk",
    "masculine",
    "balanced",
    "signature-scent",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["prada-l'homme-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired"],
  },
};
