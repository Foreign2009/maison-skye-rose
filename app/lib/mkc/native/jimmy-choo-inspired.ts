// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — jimmy-choo-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-10T17:57:04.350Z
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

export const jimmyChooInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "jimmy-choo-inspired",
  slug          : "jimmy-choo-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Jimmy Choo Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity", "Sweet"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  // PROPOSED EDITORIAL PROFILE (2026-10-11, for review — not a supplier confirmation or promotion approval):
  //   "Fruity Floral Sweet" uses authorised-retailer classifications: Nordstrom style "Fruity, floral",
  //   Ulta family "Sweet". Other classifications kept on record: "fruity chypre" (Nordstrom story, Ulta scent
  //   type, John Lewis). Previous editorial mapping: "Floral Gourmand" (no authorised source uses "Gourmand").
  //   family and scentCharacter are derived by knowledgeAdapter from this profile.
  profile       : "Fruity Floral Sweet",
  season        : "Spring",
  notes: {
    // Pyramid matches the inspected johnlewis.com EDP listing (authorised): top "Pear, mandarin orange",
    //   heart "Orchid", base "Patchouli, toffee". "Tiger Orchid" naming per nordstrom.com, ulta.com and
    //   debenhams.com (first-party). "Green Notes" removed 2026-10-11: listed only by scentverdict.com
    //   (third-party database), by no authorised source.
    // WORDING VARIANTS between authorised sources: Nordstrom/Debenhams "sweet Italian orange" (vs John Lewis
    //   "mandarin orange"); Nordstrom "caramel" (vs John Lewis/Debenhams "toffee"). See wave-9-source-evidence.json.
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected): founder wording
    //   "original women's Jimmy Choo, EDP". Reference edition used: Jimmy Choo EDP (2011).
    top:   ["Pear", "Mandarin Orange"],
    heart: ["Tiger Orchid"],
    base:  ["Toffee", "Patchouli"],
  },
  notesEvidenceLocked: true,
  mood          : "Feminine Playful Modern",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Playful",
    "Modern",
    "Sensual",
    "Warm",
    "Sophisticated",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Date Night",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer", "Autumn"],
  signatureStyle: ["Modern Fruity Floral", "Playful Elegance", "Sensual Softness"],
  recommendedFor: [
    "Women who want a signature fragrance that balances floral elegance with fruity sweetness for everyday confidence",
    "Those seeking a playful, modern feminine scent that suits both office and evening without feeling heavy",
    "Anyone drawn to orchid-led florals who appreciates a touch of toffee sweetness and sensual depth",
    "Women building a fragrance wardrobe who want a playful floral alongside bolder scents",
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
  subtitle      : "Floral Sweetness",
  description   : "Pear and mandarin open with crisp, fruit-bright clarity. Tiger orchid blooms alone at the heart, sensual and quietly confident. Toffee and patchouli close the composition with soft, sweet depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fruity",
    "floral",
    "sweet",
    "patchouli",
    "toffee",
    "feminine",
    "playful",
    "layering",
    "daily-wear",
    "wedding",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Fruity Floral Sweet", season="Spring").
  // sweetness:4 (sweet), freshness:3 (floral), warmth:2 (else), intensity:2 (Spring), versatility:3 (Spring).
  // scentCharacter "Rich & Full-Bodied" per deriveScentCharacter (has "sweet").
  // Scores are heuristic-derived approximations (knowledgeAdapter.ts line 208). No calibration producer in pipeline.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification.
  // Validator (validator.ts): BOTH alternatives AND wardrobePartners require reciprocity
  // when allRecords is provided — RELATIONSHIP_ALTERNATIVES_NOT_RECIPROCAL and
  // RELATIONSHIP_WARDROBE_PARTNERS_NOT_RECIPROCAL both fire. Empty arrays pass without error.
  // Proposed pairings retained in catalogue-expansion-ledger.json → pending_relationship_proposals.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
