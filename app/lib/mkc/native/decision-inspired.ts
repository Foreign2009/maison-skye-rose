// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — decision-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:47:49.149Z
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

export const decisionInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "decision-inspired",
  slug          : "decision-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Decision Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aromatic",
  season        : "Autumn",
  notes: {
    top:   ["Cardamom", "Bergamot", "Pink Pepper"],
    heart: ["Frankincense", "Myrrh", "Juniper Berries"],
    base:  ["Vanilla", "Cedarwood", "Patchouli"],
  },
  mood          : "Woody Resinous Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Resolute",
    "Grounded",
    "Sophisticated",
    "Intense",
    "Sacred",
    "Confident",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Woody Resinous Aromatic", "Resolute Incense", "Balanced Signature"],
  recommendedFor: [
    "Those seeking a unisex woody aromatic that commands presence without aggression, perfect for professional settings and intimate evenings alike",
    "Men and women drawn to incense-forward fragrances with resinous depth—frankincense and myrrh lovers who value substance over sweetness",
    "Anyone building a signature collection who wants one fragrance that bridges boardroom confidence and thoughtful solitude",
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
  subtitle      : "Resolute Incense",
  description   : "Cardamom and bergamot strike a sharp, deliberate opening—the moment before commitment. Frankincense and myrrh unfold beneath, building a resinous core that feels both sacred and grounded, while cedarwood and vanilla anchor the composition in warm, contemplative depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "cardamom",
    "bergamot",
    "frankincense",
    "cedarwood",
    "patchouli",
    "unisex",
    "signature",
    "autumn",
    "balanced",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["sauvage-elixir-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};
