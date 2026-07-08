/**
 * Maison Knowledge Catalogue — Fragrance Authoring Template
 *
 * This is the canonical template for all native FragranceKnowledge records.
 * Do NOT edit the TEMPLATE_CONST, TEMPLATE_SLUG, or TEMPLATE_NAME markers —
 * they are replaced automatically by the scaffold generator.
 *
 * To create a new record:
 *   npm run mkc:new -- "Fragrance Name"
 *
 * After generation, open the created file, fill in every field, then run:
 *   npm run mkc:validate
 *
 * The record must achieve PASS across all 7 validation groups before committing.
 * See docs/mkc-authoring-guide.md for the full authoring standard.
 */

import type { FragranceKnowledge } from "../types";

export const TEMPLATE_CONST: FragranceKnowledge = {

  // ── Identity (auto-filled by scaffold generator) ──────────────────────────
  id:             "TEMPLATE_SLUG",
  slug:           "TEMPLATE_SLUG",
  brand:          "Maison Skye & Rose",
  name:           "TEMPLATE_NAME",
  // CHANGE: Skye (masculine) | Rose (feminine) | Elite (premium/unisex)
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ─────────────────────────────────────────────────────────
  // CHANGE: male | female | unisex
  gender:         "unisex",
  // REQUIRED: 1–3 values from the approved vocabulary (see authoring guide):
  //   Fresh  Aquatic  Citrus  Woody  Aromatic  Amber  Sweet  Gourmand
  //   Floral  White Floral  Rose  Vanilla  Leather  Tobacco  Oud
  //   Musk  Powdery  Spicy  Fruity
  family:         [],
  // CHANGE after authoring composition:
  //   "Fresh & Light" | "Balanced Signature" | "Rich & Long Wearing" | "Deep & Intense"
  scentCharacter: "Fresh & Light",
  // CHANGE: "soft" | "moderate" | "strong"
  projection:     "moderate",

  // ── Composition ────────────────────────────────────────────────────────────
  // REQUIRED: 2–3 word olfactive descriptor  e.g. "Fresh Spicy Woody"
  profile: "",
  // CHANGE: "All Season" | "Summer" | "Winter" | "Spring" | "Autumn"
  season:  "All Season",
  // REQUIRED: minimum 2 notes in every tier
  notes: {
    top:   [],  // e.g. ["Bergamot", "Grapefruit"]
    heart: [],  // e.g. ["Pepper", "Lavender", "Elemi"]
    base:  [],  // e.g. ["Ambroxan", "Cedar", "Vetiver"]
  },
  // REQUIRED: 1–2 sentence mood description in Maison voice
  mood: "",

  // ── Discovery ──────────────────────────────────────────────────────────────
  // REQUIRED: minimum 3 from the approved vocabulary:
  //   Luxury  Confident  Powerful  Sexy  Professional  Clean  Elegant
  //   Playful  Mysterious  Romantic  Bold  Sophisticated  Modern  Wealthy  Old Money
  vibe:           [],
  // REQUIRED: minimum 2 occasions  e.g. "Daily Wear" | "Office" | "Date Night"
  //   "Weekend" | "Vacation" | "Wedding" | "Evening" | "Summer Days" | "Winter Evenings"
  occasions:      [],
  // REQUIRED: list every season this fragrance genuinely suits
  //   e.g. ["Spring", "Summer", "Autumn", "Winter"] for all-season fragrances
  seasons:        [],
  // REQUIRED: 2–3 curated wardrobe style descriptors (not a copy of subtitle)
  //   e.g. ["Masculine Freshness", "Power Casual", "Modern Signature"]
  signatureStyle: [],
  // REQUIRED: minimum 2 specific customer persona statements
  //   e.g. "Men seeking a proven, universally respected signature"
  recommendedFor: [],

  // ── Merchandising (copy exact values from production data) ────────────────
  prices: { "5ml": 0, "10ml": 0, "30ml": 0 },
  images: {
    "5ml":  "",
    "10ml": "",
    "30ml": "",
  },
  bestSeller: false,
  newArrival: false,
  featured:   false,

  // ── Education ──────────────────────────────────────────────────────────────
  // REQUIRED: 2–3 word character summary  e.g. "Masculine Energy"
  subtitle: "",
  // REQUIRED: 2–4 sentences in Maison voice.
  //   Cover: opening accord → heart character → dry-down.
  //   Name key molecules when relevant. Write for a first-time customer.
  description: "",

  // ── Academy integration (optional but strongly recommended) ───────────────
  // Slugs of Academy articles that relate to this fragrance.
  // Listed articles receive a +50 score boost in the recommendation engine.
  // Available slugs: the-note-pyramid-explained | guide-to-fragrance-families |
  //   how-to-wear-fragrance | what-makes-a-signature-scent |
  //   choosing-your-season-scent | how-to-layer-fragrances
  academyArticleIds: [],
  // Academy category slugs: fragrance-fundamentals | fragrance-families |
  //   the-note-pyramid | building-your-wardrobe | occasion-guide | seasonal-guide
  academyCategories: [],
  // Tags shared with the Academy Registry for cross-referencing.
  // Include: primary notes, family terms, character, gender, season
  educationTags:     [],
  // Ordered article slugs for a guided learning experience.
  // Start with foundational articles, end with occasion-specific content.
  learningPath:      [],

  // ── Intelligence (calibrate relative to the full catalogue) ───────────────
  //   All scores 1–5. Population average is 3.
  sweetness:   3,  // 1 = no sweetness at all … 5 = candied/gourmand
  freshness:   3,  // 1 = zero freshness    … 5 = dominant citrus/bergamot
  warmth:      3,  // 1 = cool and crisp    … 5 = Oud/Amber/Vanilla dominant
  intensity:   3,  // 1 = soft and close    … 5 = very powerful projection
  versatility: 3,  // 1 = niche/specialist  … 5 = genuinely all-occasion
  // 1–10 popularity scale. Bestsellers: 8–10. Average: 5. Niche: 2–4.
  popularity:  5,
};
