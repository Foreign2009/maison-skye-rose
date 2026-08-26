// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dylan-blue-pour-femme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:07:01.204Z
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

export const dylanBluePourFemmeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dylan-blue-pour-femme-inspired",
  slug          : "dylan-blue-pour-femme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Dylan Blue Pour Femme Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Aquatic", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Aquatic",
  season        : "Spring",
  notes: {
    top:   [
      "Blackcurrant",
      "Granny Smith Apple",
      "Clover Accord",
      "Forget-me-not Accord",
      "Shisolia",
    ],
    heart: [
      "Eglantine Rose",
      "Pétalia",
      "Rosyfolia",
      "Jasmine",
      "Icy Infusion of Peach",
    ],
    base:  ["Styrax", "White Smooth Woods", "Musk", "Patchouli Coeur"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Floral Aquatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Luminous",
    "Elegant",
    "Soft",
    "Clean",
    "Delicate",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Wedding",
    "Casual",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Floral Aquatic", "Modern Rose", "Spring Morning Light"],
  recommendedFor: [
    "Women seeking a fresh, luminous everyday fragrance that transitions seamlessly from office to weekend without heaviness",
    "Those who love floral fragrances but prefer the airy, aquatic interpretation over dense florals",
    "Anyone looking for a spring signature with just enough presence to be noticed but never overpowering",
    "Fragrance collectors building a rotation who want an accessible, wearable rose that feels modern and cool",
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
  subtitle      : "Aquatic Rose",
  description   : "Blackcurrant and green apple open into a cool, luminous heart of eglantine rose and peach, where aquatic minerals dissolve into creamy woods and musk. A spring fragrance that feels like morning light on skin—crisp, floral, impossible to pinpoint.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aquatic",
    "floral",
    "rose",
    "jasmine",
    "fresh",
    "light",
    "spring",
    "blackcurrant",
    "peach",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["light-blue-inspired", "omnia-green-jade-inspired", "chance-eau-fraiche-inspired"],
    wardrobePartners: ["delina-inspired", "good-girl-inspired"],
  },
};
