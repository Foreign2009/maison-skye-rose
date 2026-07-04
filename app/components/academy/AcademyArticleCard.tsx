"use client";

import Link from "next/link";
import type { AcademyArticle } from "../../lib/academy/types";

interface AcademyArticleCardProps {
  article: AcademyArticle;
}

export function AcademyArticleCard({ article }: AcademyArticleCardProps) {
  return (
    <Link
      href={`/academy/${article.slug}`}
      className="group block rounded-2xl bg-white border border-[#e8e4e9] hover:border-[#d89ca4] transition-colors duration-200 overflow-hidden"
    >
      <div className="p-6">
        <p className="text-xs font-medium tracking-widest uppercase text-[#d89ca4] mb-3">
          {article.category}
        </p>
        <h3 className="text-[#4f4a52] font-semibold text-lg leading-snug mb-2 group-hover:text-[#d89ca4] transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-[#4f4a52]/70 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#4f4a52]/50">{article.readTime} min read</span>
          <span className="text-xs font-medium text-[#d89ca4] group-hover:translate-x-0.5 transition-transform duration-200">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
