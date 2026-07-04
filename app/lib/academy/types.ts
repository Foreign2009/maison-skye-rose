export type AcademyCategory =
  | "Fragrance Families"
  | "The Note Pyramid"
  | "Wear & Application"
  | "Scent Science"
  | "Occasions & Style"
  | "Fragrance Fundamentals";

export type AcademyContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "tip"; text: string }
  | { type: "note-list"; notes: string[] }
  | { type: "fragrance-spotlight"; fragranceId: string; caption: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "warning"; text: string }
  | { type: "comparison"; left: { label: string; text: string }; right: { label: string; text: string } }
  | { type: "divider" }
  | { type: "callout"; title?: string; body: string };

export interface AcademyArticle {
  slug: string;
  title: string;
  subtitle: string;
  category: AcademyCategory;
  excerpt: string;
  coverImage?: string;
  readTime: number;
  content: AcademyContentBlock[];
  relatedFragranceIds: string[];
  relatedArticleIds?: string[];
  recommendedArticleIds?: string[];
  featured?: boolean;
  publishedAt: string;
}
