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

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const fragrance = fragrances.find((item) => {
    const generatedSlug = item.title
      .toLowerCase()
      .replace(/\s+/g, "-");

    return generatedSlug === slug;
  });

  if (!fragrance) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <ProductDetail fragrance={fragrance} />

      <Footer />
    </main>
  );
}