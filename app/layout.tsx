// app/layout.tsx
import "./globals.css";

import type { Metadata } from "next";

import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartUIProvider } from "./context/CartUIContext";
import { CartFeedbackProvider } from "./context/CartFeedbackContext";

import CartSuccessToast from "./components/CartSuccessToast";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { AnalyticsInit } from "./components/AnalyticsInit";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000"
  ),
  title: "Maison Skye & Rose | Luxury Inspired Fragrances",
  description:
    "Explore luxury-inspired fragrances from Maison Skye & Rose. Premium 5ml, 10ml and 30ml options available.",
  openGraph: {
    title: "Maison Skye & Rose | Luxury Inspired Fragrances",
    description:
      "Explore luxury-inspired fragrances from Maison Skye & Rose. Premium 5ml, 10ml and 30ml options available.",
    url: "/",
    siteName: "Maison Skye & Rose",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maison Skye & Rose — Luxury Inspired Fragrances",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Skye & Rose | Luxury Inspired Fragrances",
    description:
      "Explore luxury-inspired fragrances from Maison Skye & Rose. Premium 5ml, 10ml and 30ml options available.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <FavoritesProvider>
          <CartProvider>
            <CartUIProvider>
              <CartFeedbackProvider>
                {children}

                <CartSuccessToast />
                <FloatingWhatsApp />
              </CartFeedbackProvider>
            </CartUIProvider>
          </CartProvider>
        </FavoritesProvider>
        <AnalyticsInit />
      </body>
    </html>
  );
}