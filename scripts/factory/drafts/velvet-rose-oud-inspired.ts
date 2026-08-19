// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — velvet-rose-oud-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:07:14.700Z
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

export const velvetRoseOudInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "velvet-rose-oud-inspired",
  slug          : "velvet-rose-oud-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Velvet Rose Oud Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Oriental",
  season        : "Autumn",
  notes: {
    top:   [],
    heart: ["Damask Rose", "Agarwood (Oud)", "Praline", "Clove"],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Rich Floral Warm",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Warm",
    "Intimate",
    "Magnetic",
    "Elegant",
    "Sensual",
  ],
  occasions     : ["Date Night", "Office", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Floral Oriental Elegance", "Velvet Intensity", "Balanced Luxury"],
  recommendedFor: [
    "Anyone seeking a sophisticated floral-oriental signature that balances rose's romance with oud's depth and mystery",
    "Those who appreciate rich, velvety textures and want a fragrance that whispers rather than shouts",
    "Fragrance collectors building a curated wardrobe who value balanced complexity over linear simplicity",
    "Women and men drawn to damask rose elevated by precious woods and spice, perfect for intimate evening moments",
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
  subtitle      : "Velvet Intensity",
  description   : "Damask rose and agarwood in quiet convergence, threaded through with clove and praline warmth. Rich and intimate in character—a fragrance that wears like velvet, refusing to whisper.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-oriental",
    "damask-rose",
    "oud",
    "agarwood",
    "praline",
    "clove",
    "signature",
    "balanced",
    "autumn",
    "unisex",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

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
    alternatives:     ["rose-oud-inspired", "oud-mood-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
