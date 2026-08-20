import type { FragranceKnowledge } from "../types";

export const ombreNomadeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ombre-nomade-inspired",
  slug          : "ombre-nomade-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Ombre Nomade Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody", "Oud"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oud Woody",
  season        : "Winter",
  notes: {
    top:   ["Bergamot", "Black Cardamom", "Oud"],
    heart: ["Rose Absolute", "Agarwood", "Leather"],
    base:  ["Amber", "Vetiver", "Vanilla"],
  },
  mood          : "Deep and mysterious.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Mysterious",
    "Intense",
    "Sophisticated",
    "Warm",
    "Masculine",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Desert Luxury", "Nocturnal Intensity", "Oud Mystic"],
  recommendedFor: [
    "Men seeking a nocturnal signature that transforms evening wear into a ritual of dark elegance and oud-driven intensity",
    "Those who appreciate leather and rose in a masculine context and want depth over brightness",
    "Anyone drawn to mysterious, complex fragrances that evolve from austere opening to warm, ambered base",
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
  subtitle      : "Nocturnal Elegance",
  description   : "Black cardamom and oud open with austere brightness before the composition descends into rose absolute and leather—a whisper of civilization against vast, darkened landscape. Amber and vetiver anchor the base in animal warmth, creating a fragrance that moves between shadow and skin with quiet intensity.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "woody-fragrances-explained",
    "oud-the-worlds-most-complex-ingredient",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "woody",
    "agarwood",
    "leather",
    "amber",
    "rose",
    "vetiver",
    "mysterious",
    "winter",
    "date-night",
    "intense",
    "oriental",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "woody-fragrances-explained",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

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
    alternatives:     ["oud-wood-inspired", "royal-oud-inspired", "ombre-leather-inspired", "oud-bergamot-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired", "spicebomb-extreme-inspired", "voyage-d'hermes-inspired", "black-orchid-inspired", "gold-oud-inspired"],
  },
};
