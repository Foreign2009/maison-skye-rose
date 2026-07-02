import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elite Collection | Maison Skye & Rose",
  description:
    "Exclusive niche fragrances inspired by the world's most sought-after luxury perfume houses. Shop the Elite Collection.",
  alternates: {
    canonical: "/collections/elite",
  },
  openGraph: {
    title: "Elite Collection | Maison Skye & Rose",
    description:
      "Exclusive niche fragrances inspired by the world's most sought-after luxury perfume houses. Shop the Elite Collection.",
    url: "/collections/elite",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Elite Collection — Maison Skye & Rose",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Collection | Maison Skye & Rose",
    description:
      "Exclusive niche fragrances inspired by the world's most sought-after luxury perfume houses. Shop the Elite Collection.",
    images: ["/og-image.png"],
  },
};

export default function EliteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
