"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, Heart, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCartUI } from "../context/CartUIContext";
import MiniCart from "./MiniCart";
import { trackCartOpened } from "../lib/analytics";

// Optimized: Static array defined outside the component scope to preserve performance memory allocations
const ANNOUNCEMENTS = [
  "Nationwide South African Delivery",
  "Mix & Match Wholesale From 10 Bottles",
  "5ml R48 • 10ml R77 • 30ml R180",
  "WhatsApp Orders Welcome",
  "465+ Signature Fragrances Available"
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartOpen, openCart, closeCart } = useCartUI();
  
  const { cart } = useCart();
  const totalItems = (cart || []).reduce((acc, item) => acc + item.quantity, 0);

  const { favorites } = useFavorites();
  const favoriteCount = favorites.length;

  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Change 5 — Removed manual "HOME" link; Logo serves as Home button
  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/quiz", label: "Scent Finder", icon: true },
    { href: "/wholesale", label: "Wholesale" },
  ];

  // Destructured link allocations to accurately split evenly across the logo
  const leftLinks = navLinks.slice(0, 2);
  const rightLinks = navLinks.slice(2);

  return (
    <>
      {/* Change 7 — Taller Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#4f4a52] text-white text-[11px] uppercase tracking-[0.2em] font-semibold h-8 flex items-center justify-center select-none">
        <span key={currentAnnouncement} className="animate-fade-in">
          {ANNOUNCEMENTS[currentAnnouncement]}
        </span>
      </div>

      {/* Main Top Navigation Frame — Shifted top-8 to account for taller announcement bar */}
      <nav className="fixed top-8 left-0 right-0 z-40 bg-white border-b border-black/5 py-1 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Updated Structure: Grid container for clean luxury proportion calculations */}
          <div className="relative h-12 md:h-[86px] grid grid-cols-[1fr_auto_1fr] items-center">
            
            {/* Left Column: Mobile Hamburger Toggle OR Desktop Links (Left-Wing) */}
            <div className="flex items-center justify-start md:justify-end gap-8 md:pr-12">
              {/* Mobile Menu Toggle */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-[#4f4a52] hover:text-[#d89ca4] transition-colors"
                  aria-label="Toggle Menu"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>

              {/* Desktop Left-Wing Navigation Items — Change 1 & 6 */}
              <div className="hidden md:flex items-center gap-4 lg:gap-6 justify-start">
                {leftLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex text-[13px] uppercase tracking-[0.20em] font-semibold transition-all duration-200 items-center gap-1.5 whitespace-nowrap group relative py-1 ${
                      pathname === link.href ? "text-[#d89ca4]" : "text-[#4f4a52]"
                    }`}
                  >
                    {link.label}
                    <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-[#d89ca4] transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Center Column: Flex Layout Luxury Center Brand Frame */}
            <div className="flex justify-center md:justify-center">
              <Link
                href="/"
                className="group block select-none max-w-full overflow-hidden cursor-pointer pointer-events-auto"
              >
                {/* Updated to text-[15px] on mobile */}
                <h1 className="text-[15px] md:text-[1.85rem] font-extrabold tracking-[0.14em] uppercase text-[#4f4a52] transition-colors group-hover:text-black whitespace-nowrap leading-none">
                  SKYE & ROSE
                </h1>
              </Link>
            </div>

            {/* Right Column: Desktop Links (Right-Wing) paired with Utility Icons */}
            <div className="flex items-center justify-end md:justify-start gap-2 md:gap-8 pl-0 md:pl-12">
              
              {/* Desktop Right-Wing Navigation Items — Change 1 & 6 */}
              <div className="hidden md:flex items-center gap-4 lg:gap-6">
                {rightLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex text-[13px] uppercase tracking-[0.20em] font-semibold transition-all duration-200 items-center gap-1.5 whitespace-nowrap group relative py-1 ${
                      pathname === link.href ? "text-[#d89ca4]" : "text-[#4f4a52]"
                    }`}
                  >
                    {link.label}
                    <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-[#d89ca4] transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>

              {/* Functional Icon Group */}
              <div className="flex items-center gap-3 md:gap-4 ml-0 md:ml-2">
                <Link
                  href="/favorites"
                  className="relative text-[#4f4a52] hover:text-[#d89ca4] transition-colors"
                  aria-label="Favorites"
                >
                  <Heart className="h-5 w-5 stroke-[1.75]" />

                  {favoriteCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d89ca4] text-[9px] font-black text-white ring-2 ring-white">
                      {favoriteCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/recently-viewed"
                  className="relative text-[#4f4a52] hover:text-[#d89ca4] transition-colors"
                  aria-label="Recently Viewed"
                >
                  <Clock className="h-5 w-5 stroke-[1.75]" />
                </Link>

                <Link
                  href="/account"
                  className={`text-[#4f4a52] hover:text-[#d89ca4] transition-colors ${
                    pathname === "/account" ? "text-[#d89ca4]" : ""
                  }`}
                  aria-label="Account"
                >
                  <User className="h-5 w-5 stroke-[1.75]" />
                </Link>

                <button
                  onClick={() => {
                    if (!cartOpen) {
                      openCart();
                      trackCartOpened({ source: "bag-icon" });
                    }
                  }}
                  className="group relative flex items-center p-1 text-[#4f4a52] hover:text-[#d89ca4] transition-colors"
                  aria-label="Open Cart"
                >
                  <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d89ca4] text-[9px] font-black text-white ring-2 ring-white">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Fullscreen Overlay Navigation — Top offset adjusted to 126px (Announcement h-10 + Nav h-[86px]) */}
        <div
          className={`fixed inset-x-0 top-[80px] bottom-0 bg-white z-30 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between px-6 py-12 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-black tracking-wide flex items-center gap-2 border-b border-zinc-100 pb-4 ${
                  pathname === link.href ? "text-[#d89ca4]" : "text-[#4f4a52]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* South African Logistics & Corporate Email Footer Stack */}
          <div className="border-t border-zinc-100 pt-6 flex flex-col items-center gap-4">
            <p className="text-xs text-zinc-400 tracking-wider uppercase font-bold text-center">
              Complimentary Delivery Over R750
            </p>
            <div className="space-y-1 text-center font-medium tracking-tight">
              <p className="text-[10px] text-zinc-400">
                hello@maisonskyeandrose.com
              </p>
              <p className="text-[10px] text-zinc-400">
                wholesale@maisonskyeandrose.com
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* MiniCart Sidebar */}
      <MiniCart isOpen={cartOpen} onClose={closeCart} />
    </>
  );
}