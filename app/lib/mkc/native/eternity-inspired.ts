// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — eternity-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:51:49.937Z
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

export const eternityInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "eternity-inspired",
  slug          : "eternity-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Eternity Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Fougere",
  season        : "Year-Round",
  notes: {
    top:   ["Lavender", "Lemon", "Bergamot", "Mandarin Orange"],
    heart: [
      "Sage",
      "Juniper Berries",
      "Basil",
      "Geranium",
      "Jasmine",
      "Coriander",
      "Orange Blossom",
      "Lily of the Valley",
      "Lily",
    ],
    base:  [
      "Sandalwood",
      "Musk",
      "Vetiver",
      "Brazilian Rosewood",
      "Amber",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aromatic Classic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Sophisticated",
    "Balanced",
    "Elegant",
    "Confident",
    "Timeless",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Aromatic Fougère", "Verdant Classic", "Balanced Signature"],
  recommendedFor: [
    "Men seeking a refined everyday fragrance that balances fresh citrus with classical herbal depth and never feels tired.",
    "Those who appreciate aromatic elegance and want a signature that works from office to weekend without projection fatigue.",
    "Anyone building a fragrance wardrobe who values timeless restraint over trend — a verdant classic that ages well.",
    "Men in professional and social settings who prefer clean, balanced compositions that complement rather than dominate.",
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
  subtitle      : "Verdant Classic",
  description   : "Crisp lavender and citrus open with classical restraint, revealing a verdant heart of sage and juniper that speaks to timeless aromatic tradition. Sandalwood and vetiver ground the composition in warm, subtle sensuality—a fragrance that feels complete and unhurried.",
  academyArticleIds: ["guide-to-fragrance-families", "what-makes-a-signature-scent", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "wear-and-application", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "fougere",
    "lavender",
    "sage",
    "sandalwood",
    "vetiver",
    "citrus",
    "balanced",
    "signature",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-inspired", "bleu-de-chanel-inspired", "montblanc-legend-inspired"],
    wardrobePartners: ["stronger-with-you-inspired"],
  },
};
