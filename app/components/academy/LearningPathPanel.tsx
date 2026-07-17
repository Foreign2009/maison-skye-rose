import Link from "next/link";
import { academyCatalogue } from "../../lib/academy/catalogue";
import type { AcademyArticle } from "../../lib/academy/types";

interface LearningPathPanelProps {
  slugs?: string[];
}

export function LearningPathPanel({ slugs }: LearningPathPanelProps) {
  if (!slugs || slugs.length === 0) return null;

  const articles = slugs
    .map((slug) => academyCatalogue.find((a) => a.slug === slug))
    .filter((a): a is AcademyArticle => a !== undefined);

  if (articles.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#4f4a52]">Your Learning Path</h2>
        <span className="text-xs font-medium tracking-widest uppercase text-[#d89ca4]">
          Fragrance Academy
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            href={`/academy/${article.slug}`}
            className="flex items-start gap-4 rounded-2xl border border-[#ede8e1] bg-[#f9f7f4] px-5 py-4 transition-colors hover:border-[#d89ca4]/60 hover:bg-[#fdf6f7]"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d89ca4]/15 text-[10px] font-bold text-[#d89ca4]">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4]">
                {article.category}
              </p>
              <p className="text-sm font-semibold text-[#4f4a52] leading-snug">
                {article.title}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{article.readTime} min read</p>
            </div>
            <span className="mt-0.5 shrink-0 text-sm font-bold text-[#d89ca4]">→</span>
          </Link>
        ))}
      </div>

      <div className="mt-5 text-right">
        <Link href="/academy" className="text-sm font-medium text-[#d89ca4] hover:underline">
          Explore the Fragrance Academy →
        </Link>
      </div>
    </div>
  );
}
