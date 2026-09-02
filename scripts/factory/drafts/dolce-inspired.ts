// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dolce-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:28:36.335Z
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

export const dolceInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dolce-inspired",
  slug          : "dolce-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Dolce Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["White Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "White Floral",
  season        : "Spring",
  notes: {
    top:   ["Neroli", "Papaya Blossom", "White Amaryllis"],
    heart: ["Cashmere Daffodil", "White Muguet", "White Narcissus"],
    base:  ["Ambroxan", "Sandalwood", "Cashmeran", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Soft White Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Soft",
    "Elegant",
    "Luminous",
    "Sophisticated",
    "Delicate",
    "Feminine",
  ],
  occasions     : ["Daily Wear", "Office", "Wedding", "Date Night"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Soft White Floral", "Luminous Elegance", "Balanced Signature"],
  recommendedFor: [
    "Women seeking a soft yet substantial signature fragrance that works across seasons despite its spring soul.",
    "Those who love white florals but want luminous elegance over heavy sweetness or intense projection.",
    "Anyone looking for a fragrance that bridges everyday wear and special occasions with graceful versatility.",
    "Women who appreciate creamy, airy florals with a sophisticated base that grounds without overwhelming.",
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
  subtitle      : "Soft Luminescence",
  description   : "White amaryllis and neroli open into a luminous heart of muguet and daffodil, their creamy petals hovering above a soft base of sandalwood and ambroxan. The composition breathes—airy yet substantial, innocent yet sensual.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "white-floral",
    "neroli",
    "muguet",
    "sandalwood",
    "musk",
    "signature-scent",
    "spring",
    "balanced",
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
    alternatives:     ["alien-inspired", "my-way-inspired", "bloom-inspired"],
    wardrobePartners: ["prada-l'homme-inspired", "good-girl-inspired"],
  },
};
