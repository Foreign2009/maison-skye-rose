// Maison Knowledge Catalogue — Imagination Inspired
import type { FragranceKnowledge } from "../types";

export const imaginationInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "imagination-inspired",
  slug:           "imagination-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Imagination Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fresh", "Citrus", "Woody"],
  scentCharacter: "Fresh & Light",
  projection:     "soft",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Citrus Tea",
  season:  "Summer",
  notes: {
    top:   ["Citron", "Bergamot", "Pink Pepper"],
    heart: ["Black Tea", "Jasmine", "Lily of the Valley"],
    base:  ["Cedarwood", "White Musks", "Amber"],
  },
  mood: "Citrus, clarity and quiet confidence — a fresh masculine that rewards closeness over announcement.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Elegant", "Clean", "Modern", "Sophisticated", "Refined", "Understated"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Summer Days", "Formal Events"],
  seasons:        ["Spring", "Summer"],
  signatureStyle: ["Tea Citrus Minimalism", "Quiet Luxury", "Daytime Refinement"],
  recommendedFor: [
    "Those who prefer fragrance that rewards closeness — Imagination is intimate rather than projecting, revealing its character through proximity rather than sillage",
    "Office and professional environments where restraint is a strength — clean citrus-tea freshness without aggression or sweetness",
    "Men who find most designer masculines too loud or too sweet — this is the understated option from one of fashion's most prestigious houses",
    "Collectors building a wardrobe beyond Sauvage and Aqua Di Gio — a fundamentally different approach to fresh masculinity that fills a distinct wardrobe position",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: false,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Creative Luxury",
  description:
    "A sunlit burst of Citron and Bergamot opens with immediate clarity before a Black Tea accord draws the composition inward — more considered, more precise. " +
    "Jasmine and Lily of the Valley add a quiet floral dimension that prevents the citrus-tea character from ever feeling one-dimensional. " +
    "Cedarwood and soft Musks provide the foundation: clean, refined, and confident in its restraint — a fragrance that rewards closeness over announcement.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "how-to-wear-fragrance",
    "choosing-your-season-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "fresh-guide",
    "seasonal-guide",
  ],
  educationTags: [
    "citrus", "tea", "fresh", "cedar", "clean", "understated", "masculine",
    "spring", "summer", "designer", "quiet-luxury", "bergamot",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "how-to-wear-fragrance",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["afternoon-swim-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Fresh through elegance rather than energy — compare Invictus (freshness:4, intensity:3).
  // Shares freshness:4 but intensity:2 confirms intimate, close-wearing character.
  // sweetness:1 — zero sweetness, below Hacivat (2); pure citrus/tea/cedar orientation.
  sweetness:   1,
  freshness:   4,
  warmth:      2,
  intensity:   2,
  versatility: 4,
  popularity:  4,
};
