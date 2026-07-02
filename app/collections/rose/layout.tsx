import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rose Collection | Maison Skye & Rose",
  description:
    "Timeless feminine luxury fragrances inspired by grace, romance, beauty and soft sophistication. Shop the Rose Collection.",
  alternates: {
    canonical: "/collections/rose",
  },
  openGraph: {
    title: "Rose Collection | Maison Skye & Rose",
    description:
      "Timeless feminine luxury fragrances inspired by grace, romance, beauty and soft sophistication. Shop the Rose Collection.",
    url: "/collections/rose",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rose Collection — Maison Skye & Rose",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rose Collection | Maison Skye & Rose",
    description:
      "Timeless feminine luxury fragrances inspired by grace, romance, beauty and soft sophistication. Shop the Rose Collection.",
    images: ["/og-image.png"],
  },
};

export default function RoseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
