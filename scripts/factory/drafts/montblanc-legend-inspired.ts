// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — montblanc-legend-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:59:50.238Z
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

export const montblancLegendInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "montblanc-legend-inspired",
  slug          : "montblanc-legend-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Montblanc Legend Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fougère Aromatic",
  season        : "Year-Round",
  notes: {
    top:   ["Bergamot", "Lavender", "Pineapple Leaf", "Exotic Verbena"],
    heart: [
      "Oakmoss Note",
      "Geranium",
      "Coumarin",
      "Apple",
      "Rose",
      "Pomarosa Molecule",
    ],
    base:  ["Sandalwood", "Tonka Bean", "Evernyl"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aromatic Green",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Sophisticated",
    "Balanced",
    "Luminous",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Crisp Sophistication", "Modern Aromatic", "Versatile Signature"],
  recommendedFor: [
    "Men seeking a refined daily signature that balances fresh citrus brightness with warm woody depth.",
    "Those who want a versatile aromatic that works seamlessly from office to evening without being heavy.",
    "Anyone who appreciates classic fougère sophistication with a modern, luminous interpretation.",
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
  subtitle      : "Crisp Sophistication",
  description   : "A verdant aromatic that opens with bright bergamot and lavender, immediately green and luminous. The heart settles into a sophisticated oakmoss and geranium signature, anchored by warm sandalwood and tonka bean—clean without severity, masculine without hardness.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "wear-and-application", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "fougère",
    "bergamot",
    "lavender",
    "sandalwood",
    "coumarin",
    "signature-scent",
    "daily-wear",
    "balanced",
    "masculine",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["y-inspired", "y-edp-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "layton-inspired"],
  },
};
