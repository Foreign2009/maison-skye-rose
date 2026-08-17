import type { FragranceKnowledge } from "../types";

export const flowerbombInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "flowerbomb-inspired",
  slug          : "flowerbomb-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Flowerbomb Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Sweet"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Sweet",
  season        : "Spring",
  notes: {
    top:   ["Bergamot", "Grapefruit", "Jasmine"],
    heart: ["Rose Absolute", "Tuberose", "Osmanthus"],
    base:  ["Patchouli", "Amber", "Vanilla Bourbon"],
  },
  mood          : "Luxurious and romantic.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Luxurious",
    "Sensual",
    "Sophisticated",
    "Intoxicating",
    "Warm",
  ],
  occasions     : [
    "Daily Wear",
    "Date Night",
    "Wedding",
    "Evening",
    "Formal",
  ],
  seasons       : ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Romantic Floral Luxury", "Sensual Bloom", "Modern Floral Icon"],
  recommendedFor: [
    "Women seeking a luxurious floral signature that transitions seamlessly from daily elegance to special occasions.",
    "Those who love rich, romantic florals with depth — rose and tuberose lovers who want more than just pretty.",
    "Anyone looking for a rich fragrance that makes a sensual statement without overwhelming the senses.",
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
  subtitle      : "Blooming Seduction",
  description   : "Bergamot and grapefruit ignite a luminous opening before rose absolute and tuberose bloom into a heady, intoxicating heart. Patchouli and amber ground the composition in sensual warmth, while vanilla bourbon adds a whisper of sweetness that lingers on skin like silk.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "gourmand-fragrances-guide",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "tuberose",
    "jasmine",
    "sweet",
    "romantic",
    "spring",
    "wedding",
    "layering",
    "amber-vanilla",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "mon-guerlain-inspired", "libre-flowers-flames-florale-inspired"],
    wardrobePartners: ["sauvage-inspired", "chance-inspired", "coach-floral-inspired", "light-blue-inspired"],
  },
};
