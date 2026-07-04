import type { AcademyCategory } from "./types";

export type AcademyDifficulty = "beginner" | "intermediate" | "advanced";

export interface ArticleRegistryEntry {
  slug: string;
  category: AcademyCategory;
  difficulty: AcademyDifficulty;
  topics: string[];
  families: string[];       // MKC family names this article covers; [] = universal (all families)
  notes: string[];          // Note layer types discussed; e.g. ["top", "heart", "base"]
  occasions: string[];      // Lowercase MKC occasion strings this article targets; [] = universal
  collections: string[];    // MKC collections; [] = all collections
  keywords: string[];
  educationTags: string[];
  seasonal: boolean;        // True when the article is specifically about seasonal fragrance selection
  universalRelevance: boolean;
  relevanceScore: number;   // Baseline priority 0–100; higher = recommended more broadly
}

export const ARTICLE_REGISTRY: ArticleRegistryEntry[] = [
  {
    slug: "the-note-pyramid-explained",
    category: "The Note Pyramid",
    difficulty: "beginner",
    topics: [
      "note pyramid",
      "top notes",
      "heart notes",
      "base notes",
      "fragrance composition",
      "dry-down",
    ],
    families: [],
    notes: ["top", "heart", "base"],
    occasions: [],
    collections: [],
    keywords: [
      "note pyramid",
      "top notes",
      "heart notes",
      "base notes",
      "dry-down",
      "fragrance structure",
      "composition",
    ],
    educationTags: ["fundamentals", "composition", "structure", "note-pyramid"],
    seasonal: false,
    universalRelevance: true,
    relevanceScore: 95,
  },

  {
    slug: "guide-to-fragrance-families",
    category: "Fragrance Families",
    difficulty: "beginner",
    topics: [
      "fragrance families",
      "family guide",
      "scent discovery",
      "fragrance vocabulary",
      "floral",
      "fresh",
      "woody",
      "oriental",
      "fruity",
      "gourmand",
    ],
    families: [],
    notes: [],
    occasions: [],
    collections: [],
    keywords: [
      "fragrance families",
      "floral",
      "fresh",
      "woody",
      "oriental",
      "fruity",
      "gourmand",
      "family guide",
      "scent vocabulary",
    ],
    educationTags: ["fundamentals", "families", "discovery", "vocabulary"],
    seasonal: false,
    universalRelevance: true,
    relevanceScore: 90,
  },

  {
    slug: "how-to-wear-fragrance",
    category: "Wear & Application",
    difficulty: "beginner",
    topics: [
      "application technique",
      "pulse points",
      "longevity",
      "projection",
      "spray technique",
      "fragrance application",
    ],
    families: [],
    notes: [],
    occasions: [],
    collections: [],
    keywords: [
      "pulse points",
      "application",
      "longevity",
      "spray technique",
      "wear",
      "fragrance technique",
    ],
    educationTags: ["application", "technique", "basics", "wearability"],
    seasonal: false,
    universalRelevance: true,
    relevanceScore: 80,
  },

  {
    slug: "what-makes-a-signature-scent",
    category: "Fragrance Fundamentals",
    difficulty: "beginner",
    topics: [
      "signature scent",
      "personal style",
      "fragrance identity",
      "everyday wear",
      "office scent",
      "daily fragrance",
    ],
    families: [],
    notes: [],
    occasions: ["daily wear", "office"],
    collections: [],
    keywords: [
      "signature scent",
      "everyday fragrance",
      "personal style",
      "identity",
      "office",
      "daily wear",
    ],
    educationTags: ["signature", "everyday", "personal-style", "fundamentals", "office"],
    seasonal: false,
    universalRelevance: false,
    relevanceScore: 75,
  },

  {
    slug: "choosing-your-season-scent",
    category: "Occasions & Style",
    difficulty: "beginner",
    topics: [
      "seasonal fragrance",
      "summer scent",
      "winter scent",
      "spring scent",
      "autumn scent",
      "weather",
      "temperature",
    ],
    families: ["Fresh", "Aquatic", "Citrus", "Floral", "White Floral", "Rose", "Woody", "Amber", "Oud", "Spicy"],
    notes: [],
    occasions: [],
    collections: [],
    keywords: [
      "seasonal",
      "summer",
      "winter",
      "spring",
      "autumn",
      "weather",
      "temperature",
      "season",
    ],
    educationTags: ["seasonal", "occasions", "weather", "temperature"],
    seasonal: true,
    universalRelevance: false,
    relevanceScore: 70,
  },

  {
    slug: "how-to-layer-fragrances",
    category: "Wear & Application",
    difficulty: "intermediate",
    topics: [
      "layering",
      "fragrance combination",
      "creative technique",
      "base fragrance",
      "complementary families",
    ],
    families: [],
    notes: [],
    occasions: [],
    collections: [],
    keywords: [
      "layering",
      "combining fragrances",
      "stacking",
      "technique",
      "composition",
      "fragrance layering",
    ],
    educationTags: ["layering", "technique", "advanced-application", "creative"],
    seasonal: false,
    universalRelevance: false,
    relevanceScore: 65,
  },
];
