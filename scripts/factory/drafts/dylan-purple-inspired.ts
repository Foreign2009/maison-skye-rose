// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dylan-purple-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:36:50.860Z
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

export const dylanPurpleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dylan-purple-inspired",
  slug          : "dylan-purple-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Dylan Purple Inspired",
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
  season        : "Summer",
  notes: {
    top:   ["Italian Bergamot", "Italian Bitter Orange", "Pear Juice"],
    heart: ["Purple Freesia", "Mahonia", "Pomarosa"],
    base:  [
      "Ambroxan",
      "ISO E Super",
      "Virginia Cedar",
      "Belambre",
      "Sylkolide",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Bright Floral Fresh",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bright",
    "Fresh",
    "Feminine",
    "Modern",
    "Elegant",
    "Soft",
  ],
  occasions     : [
    "Daily Wear",
    "Casual",
    "Weekend",
    "Vacation",
    "Date Night",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Luminous Floral", "Bright Signature", "Summer Modern"],
  recommendedFor: [
    "Women seeking a luminous everyday fragrance that balances bright citrus freshness with soft floral elegance",
    "Those who love purple florals but want something wearable and modern rather than heavy or dated",
    "Anyone looking for a signature summer scent that transitions effortlessly from casual days to evening outings",
    "Fragrance lovers who appreciate balanced compositions where citrus and florals share equal presence",
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
  subtitle      : "Luminous Floral",
  description   : "Opens with bergamot and pear juice—a bright, citrused opening that catches the light. Purple freesia and mahonia bloom at the heart, soft and slightly green, while ambroxan and cedar anchor the composition with quiet warmth. A fragrance of luminous florals, clean and unrushed.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "freesia",
    "bergamot",
    "pear",
    "summer",
    "signature",
    "daily-wear",
    "balanced",
    "fresh",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "chance-eau-fraiche-inspired"],
    wardrobePartners: ["black-opium-inspired", "alien-goddess-inspired"],
  },
};
