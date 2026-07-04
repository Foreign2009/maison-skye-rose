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
  | { type: "fragrance-spotlight"; fragranceId: string; caption: string };

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
  publishedAt: string;
}
