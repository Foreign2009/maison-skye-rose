import "./globals.css";

import type { Metadata } from "next";

import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

export const metadata: Metadata = {
  title: "Maison Skye & Rose",
  description:
    "Luxury-inspired fragrance lifestyle store.",
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

            {children}

          </CartProvider>

        </FavoritesProvider>

      </body>

    </html>
  );
}