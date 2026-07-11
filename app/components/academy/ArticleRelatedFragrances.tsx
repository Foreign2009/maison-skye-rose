import Image from "next/image";
import Link from "next/link";
import { mkcCatalogue } from "../../lib/mkc/catalogue";
import { KnowledgeChip } from "../knowledge/KnowledgeChip";

interface ArticleRelatedFragrancesProps {
  fragranceIds: string[];
}

export function ArticleRelatedFragrances({ fragranceIds }: ArticleRelatedFragrancesProps) {
  const fragrances = fragranceIds
    .map((id) => mkcCatalogue.find((f) => f.id === id || f.slug === id))
    .filter(Boolean);

  if (fragrances.length === 0) return null;

  return (
    <section className="mt-12 border-t border-[#e8e4e9] pt-10">
      <h2 className="text-lg font-semibold text-[#4f4a52] mb-6">
        Explore These Fragrances
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {fragrances.map((fragrance) => {
          if (!fragrance) return null;
          return (
            <Link
              key={fragrance.id}
              href={`/product/${fragrance.slug}`}
              className="group block rounded-xl border border-[#e8e4e9] hover:border-[#d89ca4] transition-colors duration-200 overflow-hidden bg-white"
            >
              <div className="relative aspect-square bg-[#faf8f8]">
                <Image
                  src={fragrance.images["10ml"]}
                  alt={fragrance.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-3"
                />
              </div>
              <div className="px-3 py-3">
                <p className="text-[10px] font-medium tracking-widest uppercase text-[#d89ca4] mb-0.5">
                  {fragrance.collection}
                </p>
                <p className="text-sm font-medium text-[#4f4a52] leading-tight group-hover:text-[#d89ca4] transition-colors duration-200 line-clamp-2">
                  {fragrance.name}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <KnowledgeChip label={fragrance.profile} />
                  <KnowledgeChip label={fragrance.season} />
                </div>
                <p className="mt-1.5 text-[11px] text-[#4f4a52]/55 leading-relaxed line-clamp-2">
                  {fragrance.mood}
                </p>
                <p className="mt-1.5 text-xs text-[#4f4a52]/60">
                  From R{fragrance.prices["5ml"]}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
