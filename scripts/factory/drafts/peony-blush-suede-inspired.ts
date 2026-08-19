// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — peony-blush-suede-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T17:37:09.392Z
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

export const peonyBlushSuedeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "peony-blush-suede-inspired",
  slug          : "peony-blush-suede-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Peony Blush Suede Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Soft",
  season        : "Year-Round",
  notes: {
    top:   [],
    heart: [
      "Red Apple",
      "Peony",
      "Rose",
      "Jasmine",
      "Carnation",
      "Suede",
    ],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Soft Powdery Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Elegant",
    "Sophisticated",
    "Delicate",
    "Warm",
    "Feminine",
  ],
  occasions     : ["Daily Wear", "Office", "Casual", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Soft Luxury", "Powdery Floral", "Everyday Refinement"],
  recommendedFor: [
    "Women seeking a refined daily signature that feels like a second skin—soft, familiar, and effortlessly elegant.",
    "Anyone who loves florals but prefers a soft, powdery character over bold sweetness or intense presence.",
    "Those building a fragrance wardrobe who want a universal bridge between casual comfort and polished sophistication.",
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
  subtitle      : "Soft Luxury",
  description   : "A soft floral composition pairing peony and red apple with rose, jasmine, carnation and suede—delicate in character, powdery in presence, and quietly luxurious in feel.",
  academyArticleIds: ["guide-to-fragrance-families", "how-to-wear-fragrance", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "wear-and-application", "occasions-and-style"],
  educationTags : [
    "floral",
    "peony",
    "rose",
    "soft-floral",
    "suede",
    "red-apple",
    "daily-wear",
    "signature",
    "balanced",
    "unisex",
  ],
  learningPath  : ["guide-to-fragrance-families", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["good-girl-blush-inspired", "chance-eau-tendre-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
