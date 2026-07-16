import type { FragranceKnowledge } from "../types";

export const goodGirlInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "good-girl-inspired",
  slug          : "good-girl-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Good Girl Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Amber", "Sweet"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Sweet Amber",
  season        : "Winter",
  notes: {
    top:   ["Bergamot", "Pink Pepper", "Tonka Bean"],
    heart: ["Cocoa Absolute", "Tuberose Absolute", "Almond Milk"],
    base:  ["Jasmine Sambac", "Vanilla Bourbon", "Amber Resin"],
  },
  mood          : "Bold feminine energy with addictive sweetness.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Feminine",
    "Sensual",
    "Sophisticated",
    "Warm",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Formal"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Velvet Audacity", "Bold Gourmand", "Luxe Nocturne"],
  recommendedFor: [
    "Women who want a signature scent that feels luxurious, sensual, and unapologetically bold for evening occasions",
    "Those seeking rich sweetness with depth — cocoa, vanilla, and jasmine layered for lasting impact and intrigue",
    "Anyone drawn to amber and tonka's honeyed warmth who prefers creamy gourmand over fruity or fresh",
    "Women pairing this with darker eveningwear or layering it as a confident statement for date night or winter social events",
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
  newArrival    : true,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Velvet Audacity",
  description   : "Pink pepper and bergamot ignite with tonka bean's honeyed warmth, giving way to a cocoa-dusted heart of tuberose and almond milk that feels both creamy and carnivorous. Jasmine sambac and vanilla bourbon settle into amber resin, building a fragrance of confident sweetness—the kind that lingers on skin like a second heartbeat.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber",
    "sweet",
    "vanilla",
    "tonka",
    "tuberose",
    "jasmine",
    "cocoa",
    "feminine",
    "bold",
    "winter",
    "date-night",
    "long-wearing",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["ultra-male-inspired", "stronger-with-you-intensely-inspired"],
    wardrobePartners: ["bleu-de-chanel-inspired"],
  },
};
