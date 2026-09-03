import type { FragranceKnowledge } from "../types";

export const alienInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "alien-inspired",
  slug          : "alien-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Alien Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["White Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "White Floral",
  season        : "Winter",
  notes: {
    top:   ["Bergamot", "Jasmine Sambac", "Pink Pepper"],
    heart: ["Amber", "Tuberose Absolute", "Vanilla Orchid"],
    base:  ["Cashmere Wood", "Musk", "Oud"],
  },
  mood          : "Bold and magnetic.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Magnetic",
    "Elegant",
    "Sensual",
    "Sophisticated",
    "Mysterious",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Mystical Femininity", "Bold White Floral", "Magnetic Evening Statement"],
  recommendedFor: [
    "Women seeking a bold white floral signature that commands attention without apology",
    "Those drawn to creamy, intoxicating tuberose and amber for evening and special occasions",
    "Anyone wanting a winter fragrance with magnetic depth — warm woods and musk beneath luminous florals",
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
  subtitle      : "Magnetic Elegance",
  description   : "Bergamot and jasmine sambac ignite with a whisper of pink pepper, then surrender to the creamy intensity of tuberose absolute and amber. Cashmere wood and oud ground the composition in warmth, creating a fragrance that commands the room without asking permission.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "white-floral",
    "tuberose",
    "amber",
    "jasmine",
    "winter",
    "signature",
    "bold",
    "date-night",
    "oud",
    "sophisticated",
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
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired", "bloom-inspired", "ange-ou-demon-inspired", "dolce-inspired"],
    wardrobePartners: ["coach-floral-inspired", "light-blue-inspired", "mon-guerlain-inspired", "twilly-d'hermes-inspired", "black-opium-over-red-inspired", "black-orchid-inspired", "angels-share-paradis-inspired", "la-nuit-tresor-inspired", "gucci-bamboo-inspired", "eden-sparkling-lychee-inspired", "my-way-nectar-inspired", "gabrielle-inspired", "angel-inspired"],
  },
};
