// Maison Knowledge Catalogue — Bleu de Chanel Inspired
import type { FragranceKnowledge } from "../types";

export const bleuDeChanelInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "bleu-de-chanel-inspired",
  slug:           "bleu-de-chanel-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Bleu de Chanel Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Citrus", "Woody", "Aromatic"],
  scentCharacter: "Fresh & Light",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Citrus Aromatic Woody",
  season:  "Summer",
  notes: {
    top:   ["Grapefruit", "Lemon", "Bergamot"],
    heart: ["Ginger", "Nutmeg", "Jasmine"],
    base:  ["Incense", "Cedar", "Sandalwood", "Vetiver"],
  },
  mood: "Sophisticated freshness with modern confidence — the clean masculine that works everywhere.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Clean", "Sophisticated", "Professional", "Elegant", "Modern"],
  occasions:      ["Daily Wear", "Office", "Weekend", "Date Night"],
  seasons:        ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Effortless Sophistication", "Clean Luxury", "Office Elegance"],
  recommendedFor: [
    "Men who want a universally inoffensive yet genuinely elegant daily fragrance",
    "Office environments where freshness and polish are the priority",
    "Those new to fragrance seeking a sophisticated, crowd-pleasing starting point",
    "Anyone who values versatility and broad appeal over statement-making",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: false,
  newArrival: true,
  featured:   false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Clean Luxury",
  description:
    "Bleu de Chanel Inspired captures the refined restraint that made the original a modern classic. " +
    "A bright opening of Grapefruit, Lemon and Bergamot establishes the clean citrus signature immediately — precise and assured without aggression. " +
    "Ginger and Nutmeg in the heart add warmth and gentle spice, preventing the fragrance from being merely safe. " +
    "Cedar, Sandalwood and Incense in the base anchor everything with quiet wood smoke — the signature that makes this recognisable without being ubiquitous. " +
    "The result is what sophistication actually smells like: confident, clean, never demanding.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "woody-fragrances-explained",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-families",
    "fragrance-fundamentals",
  ],
  educationTags: [
    "citrus", "woody", "aromatic", "grapefruit", "cedar", "incense",
    "masculine", "office", "fresh", "versatile",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    wardrobePartners: ["miss-dior-inspired", "chance-eau-tendre-inspired", "prada-paradoxe-inspired", "good-girl-inspired"],
    alternatives: ["l'immensite-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:   1,
  freshness:   4,
  warmth:      2,
  intensity:   3,
  versatility: 5,
  popularity:  7,
};
