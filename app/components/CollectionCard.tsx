import Link from "next/link";
import Image from "next/image";
import type { CollectionSpec } from "../lib/discovery/types";

interface CollectionCardProps {
  spec: CollectionSpec;
  productCount: number;
  sampleImages: string[];
}

export default function CollectionCard({
  spec,
  productCount,
  sampleImages,
}: CollectionCardProps) {
  return (
    <Link
      href={`/discover/${spec.id}`}
      className="group flex flex-col rounded-[32px] border border-[#ede8e1] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)]"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${spec.accentColor}18` }}
        >
          {spec.icon}
        </span>

        <div className="min-w-0">
          <h3 className="text-base font-black text-[#4f4a52] leading-snug group-hover:text-[#d89ca4] transition-colors">
            {spec.name}
          </h3>
          <p className="mt-1 text-xs leading-5 text-[#7b7480] line-clamp-2">
            {spec.description}
          </p>
        </div>
      </div>

      {/* Tag chips */}
      {spec.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {spec.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{
                backgroundColor: `${spec.accentColor}18`,
                color: spec.accentColor,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Preview images + product count */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex -space-x-3">
          {sampleImages.slice(0, 3).map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-pink-50 to-blue-50 shadow-sm"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-contain p-1"
                sizes="40px"
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-[#7b7480]">
          {productCount} fragrances
        </p>
      </div>

      {/* CTA */}
      <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-[#d89ca4] group-hover:gap-2.5 transition-all">
        <span>Explore Collection</span>
        <span>→</span>
      </div>
    </Link>
  );
}
