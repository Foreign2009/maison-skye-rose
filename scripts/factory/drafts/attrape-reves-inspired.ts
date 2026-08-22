// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — attrape-reves-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:49:54.122Z
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

export const attrapeRevesInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "attrape-reves-inspired",
  slug          : "attrape-reves-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Attrape Reves Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Floral"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Gourmand",
  season        : "Autumn",
  notes: {
    top:   ["Litchi", "Bergamot", "Ginger"],
    heart: ["Peony", "Turkish Rose", "Cacao"],
    base:  ["Patchouli"],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Floral Exotic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sweet",
    "Romantic",
    "Sophisticated",
    "Exotic",
    "Warm",
    "Sensual",
  ],
  occasions     : ["Date Night", "Evening", "Weekend", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Floral Gourmand Luxury", "Candied Elegance", "Exotic Romance"],
  recommendedFor: [
    "Women seeking a sophisticated gourmand that balances sweetness with floral elegance for evening occasions and intimate settings",
    "Those drawn to candied florals and exotic warmth who want a signature that feels both luxurious and wearable",
    "Anyone looking for an autumn fragrance that transitions seamlessly from date night to special occasions without feeling heavy",
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
  subtitle      : "Candied Florals",
  description   : "Litchi and ginger open with a bright, almost candied warmth, grounding into peony and Turkish rose at the heart—a floral sweetness touched by cacao's subtle earthiness. Patchouli anchors the composition, deepening the gourmand notes into something sensual and autumnal, never cloying.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "floral",
    "rose",
    "peony",
    "cacao",
    "patchouli",
    "litchi",
    "autumn",
    "date-night",
    "office",
    "rich",
    "full-bodied",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["love-don't-be-shy-inspired", "bianco-latte-inspired", "oriana-inspired"],
    wardrobePartners: ["delina-inspired", "good-girl-inspired"],
  },
};
