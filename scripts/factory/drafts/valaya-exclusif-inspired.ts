// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — valaya-exclusif-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:50:17.654Z
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

export const valayaExclusifInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "valaya-exclusif-inspired",
  slug          : "valaya-exclusif-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Valaya Exclusif Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Powdery", "Floral", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Powdery Woody",
  season        : "Year-Round",
  notes: {
    top:   ["Almond", "Bergamot", "Mandarin"],
    heart: ["Orange Blossom", "White Flowers"],
    base:  ["White Musks", "Akigalawood", "Sandalwood", "Vanilla"],
  },
  notesEvidenceLocked: true,
  mood          : "Soft Powdery Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Elegant",
    "Luminous",
    "Feminine",
    "Sophisticated",
    "Delicate",
  ],
  occasions     : ["Daily Wear", "Office", "Casual", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Luminous Powdery Floral", "Soft Signature", "Creamy Elegance"],
  recommendedFor: [
    "Women seeking a refined everyday floral that balances brightness with softness without demanding attention",
    "Those who love powdery white florals but want enough citrus and woody depth to feel sophisticated and complete",
    "Anyone building a signature scent wardrobe who values luminous, skin-close elegance over bold projection",
    "Women who pair fragrances with understated luxury aesthetics and appreciate creamy sandalwood warmth",
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
  subtitle      : "Soft Luminosity",
  description   : "A powdery white floral that opens with bitter almond and citrus brightness, settling into a luminous heart of orange blossom and creamy white flowers. Sandalwood and soft musks create a gentle, skin-close finish that feels both intimate and refined.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "powdery",
    "woody",
    "white-flowers",
    "orange-blossom",
    "sandalwood",
    "vanilla",
    "signature-scent",
    "daily-wear",
    "balanced",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-exclusif-inspired", "rolling-in-love-inspired"],
    wardrobePartners: ["prada-l'homme-inspired"],
  },
};
