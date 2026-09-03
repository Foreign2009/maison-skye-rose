// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — ck-everyone-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:25:02.901Z
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

import type { FragranceKnowledge } from "../types";

export const ckEveryoneInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ck-everyone-inspired",
  slug          : "ck-everyone-inspired",
  brand         : "Maison Skye & Rose",
  name          : "CK Everyone Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Fresh", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fresh Woody",
  season        : "Spring",
  notes: {
    top:   ["Orange", "Bergamot", "Cedar Leaf"],
    heart: ["Iris", "Cotton", "White Musk"],
    base:  ["Sandalwood", "Ambrette Seeds", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Clean Fresh Unisex",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Clean",
    "Fresh",
    "Modern",
    "Elegant",
    "Intimate",
    "Soft",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Clean Unisex Minimalism", "Luminous Transparency", "Skin Scent Fresh"],
  recommendedFor: [
    "Anyone seeking a clean, barely-there fragrance that feels like a second skin rather than a statement.",
    "Those who appreciate unisex freshness with iris and sandalwood depth—neither sweet nor heavy.",
    "Women and men wanting a luminous everyday fragrance that works across seasons and social settings.",
    "Fragrance minimalists who prioritize transparency and skin-scent intimacy over projection or drama.",
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
  subtitle      : "Luminous Transparency",
  description   : "Orange and bergamot open with bright clarity, then settle into a heart of iris and cotton that feels like skin itself—clean, intimate, almost transparent. Sandalwood and musk ground the composition in soft warmth, creating a fragrance that whispers rather than declares.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fresh",
    "woody",
    "unisex",
    "clean",
    "citrus",
    "sandalwood",
    "iris",
    "musk",
    "daily-wear",
    "spring",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["aqua-di-gio-inspired", "y-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
