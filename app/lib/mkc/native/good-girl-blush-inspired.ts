// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — good-girl-blush-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:29:34.053Z
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

export const goodGirlBlushInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "good-girl-blush-inspired",
  slug          : "good-girl-blush-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Good Girl Blush Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Vanilla",
  season        : "Spring",
  notes: {
    top:   ["Peony", "Bergamot", "Pink Pepper"],
    heart: ["Rose Absolute", "Tuberose", "Almond Milk"],
    base:  ["Vanilla Bourbon", "Sandalwood", "Musk"],
  },
  mood          : "Elegant and feminine.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Elegant",
    "Romantic",
    "Sophisticated",
    "Warm",
    "Luminous",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Wedding",
    "Evening",
  ],
  seasons       : ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Soft Elegance", "Romantic Floral Vanilla", "Luminous Femininity"],
  recommendedFor: [
    "Women who want an elegant everyday fragrance that balances softness with sophistication and presence",
    "Those seeking a romantic floral vanilla that feels refined rather than sugary or juvenile",
    "Anyone looking for a signature scent that transitions seamlessly from office to evening without reprising",
    "Women drawn to creamy florals with depth — peony and rose with a grounding vanilla base",
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
  subtitle      : "Radiant Softness",
  description   : "Peony and pink pepper open with a whisper of bergamot, immediately feminine and luminous. The heart unfolds into rose absolute and creamy almond milk, softened by tuberose's indolic warmth. Vanilla bourbon and sandalwood anchor the composition in gentle sensuality, creating a fragrance that feels both intimate and radiant.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "vanilla",
    "rose",
    "tuberose",
    "peony",
    "feminine",
    "elegant",
    "creamy",
    "wedding",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
