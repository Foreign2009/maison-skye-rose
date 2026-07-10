// Maison Knowledge Catalogue — Acqua Di Gio Profondo Inspired
import type { FragranceKnowledge } from "../types";

export const acquaDiGioProfondoInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "acqua-di-gio-profondo-inspired",
  slug:           "acqua-di-gio-profondo-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Acqua Di Gio Profondo Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Aquatic", "Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Aquatic Aromatic",
  season:  "Summer",
  notes: {
    top:   ["Bergamot", "Mineral Notes", "Rosemary"],
    heart: ["Aquatic Accord", "Geranium", "Sea Notes"],
    base:  ["Patchouli", "Mineral Amber", "Musk"],
  },
  mood: "Mineral notes, sea depth and patchouli — the aquatic that stays when the occasion demands more than freshness.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Bold", "Confident", "Powerful", "Modern", "Luxury", "Sophisticated"],
  occasions:      ["Summer Days", "Weekend", "Date Night", "Evening"],
  seasons:        ["Spring", "Summer"],
  signatureStyle: ["Mineral Ocean Depth", "Dark Aquatic Presence", "Confident Exploration"],
  recommendedFor: [
    "Those who have worn the original Aqua Di Gio and found themselves wanting something with more depth and projection — Profondo takes the same marine freshness and adds a mineral weight that commands attention rather than simply refreshing",
    "Men building a summer wardrobe who want one clean daytime option and one more assertive evening alternative — Profondo occupies the evening position in the aquatic register, darker and more present than a conventional summer signature while remaining unmistakably fresh",
    "Those who want bold summer projection without resorting to the heavier sweetness of amber masculines — Profondo reaches intensity:4 in a completely clean, mineral frame, delivering presence through depth rather than through warmth",
    "Customers deciding between Profondo and Acqua Di Gio Parfum — Profondo is the mineral summer choice, darker and sea-driven; Parfum is the incense-warmed choice with broader autumn range; both advance the same aquatic lineage but toward different destinations",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: false,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Ocean Depth",
  description:
    "Acqua Di Gio Profondo Inspired opens with Bergamot and Mineral Notes — a fresh opening that carries geological weight beneath its surface brightness. " +
    "The aquatic heart introduces Sea Notes and Geranium in an accord that goes further than the conventional marine masculine, deeper and more mineral than breezy summer freshness alone can reach. " +
    "Patchouli and Mineral Amber in the base anchor the composition with earthy authority — the aquatic DNA taken from its original brightness into something with genuine presence and depth.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "choosing-your-season-scent",
    "how-to-wear-fragrance",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
    "occasion-guide",
  ],
  educationTags: [
    "bergamot", "mineral", "sea-notes", "aquatic", "patchouli", "rosemary",
    "fresh", "masculine", "summer", "dark", "powerful", "bold", "ocean",
  ],
  learningPath: [
    "guide-to-fragrance-families",
    "the-note-pyramid-explained",
    "choosing-your-season-scent",
    "how-to-wear-fragrance",
  ],

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Mineral aquatic benchmark. Distinct from Aqua Di Gio Inspired (freshness:5, intensity:2 —
  // the breezy summer classic) by depth and projection: Profondo is freshness:4 (mineral weight
  // tempers pure freshness from the original's tier) and intensity:4 (powerful and assertive).
  // Compare with Hawas (freshness:4, intensity:4) — same coordinate pair via different note
  // routes: Hawas via apple/jasmine/fruity-aquatic; Profondo via mineral/sea/patchouli.
  // The ADG lineage step-change: original (freshness:5, intensity:2) → Profondo
  // (freshness:4, intensity:4) → Parfum (freshness:3, warmth:3, intensity:4 — incense).
  // sweetness:1 and warmth:2 confirm the cold-mineral character throughout.
  sweetness:   1,
  freshness:   4,
  warmth:      2,
  intensity:   4,
  versatility: 3,
  popularity:  5,
};
