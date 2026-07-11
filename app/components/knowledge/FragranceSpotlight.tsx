// Canonical presentation component for fragrance spotlights.
//
// Shared by:
//   • Academy spotlight blocks (ArticleContentRenderer fragrance-spotlight case)
//   • Discovery representative fragrances (discover/[id] standard collection pages)
//
// Future experiences should reuse this component rather than creating new spotlight
// implementations (EP23-P2, Refinement 2).
//
// Props:
//   fragrance — the full MKC FragranceKnowledge record
//   caption   — optional editorial text shown in the footer.
//               Academy: passes block.caption (authored per article).
//               Discovery: passes fragrance.mood (describes collection character).

import Image from "next/image";
import Link from "next/link";
import type { FragranceKnowledge } from "../../lib/mkc/types";
import { KnowledgeChip } from "./KnowledgeChip";
import { NoteChip } from "./NoteChip";

interface FragranceSpotlightProps {
  fragrance: FragranceKnowledge;
  caption?:  string;
}

export function FragranceSpotlight({ fragrance, caption }: FragranceSpotlightProps) {
  const spotlightNotes = [
    ...fragrance.notes.top,
    ...fragrance.notes.heart,
    ...fragrance.notes.base,
  ].slice(0, 5);

  return (
    <div className="rounded-xl border border-[#e8e4e9] bg-white overflow-hidden">

      {/* ── Fragrance body ───────────────────────────────────────────────────── */}
      <div className="flex gap-4 p-5">
        <div className="shrink-0">
          <Image
            src={fragrance.images["10ml"]}
            alt={fragrance.name}
            width={72}
            height={72}
            className="rounded-lg bg-[#faf8f8] object-contain p-2"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-0.5">
            {fragrance.collection} Collection
          </p>
          <p className="text-sm font-bold text-[#4f4a52] leading-snug">
            {fragrance.name}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <KnowledgeChip label={fragrance.profile} />
            <KnowledgeChip label={fragrance.season} />
          </div>
          <p className="mt-2 text-xs text-[#4f4a52]/70 leading-relaxed line-clamp-2">
            {fragrance.mood}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {spotlightNotes.map((note) => (
              <NoteChip key={note} note={note} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer: caption + explore link ──────────────────────────────────── */}
      <div
        className={`border-t border-[#e8e4e9] bg-[#faf8f8] px-5 py-3 flex items-start gap-4 ${
          caption ? "justify-between" : "justify-end"
        }`}
      >
        {caption && (
          <p className="text-xs italic text-[#4f4a52]/60 leading-relaxed">
            {caption}
          </p>
        )}
        <Link
          href={`/product/${fragrance.slug}`}
          className="shrink-0 text-xs font-semibold text-[#d89ca4] hover:underline whitespace-nowrap"
        >
          Explore →
        </Link>
      </div>

    </div>
  );
}
