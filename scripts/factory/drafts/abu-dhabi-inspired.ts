// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — abu-dhabi-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:53:20.007Z
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

export const abuDhabiInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "abu-dhabi-inspired",
  slug          : "abu-dhabi-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Abu Dhabi Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Fruity", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Amber",
  season        : "Year-Round",
  notes: {
    top:   [
      "Bergamot Oil",
      "Orange Oil Brazil",
      "Pink Peppercorn",
      "Cardamom",
      "Ginger",
      "Olibanum",
      "Safraleine",
    ],
    heart: [
      "Date Accord",
      "Plum Accord",
      "Davana Oil",
      "Carrot Seed",
      "Orange Flower Absolute",
      "Mahonial",
    ],
    base:  [
      "Vetiver des Sables",
      "Vetiver Oil Haiti",
      "Vetiver Oil Indonesia",
      "Patchouli",
      "Cistus Absolute",
      "Hydrocarboresine",
      "Fir Balsam Absolute",
      "Vanillin",
      "Ambrofix",
      "AmbreXolide",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Rich Fruity Amber",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Rich",
    "Warm",
    "Sophisticated",
    "Earthy",
    "Magnetic",
    "Luxury",
  ],
  occasions     : ["Daily Wear", "Office", "Evening", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Spiced Amber Luxury", "Fruity Unisex Signature", "Warm Depth with Brightness"],
  recommendedFor: [
    "Anyone seeking a year-round signature that balances warmth, spice, and fruit without gender constraint",
    "Those who love amber and vetiver but want fruity brightness to prevent heaviness",
    "Fragrance collectors building a luxury unisex wardrobe with distinctive Middle Eastern character",
    "Men and women drawn to date and plum accords who prefer earthy, grounded base notes",
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
  subtitle      : "Spiced Amber Luxury",
  description   : "Citrus and spice ignite against a warm date and plum heart, while vetiver and patchouli anchor the composition in earthy depth. Olibanum and cardamom weave through the opening, creating a restless energy that settles into amber and vanilla. Rich, complex, unapologetically opulent.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "fruity",
    "amber",
    "unisex",
    "bergamot",
    "vetiver",
    "patchouli",
    "date",
    "plum",
    "rich",
    "full-bodied",
    "daily-wear",
    "year-round",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-mood-inspired", "baccarat-rouge-540-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
