// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — tuscan-leather-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:09:21.108Z
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

export const tuscanLeatherInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "tuscan-leather-inspired",
  slug          : "tuscan-leather-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Tuscan Leather Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Leather"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Leather Oriental",
  season        : "Winter",
  notes: {
    top:   ["Raspberry", "Saffron", "Thyme"],
    heart: ["Olibanum", "Jasmine"],
    base:  ["Leather", "Suede", "Woody Notes", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Leather Spicy",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Mysterious",
    "Sophisticated",
    "Intense",
    "Warm",
    "Powerful",
  ],
  occasions     : ["Date Night", "Evening", "Formal"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Leather Sensuality", "Spiced Oriental", "Winter Intensity"],
  recommendedFor: [
    "Those who appreciate leather as a sensual material and want a fragrance that celebrates its depth without apology",
    "Evening wearers seeking a sophisticated leather oriental that balances spice, florals, and woody darkness for intimate occasions",
    "Fragrance collectors building a winter rotation who value intensity, complexity, and a strong signature presence",
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
  subtitle      : "Dark Leather Sensuality",
  description   : "Leather opens with spiced warmth—saffron and thyme kindle against supple suede. Olibanum and jasmine soften the hide, while amber and woody notes anchor the composition in shadow and sensuality.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "leather",
    "oriental",
    "amber",
    "woody",
    "saffron",
    "jasmine",
    "winter",
    "date-night",
    "intense",
    "unisex",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["ombre-leather-inspired", "spicebomb-dark-leather-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
