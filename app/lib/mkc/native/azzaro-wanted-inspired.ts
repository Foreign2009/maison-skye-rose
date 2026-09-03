// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — azzaro-wanted-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-02T17:26:08.389Z
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

export const azzaroWantedInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "azzaro-wanted-inspired",
  slug          : "azzaro-wanted-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Azzaro Wanted Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aromatic",
  season        : "Autumn",
  notes: {
    top:   ["Cardamom", "Grapefruit", "Star Anise"],
    heart: ["Juniper Berries", "Suede"],
    base:  ["Vetiver", "Guaiac Wood", "Amberwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Bold Woody Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Confident",
    "Warm",
    "Sophisticated",
    "Magnetic",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Woody Confidence", "Balanced Aromatic Signature", "Modern Spiced Warmth"],
  recommendedFor: [
    "Men seeking a warm woody signature that balances sharp spice with soft depth for professional and evening wear",
    "Those who appreciate aromatic complexity over fresh simplicity and want cardamom and vetiver to anchor their presence",
    "Anyone looking for a confident autumn fragrance that works from office to date night without reinvention",
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
  subtitle      : "Warm Woody Confidence",
  description   : "Cardamom and grapefruit ignite a sharp, almost austere opening that dissolves into soft suede and juniper. Vetiver and guaiac wood anchor the composition with a warm, resinous depth—less cologne, more intimate woody whisper.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "cardamom",
    "vetiver",
    "guaiac-wood",
    "masculine",
    "balanced",
    "signature",
    "office",
    "date-night",
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
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};
