// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — 212-heroes-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:26:32.882Z
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

export const _212HeroesInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "212-heroes-inspired",
  slug          : "212-heroes-inspired",
  brand         : "Maison Skye & Rose",
  name          : "212 Heroes Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Fruity",
  season        : "Spring",
  notes: {
    top:   ["Pear", "Cannabis", "Ginger"],
    heart: ["Geranium", "Sage"],
    base:  ["Musk", "Leather"],
  },
  notesEvidenceLocked: true,
  mood          : "Bold Aromatic Fruity",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Confident",
    "Herbal",
    "Sharp",
    "Sophisticated",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Wedding"],
  seasons       : ["Spring"],
  signatureStyle: ["Herbal Aromatic Edge", "Bold Signature", "Modern Herbalist"],
  recommendedFor: [
    "Men who want a bold aromatic statement that refuses to blend into the background—sharp, herbal, and confidently unconventional.",
    "Those seeking a spring fragrance with genuine personality, where pear and ginger lead into leather and sage rather than fade into sweetness.",
    "Anyone building a signature collection who values herbal complexity and confident character for daily wear that still commands respect.",
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
  subtitle      : "Herbal Edge",
  description   : "Pear and ginger ignite a sharp, green aromatic opening that pivots toward leather and geranium—a composition that refuses softness. Cannabis and sage create an herbal architecture that feels both botanical and boldly unconventional. Musk grounds the entire structure in quiet sensuality.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "fruity",
    "pear",
    "ginger",
    "geranium",
    "sage",
    "musk",
    "leather",
    "balanced",
    "signature",
    "daily-wear",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["hacivat-inspired", "y-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
