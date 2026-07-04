import Link from "next/link";

export interface ArticleNavItem {
  slug: string;
  title: string;
  category: string;
}

interface AcademyArticleNavigationProps {
  prev: ArticleNavItem | null;
  next: ArticleNavItem | null;
}

export function AcademyArticleNavigation({ prev, next }: AcademyArticleNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Article navigation"
      className="mt-12 border-t border-[#e8e4e9] pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {prev ? (
        <Link
          href={`/academy/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-xl border border-[#e8e4e9] bg-white px-5 py-4 hover:border-[#d89ca4] transition-colors duration-200"
        >
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#4f4a52]/40 group-hover:text-[#d89ca4] transition-colors">
            ← Previous
          </span>
          <span className="text-sm font-medium text-[#4f4a52] leading-snug">
            {prev.title}
          </span>
          <span className="text-xs text-[#4f4a52]/40">{prev.category}</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/academy/${next.slug}`}
          className="group flex flex-col gap-1 rounded-xl border border-[#e8e4e9] bg-white px-5 py-4 hover:border-[#d89ca4] transition-colors duration-200 sm:text-right"
        >
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#4f4a52]/40 group-hover:text-[#d89ca4] transition-colors">
            Next →
          </span>
          <span className="text-sm font-medium text-[#4f4a52] leading-snug">
            {next.title}
          </span>
          <span className="text-xs text-[#4f4a52]/40">{next.category}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
