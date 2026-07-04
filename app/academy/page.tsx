import type { Metadata } from "next";
import { academyCatalogue } from "../lib/academy/catalogue";
import type { AcademyCategory } from "../lib/academy/types";
import { AcademyArticleCard } from "../components/academy/AcademyArticleCard";

export const metadata: Metadata = {
  title: "Fragrance Academy | Maison Skye & Rose",
  description:
    "Learn everything about fragrance — families, note pyramids, how to wear and layer, seasonal guidance, and how to find your signature scent.",
  alternates: {
    canonical: "/academy",
  },
  openGraph: {
    title: "Fragrance Academy | Maison Skye & Rose",
    description:
      "Learn everything about fragrance — families, note pyramids, how to wear and layer, seasonal guidance, and how to find your signature scent.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fragrance Academy | Maison Skye & Rose",
    description:
      "Learn everything about fragrance — families, note pyramids, how to wear and layer, seasonal guidance, and how to find your signature scent.",
  },
};

const CATEGORY_ORDER: AcademyCategory[] = [
  "Fragrance Fundamentals",
  "Fragrance Families",
  "The Note Pyramid",
  "Wear & Application",
  "Occasions & Style",
  "Scent Science",
];

export default function AcademyPage() {
  const byCategory = CATEGORY_ORDER.reduce<Record<string, typeof academyCatalogue>>(
    (acc, category) => {
      const articles = academyCatalogue.filter((a) => a.category === category);
      if (articles.length > 0) acc[category] = articles;
      return acc;
    },
    {}
  );

  return (
    <main className="min-h-screen bg-[#faf8f8]">
      {/* Hero */}
      <section className="bg-white border-b border-[#e8e4e9] px-4 py-16 text-center">
        <p className="text-xs font-medium tracking-widest uppercase text-[#d89ca4] mb-4">
          Maison Skye &amp; Rose
        </p>
        <h1 className="text-3xl sm:text-4xl font-light text-[#4f4a52] mb-4">
          Fragrance Academy
        </h1>
        <p className="text-[#4f4a52]/70 max-w-lg mx-auto text-base leading-relaxed">
          Everything you need to understand, choose, and wear fragrance with
          confidence. Written by perfume enthusiasts, for perfume enthusiasts.
        </p>
      </section>

      {/* Articles by category */}
      <section className="max-w-5xl mx-auto px-4 py-14 space-y-14">
        {Object.entries(byCategory).map(([category, articles]) => (
          <div key={category}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[#4f4a52]">
                {category}
              </h2>
              <div className="flex-1 h-px bg-[#e8e4e9]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <AcademyArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
