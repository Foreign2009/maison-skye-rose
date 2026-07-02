import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skye Collection | Maison Skye & Rose",
  description:
    "Bold masculine luxury fragrances inspired by confidence, nightlife, movement and modern elegance. Shop the Skye Collection.",
  alternates: {
    canonical: "/collections/skye",
  },
  openGraph: {
    title: "Skye Collection | Maison Skye & Rose",
    description:
      "Bold masculine luxury fragrances inspired by confidence, nightlife, movement and modern elegance. Shop the Skye Collection.",
    url: "/collections/skye",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skye Collection — Maison Skye & Rose",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skye Collection | Maison Skye & Rose",
    description:
      "Bold masculine luxury fragrances inspired by confidence, nightlife, movement and modern elegance. Shop the Skye Collection.",
    images: ["/og-image.png"],
  },
};

export default function SkyeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
