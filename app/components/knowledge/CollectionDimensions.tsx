// Presentation component for discovery collection intelligence.
// Displays frequency-based dimension summaries for generated CollectionSpecs.
//
// Describes what is commonly found across the collection — not a guarantee
// that every fragrance shares every attribute (Refinement 5).
//
// Distinct from CollectionCharacter (EP22-P4), which presents Skye / Rose / Elite
// identity. This component presents curated discovery collection profiles (Refinement 3).
//
// EP23-P1 foundation. Future extensions: dominant scent character,
// seasonal pathways, collection comparisons, guided discovery journeys (Refinement 6).

import { KnowledgeChip } from "./KnowledgeChip";

interface CollectionDimensionsProps {
  families:  string[];
  occasions: string[];
  seasons:   string[];
}

export function CollectionDimensions({ families, occasions, seasons }: CollectionDimensionsProps) {
  if (!families.length && !occasions.length && !seasons.length) return null;

  return (
    <div className="mt-6 rounded-2xl border border-[#e8e4e9] bg-white p-5 md:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-5">
        Fragrance Profile
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
