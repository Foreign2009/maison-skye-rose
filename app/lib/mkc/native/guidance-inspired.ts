import type { FragranceKnowledge } from "../types";

export const guidanceInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "guidance-inspired",
  slug          : "guidance-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Guidance Inspired",
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
  season        : "Winter",
  notes: {
    top:   ["Pear", "Bergamot", "Pink Pepper"],
    heart: ["Rose Absolute", "Jasmine Sambac", "Amber"],
    base:  ["Sandalwood", "Vanilla Bourbon", "Musk Ambroxan"],
  },
  mood          : "Elegant and captivating.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Warm",
    "Sensual",
    "Sophisticated",
    "Luminous",
    "Captivating",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Luxury Amber Floral", "Elegant Evening Statement", "Warm Rose Sophistication"],
  recommendedFor: [
    "Women seeking an elegant rose fragrance that transitions seamlessly from evening sophistication to intimate moments",
    "Those who appreciate warm amber florals with depth and longevity for winter occasions",
    "Anyone drawn to rose-centered compositions that balance brightness with sensual warmth",
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
  subtitle      : "Radiant Depth",
  description   : "Pear and pink pepper ignite a bright opening before rose absolute and jasmine settle into a warm, enveloping heart. Sandalwood and vanilla bourbon create a luminous base that whispers rather than shouts, drawing the wearer into its amber-tinged orbit.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "oriental-and-amber-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber-floral",
    "rose-absolute",
    "jasmine",
    "sandalwood",
    "vanilla",
    "winter",
    "elegant",
    "date-night",
    "long-wearing",
    "rich",
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
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired"],
  },
};
