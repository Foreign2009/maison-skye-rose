// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — oriana-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:13:01.178Z
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

export const orianaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "oriana-inspired",
  slug          : "oriana-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Oriana Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Floral", "Fruity"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity Gourmand",
  season        : "Spring",
  notes: {
    top:   ["Mandarin Orange", "Bergamot", "Grapefruit"],
    heart: ["Orange Blossom", "Blackcurrant", "Raspberry"],
    base:  ["Marshmallow", "Ambrette", "Chantilly Cream", "Musk"],
  },
  mood          : "Sweet Fruity Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Soft",
    "Sweet",
    "Bright",
    "Romantic",
    "Delicate",
  ],
  occasions     : [
    "Daily Wear",
    "Wedding",
    "Weekend",
    "Casual",
    "Date Night",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Soft Gourmand Floral", "Spring Sweetness", "Feminine Elegance"],
  recommendedFor: [
    "Women seeking a soft, sweet signature fragrance that feels like a gentle hug—effortlessly wearable and intimately warm.",
    "Those who love fruity florals with gourmand comfort but want brightness and airiness rather than density or intensity.",
    "Anyone looking for a fragrance equally at home at a spring wedding, casual weekend, or everyday moment—effortlessly feminine without trying.",
    "Fragrance layerers who want a creamy, marshmallow-forward base that plays beautifully with lighter florals and other gourmands.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Soft Sweetness",
  description   : "Mandarin and bergamot open onto a heart of orange blossom and blackcurrant—bright, almost candied, with a soft fuzzy edge. Marshmallow and creamy musk settle into skin like a whisper of vanilla-tinged warmth, creating something both playful and intimate.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "gourmand",
    "floral",
    "fruity",
    "orange-blossom",
    "marshmallow",
    "feminine",
    "spring",
    "layering",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "burberry-her-inspired", "mon-paris-inspired", "scandal-inspired", "la-nuit-tresor-inspired", "torino24-inspired"],
    wardrobePartners: ["blanche-bete-inspired", "love-don't-be-shy-inspired"],
  },
};
