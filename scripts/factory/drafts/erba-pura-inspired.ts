// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — erba-pura-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:28:16.686Z
// Factory version:   0.5.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
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

export const erbaPuraInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "erba-pura-inspired",
  slug          : "erba-pura-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Erba Pura Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Fruity", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Musk",
  season        : "Summer",
  notes: {
    top:   ["Sweet Orange", "Grapefruit"],
    heart: ["Lemon Verbena", "Peach Nectar"],
    base:  ["White Musk", "Ambroxan"],
  },
  mood          : "Bright and addictive.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bright",
    "Fresh",
    "Addictive",
    "Balanced",
    "Warm",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Casual", "Weekend", "Travel"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Bright Fruit Musk", "Luminous Signature", "Summer Gourmand"],
  recommendedFor: [
    "Men seeking a bright, fruity signature that feels fresh and wearable without being overtly sweet or heavy",
    "Those who love citrus and stone fruit but want skin-hugging musk depth rather than pure cologne spray",
    "Anyone looking for a summer staple that transitions seamlessly from daily wear to leisure travel",
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
  subtitle      : "Bright Skin Musk",
  description   : "Sweet orange and grapefruit open with luminous clarity, then dissolve into a heart of lemon verbena and peach that feels both crisp and gourmand. White musk and ambroxan anchor the composition, transforming bright fruit into a second skin—addictive, warm, utterly wearable.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "fruity",
    "musk",
    "citrus",
    "orange",
    "grapefruit",
    "peach",
    "lemon-verbena",
    "white-musk",
    "summer",
    "daily-wear",
    "balanced",
    "signature",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

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
    alternatives:     ["aventus-inspired", "hacivat-inspired", "god-of-fire-inspired"],
    wardrobePartners: ["sauvage-inspired", "aqua-di-gio-inspired"],
  },
};
