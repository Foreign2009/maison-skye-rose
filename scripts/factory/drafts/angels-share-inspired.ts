// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — angels-share-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:04:41.854Z
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

export const angelsShareInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "angels-share-inspired",
  slug          : "angels-share-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Angels Share Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Cognac"],
    heart: ["Cinnamon", "Tonka Bean", "Oak", "Hedione"],
    base:  ["Vanilla", "Praline", "Sandalwood", "Candied Almond"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Spicy Gourmand",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Sensual",
    "Luxury",
    "Inviting",
    "Mature",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Office"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Spiced Luxury", "Oriental Gourmand", "Sophisticated Comfort"],
  recommendedFor: [
    "Anyone seeking a sophisticated gourmand that balances warmth with spice, perfect for cooler evenings and intimate occasions.",
    "Those who love Oriental fragrances but want something wearable and inviting rather than overtly intense or heavy.",
    "Men and women drawn to the comfort of vanilla and praline with an elevated edge of cinnamon and aged oak.",
    "Fragrance collectors building a spicy-sweet wardrobe who appreciate cognac-inspired depth and luxury positioning.",
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
  subtitle      : "Warm Spiced Luxury",
  description   : "Cognac opens into a warm embrace of cinnamon and tonka bean, where spiced sweetness meets the depth of aged oak. Vanilla, praline, and candied almond settle into sandalwood, creating a fragrance that tastes as much as it smells—luxurious, enveloping, unmistakably autumnal.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-spicy",
    "cinnamon",
    "vanilla",
    "tonka-bean",
    "praline",
    "sandalwood",
    "cognac",
    "amber",
    "rich",
    "full-bodied",
    "unisex",
    "autumn",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "tobacco-vanille-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
