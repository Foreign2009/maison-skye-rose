import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { academyCatalogue } from "../../../lib/academy/catalogue";
import {
  ACADEMY_CATEGORIES,
  getCategoryMetaBySlug,
} from "../../../lib/academy/categories";
import { AcademyArticleCard } from "../../../components/academy/AcademyArticleCard";
import { AcademyBreadcrumbs } from "../../../components/academy/AcademyBreadcrumbs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ACADEMY_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryMetaBySlug(slug);

  if (!cat) {
    return { title: "Category Not Found | Maison Fragrance Academy" };
  }

  return {
    title: `${cat.title} | Maison Fragrance Academy`,
    description: cat.seoDescription,
    alternates: { canonical: `/academy/category/${cat.slug}` },
    openGraph: {
      title: `${cat.title} | Maison Fragrance Academy`,
      description: cat.seoDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.title} | Maison Fragrance Academy`,
      description: cat.seoDescription,
    },
  };
}

export default async function AcademyCategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategoryMetaBySlug(slug);

  if (!cat) notFound();

  const articles = academyCatalogue.filter((a) => a.category === cat.category);
  const featuredArticle = cat.featuredArticleId
    ? articles.find((a) => a.slug === cat.featuredArticleId)
    : null;
  const gridArticles = articles.filter(
    (a) => a.slug !== featuredArticle?.slug
  );

  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl || "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Fragrance Academy",
        item: `${baseUrl}/academy`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cat.title,
        item: `${baseUrl}/academy/category/${cat.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-[#faf8f8]">

        {/* ── Category hero ─────────────────────────────────────────────── */}
        <section className="bg-white border-b border-[#e8e4e9] px-4 py-14">
          <div className="max-w-3xl mx-auto">
            <AcademyBreadcrumbs
              items={[
                { label: "Academy", href: "/academy" },
                { label: cat.title },
              ]}
            />

            <div className="flex items-start gap-5 mb-6">
              <span
                className="text-4xl leading-none select-none mt-1"
                aria-hidden="true"
                style={{ color: cat.accentColor }}
              >
                {cat.icon}
              </span>
              <div>
                <p
                  className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-2"
                  style={{ color: cat.accentColor }}
                >
                  {cat.heroCopy}
                </p>
                <h1 className="text-3xl sm:text-4xl font-light text-[#4f4a52] leading-tight mb-2">
                  {cat.title}
                </h1>
                <p className="text-[#4f4a52]/50 text-base">{cat.subtitle}</p>
              </div>
            </div>

            <p className="text-[#4f4a52]/65 text-base leading-relaxed max-w-2xl">
              {cat.description}
            </p>

            {articles.length > 0 && (
              <p className="mt-5 text-xs text-[#4f4a52]/35">
                {articles.length} {articles.length === 1 ? "article" : "articles"} in this category
              </p>
            )}
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

          {/* ── Featured article ──────────────────────────────────────────── */}
          {featuredArticle && (
            <section>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#4f4a52]/40 mb-4">
                Featured
              </p>
              <AcademyArticleCard article={featuredArticle} featured />
            </section>
          )}

          {/* ── Article grid ─────────────────────────────────────────────── */}
          {gridArticles.length > 0 && (
            <section>
              {featuredArticle && (
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[#4f4a52]/40 mb-4">
                  All Articles
                </p>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gridArticles.map((article) => (
                  <AcademyArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* ── Empty state ───────────────────────────────────────────────── */}
          {articles.length === 0 && (
            <section className="rounded-2xl border border-[#e8e4e9] bg-white px-8 py-14 text-center">
              <p
                className="text-3xl mb-4 select-none"
                aria-hidden="true"
                style={{ color: cat.accentColor }}
              >
                {cat.icon}
              </p>
              <h2 className="text-lg font-semibold text-[#4f4a52] mb-2">
                Articles Coming Soon
              </h2>
              <p className="text-sm text-[#4f4a52]/50 max-w-sm mx-auto leading-relaxed mb-6">
                We are working on articles for this category. Return soon or
                explore other topics in the Academy.
              </p>
              <Link
                href="/academy"
                className="inline-block text-sm font-medium text-[#d89ca4] hover:underline"
              >
                ← Back to Fragrance Academy
              </Link>
            </section>
          )}

          {/* ── Other categories ─────────────────────────────────────────── */}
          <section className="border-t border-[#e8e4e9] pt-10">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#4f4a52]/40 mb-4">
              Other Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {ACADEMY_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
                <Link
                  key={c.slug}
                  href={`/academy/category/${c.slug}`}
                  className="rounded-full border border-[#e8e4e9] bg-white px-4 py-2 text-sm text-[#4f4a52]/60 hover:border-[#d89ca4] hover:text-[#d89ca4] transition-colors duration-200"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
