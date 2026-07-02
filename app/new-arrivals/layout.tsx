import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals | Maison Skye & Rose",
  description:
    "Discover the latest fragrance additions to the Maison Skye & Rose collection. New luxury inspired scents now available.",
  alternates: {
    canonical: "/new-arrivals",
  },
  openGraph: {
    title: "New Arrivals | Maison Skye & Rose",
    description:
      "Discover the latest fragrance additions to the Maison Skye & Rose collection. New luxury inspired scents now available.",
    url: "/new-arrivals",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "New Arrivals — Maison Skye & Rose",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Arrivals | Maison Skye & Rose",
    description:
      "Discover the latest fragrance additions to the Maison Skye & Rose collection. New luxury inspired scents now available.",
    images: ["/og-image.png"],
  },
};

export default function NewArrivalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
