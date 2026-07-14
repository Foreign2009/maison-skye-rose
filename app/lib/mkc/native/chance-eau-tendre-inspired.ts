// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — chance-eau-tendre-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:30:05.541Z
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

export const chanceEauTendreInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "chance-eau-tendre-inspired",
  slug          : "chance-eau-tendre-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Chance Eau Tendre Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Floral",
  season        : "Spring",
  notes: {
    top:   ["Grapefruit", "Pink Pepper", "Bergamot"],
    heart: ["Quince", "Rose Absolute", "Freesia"],
    base:  ["Jasmine Sambac", "Musk", "Sandalwood"],
  },
  mood          : "Soft and delicate.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Delicate",
    "Soft",
    "Romantic",
    "Bright",
    "Elegant",
    "Feminine",
  ],
  occasions     : ["Daily Wear", "Wedding", "Date Night", "Weekend"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Romance", "Luminous Floral", "Delicate Signature"],
  recommendedFor: [
    "Women seeking a luminous everyday fragrance that feels both fresh and romantically feminine without overwhelming sweetness",
    "Those who love rose-centered florals but prefer a lighter, more delicate expression with fruity brightness",
    "Anyone looking for a signature scent that works equally well for casual days and special occasions like weddings",
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
  subtitle      : "Tender Luminescence",
  description   : "A luminous fruity floral that opens with grapefruit and pink pepper before settling into quince and rose absolute—delicate, never saccharine. Freesia and jasmine sambac create a warm, skin-close finish that lingers softly, grounded by subtle musk and sandalwood.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "rose",
    "grapefruit",
    "pink-pepper",
    "freesia",
    "jasmine",
    "musk",
    "signature",
    "spring",
    "delicate",
    "daily-wear",
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
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
