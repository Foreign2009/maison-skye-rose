// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — gucci-guilty-pour-femme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:38:19.223Z
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

export const gucciGuiltyPourFemmeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gucci-guilty-pour-femme-inspired",
  slug          : "gucci-guilty-pour-femme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gucci Guilty Pour Femme Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity",
  season        : "Year-Round",
  notes: {
    top:   ["Pink Pepper", "Mandarin Orange", "Bergamot"],
    heart: [
      "Lilac",
      "Peach",
      "Geranium",
      "Jasmine",
      "Black Currant",
    ],
    base:  ["Patchouli", "Amber", "White Musk", "Vanilla"],
  },
  notesEvidenceLocked: true,
  mood          : "Playful Floral Warm",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Playful",
    "Warm",
    "Luminous",
    "Sophisticated",
    "Feminine",
    "Bright",
  ],
  occasions     : ["Daily Wear", "Office", "Casual", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Luminous Floral Warmth", "Modern Feminine Playfulness", "Balanced Fruity Floral"],
  recommendedFor: [
    "Women seeking a luminous, approachable floral that works year-round without demanding occasion",
    "Those who want playful warmth and fruity brightness balanced by grounding amber and patchouli",
    "Anyone building a signature collection who values versatility and a distinctly feminine but not overtly sensual character",
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
  subtitle      : "Luminous Floral Warmth",
  description   : "Pink pepper and mandarin ignite a sparkling opening that yields to lilac and peach—a luminous floral heart with whispers of black currant. Patchouli and amber ground the composition in warmth, while white musk and vanilla soften the edges into a creamy, intimate finish.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "fruity",
    "pink-pepper",
    "jasmine",
    "peach",
    "playful",
    "signature",
    "year-round",
    "daily-wear",
    "balanced",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "mon-paris-inspired", "chance-eau-tendre-inspired"],
    wardrobePartners: ["bleu-de-chanel-inspired"],
  },
};
