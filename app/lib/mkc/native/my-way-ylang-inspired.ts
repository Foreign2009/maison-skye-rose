// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — my-way-ylang-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:08:52.748Z
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

export const myWayYlangInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "my-way-ylang-inspired",
  slug          : "my-way-ylang-inspired",
  brand         : "Maison Skye & Rose",
  name          : "My Way Ylang Inspired",
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
    top:   ["Mango Accord", "White Flowers", "Ginger", "Bergamot"],
    heart: ["Ylang Ylang Essence", "Coconut Water Accord", "Tuberose"],
    base:  ["White Musk", "Vanilla Bourbon", "Cedarwood"],
  },
  mood          : "Tropical Feminine Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Warm",
    "Elegant",
    "Tropical",
    "Sensual",
    "Sophisticated",
  ],
  occasions     : ["Daily Wear", "Weekend", "Date Night", "Wedding"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Tropical Feminine Floral", "Creamy Signature Radiance", "Balanced White Floral"],
  recommendedFor: [
    "Women seeking a signature floral that balances tropical brightness with creamy, grounded warmth for everyday wear",
    "Those who love ylang ylang and tuberose but want the sensuality softened by coconut water and vanilla for approachability",
    "Fragrance collectors building a wardrobe who need a radiant spring-to-summer floral between fresh and sensual",
    "Anyone drawn to tropical florals who prefer moderate projection and balanced composition over heavy or sweet florals",
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
  subtitle      : "Tropical Radiance",
  description   : "Tropical ylang ylang unfolds with creamy tuberose and a whisper of coconut water, opening with bright mango and white flowers kissed by ginger. White musk and vanilla bourbon settle into cedarwood, creating a sensual base that feels both luminous and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "ylang-ylang",
    "tuberose",
    "white-flowers",
    "tropical",
    "mango",
    "vanilla",
    "signature-scent",
    "daily-wear",
    "feminine",
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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "my-way-inspired"],
    wardrobePartners: ["coco-mademoiselle-inspired"],
  },
};
