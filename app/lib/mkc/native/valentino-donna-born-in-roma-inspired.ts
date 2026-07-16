import type { FragranceKnowledge } from "../types";

export const valentinoDonnaBornInRomaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "valentino-donna-born-in-roma-inspired",
  slug          : "valentino-donna-born-in-roma-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Valentino Donna Born In Roma Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Floral",
  season        : "All Season",
  notes: {
    top:   ["Blackcurrant", "Bergamot", "Pink Pepper"],
    heart: ["Jasmine Absolute", "Tuberose", "Amber Accord"],
    base:  ["Vanilla Bourbon", "Sandalwood", "Musk"],
  },
  mood          : "Elegant and bold.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Bold",
    "Sophisticated",
    "Sensual",
    "Magnetic",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Office", "Evening", "Date Night"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Modern Couture", "Velvet Intensity", "Sophisticated Power"],
  recommendedFor: [
    "Women seeking a signature fragrance that commands attention in the office and beyond with effortless sophistication.",
    "Those who want creamy floral depth with amber warmth — not airy or delicate, but rich and unapologetically present.",
    "Anyone building a refined collection who values long-wearing elegance that evolves beautifully from morning to evening.",
    "Women drawn to the sensual comfort of vanilla and sandalwood wrapped in jasmine and tuberose intensity.",
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
  subtitle      : "Velvet Intensity",
  description   : "Blackcurrant and pink pepper ignite with a flash of bergamot, then yield to a creamy heart of jasmine and tuberose that blooms against warm amber. Vanilla bourbon and sandalwood settle into a sensual, powdered base—elegant and deliberately bold.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "amber-floral",
    "jasmine",
    "tuberose",
    "vanilla",
    "sandalwood",
    "bold",
    "long-wearing",
    "office-wear",
    "elegant",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired"],
    wardrobePartners: ["valentino-uomo-born-in-roma-inspired"],
  },
};
