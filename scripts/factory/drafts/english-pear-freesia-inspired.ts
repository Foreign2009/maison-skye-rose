// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — english-pear-freesia-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:07:35.457Z
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

export const englishPearFreesiaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "english-pear-freesia-inspired",
  slug          : "english-pear-freesia-inspired",
  brand         : "Maison Skye & Rose",
  name          : "English Pear Freesia Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity",
  season        : "Spring",
  notes: {
    top:   [],
    heart: [
      "Pear",
      "Melon",
      "Freesia",
      "Rose",
      "Musk",
      "Amber",
      "Patchouli",
      "Rhubarb",
    ],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Fruity Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Luminous",
    "Elegant",
    "Soft",
    "Balanced",
    "Refined",
  ],
  occasions     : ["Daily Wear", "Casual", "Weekend", "Wedding"],
  seasons       : ["Spring"],
  signatureStyle: ["Fresh Floral Fruity", "Spring Luminescence", "Balanced Elegance"],
  recommendedFor: [
    "Anyone seeking a fresh, approachable floral fruity that transitions seamlessly from spring mornings to casual social occasions.",
    "Women and those preferring feminine florals who want luminous pear and freesia without heavy or intensely sweet compositions.",
    "Fragrance collectors building a spring rotation who value balanced compositions that respect both fruit and floral registers.",
    "Gift-givers looking for an elegant, universally appealing unisex fragrance that reads polished and effortlessly sophisticated.",
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
  subtitle      : "Orchard Luminescence",
  description   : "Crisp pear and freesia alongside melon and rhubarb—fresh, luminous, with rose and musk softening the brightness. Amber and patchouli add quiet depth, creating a composition that feels both weightless and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "pear",
    "freesia",
    "rose",
    "musk",
    "unisex",
    "spring",
    "signature",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "chance-eau-tendre-inspired", "mon-paris-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
