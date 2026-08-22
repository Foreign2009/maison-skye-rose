// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — changing-constance-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:49:01.467Z
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

export const changingConstanceInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "changing-constance-inspired",
  slug          : "changing-constance-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Changing Constance Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Gourmand",
  season        : "Autumn",
  notes: {
    top:   ["Cardamom", "Pimento Seeds"],
    heart: ["Caramel", "Salt"],
    base:  ["Vanilla", "Cashmeran", "Tobacco"],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Spicy Gourmand",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Sophisticated",
    "Magnetic",
    "Composed",
  ],
  occasions     : ["Date Night", "Office", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Sophisticated Gourmand", "Spiced Sweetness", "Warm Sensuality"],
  recommendedFor: [
    "Women seeking a sophisticated gourmand that balances sweetness with spice and smoke for evening elegance",
    "Those who love warm, edible fragrances with complexity—caramel and vanilla paired with cardamom and tobacco depth",
    "Anyone looking for an autumn signature that feels composed and mature rather than candy-sweet",
    "Women drawn to sensual, full-bodied scents that transition seamlessly from date night to intimate evenings",
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
  subtitle      : "Spiced Sweetness",
  description   : "Cardamom and pimento seeds ignite a warm spice that yields to salted caramel—sweet, slightly smoky, utterly composed. Vanilla and cashmeran anchor the base in soft gourmand comfort, while a whisper of tobacco adds quiet sophistication to what could have been simple indulgence.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "vanilla",
    "caramel",
    "cardamom",
    "tobacco",
    "warm",
    "spiced",
    "autumn",
    "date-night",
    "office",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["hypnotic-poison-inspired", "black-opium-inspired", "love-don't-be-shy-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "naxos-inspired"],
  },
};
