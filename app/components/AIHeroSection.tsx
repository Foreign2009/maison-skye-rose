"use client";

import Link from "next/link";
import Image from "next/image";

export default function AIHeroSection() {
  return (
    <section className="px-5 py-20">
      <div
        className="
          mx-auto
          max-w-7xl
          overflow-hidden
          rounded-[40px]
          bg-[#faf7f5]
          border
          border-[#efe7e2]
          p-10
          md:p-16
        "
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Core Brand Messaging & Premium CTAs */}
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4] font-semibold">
              South African Luxury Fragrance House
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#4f4a52] md:text-6xl leading-[1.1]">
              Luxury Fragrances
              <br />
              Inspired By Icons
            </h2>

            <p className="mt-6 text-base md:text-lg leading-relaxed text-[#7b7480]">
              Discover over 50 inspired fragrances crafted for everyday luxury.
              Start with 5ml discovery sizes, unlock free samples from R400,
              and find the scent that becomes your signature.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="
                  rounded-full
                  bg-[#d89ca4]
                  hover:bg-[#c78992]
                  px-8
                  py-4
                  text-xs
                  uppercase
                  tracking-wider
                  font-bold
                  text-white
                  transition-all
                  duration-300
                  shadow-sm
                "
              >
                Shop Best Sellers
              </Link>

              <Link
                href="/collections/skye"
                className="
                  rounded-full
                  border
                  border-[#d89ca4]
                  text-[#d89ca4]
                  hover:bg-[#d89ca4]/5
                  px-8
                  py-4
                  text-xs
                  uppercase
                  tracking-wider
                  font-bold
                  transition-all
                  duration-300
                "
              >
                Browse Collection
              </Link>
            </div>
          </div>

          {/* Right Column: High-End Fragrance Bottle Showcase */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[450px] aspect-square lg:max-w-[500px]">
              <Image
                src="/images/glass-pink-30ml.png"
                alt="Maison Skye & Rose Pink 30ml Luxury Bottle"
                width={500}
                height={500}
                priority
                className="object-contain w-full h-full transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}