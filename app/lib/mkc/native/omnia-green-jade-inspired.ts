// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — omnia-green-jade-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:07:13.838Z
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

import type { FragranceKnowledge } from "../types";

export const omniaGreenJadeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "omnia-green-jade-inspired",
  slug          : "omnia-green-jade-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Omnia Green Jade Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Aquatic", "Floral"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Aquatic",
  season        : "Summer",
  notes: {
    top:   ["Green Notes", "Mandarin Orange"],
    heart: ["Jasmine", "Peony", "Pear Blossom"],
    base:  ["Woodsy Notes", "Pistachio", "Musk"],
  },
  mood          : "Fresh Green Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Elegant",
    "Bright",
    "Delicate",
    "Sophisticated",
    "Clean",
  ],
  occasions     : [
    "Daily Wear",
    "Casual",
    "Office",
    "Weekend",
    "Vacation",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Fresh Green Floral", "Modern Aquatic Elegance", "Luminous Everyday"],
  recommendedFor: [
    "Women seeking a fresh green floral that feels luminous and natural without heavy sweetness",
    "Those who love spring and summer florals but want something with modern aquatic brightness and subtlety",
    "Anyone looking for a signature everyday fragrance that transitions seamlessly from casual to social settings",
    "Fragrance lovers drawn to verdant, garden-inspired scents with delicate fruity undertones",
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
  subtitle      : "Fresh Green Floral",
  description   : "A verdant floral that opens with bright green notes and mandarin, settling into a luminous heart of jasmine and peony touched with pear blossom. Woodsy accords and a whisper of pistachio ground the composition in quiet sophistication.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aquatic",
    "floral",
    "jasmine",
    "peony",
    "fresh",
    "light",
    "summer",
    "green-notes",
    "citrus",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["coco-mademoiselle-inspired", "chance-eau-fraiche-inspired", "yellow-diamond-inspired", "omnia-crystalline-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
