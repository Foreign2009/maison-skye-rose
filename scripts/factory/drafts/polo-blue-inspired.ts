// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — polo-blue-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:05:25.805Z
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

export const poloBlueInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "polo-blue-inspired",
  slug          : "polo-blue-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Polo Blue Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aquatic", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aquatic Fresh",
  season        : "Summer",
  notes: {
    top:   ["Cantaloupe Melon Accord", "Cucumber Accord", "Watery Melon Accord", "Bergamot Oil"],
    heart: ["Aquatic Accord", "Clary Sage Oil", "Geranium Oil", "Basil Verbena Oil"],
    base:  ["Washed Suede Accord", "Patchouli Heart", "Sheer Musk Accord"],
  },
  notesEvidenceLocked: true,
  mood          : "Crisp Aquatic Fresh",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Crisp",
    "Clean",
    "Luminous",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Office", "Casual", "Vacation"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Aquatic Freshness", "Summer Clarity", "Effortless Light"],
  recommendedFor: [
    "Men seeking a crisp, refreshing daily fragrance that feels like cool water and fresh air on warm days",
    "Those who prefer light aquatic freshness over heavy or spicy fragrances and want easy, confident wearability",
    "Anyone looking for a signature summer scent that works equally well at the office, outdoors, or on vacation",
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
  subtitle      : "Aquatic Clarity",
  description   : "Crisp cantaloupe and cucumber open onto a luminous aquatic heart where sage and geranium drift like cool air across water. Washed suede and sheer musk anchor the composition, leaving a whisper of herbaceous green that feels both transparent and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aquatic",
    "fresh",
    "melon",
    "bergamot",
    "citrus",
    "summer",
    "light",
    "daily-wear",
    "masculine",
    "versatile",
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
    alternatives:     ["aqua-di-gio-inspired", "invictus-inspired", "hawas-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
