// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — gucci-flora-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:07:36.712Z
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

export const gucciFloraInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gucci-flora-inspired",
  slug          : "gucci-flora-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gucci Flora Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity",
  season        : "Spring",
  notes: {
    top:   ["Pear Blossom", "Red Berries", "Italian Mandarin"],
    heart: ["Gardenia", "Jasmine", "Frangipani"],
    base:  ["Brown Sugar", "Patchouli"],
  },
  notesEvidenceLocked: true,
  mood          : "Bright Fruity Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bright",
    "Fresh",
    "Elegant",
    "Youthful",
    "Playful",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Wedding",
    "Weekend",
    "Casual",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Bright Floral Fruity", "Spring Signature", "Luminous Everyday"],
  recommendedFor: [
    "Women seeking a luminous everyday fragrance that balances fresh fruit with creamy florals for spring and summer wear.",
    "Those who love gardenia-forward scents but want brightness and playfulness rather than intensity or depth.",
    "Fragrance lovers building a collection who need a cheerful, moderate-projection signature for daily wear and social occasions.",
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
  subtitle      : "Luminous Fruit & Gardenia",
  description   : "Pear blossom and Italian mandarin open with crisp fruit brightness, a burst of spring morning light. The heart unfolds into creamy gardenia and jasmine, grounded by a whisper of brown sugar and patchouli—luminous florals with subtle depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "gardenia",
    "jasmine",
    "pear",
    "balanced",
    "signature",
    "spring",
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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "chance-eau-tendre-inspired"],
    wardrobePartners: ["coco-mademoiselle-inspired"],
  },
};
