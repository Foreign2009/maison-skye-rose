// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — narciso-rodriguez-for-her-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:36:05.626Z
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

export const narcisoRodriguezForHerInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "narciso-rodriguez-for-her-inspired",
  slug          : "narciso-rodriguez-for-her-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Narciso Rodriguez for Her Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Musk",
  season        : "Year-Round",
  notes: {
    top:   ["Rose", "Peach"],
    heart: ["Musk", "Amber"],
    base:  ["Patchouli", "Sandalwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Soft Floral Musk",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Elegant",
    "Warm",
    "Sophisticated",
    "Sensual",
    "Feminine",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Soft Luxury Floral", "Balanced Musk Signature", "Modern Intimate Rose"],
  recommendedFor: [
    "Women seeking a soft yet substantial signature fragrance that feels intimate without being heavy",
    "Those who appreciate rose-centered compositions with warm musk and woody anchors for everyday elegance",
    "Anyone looking for a year-round floral that balances delicate peach brightness with sensual depth",
    "Fragrance enthusiasts who want a modern take on classic feminine luxury with restraint and refinement",
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
  subtitle      : "Soft Luxury",
  description   : "Rose and peach open with delicate brightness before melting into a warm embrace of musk and amber. Patchouli and sandalwood anchor the composition, creating a fragrance that feels both intimate and effortlessly wearable—a second skin rather than a statement.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "musk",
    "rose",
    "peach",
    "amber",
    "patchouli",
    "sandalwood",
    "signature-scent",
    "balanced",
    "daily-wear",
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
    alternatives:     ["si-passione-red-musk-inspired", "coco-mademoiselle-inspired"],
    wardrobePartners: ["black-opium-inspired"],
  },
};
