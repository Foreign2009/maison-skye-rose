"use client";

import ConciergeProductCard from "./ConciergeProductCard";
import ConciergeArticleCard from "./ConciergeArticleCard";
import type { FormattedFragrance, FormattedArticle } from "../lib/concierge/types";

export interface UIMessage {
  role:                 "user" | "assistant";
  content:              string;
  timestamp:            number;
  fragrances?:          FormattedFragrance[];
  articles?:            FormattedArticle[];
  followUpSuggestions?: string[];
}

interface ConciergeMessageProps {
  message:        UIMessage;
  onFollowUp:     (suggestion: string) => void;
  onProductClick: (slug: string, name: string) => void;
  onArticleClick: (slug: string, title: string) => void;
}

export default function ConciergeMessage({
  message,
  onFollowUp,
  onProductClick,
  onArticleClick,
}: ConciergeMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex flex-col gap-2 ${isAssistant ? "items-start" : "items-end"}`}>
      {/* Bubble */}
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13px] leading-6 ${
          isAssistant
            ? "bg-white border border-[#efe8e1] text-[#4f4a52] rounded-tl-sm"
            : "bg-[#d89ca4] text-white rounded-tr-sm"
        }`}
      >
        {message.content}
      </div>

      {/* Product cards (assistant only) */}
      {isAssistant && message.fragrances && message.fragrances.length > 0 && (
        <div className="w-full space-y-2">
          {message.fragrances.slice(0, 3).map((f) => (
            <ConciergeProductCard
              key={f.slug}
              fragrance={f}
              onClick={() => onProductClick(f.slug, f.name)}
            />
          ))}
        </div>
      )}

      {/* Article cards (assistant only) */}
      {isAssistant && message.articles && message.articles.length > 0 && (
        <div className="w-full space-y-2">
          {message.articles.slice(0, 2).map((a) => (
            <ConciergeArticleCard
              key={a.slug}
              article={a}
              onClick={() => onArticleClick(a.slug, a.title)}
            />
          ))}
        </div>
      )}

      {/* Follow-up suggestions (assistant only) */}
      {isAssistant &&
        message.followUpSuggestions &&
        message.followUpSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.followUpSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => onFollowUp(s)}
                className="rounded-full border border-[#d89ca4] bg-[#fff7f8] px-3 py-1.5 text-[11px] font-medium text-[#d89ca4] transition hover:bg-[#d89ca4] hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}
