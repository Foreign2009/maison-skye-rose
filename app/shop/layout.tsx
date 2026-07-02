import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Fragrances | Maison Skye & Rose",
  description:
    "Browse the full Maison Skye & Rose fragrance collection. Luxury-inspired scents for every style, available in 5ml, 10ml and 30ml.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Fragrances | Maison Skye & Rose",
    description:
      "Browse the full Maison Skye & Rose fragrance collection. Luxury-inspired scents for every style, available in 5ml, 10ml and 30ml.",
    url: "/shop",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maison Skye & Rose Fragrance Collection",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Fragrances | Maison Skye & Rose",
    description:
      "Browse the full Maison Skye & Rose fragrance collection. Luxury-inspired scents for every style, available in 5ml, 10ml and 30ml.",
    images: ["/og-image.png"],
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
