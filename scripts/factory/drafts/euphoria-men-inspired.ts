// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — euphoria-men-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:26:59.137Z
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

export const euphoriaMenInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "euphoria-men-inspired",
  slug          : "euphoria-men-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Euphoria Men Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Woody",
  season        : "Autumn",
  notes: {
    top:   ["Ginger", "Pepper"],
    heart: ["Black Basil", "Sage", "Cedar"],
    base:  ["Amber", "Suede", "Brazilian Redwood", "Patchouli"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Aromatic Dark",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Spiced",
    "Confident",
    "Grounded",
    "Mysterious",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Aromatic Dark", "Balanced Spiced Woody", "Modern Sophisticated Warmth"],
  recommendedFor: [
    "Men seeking a warm, spiced signature that bridges professional polish and evening sophistication.",
    "Those who want aromatic depth without sweetness—grounded by cedar, suede, and dark basil.",
    "Anyone drawn to autumn and winter warmth who appreciates balanced projection for office and intimate settings.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Warm Aromatic Dark",
  description   : "Ginger and pepper ignite a dark aromatic core of black basil and sage, grounded by cedar and suede. Amber and Brazilian redwood emerge as the warmth deepens, creating a fragrance that feels both spiced and intimate—sophisticated without softness.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "ginger",
    "pepper",
    "basil",
    "cedar",
    "amber",
    "patchouli",
    "warm",
    "signature",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-elixir-inspired", "stronger-with-you-inspired"],
    wardrobePartners: ["bleu-de-chanel-inspired", "spicebomb-extreme-inspired"],
  },
};
