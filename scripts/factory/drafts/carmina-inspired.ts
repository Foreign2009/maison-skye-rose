// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — carmina-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:13:45.771Z
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const carminaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "carmina-inspired",
  slug          : "carmina-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Carmina Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Woody", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Amber Woody",
  season        : "Autumn",
  notes: {
    top:   ["Pink Pepper", "Black Cherry", "Saffron"],
    heart: ["Rose de Mai", "Violet", "Peony", "Cashmere Wood"],
    base:  ["Myrrh", "Frankincense", "Ambroxan", "Musk"],
  },
  mood          : "Romantic Floral Spicy",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Sophisticated",
    "Warm",
    "Sensual",
    "Artistic",
    "Elegant",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Romantic Floral Spice", "Autumn Elegance", "Incense-Layered Amber"],
  recommendedFor: [
    "Women seeking a romantic signature that transitions seamlessly from office to evening.",
    "Those who love rose fragrances but want depth, spice, and woody warmth rather than simple florals.",
    "Anyone drawn to amber and myrrh who appreciates how incense adds contemplative elegance to floral beauty.",
    "Fragrance collectors building an autumn wardrobe around rich, full-bodied scents with genuine sophistication.",
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
  subtitle      : "Spiced Romance",
  description   : "Pink pepper and black cherry ignite against saffron, opening into a sumptuous heart of Rose de Mai and violet layered with creamy cashmere wood. Myrrh and frankincense anchor the composition in warm amber, where spice meets intimate musk—a fragrance that moves between romantic softness and quiet sensuality.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-amber",
    "rose",
    "woody",
    "romantic",
    "autumn",
    "full-bodied",
    "myrrh",
    "frankincense",
    "sophisticated",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "crystal-noir-inspired", "prada-paradoxe-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "oud-mood-inspired"],
  },
};
