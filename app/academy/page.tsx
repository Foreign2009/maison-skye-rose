import type { Metadata } from "next";
import Link from "next/link";
import { academyCatalogue } from "../lib/academy/catalogue";
import { ACADEMY_CATEGORIES } from "../lib/academy/categories";
import { AcademyHero } from "../components/academy/AcademyHero";
import { AcademySection } from "../components/academy/AcademySection";
import { AcademyArticleCard } from "../components/academy/AcademyArticleCard";
import { AcademyCategoryCard } from "../components/academy/AcademyCategoryCard";
import { AcademyBadge } from "../components/academy/AcademyBadge";

export const metadata: Metadata = {
  title: "Fragrance Academy | Maison Skye & Rose",
  description:
    "Learn everything about fragrance — families, note pyramids, how to wear and layer, seasonal guidance, and how to find your signature scent.",
  alternates: { canonical: "/academy" },
  openGraph: {
    title: "Fragrance Academy | Maison Skye & Rose",
    description:
      "Learn everything about fragrance — families, note pyramids, how to wear and layer, seasonal guidance, and how to find your signature scent.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fragrance Academy | Maison Skye & Rose",
    description:
      "Learn everything about fragrance — families, note pyramids, how to wear and layer, seasonal guidance, and how to find your signature scent.",
  },
};

const BEGINNER_SLUGS = [
  "guide-to-fragrance-families",
  "the-note-pyramid-explained",
  "how-to-wear-fragrance",
];

const START_HERE_SLUG = "what-makes-a-signature-scent";

export default function AcademyPage() {
  const featuredArticles = academyCatalogue.filter((a) => a.featured);
  const beginnerArticles = BEGINNER_SLUGS.map((slug) =>
    academyCatalogue.find((a) => a.slug === slug)
  ).filter(Boolean);
  const startHereArticle = academyCatalogue.find((a) => a.slug === START_HERE_SLUG);

  const articleCountByCategory = Object.fromEntries(
    ACADEMY_CATEGORIES.map((cat) => [
      cat.slug,
      academyCatalogue.filter((a) => a.category === cat.category).length,
    ])
  );

  return (
    <main className="min-h-screen bg-[#faf8f8]">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <AcademyHero
        articleCount={academyCatalogue.length}
        categoryCount={ACADEMY_CATEGORIES.filter(
          (c) => articleCountByCategory[c.slug] > 0
        ).length}
      />

      <div className="max-w-6xl mx-auto px-4">

        {/* ── Beginner's Journey ───────────────────────────────────────────── */}
        <AcademySection>
          <div className="mb-8">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#d89ca4] mb-2">
              Start Here
            </p>
            <h2 className="text-2xl font-light text-[#4f4a52]">
              New to Fragrance?
            </h2>
            <p className="text-sm text-[#4f4a52]/50 mt-1">
              Three essential reads to build your fragrance knowledge from the ground up.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]">
            {/* Start Here card */}
            {startHereArticle && (
              <Link
                href={`/academy/${startHereArticle.slug}`}
                className="group block rounded-2xl bg-[#4f4a52] px-7 py-8 hover:bg-[#3e3a41] transition-colors duration-200"
              >
                <AcademyBadge variant="default" className="bg-white/10 text-white/60 mb-4">
                  Recommended First Read
                </AcademyBadge>
                <h3 className="text-xl font-semibold text-white leading-snug mb-3 group-hover:text-[#d89ca4] transition-colors duration-200">
                  {startHereArticle.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed mb-6">
                  {startHereArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/35">
                    {startHereArticle.readTime} min read
                  </span>
                  <span className="text-sm font-medium text-[#d89ca4] group-hover:translate-x-0.5 transition-transform duration-200">
                    Read →
                  </span>
                </div>
              </Link>
            )}

            {/* 3 foundational articles */}
            <div className="flex flex-col gap-3">
              {beginnerArticles.map((article) => {
                if (!article) return null;
                return (
                  <Link
                    key={article.slug}
                    href={`/academy/${article.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-[#e8e4e9] bg-white px-5 py-4 hover:border-[#d89ca4] transition-colors duration-200"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-0.5">
                        {article.category}
                      </p>
                      <p className="text-sm font-medium text-[#4f4a52] leading-snug group-hover:text-[#d89ca4] transition-colors duration-200">
                        {article.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-[#4f4a52]/35">
                        {article.readTime} min
                      </span>
                      <span className="text-[#4f4a52]/25 group-hover:text-[#d89ca4] transition-colors text-sm">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </AcademySection>

        {/* ── Featured Articles ─────────────────────────────────────────────── */}
        {featuredArticles.length > 0 && (
          <AcademySection className="border-t border-[#e8e4e9]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#d89ca4] mb-2">
                  Featured
                </p>
                <h2 className="text-2xl font-light text-[#4f4a52]">
                  Essential Reads
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featuredArticles.map((article) => (
                <AcademyArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          </AcademySection>
        )}

        {/* ── Popular Topics ────────────────────────────────────────────────── */}
        <AcademySection className="border-t border-[#e8e4e9]">
          <div className="mb-6">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#d89ca4] mb-2">
              Popular Topics
            </p>
            <h2 className="text-2xl font-light text-[#4f4a52]">
              Explore by Topic
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {academyCatalogue.map((article) => (
              <Link
                key={article.slug}
                href={`/academy/${article.slug}`}
                className="rounded-full border border-[#e8e4e9] bg-white px-4 py-2 text-sm text-[#4f4a52]/70 hover:border-[#d89ca4] hover:text-[#d89ca4] transition-colors duration-200"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </AcademySection>

        {/* ── Browse by Category ────────────────────────────────────────────── */}
        <AcademySection className="border-t border-[#e8e4e9]">
          <div className="mb-8">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#d89ca4] mb-2">
              Browse
            </p>
            <h2 className="text-2xl font-light text-[#4f4a52]">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACADEMY_CATEGORIES.map((cat) => (
              <AcademyCategoryCard
                key={cat.slug}
                category={cat}
                articleCount={articleCountByCategory[cat.slug] ?? 0}
              />
            ))}
          </div>
        </AcademySection>

        {/* ── All Articles ──────────────────────────────────────────────────── */}
        <AcademySection className="border-t border-[#e8e4e9]">
          <div className="mb-8">
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#d89ca4] mb-2">
              All Articles
            </p>
            <h2 className="text-2xl font-light text-[#4f4a52]">
              The Full Library
            </h2>
          </div>
          <div className="space-y-10">
            {ACADEMY_CATEGORIES.map((cat) => {
              const articles = academyCatalogue.filter(
                (a) => a.category === cat.category
              );
              if (articles.length === 0) return null;
              return (
                <div key={cat.slug}>
                  <div className="flex items-center gap-4 mb-5">
                    <h3 className="text-xs font-semibold tracking-widest uppercase text-[#4f4a52]/50">
                      {cat.title}
                    </h3>
                    <div className="flex-1 h-px bg-[#e8e4e9]" />
                    <Link
                      href={`/academy/category/${cat.slug}`}
                      className="text-xs text-[#4f4a52]/35 hover:text-[#d89ca4] transition-colors"
                    >
                      All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                      <AcademyArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </AcademySection>

      </div>
    </main>
  );
}
