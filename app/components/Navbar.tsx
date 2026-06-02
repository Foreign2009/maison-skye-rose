"use client";

import { useState } from "react";
import Link from "next/link";

import CartDrawer from "./CartDrawer";

import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCartUI } from "../context/CartUIContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { favorites } = useFavorites();
  const { cartOpen, openCart, closeCart } = useCartUI();
  const [mobileMenu, setMobileMenu] = useState(false);

  const closeMobileMenu = () => setMobileMenu(false);

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/40 bg-white/70 px-4 py-3 shadow-[0_15px_50px_rgba(216,156,164,0.12)] backdrop-blur-2xl sm:px-6 sm:py-4">
          
          {/* LOGO */}
          <Link href="/">
            <div>
              <p className="text-[8px] uppercase tracking-[0.35em] text-[#b67d86] sm:text-[9px] sm:tracking-[0.45em]">
                Maison
              </p>
              <h1 className="text-lg font-black uppercase tracking-[-0.05em] text-[#4f4a52] sm:text-2xl md:text-3xl">
                Skye & Rose
              </h1>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            <Link href="/" className="text-xs uppercase tracking-[0.28em] text-[#7b7480] transition duration-300 hover:text-[#d89ca4]">Home</Link>
            <Link href="/best-sellers" className="text-xs uppercase tracking-[0.28em] text-[#7b7480] transition duration-300 hover:text-[#d89ca4]">Best Sellers</Link>
            <Link href="/new-arrivals" className="text-xs uppercase tracking-[0.28em] text-[#7b7480] transition duration-300 hover:text-[#d89ca4]">New Arrivals</Link>
            <Link href="/shop" className="text-xs uppercase tracking-[0.28em] text-[#7b7480] transition duration-300 hover:text-[#d89ca4]">Shop</Link>
            <Link href="/collections/skye" className="text-xs uppercase tracking-[0.28em] text-[#7b7480] transition duration-300 hover:text-[#8fa8c7]">Skye</Link>
            <Link href="/collections/rose" className="text-xs uppercase tracking-[0.28em] text-[#7b7480] transition duration-300 hover:text-[#d89ca4]">Rose</Link>
            <Link href="/about" className="text-xs uppercase tracking-[0.28em] text-[#7b7480] transition duration-300 hover:text-[#d89ca4]">About</Link>
            <Link href="/favorites" className="text-xs uppercase tracking-[0.28em] text-[#7b7480] transition duration-300 hover:text-[#d89ca4]">Favorites</Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            <Link href="/favorites" className="relative text-xl">
              ❤️
              {favorites.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#d89ca4] text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              onClick={openCart}
              className="flex items-center gap-2 rounded-full bg-[#d89ca4] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white shadow-[0_12px_35px_rgba(216,156,164,0.22)] transition duration-300 hover:bg-[#c98992] sm:px-6 sm:py-4 sm:text-xs sm:tracking-[0.25em]"
            >
              Bag
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1 text-[9px] font-bold sm:h-6 sm:min-w-[24px] sm:px-2 sm:text-[10px]">
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef3f8] lg:hidden"
            >
              <div className="space-y-1">
                <div className="h-[2px] w-5 rounded bg-[#4f4a52]" />
                <div className="h-[2px] w-5 rounded bg-[#4f4a52]" />
                <div className="h-[2px] w-5 rounded bg-[#4f4a52]" />
              </div>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="mt-3 rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-[0_15px_50px_rgba(216,156,164,0.12)] backdrop-blur-2xl lg:hidden">
            <nav className="flex flex-col gap-5">
              <Link href="/" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">Home</Link>
              <Link href="/best-sellers" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">Best Sellers</Link>
              <Link href="/new-arrivals" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">New Arrivals</Link>
              <Link href="/shop" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">Shop</Link>
              <Link href="/collections/skye" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">Skye</Link>
              <Link href="/collections/rose" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">Rose</Link>
              <Link href="/about" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">About</Link>
              <Link href="/favorites" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">Favorites</Link>
              <Link href="/contact" onClick={closeMobileMenu} className="text-sm uppercase tracking-[0.25em] text-[#4f4a52]">Contact</Link>
            </nav>

            <div className="mt-6 space-y-3">
              <a
                href="https://wa.me/27696863952"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-green-500 px-5 py-4 text-center font-bold text-white"
              >
                WhatsApp Us
              </a>
              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="block rounded-2xl bg-black px-5 py-4 text-center font-bold text-white"
              >
                Shop Collection
              </Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </>
  );
}