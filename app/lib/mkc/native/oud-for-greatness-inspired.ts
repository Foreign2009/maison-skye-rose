import type { FragranceKnowledge } from "../types";

export const oudForGreatnessInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "oud-for-greatness-inspired",
  slug          : "oud-for-greatness-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Oud For Greatness Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Spicy", "Oud"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oud Spicy",
  season        : "Winter",
  notes: {
    top:   ["Black Cardamom", "Bergamot"],
    heart: ["Saffron", "Oud Absolute"],
    base:  ["Ambroxan", "Oud Wood", "Musk"],
  },
  mood          : "Bold and luxurious.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Powerful",
    "Intense",
    "Luxurious",
    "Magnetic",
    "Mysterious",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Power & Prestige", "Oud Intensity", "Luxe Spice"],
  recommendedFor: [
    "Men who want a bold, unapologetic statement fragrance that announces their presence without compromise",
    "Those seeking a winter signature with depth and complexity — one that evolves from sharp brightness to resinous intensity",
    "Anyone drawn to oud and spice who refuses to soften their edges for anyone",
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
  subtitle      : "Unapologetic Depth",
  description   : "Black cardamom and bergamot ignite with a sharp, almost aggressive brightness before saffron and oud absolute settle into a deep, resinous heart that commands attention. Ambroxan and oud wood create a base of sustained power—animalic, grounding, unapologetically luxurious.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oud",
    "spicy",
    "cardamom",
    "saffron",
    "woody",
    "amber",
    "intense",
    "winter",
    "date-night",
    "bold",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-wood-inspired", "sauvage-elixir-inspired"],
    wardrobePartners: ["aventus-inspired"],
  },
};
