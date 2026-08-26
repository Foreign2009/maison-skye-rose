// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — legend-blue-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:05:49.815Z
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

export const legendBlueInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "legend-blue-inspired",
  slug          : "legend-blue-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Legend Blue Inspired",
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
  season        : "Autumn",
  notes: {
    top:   ["Mint", "Lavender"],
    heart: ["Cedar", "Sandalwood"],
    base:  ["Ambroxan", "Moss"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Woody Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Sophisticated",
    "Elegant",
    "Warm",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Autumn", "Spring"],
  signatureStyle: ["Crisp Woody Elegance", "Balanced Aromatic", "Refined Signature"],
  recommendedFor: [
    "Men seeking a refined woody aromatic that transitions seamlessly from office to evening without projection fatigue",
    "Those who appreciate mint and lavender freshness grounded in warm cedar and sandalwood for autumn wear",
    "Professionals who want a balanced signature fragrance that conveys quiet confidence rather than bold statement",
    "Anyone building a collection who needs a crisp woody alternative to heavier spiced or amber-forward fragrances",
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
  subtitle      : "Crisp Woody Elegance",
  description   : "Mint and lavender open with crystalline clarity, giving way to warm cedar and sandalwood that anchor the composition with quiet depth. Ambroxan and moss create a soft, woody foundation that feels both grounded and luminous.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "cedar",
    "sandalwood",
    "mint",
    "lavender",
    "ambroxan",
    "moss",
    "balanced",
    "signature",
    "office",
    "date-night",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["y-inspired", "montblanc-explorer-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "sauvage-inspired"],
  },
};
