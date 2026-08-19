// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — olympea-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:34:36.023Z
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

export const olympeaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "olympea-inspired",
  slug          : "olympea-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Olympea Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Musk",
  season        : "Year-Round",
  notes: {
    top:   ["Green Mandarin", "Ginger Lily", "Water Jasmine"],
    heart: ["Salted Vanilla"],
    base:  ["Ambergris", "Cashmere Wood", "Sandalwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Aquatic Sensual",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Fresh",
    "Luminous",
    "Sophisticated",
    "Warm",
    "Elegant",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Weekend",
    "Evening",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Aquatic Sensuality", "Modern Floral Signature", "Balanced Elegance"],
  recommendedFor: [
    "Women seeking a luminous everyday signature that balances freshness with warmth across all seasons",
    "Those who want sensual comfort without heaviness—a modern take on floral sophistication",
    "Anyone looking for a versatile fragrance that works from office to evening without changing",
    "Women who prefer aquatic freshness grounded in creamy vanilla and soft woods",
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
  subtitle      : "Aquatic Sensuality",
  description   : "Green mandarin and ginger lily open onto a luminous aquatic path, where water jasmine meets salted vanilla in a moment of crystalline warmth. Ambergris and cashmere wood anchor the skin with a soft, skin-like musk that feels both ethereal and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "musk",
    "jasmine",
    "vanilla",
    "sandalwood",
    "signature-scent",
    "sensual",
    "year-round",
    "balanced",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["alien-goddess-inspired", "si-passione-red-musk-inspired"],
    wardrobePartners: ["delina-inspired"],
  },
};
