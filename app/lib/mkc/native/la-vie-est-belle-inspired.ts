import type { FragranceKnowledge } from "../types";

export const laVieEstBelleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "la-vie-est-belle-inspired",
  slug          : "la-vie-est-belle-inspired",
  brand         : "Maison Skye & Rose",
  name          : "La Vie Est Belle Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Sweet"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Sweet Floral",
  season        : "Winter",
  notes: {
    top:   ["Pear", "Bergamot", "Pink Pepper"],
    heart: ["Iris", "Rose Absolute", "Almond"],
    base:  ["Vanilla", "Amber", "Musk"],
  },
  mood          : "Elegant sweet femininity.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Soft",
    "Warm",
    "Romantic",
    "Luminous",
    "Sophisticated",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Elegant Sweet Femininity", "Radiant Softness", "Winter Romance"],
  recommendedFor: [
    "Women seeking an elegant, comforting signature that bridges sweetness and sophistication for winter evenings and special occasions",
    "Those who love rose and vanilla but want luminous floral depth rather than pure gourmand sweetness",
    "Anyone looking for a rich fragrance that feels intimate and powdered—intimate enough for close encounters, radiant enough for formal events",
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
  subtitle      : "Radiant Softness",
  description   : "Pear and pink pepper open with crystalline brightness, giving way to a luminous heart of rose absolute and iris—soft, powdered, intimate. Vanilla and amber settle into skin like a second layer, warm and subtly sweet, exhaling musk that lingers without excess.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "gourmand-fragrances-guide",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "sweet",
    "rose",
    "vanilla",
    "amber",
    "iris",
    "winter",
    "date-night",
    "elegant",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "hypnotic-poison-inspired", "bianco-latte-inspired", "devotion-inspired", "mon-guerlain-inspired", "lady-million-inspired", "la-belle-inspired"],
    wardrobePartners: ["ultra-male-inspired", "layton-inspired", "fresh-blossom-inspired"],
  },
};
