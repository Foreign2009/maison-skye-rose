"use client";

import Link from "next/link";
import type { FormattedArticle } from "../lib/concierge/types";

interface ConciergeArticleCardProps {
  article: FormattedArticle;
  onClick?: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  "Fragrance Families":      "🌸",
  "The Note Pyramid":        "🔺",
  "Wear & Application":      "✨",
  "Scent Science":           "🧪",
  "Occasions & Style":       "🌟",
  "Fragrance Fundamentals":  "📚",
};

export default function ConciergeArticleCard({ article, onClick }: ConciergeArticleCardProps) {
  const emoji = CATEGORY_EMOJI[article.category] ?? "📖";

  return (
    <Link
      href={article.href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-[#efe8e1] bg-[#faf7f5] p-3 transition hover:border-[#d89ca4] hover:shadow-sm"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
        {emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[12px] font-semibold text-[#4f4a52] leading-snug">
          {article.title}
        </p>
        <p className="mt-0.5 text-[10px] text-zinc-400">
          {article.category} · {article.readTime} min read
        </p>
      </div>
      <span className="shrink-0 text-[10px] text-[#d89ca4]">Read →</span>
    </Link>
  );
}
