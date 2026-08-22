// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — 212-vip-black-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:52:13.919Z
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

export const _212VipBlackInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "212-vip-black-inspired",
  slug          : "212-vip-black-inspired",
  brand         : "Maison Skye & Rose",
  name          : "212 Vip Black Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Fougere",
  season        : "Winter",
  notes: {
    top:   ["Absinthe", "Anise", "Fennel"],
    heart: ["Lavender"],
    base:  ["Black Vanilla Husk", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Spicy Aromatic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Mysterious",
    "Warm",
    "Bold",
    "Mature",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Dark Aromatic Elegance", "Spiced Sophistication", "Winter Signature"],
  recommendedFor: [
    "Men seeking a dark, spiced aromatic that commands presence without aggression in evening and winter settings",
    "Those who appreciate herbal complexity and anise-forward compositions that feel sophisticated rather than sweet",
    "Anyone looking for a balanced signature that transitions seamlessly from dinner to after-hours occasions",
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
  subtitle      : "Dark Aromatic Elegance",
  description   : "Absinthe and anise open with a sharp, almost austere clarity—spirit-like and mineral. A whisper of lavender softens the aromatic intensity before black vanilla husk and musk settle into a warm, skin-like base that feels both intimate and distinctly masculine.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "fougere",
    "anise",
    "lavender",
    "vanilla",
    "musk",
    "spicy",
    "winter",
    "signature",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "le-male-elixir-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};
