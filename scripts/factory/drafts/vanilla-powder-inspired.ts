// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — vanilla-powder-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:04:14.444Z
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

export const vanillaPowderInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "vanilla-powder-inspired",
  slug          : "vanilla-powder-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Vanilla Powder Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Gourmand", "Vanilla"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Gourmand Vanilla",
  season        : "Autumn",
  notes: {
    top:   ["Coconut Powder", "Heliotrope"],
    heart: ["Madagascar Vanilla"],
    base:  [
      "Vanilla Absolute",
      "White Musk",
      "Musk",
      "Palo Santo",
      "Coconut",
      "Lactones",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Powdery Vanilla",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Elegant",
    "Warm",
    "Sensual",
    "Sophisticated",
    "Delicate",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Creamy Gourmand Comfort", "Powdery Vanilla Sophistication", "Soft Luxury"],
  recommendedFor: [
    "Anyone seeking a gourmand fragrance that feels sophisticated rather than candy-like, with creamy vanilla and powdery comfort.",
    "Women and those who gravitate toward feminine-leaning scents looking for a signature that works across seasons but peaks in autumn.",
    "Fragrance collectors building a vanilla wardrobe who want something distinctly powdery and architectural rather than dark or intense.",
    "Those drawn to skin scents and subtle projection who want vanilla that feels like a second skin rather than a statement.",
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
  subtitle      : "Soft Comfort",
  description   : "Coconut powder and heliotrope dissolve into a creamy Madagascar vanilla that settles on skin like translucent talc. White musk and palo santo ground the sweetness in something almost architectural—a gourmand that whispers rather than shouts. The effect is intimate, powdery, deeply comforting.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "vanilla",
    "gourmand",
    "coconut",
    "heliotrope",
    "musk",
    "creamy",
    "sweet",
    "autumn",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["dark-vanilla-inspired", "khamrah-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
