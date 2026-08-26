// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — clinique-happy-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:06:37.144Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: FAIL  [3 error(s), 0 warning(s)]
// Projected KQ tier: (not available — requires Intelligence Producer)
// ─────────────────────────────────────────────────────────────────
// REVIEW CHECKLIST
//   □ Notes pyramid verified (≥ 2 per tier, no cross-tier duplicates)
//   □ Description reviewed in Maison editorial voice
//   □ Vibe tags meet minimum of 3 (from approved vocabulary)
//   □ recommendedFor has minimum of 2 persona statements
//   □ All FACTORY_ERROR markers resolved
//   □ All FACTORY_WARN markers reviewed
//   □ Relationship suggestions reviewed (see footer)
//   □ npm run mkc:validate passes before promotion
// ═════════════════════════════════════════════════════════════════

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const cliniqueHappyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "clinique-happy-inspired",
  slug          : "clinique-happy-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Clinique Happy Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Citrus", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Citrus Floral",
  season        : "Spring",
  notes: {
    top:   [
      "Orange",
      "Blood Grapefruit",
      "Indian Mandarin",
      "Bergamot",
      "Apple",
      "Plum",
    ],
    heart: ["Lily-of-the-Valley", "Freesia", "Orchid", "Rose"],
    base:  [
      "Mimosa",
      "Lily",
      "Magnolia",
      "Musk",
      "Amber",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Bright Citrus Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bright",
    "Fresh",
    "Cheerful",
    "Soft",
    "Optimistic",
    "Youthful",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Bright Citrus Floral", "Everyday Radiance", "Spring Optimism"],
  recommendedFor: [
    "Women seeking a luminous everyday fragrance that lifts mood and brightens any moment with citrus sparkle and floral grace",
    "Those who love fresh florals with natural brightness—no heavy musk, no sultry notes, just pure spring energy",
    "Anyone building a collection who wants a reliable cheerful signature for work, errands, and casual social moments",
    "Women drawn to Clinique Happy's original joy but seeking a softer, more floral interpretation with rose warmth",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Bright Citrus Bloom",
  description   : "A radiant clash of blood grapefruit and mandarin opens onto a luminous heart of freesia and lily-of-the-valley, their spring freshness anchored by soft mimosa and amber. Rose surfaces as a whisper rather than a statement, letting citrus brightness define the composition's modern optimism.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "citrus",
    "floral",
    "orange",
    "bergamot",
    "freesia",
    "rose",
    "fresh",
    "light",
    "spring",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["chance-eau-fraiche-inspired", "coco-mademoiselle-inspired"],
    wardrobePartners: ["mon-guerlain-inspired"],
  },
};
