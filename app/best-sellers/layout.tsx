import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Sellers | Maison Skye & Rose",
  description:
    "Shop the most popular fragrances at Maison Skye & Rose. Top-rated luxury inspired scents loved by our guests.",
  alternates: {
    canonical: "/best-sellers",
  },
  openGraph: {
    title: "Best Sellers | Maison Skye & Rose",
    description:
      "Shop the most popular fragrances at Maison Skye & Rose. Top-rated luxury inspired scents loved by our guests.",
    url: "/best-sellers",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best Sellers — Maison Skye & Rose",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Sellers | Maison Skye & Rose",
    description:
      "Shop the most popular fragrances at Maison Skye & Rose. Top-rated luxury inspired scents loved by our guests.",
    images: ["/og-image.png"],
  },
};

export default function BestSellersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
