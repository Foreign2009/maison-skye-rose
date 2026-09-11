// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — 212-vip-rose-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-11T18:49:34.325Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: PASS  [0 error(s), 0 warning(s)]
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

export const _212VipRoseInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "212-vip-rose-inspired",
  slug          : "212-vip-rose-inspired",
  brand         : "Maison Skye & Rose",
  name          : "212 VIP Rose Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity Woody",
  season        : "Spring",
  notes: {
    top:   ["Champagne Rosé", "Pink Pepper"],
    heart: ["Peach Blossom", "Rose"],
    base:  ["Queenwood", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Luminous Feminine Magnetic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Magnetic",
    "Luminous",
    "Feminine",
    "Playful",
    "Sophisticated",
    "Warm",
  ],
  occasions     : [
    "Daily Wear",
    "Wedding",
    "Date Night",
    "Weekend",
    "Evening",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Effervescent Elegance", "Modern Rose Icon", "Luminous Feminine"],
  recommendedFor: [
    "Women seeking an elegant signature that balances celebration with everyday sophistication",
    "Those who love rose but want brightness and playfulness over classic romance",
    "Anyone drawn to fruity florals with enough depth to transition from day to evening",
    "Gift-givers looking for a universally flattering fragrance with personality and warmth",
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
  subtitle      : "Effervescent Femininity",
  description   : "Opens with the fizz of rosé and pink pepper—effervescent, celebratory, alive. A heart of peach blossom and rose unfolds with luminous warmth, grounded by queenwood and musk that anchor the composition in sensual depth rather than sugar.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "fruity",
    "woody",
    "peach",
    "pink-pepper",
    "champagne",
    "feminine",
    "signature",
    "spring",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "mon-paris-inspired", "chance-eau-tendre-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "alien-inspired"],
  },
};
