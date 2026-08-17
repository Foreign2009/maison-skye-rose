// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — libre-flowers-flames-florale-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:48:46.436Z
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

export const libreFlowersFlamesFloraleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "libre-flowers-flames-florale-inspired",
  slug          : "libre-flowers-flames-florale-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Libre Flowers Flames Florale Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    top:   ["Lavender", "Bergamot"],
    heart: [
      "Orange Blossom",
      "Lavender",
      "Coconut",
      "Lily",
      "Palm Tree Flower",
    ],
    base:  ["Vanilla"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Floral Sweet Tropical",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Warm",
    "Feminine",
    "Elegant",
    "Bright",
    "Playful",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Wedding",
    "Casual",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Tropical Floral Warmth", "Balanced Signature Floral", "Fresh & Sweet Elegance"],
  recommendedFor: [
    "Women seeking a fresh yet warm signature fragrance that transitions seamlessly from spring mornings to tropical vacations.",
    "Those who love floral fragrances but want balance—lavender and lily without heaviness or overpowering sweetness.",
    "Anyone building a fragrance wardrobe who wants a versatile daily floral that feels both approachable and elegant.",
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
  subtitle      : "Tropical Floral Warmth",
  description   : "Lavender and bergamot open into a lush heart of orange blossom and lily, where tropical coconut and palm flower create an unexpected warmth. Vanilla anchors the composition—a fragrance that moves between fresh florality and sun-warmed sweetness without apology.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "lavender",
    "orange-blossom",
    "lily",
    "vanilla",
    "balanced",
    "signature-scent",
    "spring",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["libre-inspired", "chance-eau-fraiche-inspired", "flowerbomb-inspired"],
    wardrobePartners: ["libre-intense-inspired", "blanche-bete-inspired"],
  },
};
