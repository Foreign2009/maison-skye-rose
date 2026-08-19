// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — eros-energy-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:02:40.078Z
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

export const erosEnergyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "eros-energy-inspired",
  slug          : "eros-energy-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Eros Energy Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Citrus"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Citrus Aromatic",
  season        : "Summer",
  notes: {
    top:   [
      "Bergamot",
      "Blood Orange",
      "Lime",
      "Mandarin Orange",
      "Grapefruit",
      "Lemon",
    ],
    heart: ["White Amber", "Black Currant", "Pink Pepper"],
    base:  ["Patchouli", "Musk", "Oakmoss"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Energetic Citrus",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Energetic",
    "Bright",
    "Confident",
    "Modern",
  ],
  occasions     : ["Daily Wear", "Casual", "Weekend", "Travel"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Citrus Velocity", "Fresh Aromatic", "Summer Signature"],
  recommendedFor: [
    "Men seeking a bright, energetic citrus for summer days and casual weekend activities",
    "Those who want immediate freshness with a subtle spicy edge — clean but not boring",
    "Anyone looking for a fresh signature that carries with easy brightness for daily wear without demanding attention",
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
  subtitle      : "Citrus Velocity",
  description   : "Blood orange and bergamot collide with a sharp edge of grapefruit, creating an immediate sense of vitality and motion. Pink pepper adds a subtle bite to the heart, while patchouli and musk anchor the composition with quiet depth, preventing the brightness from ever turning shrill.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "citrus",
    "aromatic",
    "bergamot",
    "fresh",
    "light",
    "summer",
    "daily-wear",
    "masculine",
    "energetic",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],

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
    alternatives:     ["sauvage-inspired", "bleu-de-chanel-inspired", "aqua-di-gio-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
