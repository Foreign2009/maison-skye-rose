// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — crazy-in-love-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:50:32.492Z
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

export const crazyInLoveInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "crazy-in-love-inspired",
  slug          : "crazy-in-love-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Crazy in Love Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Floral",
  season        : "Autumn",
  notes: {
    top:   ["Wild Rose", "Violet Leaves"],
    heart: ["Saffron", "Brown Sugar"],
    base:  ["Amber", "Vanilla Bean"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Floral Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Sophisticated",
    "Balanced",
    "Magnetic",
    "Elegant",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Floral Oriental", "Spiced Elegance", "Sensual Signature"],
  recommendedFor: [
    "Women seeking a warm, spiced floral signature that transitions beautifully from office to evening",
    "Those who love rose and amber but want sophistication over sweetness—balanced, never cloying",
    "Anyone drawn to sensual oriental florals with an edgy saffron note that feels modern and unexpected",
    "Women building a fragrance wardrobe who need one scent that works for professional settings and intimate occasions",
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
  subtitle      : "Warm Floral Intimacy",
  description   : "Wild rose and violet leaves open with a gentle green bite, then melt into saffron and caramelized brown sugar—a warm, sensual heart that feels both spiced and sweet. Amber and vanilla bean warm the base with dark, unhurried richness—an Oriental floral that is intimate without apology.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "oriental-floral",
    "rose",
    "amber",
    "vanilla",
    "saffron",
    "signature-scent",
    "autumn",
    "date-night",
    "layering",
    "balanced",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "mon-paris-inspired", "good-girl-blush-inspired"],
    wardrobePartners: ["black-opium-inspired", "chance-eau-fraiche-inspired"],
  },
};
