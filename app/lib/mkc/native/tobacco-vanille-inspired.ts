// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — tobacco-vanille-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:52:55.153Z
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

export const tobaccoVanilleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "tobacco-vanille-inspired",
  slug          : "tobacco-vanille-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Tobacco Vanille Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Spicy",
  season        : "Winter",
  notes: {
    top:   ["Tobacco Leaf", "Spicy Notes"],
    heart: ["Vanilla", "Cacao", "Tonka Bean", "Tobacco Blossom"],
    base:  ["Dried Fruits", "Woody Notes"],
  },
  mood          : "Sweet Warm Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Sophisticated",
    "Luxurious",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Warm Masculine Elegance", "Spiced Comfort Luxury"],
  recommendedFor: [
    "Men seeking a rich, sensual signature for evening occasions and cooler months.",
    "Those who appreciate warm spice and creamy sweetness over fresh or citrus-forward profiles.",
    "Anyone looking for a sophisticated fragrance that feels luxurious without being overly formal.",
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
  subtitle      : "Tobacco & Tonka",
  description   : "Tobacco leaf opens with a whisper of spice, immediately warming into a sensual embrace of vanilla and tonka bean. Cacao and dried fruit deepen the composition, while woody notes ground the sweetness into something rich, contemplative, and unmistakably masculine.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oriental-spicy",
    "tobacco",
    "vanilla",
    "tonka-bean",
    "cacao",
    "woody",
    "warm",
    "winter",
    "date-night",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "naxos-inspired", "side-effect-inspired", "angels-share-inspired", "amen-fantasm-inspired", "centaurus-inspired", "burberry-london-inspired", "bvlgari-black-inspired", "scandal-pour-homme-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired", "oud-for-greatness-inspired"],
  },
};
