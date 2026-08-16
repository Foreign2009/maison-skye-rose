// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — h24-herbes-vives-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:09:20.186Z
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const h24HerbesVivesInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "h24-herbes-vives-inspired",
  slug          : "h24-herbes-vives-inspired",
  brand         : "Maison Skye & Rose",
  name          : "H24 Herbes Vives Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Fresh",
  season        : "Summer",
  notes: {
    top:   ["Herbal Notes"],
    heart: ["Pear"],
    base:  ["Physcool®"],
  },
  mood          : "Fresh Herbal Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Bright",
    "Herbal",
    "Crisp",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Casual",
    "Travel",
    "Weekend",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Herbal Freshness", "Summer Clarity", "Everyday Aromatic"],
  recommendedFor: [
    "Men seeking a fresh herbal signature for warm weather that feels natural and unforced",
    "Those who prefer green aromatic clarity over sweet or woody depth",
    "Anyone looking for a lightweight daily fragrance that works equally well at the office or on vacation",
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
  subtitle      : "Living Herbs",
  description   : "Green herbs open with crystalline clarity, their bright, almost medicinal edge softened by a whisper of ripe pear. The composition settles into a cool, clean base that feels like air itself—skin-close and luminous, with the freshness of crushed herbs held between cool palms.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "fresh",
    "herbal",
    "pear",
    "light",
    "summer",
    "daily-wear",
    "vacation",
    "crisp",
    "citrus-adjacent",
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
    alternatives:     ["y-inspired", "aqua-di-gio-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
