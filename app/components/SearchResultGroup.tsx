"use client";

import type { SearchGroup, SearchDocument } from "../lib/search/types";
import SearchResultItem from "./SearchResultItem";

interface Props {
  group:         SearchGroup;
  highlightedId: string | null;
  onSelect:      (doc: SearchDocument) => void;
}

export default function SearchResultGroup({ group, highlightedId, onSelect }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between px-3 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7b7480]">
          {group.label}
        </span>
        {group.totalCount > group.matches.length && (
          <span className="text-[10px] text-[#d89ca4]">
            +{group.totalCount - group.matches.length} more
          </span>
        )}
      </div>

      <div className="space-y-0.5">
        {group.matches.map((match) => (
          <SearchResultItem
            key={match.document.id}
            match={match}
            onSelect={onSelect}
            isHighlighted={highlightedId === match.document.id}
          />
        ))}
      </div>
    </div>
  );
}
