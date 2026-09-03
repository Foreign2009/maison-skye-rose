import type { FragranceKnowledge } from "../types";

export const arabiansTonkaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "arabians-tonka-inspired",
  slug          : "arabians-tonka-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Arabians Tonka Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Amber", "Oud"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oud Amber",
  season        : "Winter",
  notes: {
    top:   ["Tonka Bean", "Cardamom", "Black Pepper"],
    heart: ["Oud", "Rose Absolute", "Amber Resin"],
    base:  ["Vanilla Bourbon", "Sandalwood", "Musk Ambroxan"],
  },
  mood          : "Dark and powerful.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Powerful",
    "Mysterious",
    "Warm",
    "Intense",
    "Sophisticated",
    "Sensual",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Middle Eastern Luxury", "Dark Amber Ritual", "Spiced Oriental"],
  recommendedFor: [
    "Men who want a dark, ritualistic fragrance that commands attention in evening and intimate settings.",
    "Those seeking authentic oud depth without compromising on wearability or modern appeal.",
    "Anyone drawn to warm spice, vanilla, and amber who craves intensity over freshness.",
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
  subtitle      : "Dark Amber Ritual",
  description   : "Black pepper and tonka bean ignite against deep oud and rose absolute, building into a dark amber resin that unfolds like aged leather and incense. Vanilla bourbon and sandalwood anchor the base with a sensual warmth that lingers on skin, unapologetic and hypnotic.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "oud-the-worlds-most-complex-ingredient",
    "evening-and-date-night-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "amber",
    "tonka-bean",
    "oriental",
    "spicy",
    "warm",
    "vanilla",
    "sandalwood",
    "date-night",
    "winter",
    "layering",
    "masculine",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-wood-inspired", "naxos-inspired", "angels-share-paradis-inspired", "oud-bergamot-inspired", "armani-prive-oud-royal-inspired", "oud-cadenza-inspired", "myrrh-tonka-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
