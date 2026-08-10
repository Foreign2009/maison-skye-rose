import type { FragranceKnowledge } from "../types";

export const weddingSilkSantalInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "wedding-silk-santal-inspired",
  slug          : "wedding-silk-santal-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Wedding Silk Santal Inspired",
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
  season        : "All Season",
  notes: {
    top:   ["Champagne Accord", "Neroli", "Galbanum"],
    heart: ["Vanilla Absolute", "Tuberose", "Sandalwood"],
    base:  ["White Musk", "Amber Resin", "Creamy Sandalwood"],
  },
  mood          : "Soft luxury.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luxury",
    "Elegant",
    "Soft",
    "Romantic",
    "Sophisticated",
    "Warm",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Evening",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Elegant Romance", "Soft Luxury", "Creamy Femininity", "Signature Floral"],
  recommendedFor: [
    "Women seeking an elegant signature fragrance that transitions seamlessly from office to evening occasions",
    "Those who love creamy vanilla and tuberose but want luxury and sophistication over sweetness",
    "Anyone looking for a soft, intimate fragrance that feels like a second skin rather than a statement",
    "Women who appreciate champagne-bright openings and want a fragrance that deepens beautifully throughout the day",
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
  subtitle      : "Soft Luxury",
  description   : "Champagne and neroli open into a luminous heart of tuberose and vanilla absolute, where creamy sandalwood and white musk create an intimate second skin. The fragrance settles into warm amber resin and soft sandalwood, a gentle veil of luxury that feels both ceremonial and deeply personal.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "vanilla",
    "floral",
    "tuberose",
    "sandalwood",
    "white-musk",
    "amber",
    "luxury",
    "signature-scent",
    "all-season",
    "office-wear",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["layton-inspired", "prada-l'homme-inspired"],
  },
};
