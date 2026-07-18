"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import Image from "next/image";
import { useSearch } from "../hooks/useSearch";

interface Props {
  isOpen:      boolean;
  onClose:     () => void;
  currentSlug: string;
}

const DEBOUNCE_MS = 200;

export default function ComparePickerOverlay({ isOpen, onClose, currentSlug }: Props) {
  const router = useRouter();
  const [inputValue,     setInputValue]     = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setDebouncedQuery("");
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setDebouncedQuery("");
      return;
    }
    const t = setTimeout(() => setDebouncedQuery(inputValue.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [inputValue]);

  const { groups } = useSearch(debouncedQuery);

  const fragrances = groups
    .filter((g) => g.type === "fragrance")
    .flatMap((g) => g.matches)
    .filter((m) => m.document.slug !== currentSlug);

  const handleSelect = useCallback(
    (slug: string) => {
      onClose();
      router.push(`/compare?a=${currentSlug}&b=${slug}`);
    },
    [currentSlug, onClose, router]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — full-screen drawer on mobile, centred modal on desktop */}
      <div
        className="fixed inset-x-0 bottom-0 z-[70] md:inset-auto md:top-[12vh] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Select a fragrance to compare"
      >
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col h-[88vh] md:h-auto md:max-h-[72vh]">

          {/* Input row */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f0ece6] shrink-0">
            <Search className="h-4 w-4 text-[#7b7480] shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search a fragrance to compare..."
              className="flex-1 text-sm text-[#4f4a52] placeholder:text-[#c0babb] outline-none bg-transparent"
              aria-label="Search fragrances"
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

            <button
              onClick={onClose}
              className="hidden md:flex shrink-0 items-center text-[10px] font-bold text-[#7b7480] border border-[#e0dbd5] rounded px-2 py-0.5 hover:border-[#d89ca4] transition-colors tracking-wide"
              aria-label="Close"
            >
              Esc
            </button>

            <button
              onClick={onClose}
              className="md:hidden shrink-0 text-[#7b7480] hover:text-[#4f4a52] transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Label */}
          {!debouncedQuery && (
            <div className="px-4 pt-3 pb-1 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d89ca4]">
                Choose a fragrance to compare
              </p>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {fragrances.length > 0 ? (
              <div className="space-y-0.5">
                {fragrances.map(({ document: doc }) => (
                  <button
                    key={doc.slug}
                    onClick={() => handleSelect(doc.slug)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#faf7f5]"
                  >
                    <div className="shrink-0">
                      {doc.image ? (
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
                          className="h-10 w-10 rounded-lg bg-[#f5f1eb] flex items-center justify-center text-xl"
                          aria-hidden="true"
                        >
                          ◇
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#4f4a52] truncate leading-tight">
                        {doc.title}
                      </p>
                      {doc.family && doc.family.length > 0 && (
                        <p className="text-[11px] text-[#7b7480] truncate mt-0.5 leading-tight">
                          {doc.family.slice(0, 2).join(" · ")}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 text-[11px] font-bold text-[#d89ca4]">
                      Compare →
                    </span>
                  </button>
                ))}
              </div>
            ) : debouncedQuery ? (
              <div className="py-12 text-center px-4">
                <p className="text-sm font-semibold text-[#4f4a52]">
                  No results for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="mt-2 text-xs text-[#7b7480]">Try a fragrance name or family</p>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </>
  );
}
