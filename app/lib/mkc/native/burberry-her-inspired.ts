import type { FragranceKnowledge } from "../types";

export const burberryHerInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "burberry-her-inspired",
  slug          : "burberry-her-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Burberry Her Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Fruity"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Gourmand",
  season        : "Summer",
  notes: {
    top:   ["Strawberry", "Bergamot", "Pink Pepper"],
    heart: ["Raspberry", "Peony", "Almond Milk"],
    base:  ["Vanilla", "Musk", "Tonka Bean"],
  },
  mood          : "Sweet and youthful.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Playful",
    "Sweet",
    "Youthful",
    "Romantic",
    "Soft",
    "Warm",
  ],
  occasions     : ["Daily Wear", "Vacation", "Weekend", "Casual"],
  seasons       : ["Summer"],
  signatureStyle: ["Playful Luxury", "Modern Gourmand", "Velvet Sweetness"],
  recommendedFor: [
    "Women who love sweet, fruity scents that feel effortless and wearable every day",
    "Those seeking a signature summer fragrance that balances playfulness with understated elegance",
    "Anyone who wants gourmand comfort without heaviness — soft almond milk and vanilla on skin",
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
  subtitle      : "Velvet Sweetness",
  description   : "Strawberry and bergamot open with a whisper of pink pepper, catching light like summer skin. The heart softens into raspberry and peony, anchored by the creamy tenderness of almond milk, while vanilla and tonka bean create a warm, lingering sweetness that feels both indulgent and effortless.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "weekend-and-casual-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "fruity",
    "strawberry",
    "vanilla",
    "tonka-bean",
    "summer",
    "daily-wear",
    "sweet",
    "long-wearing",
    "feminine",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "gourmand-fragrances-guide",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
  },
};
