// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — leau-dissey-pour-homme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:00:35.161Z
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

export const leauDisseyPourHommeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "leau-dissey-pour-homme-inspired",
  slug          : "leau-dissey-pour-homme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Leau Dissey Pour Homme Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aquatic", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aquatic Floral",
  season        : "Summer",
  notes: {
    top:   [
      "Yuzu",
      "Lemon",
      "Bergamot",
      "Lemon Verbena",
      "Mandarin Orange",
      "Cypress",
      "Calone",
      "Coriander",
      "Sage",
      "Tarragon",
    ],
    heart: [
      "Blue Lotus",
      "Lily of the Valley",
      "Nutmeg",
      "Bourbon Geranium",
      "Saffron",
      "Ceylon Cinnamon",
      "Mignonette",
    ],
    base:  [
      "Tahitian Vetiver",
      "Musk",
      "Cedar",
      "Sandalwood",
      "Amber",
      "Tobacco",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Aquatic Clean",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Bright",
    "Elegant",
    "Sophisticated",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Casual",
    "Weekend",
    "Travel",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Aquatic Clarity", "Fresh Masculine Lightness", "Modern Aquatic"],
  recommendedFor: [
    "Men seeking a fresh aquatic fragrance appropriate for office, weekend, and casual occasions",
    "Those who want summer brightness without heaviness — citrus and aquatics that feel clean rather than sweet",
    "Anyone building a signature collection who values versatility and a presence that feels considered rather than demanding in professional settings",
    "Travel-focused men who need one fragrance that works across climates, dress codes, and social contexts",
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
  description   : "Yuzu and bergamot open with aquatic clarity, their citrus brightness cooled by calone and a whisper of cypress. Blue lotus and lily of the valley emerge at the heart, softening into vetiver and sandalwood that ground the composition in quiet, clean sophistication.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aquatic",
    "floral",
    "citrus",
    "yuzu",
    "bergamot",
    "fresh",
    "clean",
    "summer",
    "light",
    "daily-wear",
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
