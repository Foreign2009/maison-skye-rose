// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dior-homme-sport-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:11:11.424Z
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

export const diorHommeSportInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dior-homme-sport-inspired",
  slug          : "dior-homme-sport-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Dior Homme Sport Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Fresh", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Fresh",
  season        : "Summer",
  notes: {
    top:   ["Lemon", "Bergamot", "Aldehydes"],
    heart: ["Elemi", "Pink Pepper"],
    base:  ["Woody Notes", "Amber", "Olibanum"],
  },
  mood          : "Fresh Clean Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Clean",
    "Fresh",
    "Masculine",
    "Sophisticated",
    "Bright",
    "Precise",
  ],
  occasions     : ["Daily Wear", "Office", "Casual", "Weekend"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Crisp Woody Fresh", "Minimalist Masculine", "Aldehyde Restraint"],
  recommendedFor: [
    "Men seeking a crisp, restrained fresh fragrance for summer daily wear that prioritizes clarity over sweetness",
    "Those who appreciate surgical precision in fragrance—clean citrus with architectural woody restraint",
    "Active men who want a moderate projection fragrance that works equally well in office and casual summer settings",
    "Fragrance enthusiasts drawn to resinous woody bases and aldehydic brightness rather than gourmand or aquatic registers",
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
  subtitle      : "Crisp Restraint",
  description   : "Bright citrus and aldehydes cut through with surgical precision, giving way to a whisper of pink pepper and resinous elemi. The woody base—anchored in amber and olibanum—refuses sentimentality; clean, austere, uncompromising.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fresh",
    "woody",
    "citrus",
    "lemon",
    "bergamot",
    "clean",
    "summer",
    "daily-wear",
    "moderate-projection",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],

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
    alternatives:     ["aqua-di-gio-inspired", "bleu-de-chanel-inspired", "imagination-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
