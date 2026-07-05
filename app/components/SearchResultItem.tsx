"use client";

import Link from "next/link";
import Image from "next/image";
import type { SearchMatch, SearchDocument } from "../lib/search/types";

interface Props {
  match:         SearchMatch;
  onSelect:      (doc: SearchDocument) => void;
  isHighlighted: boolean;
}

export default function SearchResultItem({ match, onSelect, isHighlighted }: Props) {
  const { document: doc } = match;

  const subtitle =
    doc.type === "fragrance" && doc.family && doc.family.length > 0
      ? doc.family.slice(0, 2).join(" · ")
      : doc.type === "article"
      ? [doc.readTime ? `${doc.readTime} min read` : null, doc.category]
          .filter(Boolean)
          .join(" · ")
      : doc.subtitle ?? "";

  const cta =
    doc.type === "fragrance"
      ? "View →"
      : doc.type === "collection"
      ? "Explore →"
      : "Read →";

  return (
    <Link
      href={doc.href}
      onClick={() => onSelect(doc)}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
        isHighlighted ? "bg-[#f5f1eb]" : "hover:bg-[#faf7f5]"
      }`}
    >
      {/* Thumbnail or icon */}
      <div className="shrink-0">
        {doc.type === "fragrance" && doc.image ? (
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-[#f5f1eb]">
            <Image
              src={doc.image}
              alt={doc.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center text-xl leading-none"
            style={{
              backgroundColor:
                doc.type === "collection" ? "#f5f1eb" : "#eef3f7",
            }}
            aria-hidden="true"
          >
            {doc.image ?? (doc.type === "article" ? "△" : "◇")}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#4f4a52] truncate leading-tight">
          {doc.title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-[#7b7480] truncate mt-0.5 leading-tight">
            {subtitle}
          </p>
        )}
      </div>

      {/* CTA */}
      <span className="shrink-0 text-[11px] font-bold text-[#d89ca4]">
        {cta}
      </span>
    </Link>
  );
}
