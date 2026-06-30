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

// Updated with high-priority SEO Metadata
export const metadata: Metadata = {
  title: "Maison Skye & Rose | Luxury Inspired Fragrances",
  description:
    "Explore luxury-inspired fragrances from Maison Skye & Rose. Premium 5ml, 10ml and 30ml options available.",
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