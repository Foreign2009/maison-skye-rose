"use client";

import { useMemo } from "react";
import { buildSearchIndex } from "../lib/search/indexBuilder";
import { search } from "../lib/search/searchEngine";
import type { SearchGroup, SearchIndex } from "../lib/search/types";

// ── Module-level singleton ────────────────────────────────────────────────────
// The index is built once on first use and shared across all hook instances.
// This ensures mkcCatalogue + Discovery + Academy are indexed exactly once
// regardless of how many search overlays or components mount.

let _cachedIndex: SearchIndex | null = null;

function getIndex(): SearchIndex {
  if (!_cachedIndex) {
    _cachedIndex = buildSearchIndex();
  }
  return _cachedIndex;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseSearchResult {
  groups:       SearchGroup[];
  hasResults:   boolean;
  isEmptyState: boolean;
}

export function useSearch(query: string): UseSearchResult {
  const index = getIndex(); // stable singleton — never triggers re-render

  const groups = useMemo(
    () => search(query, index),
    // index is stable; omitting from deps is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query]
  );

  const isEmptyState = query.trim() === "";
  const hasResults   = groups.some((g) => g.matches.length > 0);

  return { groups, hasResults, isEmptyState };
}
