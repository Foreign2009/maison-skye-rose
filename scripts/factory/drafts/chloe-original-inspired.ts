// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — chloe-original-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:07:24.690Z
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

export const chloeOriginalInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "chloe-original-inspired",
  slug          : "chloe-original-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Chloe Original Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    top:   ["Peony", "Litchi", "Freesia"],
    heart: ["Rose", "Lily-of-the-Valley", "Magnolia"],
    base:  ["Virginia Cedar", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Soft Powdery Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Elegant",
    "Luminous",
    "Delicate",
    "Sophisticated",
    "Balanced",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Wedding",
    "Date Night",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Soft Floral Signature", "Powdery Elegance", "Luminous Rose"],
  recommendedFor: [
    "Women seeking a signature floral that balances softness with presence for everyday elegance",
    "Those who love peony and rose but prefer powdery refinement over heavy florals",
    "Anyone building a spring wardrobe who wants a fragrance that feels both delicate and confidently wearable",
    "Fragrance lovers drawn to balanced, luminous scents that work from office to evening without reinvention",
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
  subtitle      : "Soft Luminosity",
  description   : "Peony and litchi open with a whisper of freesia, immediately soft and luminous. Rose settles into lily-of-the-valley and magnolia—a powdery floral heart that feels both delicate and present. Virginia cedar and amber anchor the composition without heaviness, leaving only a refined, skin-close finish.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "peony",
    "lily-of-the-valley",
    "signature-scent",
    "spring",
    "balanced",
    "elegant",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["miss-dior-inspired", "chance-inspired"],
    wardrobePartners: ["blanche-bete-inspired", "love-don't-be-shy-inspired"],
  },
};
