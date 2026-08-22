// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — burberry-london-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:51:36.672Z
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

export const burberryLondonInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "burberry-london-inspired",
  slug          : "burberry-london-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Burberry London Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Cinnamon", "Lavender", "Bergamot"],
    heart: ["Leather", "Mimosa"],
    base:  ["Tobacco Leaf", "Guaiac Wood", "Opoponax", "Oakmoss"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Spicy Tobacco",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Confident",
    "Elegant",
    "Mysterious",
    "Mature",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Spicy Sophistication", "Leather & Tobacco Elegance", "Measured Warmth"],
  recommendedFor: [
    "Men seeking a sophisticated spicy fragrance that transitions seamlessly from office to evening without feeling costume-like",
    "Those who appreciate tobacco, leather, and warm woods as grounding elements rather than sweet or fruity florals",
    "Anyone building a refined autumn and winter wardrobe who wants a signature with quiet confidence and measured depth",
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
  subtitle      : "Warm Spice, Quiet Leather",
  description   : "Cinnamon and bergamot ignite against a leather-soft heart, while tobacco leaf and guaiac wood settle into a base of measured warmth. A fragrance that moves between spice and smoke, between brightness and earth—composed with the restraint of tailored wool and the depth of aged spirits.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-spicy",
    "cinnamon",
    "tobacco",
    "leather",
    "woody",
    "aromatic",
    "sophisticated",
    "versatile",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "tobacco-vanille-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
