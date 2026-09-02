// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — ralph's-club-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:26:41.977Z
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

export const ralphsClubInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ralph's-club-inspired",
  slug          : "ralph's-club-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Ralph's Club Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Fougère",
  season        : "Autumn",
  notes: {
    top:   ["Apple", "Pink Pepper", "Bergamot"],
    heart: ["Iris", "Rose"],
    base:  [
      "Cedarwood",
      "Patchouli",
      "Sandalwood",
      "Amber",
      "Musk",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Aromatic Amber",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Balanced",
    "Confident",
    "Elegant",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Daily Wear"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Aromatic Amber", "Sophisticated Fougère", "Balanced Signature"],
  recommendedFor: [
    "Men seeking a sophisticated aromatic signature that bridges professional polish and evening refinement.",
    "Those who appreciate warm amber and soft florals balanced with spice — never sweet, always composed.",
    "Anyone building a signature wardrobe who wants one fragrance that works from office to dinner without reapplication.",
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
  subtitle      : "Warm Aromatic Amber",
  description   : "Pink pepper and apple open with bright citrus snap, then unfold into a soft iris and rose heart that feels like skin rather than florals. Cedarwood, patchouli, and warm amber ground the composition in a quiet, masculine sensuality—the scent of an unhurried evening.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "fougère",
    "apple",
    "iris",
    "cedarwood",
    "patchouli",
    "signature-scent",
    "office",
    "date-night",
    "balanced",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["y-inspired", "layton-inspired", "montblanc-legend-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
