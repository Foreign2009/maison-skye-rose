// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — phantom-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:01:59.437Z
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

export const phantomInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "phantom-inspired",
  slug          : "phantom-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Phantom Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fougère Woody",
  season        : "Year-Round",
  notes: {
    top:   ["Lemon Peel Oil", "Styrallyl Acetate", "Lavender Oil"],
    heart: ["Lavandin", "Patchouli", "Smoky Earthy Accord", "Apple"],
    base:  ["Vetiver", "Lavandin Absolute", "Vanilla Absolute"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aromatic Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Grounded",
    "Fresh",
    "Earthy",
    "Confident",
    "Warm",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Evening"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Aromatic Woody Signature", "Smoke and Lavender", "Balanced Fougère"],
  recommendedFor: [
    "Men seeking a balanced woody signature that transitions seamlessly from office to evening without reinvention.",
    "Those who appreciate fresh aromatic openings grounded in earthy, smoky depth rather than sweet or gourmand bases.",
    "Anyone drawn to lavender-forward fragrances that feel masculine and sophisticated, not herbaceous or soapy.",
    "Confident men who want a polished, grounded presence for daily wear across all seasons.",
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
  subtitle      : "Smoke and Lavender",
  description   : "Crisp lemon and lavender open into a smoky, earthy heart where patchouli and apple create an unexpected tension. Vetiver and vanilla anchor the composition in warm, grounded depth—a fragrance that feels both fresh and contemplative.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "fougère",
    "lavender",
    "vetiver",
    "patchouli",
    "earthy",
    "citrus",
    "signature",
    "daily-wear",
    "layering",
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
    alternatives:     ["sauvage-elixir-inspired", "prada-luna-rossa-carbon-inspired"],
    wardrobePartners: ["creed-green-irish-tweed-inspired"],
  },
};
