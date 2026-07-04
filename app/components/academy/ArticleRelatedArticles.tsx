import Link from "next/link";
import { academyCatalogue } from "../../lib/academy/catalogue";

interface ArticleRelatedArticlesProps {
  slugs: string[];
  heading?: string;
}

export function ArticleRelatedArticles({
  slugs,
  heading = "Related Articles",
}: ArticleRelatedArticlesProps) {
  const articles = slugs
    .map((slug) => academyCatalogue.find((a) => a.slug === slug))
    .filter(Boolean);

  if (articles.length === 0) return null;

  return (
    <section className="mt-10 border-t border-[#e8e4e9] pt-8">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-[#4f4a52]/40 mb-4">
        {heading}
      </h2>
      <div className="space-y-3">
        {articles.map((article) => {
          if (!article) return null;
          return (
            <Link
              key={article.slug}
              href={`/academy/${article.slug}`}
              className="group flex items-start justify-between gap-4 rounded-xl border border-[#e8e4e9] bg-white px-5 py-4 hover:border-[#d89ca4] transition-colors duration-200"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-0.5">
                  {article.category}
                </p>
                <p className="text-sm font-medium text-[#4f4a52] leading-snug group-hover:text-[#d89ca4] transition-colors duration-200">
                  {article.title}
                </p>
              </div>
              <span className="shrink-0 text-sm text-[#4f4a52]/30 group-hover:text-[#d89ca4] transition-colors pt-0.5">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
