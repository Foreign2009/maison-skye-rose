import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { academyCatalogue } from "../../lib/academy/catalogue";
import { categoryToSlug } from "../../lib/academy/categories";
import { ArticleContentRenderer } from "../../components/academy/ArticleContentRenderer";
import { ArticleRelatedFragrances } from "../../components/academy/ArticleRelatedFragrances";
import { ArticleRelatedArticles } from "../../components/academy/ArticleRelatedArticles";
import { ArticleRelatedCollections } from "../../components/academy/ArticleRelatedCollections";
import { getFragrancesForArticle, getCollectionsForArticle } from "../../lib/academy/academyRelationships";
import { AcademyBreadcrumbs } from "../../components/academy/AcademyBreadcrumbs";
import { AcademyTableOfContents } from "../../components/academy/AcademyTableOfContents";
import { AcademyArticleNavigation } from "../../components/academy/AcademyArticleNavigation";
import { ReadingProgress } from "../../components/academy/ReadingProgress";
import AskAcademyButton from "../../components/AskAcademyButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return academyCatalogue.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = academyCatalogue.find((a) => a.slug === slug);

  if (!article) {
    return { title: "Article Not Found | Maison Skye & Rose" };
  }

  return {
    title: `${article.title} | Maison Fragrance Academy`,
    description: article.excerpt,
    alternates: { canonical: `/academy/${article.slug}` },
    openGraph: {
      title: `${article.title} | Maison Fragrance Academy`,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Maison Fragrance Academy`,
      description: article.excerpt,
    },
  };
}

export default async function AcademyArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = academyCatalogue.find((a) => a.slug === slug);

  if (!article) notFound();

  // ── Navigation neighbours ───────────────────────────────────────────────────
  const currentIndex = academyCatalogue.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? academyCatalogue[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < academyCatalogue.length - 1
      ? academyCatalogue[currentIndex + 1]
      : null;

  // ── Relationship-driven commerce links ─────────────────────────────────────
  const relatedFragranceSlugs = getFragrancesForArticle(article.slug)
    .sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || b.popularity - a.popularity)
    .slice(0, 6)
    .map((f) => f.slug);

  const relatedCollections = getCollectionsForArticle(article.slug);

  // ── TOC headings from content ──────────────────────────────────────────────
  const headings = article.content
    .filter(
      (b): b is { type: "heading"; text: string } => b.type === "heading"
    )
    .map((b) => ({
      id: b.text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      text: b.text,
    }));

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";
  const categorySlug = categoryToSlug(article.category);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "Maison Skye & Rose" },
    publisher: { "@type": "Organization", name: "Maison Skye & Rose" },
  };

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
        name: article.category,
        item: `${baseUrl}/academy/category/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: `${baseUrl}/academy/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Reading progress — client component */}
      <ReadingProgress />

      <main className="min-h-screen bg-[#faf8f8]">

        {/* ── Article header ─────────────────────────────────────────────── */}
        <section className="bg-white border-b border-[#e8e4e9] px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <AcademyBreadcrumbs
              items={[
                { label: "Academy", href: "/academy" },
                {
                  label: article.category,
                  href: `/academy/category/${categorySlug}`,
                },
                { label: article.title },
              ]}
            />

            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-3">
              {article.category}
            </p>
            <h1 className="text-3xl sm:text-4xl font-light text-[#4f4a52] leading-tight mb-3">
              {article.title}
            </h1>
            <p className="text-[#4f4a52]/55 text-base mb-5 leading-relaxed">
              {article.subtitle}
            </p>
            <div className="flex items-center gap-4 text-xs text-[#4f4a52]/35">
              <span>{article.readTime} min read</span>
              <span>·</span>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("en-ZA", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
            <div className="mt-5">
              <AskAcademyButton topic={article.category} />
            </div>
          </div>
        </section>

        {/* ── Content area ───────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 py-12">

          {/* Mobile TOC (collapsible, above content) */}
          {headings.length > 0 && (
            <div className="lg:hidden mb-8">
              <AcademyTableOfContents headings={headings} collapsible />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12 lg:gap-16">

            {/* Main content */}
            <article>
              <ArticleContentRenderer content={article.content} />

              {/* Related articles */}
              {(article.relatedArticleIds ?? []).length > 0 && (
                <ArticleRelatedArticles
                  slugs={article.relatedArticleIds!}
                  heading="Related Articles"
                />
              )}

              {/* Related fragrances — relationship-driven via getFragrancesForArticle() */}
              {relatedFragranceSlugs.length > 0 && (
                <ArticleRelatedFragrances fragranceIds={relatedFragranceSlugs} />
              )}

              {/* Related collections — relationship-driven via getCollectionsForArticle() */}
              {relatedCollections.length > 0 && (
                <ArticleRelatedCollections collections={relatedCollections} />
              )}

              {/* Continue learning */}
              {(article.recommendedArticleIds ?? []).length > 0 && (
                <ArticleRelatedArticles
                  slugs={article.recommendedArticleIds!}
                  heading="Continue Learning"
                />
              )}

              {/* Prev / Next navigation */}
              <AcademyArticleNavigation
                prev={
                  prevArticle
                    ? {
                        slug: prevArticle.slug,
                        title: prevArticle.title,
                        category: prevArticle.category,
                      }
                    : null
                }
                next={
                  nextArticle
                    ? {
                        slug: nextArticle.slug,
                        title: nextArticle.title,
                        category: nextArticle.category,
                      }
                    : null
                }
              />

              {/* Ask Maison AI — future placeholder */}
              <div className="mt-10 rounded-2xl bg-[#f5f1f6] border border-[#d89ca4]/20 px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#d89ca4]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#d89ca4] text-sm" aria-hidden="true">
                      ✦
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-[#d89ca4] mb-1">
                      Coming Soon
                    </p>
                    <h3 className="text-[#4f4a52] font-semibold text-base mb-1">
                      Ask Maison AI
                    </h3>
                    <p className="text-sm text-[#4f4a52]/50 leading-relaxed">
                      Get personalised fragrance guidance powered by the Maison
                      Knowledge Catalogue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Academy */}
              <div className="mt-10 pt-8 border-t border-[#e8e4e9]">
                <Link
                  href="/academy"
                  className="text-sm font-medium text-[#d89ca4] hover:underline"
                >
                  ← Back to Fragrance Academy
                </Link>
              </div>
            </article>

            {/* Desktop sidebar TOC */}
            {headings.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-36">
                  <AcademyTableOfContents headings={headings} />
                </div>
              </aside>
            )}

          </div>
        </section>
      </main>
    </>
  );
}
