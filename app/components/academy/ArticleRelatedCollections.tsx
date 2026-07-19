import Link from "next/link";
import { mkcCatalogue } from "../../lib/mkc/catalogue";
import { getCollectionIntelligence } from "../../lib/mkc/collectionIntelligence";
import type { FragranceKnowledge } from "../../lib/mkc/types";

type CollectionName = FragranceKnowledge["collection"];

interface ArticleRelatedCollectionsProps {
  collections: string[];
}

export function ArticleRelatedCollections({ collections }: ArticleRelatedCollectionsProps) {
  if (collections.length === 0) return null;

  const items = (collections as CollectionName[]).map((name) => {
    const count  = mkcCatalogue.filter((f) => f.collection === name).length;
    const intel  = getCollectionIntelligence(name);
    const labels = intel.topFamilies.slice(0, 3).join(" · ");
    return { name, count, labels, href: `/collections/${name.toLowerCase()}` };
  });

  return (
    <section className="mt-12 border-t border-[#e8e4e9] pt-10">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-[#4f4a52]/40 mb-4">
        Explore Collections
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex flex-col gap-1.5 rounded-xl border border-[#e8e4e9] bg-white px-5 py-4 hover:border-[#d89ca4] transition-colors duration-200"
          >
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4]">
              {item.name} Collection
            </p>
            <p className="text-sm font-medium text-[#4f4a52] group-hover:text-[#d89ca4] transition-colors duration-200">
              {item.labels}
            </p>
            <p className="text-[11px] text-[#4f4a52]/40">
              {item.count} fragrances →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
