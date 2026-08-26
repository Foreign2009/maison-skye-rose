// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dylan-blue-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:05:14.348Z
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

export const dylanBlueInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dylan-blue-inspired",
  slug          : "dylan-blue-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Dylan Blue Inspired",
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
    top:   ["Water Notes", "Fig Leaves", "Bergamot", "Grapefruit"],
    heart: [
      "Violet Leaves",
      "Patchouli",
      "Papyrus",
      "Black Pepper",
      "Ambroxan",
    ],
    base:  ["Musk", "Saffron", "Incense", "Tonka Bean"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aquatic Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Clean",
    "Modern",
    "Confident",
  ],
  occasions     : [
    "Daily Wear",
    "Casual",
    "Office",
    "Weekend",
    "Travel",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Aquatic Freshness", "Crisp Green Citrus", "Summer Everyday"],
  recommendedFor: [
    "Men seeking a fresh aquatic signature that feels natural and effortless for everyday wear and warm-weather travel",
    "Those who want crisp citrus and green notes without sweetness or heavy base accords",
    "Anyone looking for a moderate projection fragrance that works equally well in casual, professional, and resort settings",
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
  subtitle      : "Aquatic Freshness",
  description   : "Opens with the green snap of fig leaves and citrus, a cool aquatic breeze that feels both crisp and slightly saline. Violet leaves emerge into a peppery heart anchored by papyrus and subtle incense, lending an aromatic depth that keeps the fragrance from feeling purely fresh. Musk and tonka settle into a warm, barely-sweet base that lingers with quiet sophistication.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "aquatic",
    "fresh",
    "citrus",
    "bergamot",
    "violet",
    "summer",
    "daily-wear",
    "light",
    "aquatic-aromatic",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-layer-fragrances"],

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
