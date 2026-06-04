"use client";

import Link from "next/link";
import { brand } from "../data/brand";

export default function Footer() {
  return (
    <footer className="bg-[#111] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* BRAND IDENTITY */}
        <h3 className="text-3xl font-black">
          {brand.name}
        </h3>

        <p className="mt-4 max-w-md text-zinc-400">
          {brand.metadata.description}
        </p>

        {/* 4-COLUMN LINK SECTION */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          
          {/* COLUMN 1: SHOP */}
          <div>
            <h4 className="font-bold">
              Shop
            </h4>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li>
                <Link href="/shop" className="transition duration-200 hover:text-white">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/collections/skye" className="transition duration-200 hover:text-white">
                  Skye Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/rose" className="transition duration-200 hover:text-white">
                  Rose Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: EXPLORE */}
          <div>
            <h4 className="font-bold">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li>
                <Link href="/quiz" className="transition duration-200 hover:text-white">
                  Fragrance Quiz
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition duration-200 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition duration-200 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CUSTOMER CARE */}
          <div>
            <h4 className="font-bold">
              Customer Care
            </h4>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li>
                <Link href="/faq" className="transition duration-200 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="transition duration-200 hover:text-white">
                  Delivery
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition duration-200 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition duration-200 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div>
            <h4 className="font-bold">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li>
                <a 
                  href={brand.social.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition duration-200 hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a 
                  href={brand.social.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition duration-200 hover:text-white"
                >
                  +{brand.social.whatsappNumber.replace(/(\d{2})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')}
                </a>
              </li>
              <li>
                Cape Town
              </li>
              <li>
                South Africa
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="mt-16 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} {brand.name}. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}