// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — ange-ou-demon-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:28:11.865Z
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

export const angeOuDemonInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ange-ou-demon-inspired",
  slug          : "ange-ou-demon-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Ange ou Démon Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Aldehyde",
  season        : "Autumn",
  notes: {
    top:   ["Gardenia", "Aldehydes", "Bergamot"],
    heart: ["Iris", "White Flowers", "Lily"],
    base:  [
      "White Musk",
      "Cashmere Wood",
      "Amber",
      "Vanilla",
      "Sandalwood",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Ethereal White Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Ethereal",
    "Sophisticated",
    "Luminous",
    "Feminine",
    "Warm",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Autumn", "Spring"],
  signatureStyle: ["Ethereal White Floral", "Signature Elegance", "Modern Classique"],
  recommendedFor: [
    "Women seeking a luminous white floral signature that bridges professional elegance and romantic evenings",
    "Those who love iconic floral aldehydes but want a softer, more wearable interpretation for everyday sophistication",
    "Anyone drawn to crystalline, ethereal femininity with enough warmth to feel grounded and mature",
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
  subtitle      : "Luminous Aldehyde",
  description   : "Gardenia and aldehydes open with crystalline brightness, a shimmer of white petals that yields to a luminous heart of iris and lily. White musk and cashmere wood anchor the composition in soft amber and vanilla, creating a fragrance that hovers between angelic whisper and sensual depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-aldehyde",
    "gardenia",
    "iris",
    "white-flowers",
    "aldehydes",
    "white-musk",
    "signature-scent",
    "autumn",
    "office",
    "date-night",
    "balanced",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["j'adore-inspired", "chanel-no-5-inspired", "alien-inspired"],
    wardrobePartners: ["black-opium-inspired", "hypnotic-poison-inspired"],
  },
};
