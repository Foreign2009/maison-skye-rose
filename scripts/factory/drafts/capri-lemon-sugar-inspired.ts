// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — capri-lemon-sugar-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-13T12:45:14.116Z
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

export const capriLemonSugarInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "capri-lemon-sugar-inspired",
  slug          : "capri-lemon-sugar-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Capri Lemon Sugar Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Gourmand", "Citrus"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Citrus Gourmand",
  season        : "Summer",
  notes: {
    top:   ["Lemon", "Mandarin Orange", "Bergamot"],
    heart: ["Freesia", "Raspberry", "Peach"],
    base:  ["Brown Sugar", "Vanilla", "Musk", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Bright Playful Sweet",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Playful",
    "Bright",
    "Sweet",
    "Fresh",
    "Youthful",
    "Warm",
  ],
  occasions     : [
    "Daily Wear",
    "Vacation",
    "Summer Days",
    "Casual",
    "Weekend",
  ],
  seasons       : ["Summer"],
  signatureStyle: ["Citrus Gourmand Brightness", "Fresh Fruit Sweetness", "Summer Luminosity"],
  recommendedFor: [
    "Anyone seeking a bright, wearable fragrance that tastes as good as it smells—perfect for warm weather and carefree moments.",
    "Women and men who love citrus but want sweetness without heaviness, ideal for daily wear and weekend adventures.",
    "Those drawn to playful gourmands who appreciate lemon and peach as much as vanilla and brown sugar.",
    "Fragrance collectors building a summer rotation who value freshness with a soft, approachable sweetness.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/elite-5ml.png",
    "10ml": "/images/elite-10ml.png",
    "30ml": "/images/glass-elite-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Citrus Gourmand Brightness",
  description   : "Bright citrus opens with lemon and mandarin, then softens into peach and raspberry—a fruit-forward heart that feels both luminous and tactile. Brown sugar and vanilla settle the composition into something warm and gently sweet, without saccharine weight.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "citrus",
    "gourmand",
    "lemon",
    "bergamot",
    "vanilla",
    "brown-sugar",
    "fresh",
    "light",
    "summer",
    "playful",
    "unisex",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["burberry-her-inspired", "oriana-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
