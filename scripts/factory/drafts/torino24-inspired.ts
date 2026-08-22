// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — torino24-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T19:22:41.326Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.2.0-narrative  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
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

export const torino24Inspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "torino24-inspired",
  slug          : "torino24-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Torino24 Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Gourmand", "Fruity"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Gourmand",
  season        : "Year-Round",
  notes: {
    top:   [],
    heart: [],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Fruity Gourmand",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Sensual",
    "Generous",
    "Refined",
  ],
  occasions     : ["Daily Wear", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Fruity Gourmand Luxury", "Velvet Everyday Indulgence"],
  recommendedFor: [
    "Anyone seeking a luxurious everyday fragrance that feels indulgent without demanding an occasion",
    "Women and men who love gourmand scents with fruity character and want a year-round signature",
    "Those drawn to refined sweetness that projects warmth and generosity rather than playfulness",
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
  subtitle      : "Velvet Indulgence",
  description   : "A fragrance that captures the warmth of indulgence without apology—fruity and sumptuous, it settles into skin like a private luxury. There is generosity in its character, an ease that feels both refined and deeply sensual.",
  academyArticleIds: ["guide-to-fragrance-families", "what-makes-a-signature-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "fragrance-fundamentals"],
  educationTags : [
    "gourmand",
    "fruity",
    "rich",
    "full-bodied",
    "unisex",
    "daily-wear",
    "year-round",
    "sweet",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "what-makes-a-signature-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["burberry-her-inspired", "oriana-inspired", "scandal-inspired"],
  },
};
