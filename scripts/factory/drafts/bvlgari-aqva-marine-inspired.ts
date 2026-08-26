// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bvlgari-aqva-marine-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:06:13.834Z
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

export const bvlgariAqvaMarineInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bvlgari-aqva-marine-inspired",
  slug          : "bvlgari-aqva-marine-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bvlgari Aqva Marine Inspired",
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
    top:   ["Grapefruit", "Neroli", "Mandarin Orange", "Petitgrain"],
    heart: ["Water Notes", "Seaweed", "Rosemary"],
    base:  ["Virginia Cedar", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Marine Aquatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Clean",
    "Modern",
    "Coastal",
    "Crisp",
  ],
  occasions     : ["Daily Wear", "Casual", "Weekend", "Travel"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Marine Aquatic", "Citrus Freshness", "Coastal Escape"],
  recommendedFor: [
    "Men seeking a crisp, salt-tinged marine fragrance for warm-weather travel and vacation wear",
    "Those who love fresh citrus and aquatic clarity without sweetness or heavy projection",
    "Anyone wanting a modern coastal escape in a bottle—perfect for beach days and casual summer outings",
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
  subtitle      : "Salt and Citrus",
  description   : "Citrus and neroli open onto a salty marine accord, where seaweed and rosemary meet cool water notes in a moment of crystalline clarity. Virginia cedar emerges beneath, grounding the aquatic freshness with subtle woody warmth and amber's soft glow.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style", "the-note-pyramid"],
  educationTags : [
    "aquatic",
    "aromatic",
    "citrus",
    "grapefruit",
    "neroli",
    "fresh",
    "light",
    "summer",
    "daily-wear",
    "vacation",
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
    alternatives:     ["aqua-di-gio-inspired", "invictus-inspired", "bvlgari-aqua-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
