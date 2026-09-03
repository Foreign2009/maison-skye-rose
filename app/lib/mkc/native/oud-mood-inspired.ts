import type { FragranceKnowledge } from "../types";

export const oudMoodInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "oud-mood-inspired",
  slug          : "oud-mood-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Oud Mood Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Amber", "Oud"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Oud",
  season        : "Winter",
  notes: {
    top:   ["Oud Distillate", "Black Cardamom"],
    heart: ["Amber Resin", "Labdanum"],
    base:  ["Caramel Absolute", "Sandalwood"],
  },
  mood          : "Deep sweet oud.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luxurious",
    "Sensual",
    "Warm",
    "Mysterious",
    "Sophisticated",
    "Intense",
  ],
  occasions     : ["Date Night", "Evening", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Arabian Luxury", "Honeyed Darkness", "Intimate Oud"],
  recommendedFor: [
    "Those seeking a deeply sensual, honeyed oud that transforms spice into warmth for intimate evening occasions.",
    "Fragrance collectors who appreciate traditional Arabian oud balanced with caramel sweetness and creamy sandalwood.",
    "Anyone drawn to amber and oud compositions who wants moderate projection with lasting, cozy depth rather than aggressive sillage.",
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
  subtitle      : "Honeyed Darkness",
  description   : "Oud distillate and black cardamom open with austere spice, then settle into a warm embrace of amber resin and labdanum. Caramel absolute and sandalwood deepen the base into something honeyed and intimate—a fragrance that wraps rather than announces.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "oriental-and-amber-fragrances",
    "oud-the-worlds-most-complex-ingredient",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oud",
    "amber",
    "cardamom",
    "sandalwood",
    "caramel",
    "labdanum",
    "deep",
    "intense",
    "winter",
    "unisex",
    "date-night",
    "woody-amber",
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
    alternatives:     ["oud-wood-inspired", "rose-oud-inspired", "velvet-rose-oud-inspired", "black-orchid-inspired", "gold-oud-inspired", "oud-sapparot-inspired", "abu-dhabi-inspired", "outlands-inspired", "armani-prive-oud-royal-inspired", "creed-delphinus-inspired", "oud-cadenza-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "arabians-musk-inspired", "carmina-inspired", "khamrah-inspired", "fig-lotus-flower-inspired", "centaurus-inspired", "dark-vanilla-inspired", "les-sables-roses-inspired"],
  },
};
