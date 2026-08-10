import type { FragranceKnowledge } from "../types";

export const libreInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "libre-inspired",
  slug          : "libre-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Libre Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Amber",
  season        : "All Season",
  notes: {
    top:   ["Lavender", "Bergamot", "Pink Pepper"],
    heart: ["Orange Blossom", "Rose Absolute", "Jasmine Sambac"],
    base:  ["Vanilla", "Amber", "Musk"],
  },
  mood          : "Bold and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Bold",
    "Confident",
    "Magnetic",
    "Warm",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Office", "Evening", "Date Night"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Confident Luxury", "Modern Floral Amber", "Radiant Audacity"],
  recommendedFor: [
    "Women who want a signature fragrance that commands attention without apology, balancing floral beauty with amber warmth.",
    "Those seeking an all-season fragrance that works equally well in the office and at evening events, projecting quiet confidence.",
    "Anyone looking for a rich floral that evolves throughout the day without fading into the background.",
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
  subtitle      : "Radiant Audacity",
  description   : "Lavender and pink pepper ignite with brightness, then settle into a lush heart of rose absolute and orange blossom that blooms with quiet intensity. Vanilla and amber anchor the composition, creating a warm, skin-close base that feels both sensual and restrained.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "oriental-and-amber-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-amber",
    "rose",
    "orange-blossom",
    "jasmine",
    "vanilla",
    "amber",
    "musk",
    "sophisticated",
    "bold",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],

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
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
