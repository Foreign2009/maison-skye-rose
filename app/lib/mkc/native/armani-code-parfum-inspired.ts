// Maison Knowledge Catalogue — Armani Code Parfum Inspired
import type { FragranceKnowledge } from "../types";

export const armaniCodeParfumInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "armani-code-parfum-inspired",
  slug:           "armani-code-parfum-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Armani Code Parfum Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Woody", "Aromatic", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection:     "moderate",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Woody Aromatic",
  season:  "Winter",
  notes: {
    top:   ["Bergamot", "Cardamom", "Ginger"],
    heart: ["Iris", "Tonka Bean", "Violet Leaf"],
    base:  ["Guaiac Wood", "Sandalwood", "Amber"],
  },
  mood: "Bergamot, iris and guaiac wood in a composed evening accord — luxury understood as restraint.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Elegant", "Sophisticated", "Luxury", "Old Money", "Mysterious", "Confident"],
  occasions:      ["Evening", "Date Night", "Winter Evenings", "Office"],
  seasons:        ["Autumn", "Winter"],
  signatureStyle: ["Refined Evening Discretion", "Smoky Woody Elegance", "Armani Luxury Restraint"],
  recommendedFor: [
    "Those seeking an evening masculine that communicates luxury through refinement rather than projection — Code Parfum operates at close range by design, its guaiac wood and iris combination understood only by those who get close enough to deserve it",
    "Men who want a genuinely premium evening fragrance without the theatricality of heavily projected amber masculines — where most winter statements announce themselves boldly, Code Parfum earns its sophistication through construction and restraint, a wardrobe choice for someone who already knows they do not need to be loud",
    "Formal evenings, dinners, and occasions where a distinctive but understated presence is the appropriate register — the Armani Code Parfum wears as a personal signature rather than a public declaration, suitable for contexts where subtlety and depth of character matter more than initial impression",
    "Customers deciding between Code Parfum and Y EDP Inspired — both are warm woody aromatics at warmth:4, but Y EDP projects with daytime versatility across a full day's range while Code Parfum narrows to a deliberately evening-focused occasion with greater restraint; the choice depends on whether the fragrance is for versatile daytime wear or for the hours that count most",
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
  subtitle: "Evening Elegance",
  description:
    "Armani Code Parfum Inspired opens with Bergamot, Cardamom and Ginger — a composed, deliberate opening that withholds more than it reveals. " +
    "Iris and Tonka Bean in the heart create an elegant tension between powdery restraint and quiet warmth, while Violet Leaf introduces a green, slightly bitter quality that prevents the composition from settling into conventional amber territory. " +
    "Guaiac Wood and Sandalwood in the base provide the smoky, dry depth that earns the Parfum classification — a formal evening masculine built for proximity, not projection.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "woody-fragrances-explained",
    "fresh-citrus-and-aquatic-fragrances",
    "evening-and-date-night-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: [
    "fragrance-fundamentals",
    "fragrance-families",
    "occasion-guide",
  ],
  educationTags: [
    "bergamot", "cardamom", "iris", "tonka", "guaiac-wood", "sandalwood", "amber",
    "aromatic", "woody", "masculine", "winter", "autumn", "evening", "elegant", "refined",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "woody-fragrances-explained",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    alternatives: ["bleu-de-chanel-l'exclusif-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Refined woody evening benchmark. Distinct from Y EDP (warmth:4, intensity:4, versatility:4
  // — daytime versatile aromatic with full-range daily capability) via occasion register:
  // Code Parfum is intensity:3 and versatility:3, evening-focused and deliberately restrained.
  // warmth:4 via guaiac wood/sandalwood/amber route — smoky and drier than Layton's amber/
  // vanilla (warmth:5) and less gourmand than most warmth:4 records in the catalogue. sweetness:2
  // reflects the iris/violet leaf dryness tempering the tonka sweetness: same tier as Prada
  // L'Homme and MYSLF, not the amber-sweet tier. Calibrate future evening woody aromatics
  // between Code Parfum (intensity:3, restrained evening) and Sauvage Elixir (intensity:5,
  // concentrated power). popularity:6: Armani Code franchise recognition provides mainstream
  // uplift; the Parfum quality earns enthusiast regard beyond the original.
  sweetness:   2,
  freshness:   2,
  warmth:      4,
  intensity:   3,
  versatility: 3,
  popularity:  6,
};
