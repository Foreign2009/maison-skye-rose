// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — montblanc-explorer-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:00:13.950Z
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

export const montblancExplorerInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "montblanc-explorer-inspired",
  slug          : "montblanc-explorer-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Montblanc Explorer Inspired",
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
    top:   ["OrPur® Bergamot", "French Sage", "Pink Pepper"],
    heart: ["OrPur® Vetiver", "Skin"],
    base:  ["Patchouli", "Cocoa", "Ambrofix™", "Akigalawood®"],
  },
  notesEvidenceLocked: true,
  mood          : "Earthy Woody Spicy",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Earthy",
    "Warm",
    "Sophisticated",
    "Grounded",
    "Spicy",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Woody Aromatic Signature", "Earthy Sophistication", "Balanced Spice"],
  recommendedFor: [
    "Men seeking a balanced woody aromatic that transitions seamlessly from office to evening without requiring a fragrance change.",
    "Those who appreciate earthy, grounded compositions with subtle spice and want to move beyond fresh citrus into deeper character.",
    "Anyone drawn to vetiver and patchouli but preferring warmth and cocoa comfort over austere greenness.",
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
  subtitle      : "Earthy Radiance",
  description   : "Opens with bergamot and pink pepper—a crisp, peppery entry that settles into vetiver and skin musks. Patchouli and cocoa ground the composition in warm earth, creating a fragrance that feels both grounded and quietly radiant.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "bergamot",
    "vetiver",
    "patchouli",
    "sage",
    "pink-pepper",
    "cocoa",
    "balanced",
    "signature",
    "office",
    "versatile",
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
    alternatives:     ["sauvage-inspired", "valentino-uomo-born-in-roma-inspired", "armani-code-parfum-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
