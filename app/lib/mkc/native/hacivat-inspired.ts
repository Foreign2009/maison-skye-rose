// Maison Knowledge Catalogue — Hacivat Inspired
import type { FragranceKnowledge } from "../types";

export const hacivatInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "hacivat-inspired",
  slug:           "hacivat-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Hacivat Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fruity", "Woody", "Aromatic"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fruity Woody Aromatic",
  season:  "All Season",
  notes: {
    top:   ["Pineapple", "Bergamot", "Pink Pepper"],
    heart: ["Oakmoss", "Rose", "Geranium"],
    base:  ["Sandalwood", "Cedar", "Patchouli", "Vetiver"],
  },
  mood: "Powerful and elegant — niche sophistication made wearable for every occasion.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Sophisticated", "Powerful", "Wealthy", "Elegant", "Confident"],
  occasions:      ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons:        ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Niche Royalty", "Elevated Daily", "Connoisseur Signature"],
  recommendedFor: [
    "Men who want a fragrance that signals elevated taste without obvious branding",
    "Fragrance enthusiasts seeking a niche-quality signature in Maison's oil format",
    "Those who appreciate the balance of fruity freshness and deep woody sophistication",
    "All-season wearers who want one signature that works across every context",
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
  subtitle: "Niche Royalty",
  description:
    "Hacivat Inspired captures the balance that made the Xerjoff original beloved in the fragrance community — fruity brightness sitting perfectly over a woody, mossy base without either element overwhelming the other. " +
    "Pineapple and Bergamot open the composition with vivid tropical freshness, lifted by the gentle bite of Pink Pepper. " +
    "Oakmoss in the heart introduces a green, earthy complexity — the note that separates this from mass-market fruity woods, giving it a chypre-like quality that rewards close wearing. " +
    "Sandalwood, Cedar, Patchouli and Vetiver combine in the base to produce a richly textured dry-down that rewards wearing close — best appreciated in quiet moments and cool evening air. " +
    "The result is a fragrance that works in every season and reveals new depth with each wearing.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "weekend-and-casual-fragrances",
    "woody-fragrances-explained",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
  ],
  educationTags: [
    "pineapple", "oakmoss", "sandalwood", "vetiver", "fruity", "woody",
    "masculine", "niche", "all-season", "sophisticated",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "weekend-and-casual-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["erba-pura-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   2,
  freshness:   3,
  warmth:      3,
  intensity:   4,
  versatility: 4,
  popularity:  9,
};
