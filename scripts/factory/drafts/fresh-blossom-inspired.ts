// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — fresh-blossom-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:49:12.804Z
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

export const freshBlossomInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "fresh-blossom-inspired",
  slug          : "fresh-blossom-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Fresh Blossom Inspired",
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
    top:   ["Grapefruit", "Apricot", "Cassis"],
    heart: ["Rose", "Lily of the Valley", "Jasmine"],
    base:  ["Red Apple", "Woodsy Notes"],
  },
  mood          : "Fresh Fruity Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Fresh",
    "Bright",
    "Romantic",
    "Youthful",
    "Elegant",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Date Night",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Bright Floral Sweetness", "Modern Feminine Signature", "Fresh Fruity Romance"],
  recommendedFor: [
    "Women seeking a bright, approachable floral that transitions seamlessly from morning to evening without heaviness",
    "Those who love fruity-floral compositions with grapefruit and apple freshness balanced by romantic rose",
    "Fragrance lovers wanting a spring signature that feels both youthful and sophisticated",
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
  subtitle      : "Bright Floral Sweetness",
  description   : "Grapefruit and apricot open with a bright, almost tart energy before a lush rose and lily of the valley heart softens the frame. Red apple and subtle woodsy notes anchor the composition, creating a fragrance that feels both luminous and grounded.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "rose",
    "jasmine",
    "grapefruit",
    "spring",
    "signature",
    "feminine",
    "daily-wear",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],

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
    wardrobePartners: ["la-vie-est-belle-inspired", "coco-mademoiselle-inspired"],
  },
};
