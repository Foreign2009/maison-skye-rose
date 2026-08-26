// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bvlgari-aqua-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:10:33.730Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: PASS  [0 error(s), 0 warning(s)]
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

import type { FragranceKnowledge } from "../types";

export const bvlgariAquaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bvlgari-aqua-inspired",
  slug          : "bvlgari-aqua-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bvlgari Aqua Inspired",
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
    top:   ["Mandarin Orange", "Orange", "Petitgrain"],
    heart: ["Seaweed", "Lavender", "Cotton Flower"],
    base:  [
      "Virginia Cedar",
      "Woodsy Notes",
      "Patchouli",
      "Clary Sage",
      "Amber",
    ],
  },
  mood          : "Fresh Aquatic Clean",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Bright",
    "Sophisticated",
    "Ozonic",
  ],
  occasions     : ["Daily Wear", "Casual", "Vacation", "Weekend"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Sea-Kissed Freshness", "Aromatic Aquatic", "Clean Casual"],
  recommendedFor: [
    "Men seeking a fresh aquatic signature that feels natural and seaside-inspired rather than synthetic or fruity",
    "Those who want a moderately projecting daily fragrance for warm weather suited to office and casual settings",
    "Anyone looking for a clean, textile-like freshness with subtle woody depth—perfect for vacation or weekend casual wear",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Sea-Kissed Clarity",
  description   : "Mandarin and petitgrain open with bright citrus clarity, then drift into a surprisingly aquatic heart—seaweed and cotton flower create an ozonic, almost textile quality that feels clean without artifice. Virginia cedar and clary sage ground the composition with subtle woodsy warmth, leaving skin smelling like salt-touched linen dried in summer air.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aquatic",
    "aromatic",
    "citrus",
    "mandarin",
    "seaweed",
    "lavender",
    "cedar",
    "fresh",
    "clean",
    "summer",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent"],

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
    alternatives:     ["aqua-di-gio-inspired", "invictus-inspired", "hawas-inspired", "bvlgari-aqva-marine-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
