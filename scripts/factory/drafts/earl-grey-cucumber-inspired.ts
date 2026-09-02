// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — earl-grey-cucumber-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:24:32.994Z
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

export const earlGreyCucumberInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "earl-grey-cucumber-inspired",
  slug          : "earl-grey-cucumber-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Earl Grey Cucumber Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Aromatic"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Tea Aromatic",
  season        : "Spring",
  notes: {
    top:   [],
    heart: [
      "Earl Grey Tea",
      "Bergamot",
      "Cucumber",
      "Beeswax",
      "Musk",
      "Vanilla",
    ],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Tea Citrus",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Sophisticated",
    "Calm",
    "Bright",
    "Elegant",
    "Clean",
  ],
  occasions     : ["Daily Wear", "Office", "Wedding", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Tea Aromatic Elegance", "Fresh Citrus Signature", "Balanced Unisex Daily"],
  recommendedFor: [
    "Anyone seeking a refined daily signature that feels like afternoon tea in a garden—fresh, calming, and effortlessly sophisticated.",
    "Those who love aromatic tea fragrances and want bergamot brightness tempered by cool cucumber and honeyed vanilla.",
    "Fragrance collectors building a balanced unisex wardrobe who appreciate Jo Malone–inspired simplicity with depth.",
    "People drawn to fresh, moderate projection fragrances that work in professional settings and intimate occasions alike.",
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
  subtitle      : "Afternoon Clarity",
  description   : "A bracing tea accord meets cool cucumber in a fragrance that opens like afternoon light through garden leaves. Bergamot and earl grey meld into a softly honeyed heart, grounded by a whisper of vanilla and musk that refuses to fade into sweetness.",
  academyArticleIds: ["guide-to-fragrance-families", "what-makes-a-signature-scent", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "fragrance-fundamentals", "wear-and-application"],
  educationTags : [
    "aromatic",
    "tea",
    "bergamot",
    "cucumber",
    "unisex",
    "signature-scent",
    "balanced",
    "daily-wear",
    "wedding",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["gris-charnel-inspired"],
    wardrobePartners: ["layton-inspired"],
  },
};
