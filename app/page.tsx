"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  motion,
} from "framer-motion";

import Image from "next/image";
import Link from "next/link";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import QuickAddModal from "./components/QuickAddModal";

import { fragrances } from "./data/fragrances";

export default function HomePage() {

  const [quickOpen, setQuickOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<any>(null);

  /* HERO IMAGE TRANSITIONS */
  const heroImages = [
    "/images/pink-10ml.png",
    "/images/blue-10ml.png",
    "/images/glass-pink-30ml.png",
    "/images/glass-blue-30ml.png",
  ];

  const [heroIndex, setHeroIndex] =
    useState(0);

  useEffect(() => {

    const interval =
      setInterval(() => {

        setHeroIndex((prev) =>

          prev ===
          heroImages.length - 1

            ? 0

            : prev + 1

        );

      }, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <main className="min-h-screen overflow-hidden bg-[#f8f5f2]">

      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-20 pt-24 sm:pt-28">

        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden">

          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
            className="
              absolute
              -left-24
              top-10
              h-[260px]
              w-[260px]
              rounded-full
              bg-pink-200/30
              blur-3xl
            "
          />

          <motion.div
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
            }}
            className="
              absolute
              -right-24
              bottom-0
              h-[260px]
              w-[260px]
              rounded-full
              bg-blue-200/30
              blur-3xl
            "
          />

        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="max-w-xl"
          >

            <p className="text-[10px] uppercase tracking-[0.45em] text-[#d89ca4]">

              Maison Skye & Rose

            </p>

            <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.07em] text-[#4f4a52] sm:text-6xl lg:text-7xl">

              Luxury
              <br />

              Fragrance
              <br />

              Lifestyle

            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#7b7480] sm:text-lg">

              Discover premium inspired fragrances
              crafted for travel, confidence,
              luxury, and unforgettable moments.

            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap gap-4">

              <Link href="/collections/skye">

                <motion.button
                  whileTap={{
                    scale: 0.97,
                  }}
                  whileHover={{
                    scale: 1.02,
                  }}
                  className="
                    rounded-full
                    bg-gradient-to-r
                    from-pink-400
                    to-blue-400
                    px-8
                    py-4
                    text-sm
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-white
                    shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                  "
                >
                  Shop Collection
                </motion.button>

              </Link>

              <Link href="/quiz">

                <motion.button
                  whileTap={{
                    scale: 0.97,
                  }}
                  whileHover={{
                    scale: 1.02,
                  }}
                  className="
                    rounded-full
                    border
                    border-white/40
                    bg-white/70
                    px-8
                    py-4
                    text-sm
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#4f4a52]
                    shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                    backdrop-blur-xl
                  "
                >
                  Fragrance Quiz
                </motion.button>

              </Link>

            </div>

            {/* STATS */}
            <div className="mt-12 flex flex-wrap gap-8">

              <div>

                <h3 className="text-3xl font-black text-[#4f4a52]">

                  25+

                </h3>

                <p className="mt-1 text-sm text-[#7b7480]">

                  Luxury Fragrances

                </p>

              </div>

              <div>

                <h3 className="text-3xl font-black text-[#4f4a52]">

                  10ml

                </h3>

                <p className="mt-1 text-sm text-[#7b7480]">

                  Travel Atomizers

                </p>

              </div>

              <div>

                <h3 className="text-3xl font-black text-[#4f4a52]">

                  24hr

                </h3>

                <p className="mt-1 text-sm text-[#7b7480]">

                  Delivery Dispatch

                </p>

              </div>

            </div>

          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
            className="
              relative
              flex
              items-center
              justify-center
            "
          >

            {/* MAIN GLOW */}
            <div className="absolute h-[320px] w-[320px] rounded-full bg-gradient-to-r from-pink-200/40 to-blue-200/40 blur-3xl" />

            {/* BOTTLE CARD */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="
                relative
                z-10
                rounded-[38px]
                border
                border-white/40
                bg-white/65
                p-8
                shadow-[0_30px_80px_rgba(0,0,0,0.10)]
                backdrop-blur-[20px]
              "
            >

              <motion.div
                key={heroImages[heroIndex]}
                initial={{
                  opacity: 0,
                  scale: 0.92,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.7,
                }}
              >

                <Image
                  src={heroImages[heroIndex]}
                  alt="Maison Skye & Rose"
                  width={250}
                  height={250}
                  className="object-contain"
                  style={{
                    width: "auto",
                    height: "250px",
                  }}
                  priority
                />

              </motion.div>

            </motion.div>

          </motion.div>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="relative px-5 pb-24">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[0.45em] text-[#d89ca4]">

                Signature Collection

              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[#4f4a52] sm:text-5xl">

                Trending Fragrances

              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-[#7b7480]">

              Discover premium inspired fragrances
              crafted for luxury lifestyle,
              confidence, and social-ready energy.

            </p>

          </div>

          {/* PRODUCTS GRID */}
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {fragrances.map((fragrance) => (

              <ProductCard
                key={fragrance.title}
                {...fragrance}
                onQuickAdd={() => {

                  setSelectedProduct(
                    fragrance
                  );

                  setQuickOpen(true);

                }}
              />

            ))}

          </div>

        </div>

      </section>

      {/* QUICK ADD */}
      {selectedProduct && (

        <QuickAddModal
          open={quickOpen}
          onClose={() =>
            setQuickOpen(false)
          }
          title={
            selectedProduct.title
          }
          images={
            selectedProduct.images
          }
          prices={
            selectedProduct.prices
          }
        />

      )}

    </main>

  );

}