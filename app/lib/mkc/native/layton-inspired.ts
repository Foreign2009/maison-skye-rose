// Maison Knowledge Catalogue — Layton Inspired
import type { FragranceKnowledge } from "../types";

export const laytonInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "layton-inspired",
  slug:           "layton-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Layton Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Amber", "Vanilla", "Aromatic"],
  scentCharacter: "Rich & Long Wearing",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Amber Vanilla Aromatic",
  season:  "Winter",
  notes: {
    top:   ["Apple", "Bergamot", "Lavender"],
    heart: ["Jasmine", "Cardamom", "Geranium"],
    base:  ["Vanilla", "Sandalwood", "Guaiac Wood", "Musk"],
  },
  mood: "Warm, luxurious and commanding — the winter signature that stops conversations.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Luxury", "Wealthy", "Romantic", "Bold", "Sophisticated"],
  occasions:      ["Date Night", "Evening", "Weekend", "Winter Evenings"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Royal Seduction", "Dark Luxury", "Winter Statement"],
  recommendedFor: [
    "Men seeking a luxurious, attention-commanding evening fragrance",
    "Date nights and special occasions in cool and cold weather",
    "Those who appreciate warm vanilla and amber without excessive sweetness",
    "Fragrance collectors who want a conversation-starting winter signature",
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
  subtitle: "Royal Seduction",
  description:
    "Layton Inspired captures the opulent DNA of one of the Marly house's most celebrated creations — warm, generous and unmistakably luxurious. " +
    "Apple and Bergamot open with a crisp freshness that belies what's beneath, while Lavender adds an aromatic softness that makes the first impression both bright and elegant. " +
    "The heart is where Layton reveals its character: Jasmine, Cardamom and Geranium weave together in a rich aromatic accord that is simultaneously masculine and sensual. " +
    "Vanilla, Sandalwood and Guaiac Wood in the base produce a smooth, creamy warmth that settles into the skin rather than projecting outward — reapply generously for evenings where presence matters most.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-fundamentals",
    "building-your-wardrobe",
  ],
  educationTags: [
    "vanilla", "amber", "cardamom", "jasmine", "sandalwood",
    "masculine", "winter", "luxury", "signature", "rich",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
    "how-to-wear-fragrance",
  ],

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   4,
  freshness:   2,
  warmth:      5,
  intensity:   4,
  versatility: 3,
  popularity:  9,
};
