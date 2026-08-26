// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — prada-paradigme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:05:37.461Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: FAIL  [4 error(s), 0 warning(s)]
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

export const pradaParadigmeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "prada-paradigme-inspired",
  slug          : "prada-paradigme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Prada Paradigme Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : [],  // FACTORY_ERROR: FAMILY_EMPTY — at least one fragrance family is required
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Fougère",
  season        : "Autumn",
  notes: {
    top:   ["Calabrian Bergamot", "Musk"],
    heart: ["Bourbon Geranium", "Rose Geranium"],
    base:  ["Benzoin", "Peru Balsam", "Guaiac Wood"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Aromatic Oriental",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Balanced",
    "Elegant",
    "Magnetic",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Casual"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Aromatic Signature", "Balanced Oriental", "Office-to-Evening Elegance"],
  recommendedFor: [
    "Men seeking a warm, balanced signature that transitions seamlessly from office to evening without reinvention",
    "Those who appreciate geranium's dual nature—sharp and honeyed—over purely sweet or purely fresh approaches",
    "Anyone looking for an aromatic oriental with restraint and wearability, not theatrical intensity",
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
  subtitle      : "Warm Aromatic Embrace",
  description   : "Opens with bright bergamot and a whisper of musk, then settles into the warm embrace of geranium—both sharp and honeyed at once. Benzoin and Peru balsam build a resinous, almost creamy base, while guaiac wood adds a subtle woodsmoke finish that lingers like memory.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-fougère",
    "bergamot",
    "geranium",
    "benzoin",
    "guaiac-wood",
    "balanced",
    "signature-scent",
    "office-wear",
    "date-night",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["prada-l'homme-inspired", "le-male-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};
