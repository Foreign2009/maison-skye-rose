interface AcademyHeroProps {
  articleCount: number;
  categoryCount: number;
}

export function AcademyHero({ articleCount, categoryCount }: AcademyHeroProps) {
  return (
    <section className="bg-white border-b border-[#e8e4e9] px-4 py-16 md:py-24 text-center">
      <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#d89ca4] mb-5">
        Maison Skye &amp; Rose
      </p>

      <h1 className="text-4xl sm:text-5xl font-light text-[#4f4a52] tracking-tight mb-5">
        Fragrance Academy
      </h1>

      <p className="text-[#4f4a52]/60 max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-8">
        Everything you need to understand, choose, and wear fragrance with
        confidence. Written by perfume enthusiasts, for perfume enthusiasts.
      </p>

      <div className="flex items-center justify-center gap-6 text-xs text-[#4f4a52]/40 mb-10">
        <span>
          <span className="font-semibold text-[#4f4a52]/70">{articleCount}</span> articles
        </span>
        <span className="h-3 w-px bg-[#e8e4e9]" aria-hidden="true" />
        <span>
          <span className="font-semibold text-[#4f4a52]/70">{categoryCount}</span> categories
        </span>
      </div>

      {/* Search placeholder — UI only, no backend */}
      <div className="max-w-sm mx-auto">
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4f4a52]/25 select-none pointer-events-none"
            aria-hidden="true"
          >
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search articles… (coming soon)"
            disabled
            aria-label="Article search — coming soon"
            className="w-full rounded-full border border-[#e8e4e9] bg-[#faf8f8] px-5 py-3 pl-10 text-sm text-[#4f4a52]/30 placeholder-[#4f4a52]/25 cursor-not-allowed select-none"
          />
        </div>
      </div>
    </section>
  );
}
