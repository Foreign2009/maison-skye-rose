"use client";

import { useState } from "react";

export interface TocHeading {
  id: string;
  text: string;
}

interface AcademyTableOfContentsProps {
  headings: TocHeading[];
  collapsible?: boolean;
}

export function AcademyTableOfContents({
  headings,
  collapsible = false,
}: AcademyTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(!collapsible);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      {collapsible ? (
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-[#e8e4e9] bg-white px-4 py-3 text-left"
          aria-expanded={isOpen}
          aria-controls="toc-list"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[#4f4a52]/50">
            Contents
          </span>
          <span className="text-[#4f4a52]/40 text-sm" aria-hidden="true">
            {isOpen ? "↑" : "↓"}
          </span>
        </button>
      ) : (
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#4f4a52]/40 mb-4">
          Contents
        </p>
      )}

      {isOpen && (
        <ol
          id="toc-list"
          className={`space-y-0.5 ${collapsible ? "mt-2 rounded-xl border border-[#e8e4e9] bg-white px-4 py-3" : ""}`}
        >
          {headings.map((heading, index) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className="flex items-start gap-2 py-1.5 text-sm text-[#4f4a52]/55 hover:text-[#d89ca4] transition-colors duration-150 leading-snug"
              >
                <span className="shrink-0 text-[10px] text-[#4f4a52]/25 pt-0.5 font-medium">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
