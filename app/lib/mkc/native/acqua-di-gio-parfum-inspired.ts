// Maison Knowledge Catalogue — Acqua Di Gio Parfum Inspired
import type { FragranceKnowledge } from "../types";

export const acquaDiGioParfumInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "acqua-di-gio-parfum-inspired",
  slug:           "acqua-di-gio-parfum-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Acqua Di Gio Parfum Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Aquatic", "Woody", "Aromatic"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Fresh Woody",
  season:  "Summer",
  notes: {
    top:   ["Bergamot", "Marine Notes", "Lemon"],
    heart: ["Incense", "Cypress", "Geranium"],
    base:  ["Patchouli", "Vetiver", "Amber"],
  },
  mood: "Marine freshness and Mediterranean incense — elevated aquatic for evenings that require more than a summer signature.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Elegant", "Luxury", "Sophisticated", "Mysterious", "Old Money", "Confident"],
  occasions:      ["Evening", "Date Night", "Summer Days", "Weekend"],
  seasons:        ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Mediterranean Incense Elegance", "Aquatic Luxury", "Elevated Freshness"],
  recommendedFor: [
    "Those who appreciate the aquatic freshness of the ADG lineage but want a fragrance capable of carrying through to evening — the incense heart transforms what begins as a marine composition into something architectural and sophisticated, suited to occasions the original aquatic cannot reach",
    "Men building a summer wardrobe who want their evening option within the same olfactive family as their daytime signature — Acqua Di Gio Parfum extends the aquatic DNA into dinner, dates, and sophisticated evenings without requiring a completely different fragrance character",
    "Those who find pure aquatic fresh masculines too casual for the occasions they care about most — the incense and vetiver base introduces a solemnity and warmth that elevates familiar freshness into genuinely premium territory without abandoning its Mediterranean origins",
    "Customers deciding between the Parfum and Profondo expressions of the same lineage — Profondo delivers mineral darkness and summer projection; Parfum delivers incense warmth and evening elegance; both are sophisticated advances on the original, but toward entirely different ends of the occasion spectrum",
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
  subtitle: "Mediterranean Luxury",
  description:
    "Acqua Di Gio Parfum Inspired opens with Bergamot and Marine Notes — a composition that signals its lineage immediately before departing from everything that lineage usually promises. " +
    "Incense and Cypress in the heart are not what an aquatic masculine is supposed to do: they introduce a Mediterranean solemnity that transforms marine freshness into something quieter, warmer, and considerably more considered. " +
    "Patchouli and Vetiver in the base complete the arc from the sea to evening — the aquatic DNA taken as far toward elegance as freshness can travel.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "what-makes-a-signature-scent",
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "how-to-layer-fragrances",
  ],
  academyCategories: [
    "fragrance-families",
    "building-your-wardrobe",
    "occasion-guide",
  ],
  educationTags: [
    "bergamot", "marine", "incense", "cypress", "patchouli", "vetiver",
    "aquatic", "fresh", "masculine", "summer", "autumn", "evening", "luxury", "sophisticated",
  ],
  learningPath: [
    "what-makes-a-signature-scent",
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "how-to-layer-fragrances",
  ],

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Aquatic-incense transition benchmark. The third step in the ADG lineage calibration:
  // Aqua Di Gio (freshness:5, warmth:1, intensity:2 — pure breezy aquatic) →
  // Profondo (freshness:4, warmth:2, intensity:4 — mineral dark aquatic) →
  // Parfum (freshness:3, warmth:3, intensity:4 — incense-warmed elevated aquatic).
  // Each step adds depth and warmth at the cost of pure freshness. freshness:3 reflects the
  // incense and patchouli base tempering the marine character to population mean.
  // warmth:3 from the incense/amber/vetiver base — same warmth tier as Terre D'Hermes
  // (earthy mineral route) but via incense-maritime route: genuinely different texture.
  // popularity:6 reflects the elevated ADG Parfum appreciation beyond the original's
  // mainstream popularity, with genuine luxury positioning.
  sweetness:   1,
  freshness:   3,
  warmth:      3,
  intensity:   4,
  versatility: 3,
  popularity:  6,
};
