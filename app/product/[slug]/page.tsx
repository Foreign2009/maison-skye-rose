import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductDetail from "../../components/ProductDetail";
import { mkcCatalogue } from "../../lib/mkc/catalogue";
import type { FragranceKnowledge } from "../../lib/mkc/types";
import { recommendAcademyArticles } from "../../lib/academy/recommendAcademyArticles";
import { getSimilarFragrances } from "../../lib/discovery/similarityEngine";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function findKnowledge(slug: string): FragranceKnowledge | undefined {
  return mkcCatalogue.find((k) => k.slug === slug);
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
  const knowledge = findKnowledge(slug);

  if (!knowledge) return {};

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

  const knowledge = findKnowledge(slug);

  if (!knowledge) {
    notFound();
  }

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
      availability: "https://schema.org/InStock",
    })),
  };

  const discoverMoreArticles = recommendAcademyArticles(knowledge).map((article) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    readTime: article.readTime,
  }));

  const similarFragrances = getSimilarFragrances(knowledge, { count: 3 });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#f5f1eb]">
        <Navbar />

        <ProductDetail knowledge={knowledge} discoverMoreArticles={discoverMoreArticles} similarFragrances={similarFragrances} />

        <Footer />
      </main>
    </>
  );
}
