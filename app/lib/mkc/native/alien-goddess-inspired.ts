import type { FragranceKnowledge } from "../types";

export const alienGoddessInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "alien-goddess-inspired",
  slug          : "alien-goddess-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Alien Goddess Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Floral"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Floral",
  season        : "Summer",
  notes: {
    top:   ["Coconut Milk", "Yuzu"],
    heart: ["Jasmine Sambac", "Tuberose"],
    base:  ["Vanilla Absolute", "Sandalwood"],
  },
  mood          : "Radiant and uplifting.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Radiant",
    "Luminous",
    "Sensual",
    "Confident",
    "Warm",
    "Sophisticated",
  ],
  occasions     : [
    "Daily Wear",
    "Vacation",
    "Summer Days",
    "Date Night",
    "Evening",
  ],
  seasons       : ["Summer"],
  signatureStyle: ["Golden Glow", "Luminous Floral", "Tropical Luxury", "Creamy Radiance"],
  recommendedFor: [
    "Women seeking a radiant, long-wearing signature that celebrates golden hour glamour and luminous florals",
    "Those who love creamy vanilla florals with tropical brightness and want a fragrance that blooms louder as the day progresses",
    "Anyone looking for a summer essential that transitions effortlessly from beach days to evening occasions without feeling seasonal",
    "Fragrance collectors drawn to opulent tuberose and jasmine compositions that feel luxurious yet wearable",
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
  subtitle      : "Radiant Bloom",
  description   : "Coconut milk and yuzu open with sun-drenched clarity, yielding to a luminous heart of jasmine sambac and tuberose that blooms without apology. Vanilla absolute and sandalwood anchor the composition in warm, creamy depth—a fragrance that radiates from within.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "vanilla",
    "floral",
    "jasmine",
    "tuberose",
    "coconut",
    "sandalwood",
    "summer",
    "long-wearing",
    "layering",
    "tropical",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
