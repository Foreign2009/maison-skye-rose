// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — lady-million-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T17:36:28.040Z
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

export const ladyMillionInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "lady-million-inspired",
  slug          : "lady-million-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Lady Million Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Oriental",
  season        : "Autumn",
  notes: {
    top:   ["Neroli", "Orange", "Raspberry"],
    heart: ["Jasmine", "African Orange Blossom", "Gardenia"],
    base:  ["Patchouli", "White Honey", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Powdery Floral Warm",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Luminous",
    "Sophisticated",
    "Elegant",
    "Feminine",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Autumn", "Spring"],
  signatureStyle: ["Powdery Floral Warmth", "Modern Signature Floral", "Balanced Elegance"],
  recommendedFor: [
    "Women seeking a luminous floral signature that balances powdery warmth with fresh citrus brightness for everyday elegance",
    "Those who wear soft florals to the office but want depth and sensuality for evening transitions",
    "Anyone drawn to amber and honey bases who prefers warmth over sweetness in their signature scent",
    "Women building a fragrance wardrobe who want one floral that works from desk to dinner",
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
  subtitle      : "Powdered Warmth",
  description   : "Neroli and raspberry open with bright clarity before giving way to a luminous heart of jasmine and orange blossom. White honey and amber settle into a warm, powdery base that feels both intimate and radiant—a fragrance that builds softness with time.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral-oriental",
    "jasmine",
    "gardenia",
    "amber",
    "patchouli",
    "signature-scent",
    "date-night",
    "office",
    "balanced",
    "white-honey",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "mon-paris-inspired", "la-vie-est-belle-inspired"],
    wardrobePartners: ["1-million-inspired"],
  },
};
