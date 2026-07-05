"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import SearchResultGroup from "./SearchResultGroup";
import {
  trackSearchQuery,
  trackSearchResultClicked,
  trackSearchNoResults,
  trackSearchClosed,
} from "../lib/analytics";
import type { SearchDocument } from "../lib/search/types";

interface Props {
  isOpen:  boolean;
  onClose: () => void;
}

const DEBOUNCE_MS = 200;

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const router = useRouter();

  const [inputValue,     setInputValue]     = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [highlightedId,  setHighlightedId]  = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state and focus on open
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setDebouncedQuery("");
      setHighlightedId(null);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Debounce input → query + analytics
  useEffect(() => {
    if (!inputValue.trim()) {
      setDebouncedQuery("");
      return;
    }
    const t = setTimeout(() => {
      const q = inputValue.trim();
      setDebouncedQuery(q);
      trackSearchQuery({ query: q });
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [inputValue]);

  const { groups, hasResults, isEmptyState } = useSearch(debouncedQuery);

  // Track no results
  useEffect(() => {
    if (debouncedQuery && !hasResults) {
      trackSearchNoResults({ query: debouncedQuery });
    }
  }, [debouncedQuery, hasResults]);

  // Flatten all match IDs for keyboard navigation
  const allMatches    = groups.flatMap((g) => g.matches);
  const allIds        = allMatches.map((m) => m.document.id);

  const handleClose = useCallback(() => {
    trackSearchClosed({ query: debouncedQuery });
    onClose();
  }, [debouncedQuery, onClose]);

  const handleSelect = useCallback(
    (doc: SearchDocument) => {
      trackSearchResultClicked({
        query: debouncedQuery,
        title: doc.title,
        type:  doc.type,
        href:  doc.href,
      });
      onClose();
    },
    [debouncedQuery, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedId((prev) => {
          const idx = prev !== null ? allIds.indexOf(prev) : -1;
          return allIds[Math.min(idx + 1, allIds.length - 1)] ?? null;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedId((prev) => {
          const idx = prev !== null ? allIds.indexOf(prev) : allIds.length;
          return allIds[Math.max(idx - 1, 0)] ?? null;
        });
      } else if (e.key === "Enter" && highlightedId) {
        const match = allMatches.find((m) => m.document.id === highlightedId);
        if (match) {
          trackSearchResultClicked({
            query: debouncedQuery,
            title: match.document.title,
            type:  match.document.type,
            href:  match.document.href,
          });
          onClose();
          router.push(match.document.href);
        }
      }
    },
    // allIds and allMatches are derived from groups which changes with query
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allIds, allMatches, highlightedId, debouncedQuery, onClose, router]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel — full-screen drawer on mobile, centered modal on desktop */}
      <div
        className="fixed inset-x-0 bottom-0 z-[70] md:inset-auto md:top-[12vh] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
      >
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col h-[88vh] md:h-auto md:max-h-[72vh]">

          {/* ── Input row ────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f0ece6] shrink-0">
            <Search className="h-4 w-4 text-[#7b7480] shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search fragrances, collections, articles..."
              className="flex-1 text-sm text-[#4f4a52] placeholder:text-[#c0babb] outline-none bg-transparent"
              aria-label="Search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />

            {inputValue && (
              <button
                onClick={() => setInputValue("")}
                className="shrink-0 text-[#7b7480] hover:text-[#4f4a52] transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Desktop: Esc badge */}
            <button
              onClick={handleClose}
              className="hidden md:flex shrink-0 items-center text-[10px] font-bold text-[#7b7480] border border-[#e0dbd5] rounded px-2 py-0.5 hover:border-[#d89ca4] transition-colors tracking-wide"
              aria-label="Close search"
            >
              Esc
            </button>

            {/* Mobile: X button */}
            <button
              onClick={handleClose}
              className="md:hidden shrink-0 text-[#7b7480] hover:text-[#4f4a52] transition-colors"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── Empty state label ────────────────────────────────────────────── */}
          {isEmptyState && (
            <div className="px-4 pt-3 pb-1 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d89ca4]">
                Trending &amp; Featured
              </p>
            </div>
          )}

          {/* ── Results ──────────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {groups.length > 0 ? (
              <div className="space-y-5">
                {groups.map((group) => (
                  <SearchResultGroup
                    key={group.type}
                    group={group}
                    highlightedId={highlightedId}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            ) : debouncedQuery ? (
              <div className="py-12 text-center px-4">
                <p className="text-sm font-semibold text-[#4f4a52]">
                  No results for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="mt-2 text-xs text-[#7b7480]">
                  Try: vanilla, office, summer, floral, oud
                </p>
              </div>
            ) : null}
          </div>

          {/* ── Footer ───────────────────────────────────────────────────────── */}
          {!isEmptyState && hasResults && (
            <div className="shrink-0 border-t border-[#f0ece6] px-4 py-2.5 text-center">
              <a
                href="/shop"
                onClick={handleClose}
                className="text-xs font-semibold text-[#d89ca4] hover:underline"
              >
                Browse all fragrances in Shop →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
