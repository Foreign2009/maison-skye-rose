import Link from "next/link";
import type { CategoryMeta } from "../../lib/academy/categories";

interface AcademyCategoryCardProps {
  category: CategoryMeta;
  articleCount: number;
}

export function AcademyCategoryCard({ category, articleCount }: AcademyCategoryCardProps) {
  return (
    <Link
      href={`/academy/category/${category.slug}`}
      className="group block rounded-2xl border border-[#e8e4e9] bg-white px-6 py-6 hover:border-[#d89ca4] transition-all duration-200 hover:shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className="text-2xl leading-none select-none"
          aria-hidden="true"
          style={{ color: category.accentColor }}
        >
          {category.icon}
        </span>
        {articleCount > 0 && (
          <span className="text-[10px] font-medium text-[#4f4a52]/30">
            {articleCount} {articleCount === 1 ? "article" : "articles"}
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-[#4f4a52] mb-1 group-hover:text-[#d89ca4] transition-colors duration-200 leading-snug">
        {category.title}
      </h3>
      <p className="text-xs text-[#4f4a52]/50 leading-relaxed">
        {category.subtitle}
      </p>

      <p className="mt-4 text-xs font-medium text-[#d89ca4] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Explore →
      </p>
    </Link>
  );
}
