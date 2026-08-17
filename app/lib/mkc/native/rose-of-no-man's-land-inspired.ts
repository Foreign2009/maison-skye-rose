// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — rose-of-no-man's-land-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:03:30.263Z
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

export const roseOfNoMansLandInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "rose-of-no-man's-land-inspired",
  slug          : "rose-of-no-man's-land-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Rose of No Man's Land Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    top:   ["Turkish Rose", "Pink Pepper"],
    heart: ["Turkish Rose", "Raspberry Bloom"],
    base:  ["Papyrus", "White Amber"],
  },
  mood          : "Romantic Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Soft",
    "Elegant",
    "Warm",
    "Delicate",
    "Bright",
  ],
  occasions     : ["Daily Wear", "Date Night", "Wedding", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Romantic Floral", "Tender Bloom", "Spring Signature"],
  recommendedFor: [
    "Women and men seeking a romantic floral signature that feels both tender and subtly complex",
    "Those who love rose but want pink pepper and raspberry to add dimension and freshness",
    "Anyone drawn to spring florals that work beautifully for weddings, dates, and everyday moments of connection",
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
  subtitle      : "Tender Bloom",
  description   : "Turkish rose unfolds with pink pepper's subtle bite, deepening into raspberry bloom and papyrus whispers. White amber settles beneath—a tender, papery base that catches light like skin warmed by spring sun.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "turkish-rose",
    "pink-pepper",
    "raspberry",
    "papyrus",
    "white-amber",
    "romantic",
    "signature-scent",
    "layering",
    "wedding",
    "unisex",
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
    alternatives:     ["delina-inspired", "chance-eau-tendre-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired", "mon-paris-inspired"],
  },
};
