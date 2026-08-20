import type { FragranceKnowledge } from "../types";

export const goodGirlBlushInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "good-girl-blush-inspired",
  slug          : "good-girl-blush-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Good Girl Blush Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Floral"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Vanilla",
  season        : "Spring",
  notes: {
    top:   ["Peony", "Bergamot", "Pink Pepper"],
    heart: ["Rose Absolute", "Tuberose", "Almond Milk"],
    base:  ["Vanilla Bourbon", "Sandalwood", "Musk"],
  },
  mood          : "Elegant and feminine.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Elegant",
    "Romantic",
    "Sophisticated",
    "Warm",
    "Luminous",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Wedding",
    "Evening",
  ],
  seasons       : ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Soft Elegance", "Romantic Floral Vanilla", "Luminous Femininity"],
  recommendedFor: [
    "Women who want an elegant everyday fragrance that balances softness with sophistication and presence",
    "Those seeking a romantic floral vanilla that feels refined rather than sugary or juvenile",
    "Anyone looking for a signature scent that transitions seamlessly from office to evening without reprising",
    "Women drawn to creamy florals with depth — peony and rose with a grounding vanilla base",
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
  description   : "Peony and pink pepper open with a whisper of bergamot, immediately feminine and luminous. The heart unfolds into rose absolute and creamy almond milk, softened by tuberose's indolic warmth. Vanilla bourbon and sandalwood anchor the composition in gentle sensuality, creating a fragrance that feels both intimate and radiant.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "vanilla",
    "rose",
    "tuberose",
    "peony",
    "feminine",
    "elegant",
    "creamy",
    "wedding",
    "layering",
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
    alternatives:     ["delina-inspired", "peony-blush-suede-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
