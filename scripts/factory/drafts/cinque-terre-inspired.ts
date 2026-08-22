// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — cinque-terre-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:53:33.944Z
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

export const cinqueTerreInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "cinque-terre-inspired",
  slug          : "cinque-terre-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Cinque Terre Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aromatic",
  season        : "Summer",
  notes: {
    top:   ["Italian Rosemary", "Lemon", "Cardamom"],
    heart: ["Cedar & Pine", "Fig Leaves", "Sea Salt", "Grey Amber"],
    base:  ["Oakmoss", "Tonka Beans", "Sandalwood", "Labdanum"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Mediterranean Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Sophisticated",
    "Elegant",
    "Clean",
    "Warm",
    "Artistic",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Coastal Woody Aromatic", "Mediterranean Freshness", "Balanced Signature"],
  recommendedFor: [
    "Anyone seeking a fresh, grounded fragrance that evokes Mediterranean coastal escapes without heavy sweetness.",
    "Men and women who want a balanced woody aromatic for everyday wear that projects clarity and sophistication.",
    "Fragrance enthusiasts looking for a versatile signature that bridges crisp citrus top notes with anchoring woody base.",
    "Travelers and vacation planners who want one fragrance capturing sun-soaked seaside destinations.",
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
  subtitle      : "Coastal Wood",
  description   : "Rosemary and bright lemon open onto a composition of cedar, sea salt, and fig leaves—a woody aromatic that captures the clarity of Mediterranean air. Grey amber and oakmoss anchor the base, grounding the fresh verdancy in warm, earthy depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "woody",
    "rosemary",
    "cedar",
    "pine",
    "unisex",
    "balanced",
    "signature",
    "summer",
    "coastal",
    "fig-leaves",
    "sea-salt",
    "oakmoss",
    "sandalwood",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["valentino-uomo-born-in-roma-inspired", "bleu-de-chanel-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
