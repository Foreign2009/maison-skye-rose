// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — mon-guerlain-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:17:00.205Z
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

export const monGuerlainInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "mon-guerlain-inspired",
  slug          : "mon-guerlain-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Mon Guerlain Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Floral",
  season        : "Winter",
  notes: {
    top:   ["Lavender", "Bergamot"],
    heart: ["Iris", "Jasmine Sambac", "Rose"],
    base:  [
      "Tahitian Vanilla",
      "Tonka Bean",
      "Australian Sandalwood",
      "Benzoin",
      "Licorice",
      "Patchouli",
    ],
  },
  mood          : "Sweet Floral Romantic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Elegant",
    "Luxurious",
    "Warm",
    "Sophisticated",
    "Sensual",
  ],
  occasions     : ["Date Night", "Evening", "Wedding", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Soft Luxury Floral", "Modern Oriental Romance", "Signature Sweetness"],
  recommendedFor: [
    "Women seeking a luxurious floral signature that balances sweetness with sophisticated florals and vanilla warmth.",
    "Those who love rose-centered fragrances with creamy vanilla bases and want a fragrance for intimate evenings and special occasions.",
    "Anyone drawn to soft luxury — a fragrance that feels expensive, romantic, and deeply feminine without being overly sweet or heavy.",
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
  subtitle      : "Soft Luxury",
  description   : "Lavender and bergamot open onto a lush heart of iris and jasmine sambac, where rose takes center stage with quiet intensity. Tahitian vanilla and tonka bean settle into warm sandalwood and benzoin, creating an enveloping sweetness that feels both romantic and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oriental-floral",
    "lavender",
    "rose",
    "jasmine",
    "vanilla",
    "tonka",
    "sandalwood",
    "signature-scent",
    "winter",
    "romantic",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "choosing-your-season-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["la-vie-est-belle-inspired", "delina-inspired", "flowerbomb-inspired"],
    wardrobePartners: ["alien-inspired", "black-opium-inspired"],
  },
};
