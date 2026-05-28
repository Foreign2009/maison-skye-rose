import "./globals.css";

import type { Metadata } from "next";

import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartUIProvider } from "./context/CartUIContext";
import { CartFeedbackProvider } from "./context/CartFeedbackContext";

import FloatingCart from "./components/FloatingCart";
import CartSuccessToast from "./components/CartSuccessToast";

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

    <html
      lang="en"
      data-scroll-behavior="smooth"
    >

      <body>

        <FavoritesProvider>

          <CartProvider>

            <CartUIProvider>

              <CartFeedbackProvider>

                {children}

                <FloatingCart />

                <CartSuccessToast />

              </CartFeedbackProvider>

            </CartUIProvider>

          </CartProvider>

        </FavoritesProvider>

      </body>

    </html>

  );

}