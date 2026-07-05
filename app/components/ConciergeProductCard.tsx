"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormattedFragrance } from "../lib/concierge/types";

interface ConciergeProductCardProps {
  fragrance:   FormattedFragrance;
  onClick?:    () => void;
}

export default function ConciergeProductCard({ fragrance, onClick }: ConciergeProductCardProps) {
  return (
    <Link
      href={fragrance.href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-[#efe8e1] bg-white p-3 transition hover:border-[#d89ca4] hover:shadow-sm"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#faf7f5]">
        <Image
          src={fragrance.image}
          alt={fragrance.name}
          fill
          sizes="56px"
          className="object-contain p-1"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-[#4f4a52]">{fragrance.name}</p>
        {fragrance.subtitle && (
          <p className="truncate text-[11px] text-zinc-400">{fragrance.subtitle}</p>
        )}
        <p className="mt-0.5 text-[11px] text-zinc-400">
          {fragrance.family.slice(0, 2).join(" · ")}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[12px] font-bold text-[#4f4a52]">R{fragrance.price}</p>
        <p className="mt-0.5 text-[10px] text-[#d89ca4]">View →</p>
      </div>
    </Link>
  );
}
