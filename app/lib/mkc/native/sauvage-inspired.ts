import type { FragranceKnowledge } from "../types";

export const sauvageInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "sauvage-inspired",
  slug:           "sauvage-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Sauvage Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fresh", "Woody", "Aromatic"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fresh Spicy Woody",
  season:  "All Season",
  notes: {
    top:   ["Bergamot", "Grapefruit"],
    heart: ["Pepper", "Lavender", "Elemi"],
    base:  ["Ambroxan", "Cedar", "Vetiver"],
  },
  mood: "Fresh, powerful and magnetic everyday luxury.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Powerful", "Magnetic", "Confident", "Fresh", "Modern"],
  occasions:      ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Masculine Freshness", "Power Casual", "Modern Signature"],
  recommendedFor: [
    "Men seeking a proven, universally respected signature",
    "Fragrance beginners who want immediate impact",
    "Office and professional environments",
    "Those who prefer fresh and clean over sweet or heavy",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: true,
  newArrival: false,
  featured:   true,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Masculine Energy",
  description:
    "Sauvage Inspired captures the raw energy of Maison's most beloved masculine reference. " +
    "A thunderclap of Calabrian Bergamot opens the composition — vivid, citrusy, and instantly recognisable. " +
    "A peppery, aromatic heart of Lavender and Elemi bridges the freshness toward the dry-down, " +
    "where Ambroxan takes over entirely. This molecule, responsible for the fragrance's magnetic character, " +
    "blends with skin chemistry to produce a projection that feels personal rather than heavy. " +
    "Cedar and Vetiver ground the base with quiet authority. " +
    "The result is one of the most wearable and universally appreciated masculines in the collection — " +
    "confident without demanding attention, fresh without being forgettable.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "woody-fragrances-explained",
    "office-and-professional-fragrances",
    "how-to-wear-fragrance",
  ],
  academyCategories: [
    "fragrance-fundamentals",
    "fragrance-families",
  ],
  educationTags: [
    "bergamot", "ambroxan", "aromatic", "fresh", "woody",
    "masculine", "projection", "signature", "all-season",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    evolutions: ["sauvage-elixir-inspired"],
    wardrobePartners: ["afternoon-swim-inspired", "miss-dior-inspired", "ani-inspired", "arabians-tonka-inspired", "blanche-bete-inspired", "burberry-goddess-inspired", "chance-eau-tendre-inspired", "coco-mademoiselle-inspired", "crystal-noir-inspired", "erba-pura-inspired", "flowerbomb-inspired", "libre-intense-inspired", "love-don't-be-shy-inspired", "mon-paris-inspired", "prada-paradoxe-inspired", "good-girl-blush-inspired", "alien-man-inspired", "allure-homme-sport-inspired", "bvlgari-aqua-inspired", "h24-herbes-vives-inspired", "ombre-leather-inspired"],
    alternatives: ["dunhill-fresh-inspired", "eros-flame-inspired", "voyage-d'hermes-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   1,
  freshness:   5,
  warmth:      3,
  intensity:   4,
  versatility: 5,
  popularity:  10,
};
