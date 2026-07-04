"use client";

import Link from "next/link";
import type { AcademyArticle } from "../../lib/academy/types";

interface AcademyArticleCardProps {
  article: AcademyArticle;
  featured?: boolean;
}

export function AcademyArticleCard({ article, featured = false }: AcademyArticleCardProps) {
  return (
    <Link
      href={`/academy/${article.slug}`}
      className={`group block rounded-2xl border transition-colors duration-200 overflow-hidden ${
        featured
          ? "bg-white border-[#d89ca4]/30 hover:border-[#d89ca4]"
          : "bg-white border-[#e8e4e9] hover:border-[#d89ca4]"
      }`}
    >
      <div className={`p-6 ${featured ? "p-7" : ""}`}>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4]">
            {article.category}
          </p>
          {featured && (
            <span className="rounded-full bg-[#fdf6f7] border border-[#d89ca4]/25 px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase text-[#d89ca4]">
              Featured
            </span>
          )}
        </div>
        <h3
          className={`text-[#4f4a52] font-semibold leading-snug mb-2 group-hover:text-[#d89ca4] transition-colors duration-200 ${
            featured ? "text-xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p className="text-[#4f4a52]/65 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#4f4a52]/40">{article.readTime} min read</span>
          <span className="text-xs font-medium text-[#d89ca4] group-hover:translate-x-0.5 transition-transform duration-200">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
