import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductDetail from "../../components/ProductDetail";
import { fragrances } from "../../data/fragrances";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function findFragrance(slug: string) {
  return fragrances.find((item) => {
    const generatedSlug = item.title
      .toLowerCase()
      .replace(/\s+/g, "-");

    return generatedSlug === slug;
  });
}

function normalizeImagePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fragrance = findFragrance(slug);

  if (!fragrance) return {};

  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";
  const url = `${baseUrl}/product/${slug}`;
  const imagePath = normalizeImagePath(fragrance.images["10ml"]);
  const ogImage = `${baseUrl}${imagePath}`;
  const startingPrice = Math.min(...Object.values(fragrance.prices));
  const description = `${fragrance.mood} Notes: ${fragrance.notes.join(", ")}. From R${startingPrice}.`;

  return {
    title: `${fragrance.title} | Maison Skye & Rose`,
    description,
    category: fragrance.collection,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${fragrance.title} | Maison Skye & Rose`,
      description: fragrance.mood,
      url,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: fragrance.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${fragrance.title} | Maison Skye & Rose`,
      description: fragrance.mood,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const fragrance = findFragrance(slug);

  if (!fragrance) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";
  const imagePath = normalizeImagePath(fragrance.images["10ml"]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: fragrance.title,
    description: fragrance.mood,
    brand: {
      "@type": "Brand",
      name: "Maison Skye & Rose",
    },
    image: `${baseUrl}${imagePath}`,
    url: `${baseUrl}/product/${slug}`,
    sku: slug,
    category: fragrance.collection,
    offers: Object.entries(fragrance.prices).map(([size, price]) => ({
      "@type": "Offer",
      name: size,
      price,
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
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

        <ProductDetail fragrance={fragrance} />

        <Footer />
      </main>
    </>
  );
}
