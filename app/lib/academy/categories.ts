import type { AcademyCategory } from "./types";

export interface CategoryMeta {
  slug: string;
  category: AcademyCategory;
  title: string;
  subtitle: string;
  description: string;
  heroCopy: string;
  seoDescription: string;
  icon: string;
  accentColor: string;
  featuredArticleId?: string;
}

export const ACADEMY_CATEGORIES: CategoryMeta[] = [
  {
    slug: "fragrance-fundamentals",
    category: "Fragrance Fundamentals",
    title: "Fragrance Fundamentals",
    subtitle: "Essential knowledge for every fragrance enthusiast",
    description:
      "Start here. These are the foundational concepts that transform how you understand, choose, and wear fragrance. Whether you are completely new to perfumery or have been wearing fragrances for years, the fundamentals change everything.",
    heroCopy: "Build your fragrance foundation",
    seoDescription:
      "Learn the essential fragrance concepts — signature scents, projection, longevity, and what makes a fragrance uniquely yours.",
    icon: "◇",
    accentColor: "#d89ca4",
    featuredArticleId: "what-makes-a-signature-scent",
  },
  {
    slug: "fragrance-families",
    category: "Fragrance Families",
    title: "Fragrance Families",
    subtitle: "The six families that organise all of perfumery",
    description:
      "Fragrance families are the language of perfumery. Understanding them is the fastest way to describe what you love, discover new fragrances with confidence, and build a collection that reflects your personality.",
    heroCopy: "Discover your fragrance family",
    seoDescription:
      "A guide to fragrance families — Floral, Fresh, Woody, Oriental, Fruity, Gourmand — and how to find the family you love.",
    icon: "❧",
    accentColor: "#b8a0c0",
    featuredArticleId: "guide-to-fragrance-families",
  },
  {
    slug: "the-note-pyramid",
    category: "The Note Pyramid",
    title: "The Note Pyramid",
    subtitle: "How fragrances are structured and how they evolve",
    description:
      "Every fragrance tells a story in three acts — top notes, heart notes, and base notes. Understanding this structure changes how you experience every fragrance you wear. You will never judge a fragrance on the first spray again.",
    heroCopy: "Understand how fragrances unfold",
    seoDescription:
      "A complete guide to top notes, heart notes, and base notes — how the fragrance note pyramid works and why it matters.",
    icon: "△",
    accentColor: "#9ab0c4",
    featuredArticleId: "the-note-pyramid-explained",
  },
  {
    slug: "wear-and-application",
    category: "Wear & Application",
    title: "Wear & Application",
    subtitle: "Apply, layer, and carry your scent with confidence",
    description:
      "Most people apply fragrance incorrectly. The techniques in this section will help you maximise longevity, projection, and character — so your fragrance works with your body, not against it.",
    heroCopy: "Wear fragrance with intention",
    seoDescription:
      "How to apply fragrance correctly — pulse points, longevity tips, layering techniques, and making your scent last all day.",
    icon: "✦",
    accentColor: "#c4a090",
    featuredArticleId: "how-to-wear-fragrance",
  },
  {
    slug: "occasions-and-style",
    category: "Occasions & Style",
    title: "Occasions & Style",
    subtitle: "The right fragrance for every season and situation",
    description:
      "Fragrance is as much a style decision as clothing. The right scent for a summer afternoon is very different from a winter evening. These articles help you build an intentional fragrance wardrobe.",
    heroCopy: "Dress your scent for the moment",
    seoDescription:
      "Seasonal fragrance guidance, occasion matching, and how to choose the right fragrance for every situation and season.",
    icon: "◎",
    accentColor: "#a0b8a0",
    featuredArticleId: "choosing-your-season-scent",
  },
  {
    slug: "scent-science",
    category: "Scent Science",
    title: "Scent Science",
    subtitle: "The chemistry and psychology behind fragrance",
    description:
      "Fragrance science explains why some scents feel intimate, why certain notes last longer than others, and why the same fragrance smells different on different people. More articles coming soon.",
    heroCopy: "Explore the science of scent",
    seoDescription:
      "The science of fragrance — how smell works, why fragrances perform differently, and what chemistry determines longevity and projection.",
    icon: "◈",
    accentColor: "#b0b8c4",
    featuredArticleId: "why-fragrances-smell-different-on-everyone",
  },
];

export function categoryToSlug(category: AcademyCategory): string {
  const found = ACADEMY_CATEGORIES.find((c) => c.category === category);
  return found?.slug ?? category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function slugToCategory(slug: string): AcademyCategory | undefined {
  return ACADEMY_CATEGORIES.find((c) => c.slug === slug)?.category;
}

export function getCategoryMeta(category: AcademyCategory): CategoryMeta | undefined {
  return ACADEMY_CATEGORIES.find((c) => c.category === category);
}

export function getCategoryMetaBySlug(slug: string): CategoryMeta | undefined {
  return ACADEMY_CATEGORIES.find((c) => c.slug === slug);
}
