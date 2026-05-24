"use client";

import { useState } from "react";

import Link from "next/link";

import CartDrawer from "./CartDrawer";

import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function Navbar() {

  const { cart } = useCart();

  const { favorites } =
    useFavorites();

  const [cartOpen, setCartOpen] =
    useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f5f1eb]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* LOGO */}
          <Link href="/">

            <div className="transition duration-300 hover:opacity-80">

              <p className="text-[9px] uppercase tracking-[0.45em] text-zinc-500">
                Maison
              </p>

              <h1 className="text-3xl font-black uppercase tracking-[-0.05em]">
                Skye & Rose
              </h1>

            </div>

          </Link>

          {/* NAV */}
          <nav className="hidden items-center gap-10 lg:flex">

            <Link
              href="/collections/skye"
              className="text-xs uppercase tracking-[0.3em] text-zinc-600 transition duration-300 hover:text-black"
            >
              Skye Collection
            </Link>

            <Link
              href="/collections/rose"
              className="text-xs uppercase tracking-[0.3em] text-zinc-600 transition duration-300 hover:text-black"
            >
              Rose Collection
            </Link>

            <Link
              href="/best-sellers"
              className="text-xs uppercase tracking-[0.3em] text-zinc-600 transition duration-300 hover:text-black"
            >
              Best Sellers
            </Link>

            <Link
              href="/new-arrivals"
              className="text-xs uppercase tracking-[0.3em] text-zinc-600 transition duration-300 hover:text-black"
            >
              New Arrivals
            </Link>

            <Link
              href="/favorites"
              className="text-xs uppercase tracking-[0.3em] text-zinc-600 transition duration-300 hover:text-black"
            >
              Favorites ({favorites.length})
            </Link>

          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            <a
              href="https://wa.me/27841234567"
              target="_blank"
              className="hidden rounded-full bg-white px-6 py-4 text-xs uppercase tracking-[0.25em] shadow-sm transition duration-300 hover:scale-105 md:block"
            >
              WhatsApp
            </a>

            <button
              onClick={() =>
                setCartOpen(true)
              }
              className="rounded-full bg-black px-6 py-4 text-xs uppercase tracking-[0.25em] text-white shadow-xl transition duration-300 hover:scale-105"
            >
              Bag ({cart.length})
            </button>

          </div>

        </div>

      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
      />

    </>
  );
}