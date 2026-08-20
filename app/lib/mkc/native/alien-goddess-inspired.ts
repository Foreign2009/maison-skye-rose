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
  family        : ["Amber", "Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Floral",
  season        : "Summer",
  notes: {
    top:   ["Coconut Water", "Bergamot"],
    heart: ["Jasmine Grandiflorum", "Heliotrope"],
    base:  ["Bourbon Vanilla", "Cashmeran"],
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
    "Women seeking a radiant signature that celebrates golden hour glamour and luminous florals",
    "Those who love warm amber florals with tropical brightness and want a fragrance that blooms louder as the day progresses",
    "Anyone looking for a summer essential that transitions effortlessly from beach days to evening occasions without feeling seasonal",
    "Fragrance collectors drawn to opulent jasmine and heliotrope compositions that feel luxurious yet wearable",
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
  description   : "Coconut water and bergamot open with luminous clarity, yielding to a radiant heart of jasmine grandiflorum and heliotrope that blooms with quiet authority. Bourbon vanilla and cashmeran anchor the composition in warm, amber depth—a fragrance that glows from within.",
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
    "coconut",
    "summer",
    "layering",
    "tropical",
    "amber",
    "heliotrope",
    "bergamot",
    "cashmeran",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["soleil-blanc-inspired", "olympea-inspired"],
    wardrobePartners: ["dylan-purple-inspired"],
  },

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 4,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,
};
