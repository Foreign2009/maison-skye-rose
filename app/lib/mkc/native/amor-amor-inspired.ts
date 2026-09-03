// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — amor-amor-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:28:24.454Z
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

import type { FragranceKnowledge } from "../types";

export const amorAmorInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "amor-amor-inspired",
  slug          : "amor-amor-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Amor Amor Inspired",
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
    top:   ["Grapefruit", "Black Currant", "Cassis", "Mandarin Orange"],
    heart: ["Jasmine", "Rose", "Freesia"],
    base:  [
      "Musk",
      "Sandalwood",
      "Patchouli",
      "Amber",
      "Vetiver",
      "Vanilla",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Fruity Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Luminous",
    "Playful",
    "Romantic",
    "Fresh",
    "Sophisticated",
  ],
  occasions     : [
    "Daily Wear",
    "Casual",
    "Weekend",
    "Vacation",
    "Date Night",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Radiant Floral Fruity", "Balanced Signature", "Warm Summer Icon"],
  recommendedFor: [
    "Women seeking a radiant everyday fragrance that balances fruity brightness with soft floral warmth",
    "Those who love rose and jasmine but want something fresher and less heavy than traditional florals",
    "Anyone looking for a signature summer scent that works from beach days to casual evenings",
    "Fragrance lovers who appreciate balanced compositions where citrus and musk create an intimate glow",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Radiant Warmth",
  description   : "Grapefruit and black currant open with bright, almost tart energy, softening into a heart of jasmine and rose that feels both luminous and intimate. Sandalwood and amber anchor the composition with quiet warmth, creating a fragrance that feels like sun-kissed skin in summer's golden hour.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "rose",
    "jasmine",
    "grapefruit",
    "summer",
    "signature",
    "balanced",
    "daily-wear",
    "fruity-floral",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "very-good-girl-inspired"],
    wardrobePartners: ["alien-goddess-inspired", "black-opium-inspired"],
  },
};
