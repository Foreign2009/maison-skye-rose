import type { FragranceKnowledge } from "../types";

export const creedGreenIrishTweedInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "creed-green-irish-tweed-inspired",
  slug          : "creed-green-irish-tweed-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Creed Green Irish Tweed Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Fresh", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Green Woody",
  season        : "Spring",
  notes: {
    top:   ["Lemon", "Galbanum", "Ginger"],
    heart: ["Violet Leaf", "Geranium", "Iris Root"],
    base:  ["Sandalwood", "Vetiver", "Ambroxan"],
  },
  mood          : "Fresh and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Fresh",
    "Elegant",
    "Refined",
    "Bright",
    "Mature",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Formal",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Classic Green Woody", "Refined Freshness", "Verdant Elegance"],
  recommendedFor: [
    "Men seeking a refined green woody that bridges casual sophistication and formal elegance across seasons",
    "Those who appreciate fresh citrus and herbal notes grounded in creamy wood rather than heavy base accords",
    "Anyone building a versatile collection who wants one fragrance that works from spring through autumn without feeling seasonal",
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
  subtitle      : "Verdant Elegance",
  description   : "A green woody that opens with bright lemon and galbanum, then settles into a refined heart of violet leaf and iris root. Sandalwood and vetiver anchor the composition with quiet sophistication, creating something both crisp and enduring.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "woody-fragrances-explained",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fresh",
    "woody",
    "green",
    "lemon",
    "galbanum",
    "violet-leaf",
    "sandalwood",
    "vetiver",
    "sophisticated",
    "layering",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["terre-d'hermes-inspired", "imagination-inspired", "wood-sage-sea-salt-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired", "yellow-diamond-inspired"],
  },
};
