// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bois-pacifique-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:51:10.890Z
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

export const boisPacifiqueInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bois-pacifique-inspired",
  slug          : "bois-pacifique-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bois Pacifique Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody", "Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Turmeric", "Cardamom"],
    heart: ["Akigalawood", "Olibanum", "Orris"],
    base:  ["Sandalwood", "Cedar", "Oakwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Woody Spicy",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Spicy",
    "Creamy",
    "Resinous",
    "Mature",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Woody Spice", "Sophisticated Aromatic", "Autumn Icon"],
  recommendedFor: [
    "Men seeking a warm, spiced woody fragrance that feels sophisticated without being formal or intimidating",
    "Those who love aromatic spices and creamy woods and want a signature for cooler months and evening wear",
    "Anyone building a collection who appreciates depth and complexity — this bridges fresh and full-bodied registers",
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
  subtitle      : "Warm Woody Spice",
  description   : "Turmeric and cardamom ignite a warm spice that settles into creamy sandalwood and cedar. Akigalawood and olibanum anchor the heart with resinous depth, while orris adds a whispered iris softness that keeps the woody base from reading too austere. This is fragrance for the season when warmth becomes a texture.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "spicy",
    "sandalwood",
    "cedar",
    "turmeric",
    "cardamom",
    "aromatic",
    "autumn",
    "office",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "sauvage-elixir-inspired", "oud-for-greatness-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
