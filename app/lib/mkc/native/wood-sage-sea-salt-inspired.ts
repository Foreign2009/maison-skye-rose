// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — wood-sage-sea-salt-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:09:57.491Z
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

export const woodSageSeaSaltInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "wood-sage-sea-salt-inspired",
  slug          : "wood-sage-sea-salt-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Wood Sage Sea Salt Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Fresh", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Fresh",
  season        : "Summer",
  notes: {
    top:   ["Ambrette Seeds"],
    heart: ["Sea Salt"],
    base:  ["Sage"],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Clean Marine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Clean",
    "Fresh",
    "Bright",
    "Mineral",
    "Sophisticated",
    "Airy",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Coastal Minimalism", "Fresh Herbaceous", "Unisex Maritime"],
  recommendedFor: [
    "Anyone seeking a crisp, mineral-fresh fragrance that evokes coastal walks and sun-warmed linen without sweetness or weight",
    "Women and men who want a clean everyday signature that layers beautifully with minimalist or luxury wardrobes",
    "Travelers and those who love seasonal fragrances that capture the essence of summer air and salty, sun-dried textures",
    "Fragrance enthusiasts building a collection who appreciate the interplay of herbal sage, mineral sea salt, and warm spiced clarity",
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
  subtitle      : "Coastal Clarity",
  description   : "Ambrette seeds open with a warm, slightly spiced clarity before sea salt crystallizes the middle—a mineral freshness that recalls sun-dried linen and coastal air. Sage grounds the composition with a gentle herbal whisper, creating a fragrance that feels clean without chill, sophisticated without formality.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "fresh",
    "woody",
    "sea-salt",
    "sage",
    "unisex",
    "summer",
    "clean",
    "light",
    "daily-wear",
    "vacation",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["creed-green-irish-tweed-inspired", "acqua-di-gio-profondo-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
