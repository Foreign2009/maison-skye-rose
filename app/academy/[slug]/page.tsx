import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { academyCatalogue } from "../../lib/academy/catalogue";
import { ArticleContentRenderer } from "../../components/academy/ArticleContentRenderer";
import { ArticleRelatedFragrances } from "../../components/academy/ArticleRelatedFragrances";

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
    alternates: {
      canonical: `/academy/${article.slug}`,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "Maison Skye & Rose",
    },
    publisher: {
      "@type": "Organization",
      name: "Maison Skye & Rose",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#faf8f8]">
        {/* Header */}
        <section className="bg-white border-b border-[#e8e4e9] px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/academy"
              className="inline-flex items-center gap-1.5 text-xs text-[#4f4a52]/50 hover:text-[#d89ca4] transition-colors duration-200 mb-6"
            >
              ← Fragrance Academy
            </Link>
            <p className="text-xs font-medium tracking-widest uppercase text-[#d89ca4] mb-3">
              {article.category}
            </p>
            <h1 className="text-3xl sm:text-4xl font-light text-[#4f4a52] mb-3">
              {article.title}
            </h1>
            <p className="text-[#4f4a52]/60 text-base mb-4">{article.subtitle}</p>
            <p className="text-xs text-[#4f4a52]/40">{article.readTime} min read</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-2xl mx-auto px-4 py-12">
          <ArticleContentRenderer content={article.content} />

          {/* Related fragrances */}
          {article.relatedFragranceIds.length > 0 && (
            <ArticleRelatedFragrances fragranceIds={article.relatedFragranceIds} />
          )}

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-[#e8e4e9]">
            <Link
              href="/academy"
              className="text-sm font-medium text-[#d89ca4] hover:underline"
            >
              ← Back to Fragrance Academy
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
