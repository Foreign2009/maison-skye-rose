import type { FragranceKnowledge } from "../types";

export const althairInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "althair-inspired",
  slug          : "althair-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Althair Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Vanilla", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Vanilla",
  season        : "Winter",
  notes: {
    top:   ["Bergamot", "Vanilla Absolute", "Pink Pepper"],
    heart: ["Cinnamon", "Tonka Bean", "Clove"],
    base:  ["Amber", "Sandalwood", "Vanilla Resinoid"],
  },
  mood          : "Smooth and luxurious.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Luxurious",
    "Sophisticated",
    "Sensual",
    "Spiced",
  ],
  occasions     : ["Date Night", "Evening", "Winter Evenings", "Formal"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Amber Warmth", "Spiced Luxury", "Winter Signature"],
  recommendedFor: [
    "Men seeking a warm, luxurious signature for autumn evenings and winter occasions when richness and longevity matter most.",
    "Those who gravitate toward amber and vanilla compositions but want spice and depth rather than sweetness alone.",
    "Anyone looking for a sophisticated date night fragrance that projects confidence without overwhelming presence.",
    "Fragrance enthusiasts who appreciate tonka bean and cinnamon as central characters, not supporting notes.",
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
  newArrival    : true,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Amber Warmth",
  description   : "Bergamot and vanilla absolute open with a whisper of pink pepper—bright, almost effervescent—before the composition settles into its true character: cinnamon and tonka bean layered over a foundation of amber and sandalwood that feels both warm and restrained. This is luxury defined not by loudness but by the way it unfolds against the skin, each note resolving into the next with the ease of something deeply considered.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "oriental-and-amber-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber",
    "vanilla",
    "warm",
    "spicy",
    "winter",
    "tonka-bean",
    "cinnamon",
    "date-night",
    "rich",
    "long-wearing",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["layton-inspired", "le-male-elixir-inspired", "9pm-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
