// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — lacoste-noir-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T17:36:48.378Z
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

export const lacosteNoirInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "lacoste-noir-inspired",
  slug          : "lacoste-noir-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Lacoste Noir Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aromatic",
  season        : "Year-Round",
  notes: {
    top:   ["Watermelon"],
    heart: ["Basil", "Lavender", "Verbena"],
    base:  ["Dark Chocolate", "Cashmeran", "Patchouli", "Coumarin"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Dark Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Sophisticated",
    "Elegant",
    "Mysterious",
    "Balanced",
    "Warm",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Evening",
    "Date Night",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Fresh Dark Luxury", "Balanced Woody Aromatic", "Sophisticated Signature"],
  recommendedFor: [
    "Men seeking a balanced signature that transitions seamlessly from office to evening without demanding attention",
    "Those who appreciate green herbal sophistication anchored by dark woody depth rather than bright citrus",
    "Anyone wanting a year-round fragrance with enough complexity to reveal itself across multiple wearings",
    "Men drawn to dark chocolate and patchouli but preferring restraint over heavy projection",
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
  subtitle      : "Fresh Dark Luxury",
  description   : "Opens with a crisp watermelon note that dissolves into basil and lavender—green, herbal, quietly sophisticated. Dark chocolate and patchouli anchor the composition, creating a woody depth that feels both contemporary and timeless.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "woody",
    "basil",
    "lavender",
    "patchouli",
    "dark-chocolate",
    "balanced",
    "signature",
    "daily-wear",
    "masculine",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-elixir-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
