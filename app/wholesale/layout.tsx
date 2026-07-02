import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale | Maison Skye & Rose",
  description:
    "Wholesale pricing for Maison Skye & Rose fragrances. Mix and match 10 or more items to unlock bulk pricing.",
  alternates: {
    canonical: "/wholesale",
  },
  openGraph: {
    title: "Wholesale | Maison Skye & Rose",
    description:
      "Wholesale pricing for Maison Skye & Rose fragrances. Mix and match 10 or more items to unlock bulk pricing.",
    url: "/wholesale",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wholesale — Maison Skye & Rose",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale | Maison Skye & Rose",
    description:
      "Wholesale pricing for Maison Skye & Rose fragrances. Mix and match 10 or more items to unlock bulk pricing.",
    images: ["/og-image.png"],
  },
};

export default function WholesaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
