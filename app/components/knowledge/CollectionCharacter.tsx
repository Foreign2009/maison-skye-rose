// Canonical presentation component for collection-level knowledge.
// Displays dominant tendencies derived from MKC aggregation — not absolute rules.
//
// EP22-P4: intentionally lightweight foundation.
// Future EP22 work may extend with representative native fragrances,
// Academy article references, seasonal insights, and relationship exploration.

import { KnowledgeChip } from "./KnowledgeChip";

interface CollectionCharacterProps {
  families:  string[];
  occasions: string[];
  seasons:   string[];
}

export function CollectionCharacter({ families, occasions, seasons }: CollectionCharacterProps) {
  return (
    <div className="mt-8 rounded-2xl border border-[#e8e4e9] bg-white p-5 md:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-5">
        Collection Character
      </p>

      <div className="space-y-4">

        {families.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
              Fragrance Families
            </p>
            <div className="flex flex-wrap gap-1.5">
              {families.map((f) => (
                <KnowledgeChip key={f} label={f} />
              ))}
            </div>
          </div>
        )}

        {occasions.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
              Commonly Suited To
            </p>
            <div className="flex flex-wrap gap-1.5">
              {occasions.map((o) => (
                <KnowledgeChip key={o} label={o} variant="bordered" />
              ))}
            </div>
          </div>
        )}

        {seasons.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
              Often Worn In
            </p>
            <div className="flex flex-wrap gap-1.5">
              {seasons.map((s) => (
                <KnowledgeChip key={s} label={s} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
