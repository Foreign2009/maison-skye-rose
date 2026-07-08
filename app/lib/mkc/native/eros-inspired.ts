// Maison Knowledge Catalogue — Eros Inspired
import type { FragranceKnowledge } from "../types";

export const erosInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "eros-inspired",
  slug:           "eros-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Eros Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fresh", "Aromatic", "Vanilla"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fresh Sweet Aromatic",
  season:  "Summer",
  notes: {
    top:   ["Mint", "Green Apple", "Lemon"],
    heart: ["Tonka Bean", "Geranium", "Ambroxan"],
    base:  ["Vanilla", "Vetiver", "Oakmoss", "Cedar"],
  },
  mood: "Bold, confident and magnetic — night-out energy in an all-day package.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Bold", "Confident", "Powerful", "Sexy", "Magnetic"],
  occasions:      ["Date Night", "Evening", "Weekend", "Summer Days"],
  seasons:        ["Spring", "Summer"],
  signatureStyle: ["Nightlife Statement", "Bold Summer Signature", "Magnetic Energy"],
  recommendedFor: [
    "Men who want a fragrance that generates compliments and presence",
    "Evening and date-night occasions in warm weather",
    "Those who enjoy the contrast of icy mint freshness and warm vanilla depth",
    "Young men seeking a bold, instantly recognisable warm-weather signature",
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
  featured:   false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Nightlife Energy",
  description:
    "Eros Inspired captures the mythological energy of its reference — bold, seductive and built for attention. " +
    "Mint and Green Apple open with an icy brightness that feels immediately arresting: clean and cool in the first breath, then revealing something warmer beneath. " +
    "Tonka Bean and Ambroxan in the heart are responsible for Eros's signature — that powdery-smooth, skin-amplifying quality that reads as deeply personal rather than applied. " +
    "Vanilla, Vetiver and Oakmoss in the base give the fragrance unexpected depth: it begins bold and finishes refined, which is exactly why it generates the compliments it does.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-fundamentals",
    "fragrance-families",
  ],
  educationTags: [
    "mint", "vanilla", "ambroxan", "tonka", "fresh", "sweet",
    "masculine", "bold", "evening", "summer", "signature",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "what-makes-a-signature-scent",
    "how-to-wear-fragrance",
  ],

  // ── Intelligence ─────────────────────────────────────────────────────────────
  sweetness:       3,
  freshness:       4,
  warmth:          2,
  intensity:       4,
  versatility:     3,
  popularity:      8,
  longevitySignal: "exceptional",
};
