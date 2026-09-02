// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — azzaro-chrome-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:26:19.952Z
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

export const azzaroChromeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "azzaro-chrome-inspired",
  slug          : "azzaro-chrome-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Azzaro Chrome Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Aquatic"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Aquatic",
  season        : "Summer",
  notes: {
    top:   [
      "Bergamot",
      "Lemon",
      "Pineapple",
      "Water Notes",
      "Rosemary",
      "Cyclamen",
    ],
    heart: ["Jasmine", "Cedar", "Coriander", "Oakmoss"],
    base:  [
      "Tonka Bean",
      "Oakmoss",
      "Musk",
      "Sandalwood",
      "Vetiver",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aquatic Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Bright",
    "Sophisticated",
    "Aquatic",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Fresh Aquatic", "Mineral Clarity", "Summer Essential"],
  recommendedFor: [
    "Men seeking a crisp, water-bright everyday fragrance that performs equally well at the office or poolside",
    "Those who love citrus and mineral freshness without sweetness or heavy projection",
    "Anyone building a summer rotation who wants clarity and clean aromatic depth over fruity florals",
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
  subtitle      : "Fresh Mineral Depth",
  description   : "Bergamot and lemon pierce through water-bright air, sharpened by rosemary into something mineral and clean. Jasmine softens the heart while cedar and oakmoss anchor the composition—a fragrance that feels like morning light on skin, crisp yet grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "aquatic",
    "bergamot",
    "citrus",
    "fresh",
    "light",
    "summer",
    "daily-wear",
    "cedar",
    "oakmoss",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["aqua-di-gio-inspired", "invictus-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
