// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — vetiver-golden-vanilla-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-12T19:03:40.145Z
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

export const vetiverGoldenVanillaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "vetiver-golden-vanilla-inspired",
  slug          : "vetiver-golden-vanilla-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Vetiver Golden Vanilla Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Aromatic", "Vanilla", "Woody"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aromatic Vanilla",
  season        : "All Season",
  notes: {
    top:   ["Cardamom", "Grapefruit Tea"],
    heart: ["Vetiver", "Lavender", "Clary Sage"],
    base:  ["Vanilla", "Cistus Labdanum"],
    // Evidence-locked to nordstrom.com (Vetiver & Golden Vanilla Cologne Intense): Top "cardamom, grapefruit tea";
    // Middle "vetiver, lavender, clary sage"; Base "vanilla, cistus labdanum". PYRAMID_SECONDARY_SUPPORTED.
    // Listing shown as no longer available (reference availability only; says nothing about our supplier).
    // Profile "Woody Aromatic Vanilla" is EDITORIAL (no inspected family). See wave-9-source-evidence.json (revision 9).
  },
  notesEvidenceLocked: true,
  mood          : "Refined Warm Grounded",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Grounded",
    "Refined",
    "Warm",
    "Sophisticated",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Casual"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Grounded Aromatic Elegance", "Refined Woody Vanilla", "Warm Sophisticated Unisex"],
  recommendedFor: [
    "Anyone seeking a refined all-season signature that balances warmth with grounded herbaceous elegance.",
    "Those who love vetiver and vanilla together, opened by cardamom and an aromatic lift.",
    "Fragrance lovers building a unisex wardrobe who enjoy herbal lavender and clary sage softened by vanilla.",
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
  subtitle      : "Warm Grounded Elegance",
  description   : "Cardamom and grapefruit tea open with a bright, lightly spiced lift before vetiver, lavender and clary sage establish a grounded, herbaceous core. Vanilla and cistus labdanum settle into a warm, resinous base that feels both refined and deeply comforting.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "vanilla",
    "woody",
    "vetiver",
    "cardamom",
    "unisex",
    "grounded",
    "refined",
    "layering",
    "signature-scent",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Woody Aromatic Vanilla", season="All Season").
  // "Vanilla" in the editorial profile drives sweetness 4 / Rich & Full-Bodied; "Woody Aromatic" alone would give
  // sweetness 2, freshness 2, warmth 3, Balanced Signature — founder profile decision pending.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch3). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};
