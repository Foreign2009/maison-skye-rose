import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fragrance Finder | Maison Skye & Rose",
  description:
    "Answer a few questions and discover fragrances that match your personality, style and scent preferences with Maison AI.",
  alternates: {
    canonical: "/quiz",
  },
  openGraph: {
    title: "Fragrance Finder | Maison Skye & Rose",
    description:
      "Answer a few questions and discover fragrances that match your personality, style and scent preferences with Maison AI.",
    url: "/quiz",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maison AI Fragrance Finder",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fragrance Finder | Maison Skye & Rose",
    description:
      "Answer a few questions and discover fragrances that match your personality, style and scent preferences with Maison AI.",
    images: ["/og-image.png"],
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
