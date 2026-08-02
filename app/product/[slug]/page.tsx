import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductDetail from "../../components/ProductDetail";
import { mkcCatalogue } from "../../lib/mkc/catalogue";
import { getSimilarFragrances } from "../../lib/discovery/similarityEngine";
import { getCollectionsForFragrance } from "../../lib/discovery/collectionEngine";
import { getKnowledgeInsights } from "../../lib/intelligence";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return mkcCatalogue.map((k) => ({ slug: k.slug }));
}

function normalizeImagePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insights = getKnowledgeInsights(slug);
  if (!insights) return {};

  const knowledge = insights.record;
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";
  const url = `${baseUrl}/product/${slug}`;
  const imagePath = normalizeImagePath(knowledge.images["10ml"]);
  const ogImage = `${baseUrl}${imagePath}`;
  const startingPrice = Math.min(...Object.values(knowledge.prices));
  const allNotes = [
    ...knowledge.notes.top,
    ...knowledge.notes.heart,
    ...knowledge.notes.base,
  ];
  const description = `${knowledge.mood} Notes: ${allNotes.slice(0, 4).join(", ")}. From R${startingPrice}.`;

  return {
    title: `${knowledge.name} | Maison Skye & Rose`,
    description,
    category: knowledge.collection,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${knowledge.name} | Maison Skye & Rose`,
      description: knowledge.mood,
      url,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: knowledge.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${knowledge.name} | Maison Skye & Rose`,
      description: knowledge.mood,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const insights = getKnowledgeInsights(slug);
  if (!insights) notFound();

  const knowledge           = insights.record;
  const relationshipSummary = insights.relationships;
  const qualityProfile      = insights.quality ?? undefined;
  const discoverMoreArticles = insights.discovery.academyArticles.map((article) => ({
    slug:     article.slug,
    title:    article.title,
    category: article.category,
    readTime: article.readTime,
  }));

  // getSimilarFragrances is retained: KnowledgeDiscovery.similarFragrances discards
  // ScoreBreakdown, which deriveSimilarityReasons and RecommendationCard require.
  const similarFragrances = getSimilarFragrances(knowledge, { count: 3 });

  const discoveryCollections = getCollectionsForFragrance(knowledge).map((s) => ({
    id:       s.id,
    name:     s.name,
    icon:     s.icon,
    featured: s.featured,
  }));

  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";
  const imagePath = normalizeImagePath(knowledge.images["10ml"]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: knowledge.name,
    description: knowledge.mood,
    brand: {
      "@type": "Brand",
      name: "Maison Skye & Rose",
    },
    image: `${baseUrl}${imagePath}`,
    url: `${baseUrl}/product/${slug}`,
    sku: knowledge.slug,
    category: knowledge.collection,
    offers: Object.entries(knowledge.prices).map(([size, price]) => ({
      "@type": "Offer",
      name: size,
      price,
      priceCurrency: "ZAR",
      availability:
        knowledge.status === "discontinued"
          ? "https://schema.org/Discontinued"
          : "https://schema.org/InStock",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#f5f1eb]">
        <Navbar />

        <ProductDetail knowledge={knowledge} discoverMoreArticles={discoverMoreArticles} similarFragrances={similarFragrances} relationshipSummary={relationshipSummary} qualityProfile={qualityProfile} discoveryCollections={discoveryCollections} />

        <Footer />
      </main>
    </>
  );
}
