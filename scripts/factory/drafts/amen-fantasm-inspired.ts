// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — amen-fantasm-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:03:29.799Z
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

export const amenFantasmInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "amen-fantasm-inspired",
  slug          : "amen-fantasm-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Amen Fantasm Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Spicy",
  season        : "Autumn",
  notes: {
    top:   ["Pink Pepper", "Citrus", "Bergamot"],
    heart: ["Dark Chocolate", "Clary Sage"],
    base:  ["Patchouli"],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Sweet Spicy",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Mysterious",
    "Sophisticated",
    "Confident",
    "Sensual",
    "Bold",
    "Magnetic",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Oriental Spice", "Sophisticated Gourmand", "Modern Enigmatic"],
  recommendedFor: [
    "Men seeking a dark, sophisticated spicy fragrance that commands attention without aggression in professional and intimate settings.",
    "Those who appreciate oriental depth with gourmand sweetness but want an edgy, mysterious character rather than comfort.",
    "Anyone building a signature collection who needs a confident autumn statement that bridges office credibility with date night intrigue.",
    "Fragrance enthusiasts drawn to layered compositions where pink pepper's brightness plays against dark chocolate and earthy patchouli.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Dark Sweet Spice",
  description   : "Pink pepper and bergamot open with bright, almost metallic clarity before dark chocolate and clary sage deepen into something more enigmatic. Patchouli anchors the composition, grounding the sweetness with earthy restraint—a fragrance that moves from luminous to shadowed across the skin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "spicy",
    "oriental",
    "patchouli",
    "dark-chocolate",
    "pink-pepper",
    "bergamot",
    "autumn",
    "layering",
    "rich",
    "full-bodied",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "tobacco-vanille-inspired", "1-million-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired", "stronger-with-you-inspired"],
  },
};
