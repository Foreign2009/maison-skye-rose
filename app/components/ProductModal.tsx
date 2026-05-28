"use client";

import { useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

interface ProductModalProps {
  title: string;
  subtitle: string;
  mood: string;
  profile: string;
  season: string[];
  notes: string[];
  prices: {
    "5ml": number;
    "10ml": number;
    "30ml": number;
  };
  images: {
    "5ml": string;
    "10ml": string;
    "30ml": string;
  };
  onClose: () => void;
}

export default function ProductModal({
  title,
  subtitle,
  mood,
  profile,
  season,
  notes,
  prices,
  images,
  onClose,
}: ProductModalProps) {

  const [selectedSize, setSelectedSize] =
    useState<
      "5ml" |
      "10ml" |
      "30ml"
    >("10ml");

  const [quantity, setQuantity] =
    useState(1);

  const { addToCart } =
    useCart();

  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
  } = useFavorites();

  const isFavorite =
    favorites.some(
      (item) =>
        item.title === title
    );

  const handleFavorite = () => {

    if (isFavorite) {

      removeFromFavorites(
        title
      );

    } else {

      addToFavorites({
        title,
        subtitle,
        mood,
        profile,
        season,
        notes,
        prices,
        images,
      });

    }

  };

  const handleAddToCart = () => {

    addToCart({
      title,
      image:
        images[selectedSize],
      price:
        prices[selectedSize],
      quantity,
    });

  };

  return (

    <AnimatePresence>

      {/* BACKDROP */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
      >

        {/* MODAL */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 40,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            y: 30,
          }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          onClick={(e) =>
            e.stopPropagation()
          }
          className="absolute left-1/2 top-1/2 flex max-h-[94vh] w-[95%] max-w-7xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[42px] border border-white/40 bg-white/80 shadow-[0_40px_120px_rgba(216,156,164,0.25)] backdrop-blur-2xl"
        >

          {/* GLOWS */}
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
            className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#f7d7dc]/60 blur-[120px]"
          />

          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
            className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-[#dce8f8]/70 blur-[120px]"
          />

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3f8] text-[#7a92af] transition duration-300 hover:scale-105"
          >
            ✕
          </button>

          <div className="grid w-full overflow-y-auto lg:grid-cols-2">

            {/* LEFT */}
            <div className="relative flex min-h-[720px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8f3f5] via-[#f5f1eb] to-[#eef3f8] p-10">

              {/* FLOATING GLOW */}
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute h-[360px] w-[360px] rounded-full bg-[#f4d8de]/70 blur-[120px]"
              />

              {/* IMAGE */}
              <motion.img
                key={selectedSize}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  rotate: -8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: -2,
                }}
                src={
                  images[selectedSize]
                }
                alt={title}
                className="relative z-10 max-h-[560px] object-contain"
              />

            </div>

            {/* RIGHT */}
            <div className="relative flex flex-col justify-center p-8 lg:p-12">

              {/* TOP BADGES */}
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
                  delay: 0.2,
                }}
                className="flex flex-wrap items-center gap-3"
              >

                <motion.button
                  whileTap={{
                    scale: 0.95,
                  }}
                  whileHover={{
                    scale: 1.05,
                  }}
                  onClick={
                    handleFavorite
                  }
                  className="rounded-full bg-[#f8f3f5] px-5 py-3 text-xs uppercase tracking-[0.25em] text-[#b67d86]"
                >

                  {isFavorite
                    ? "Saved ❤️"
                    : "Save ♡"}

                </motion.button>

                <div className="rounded-full bg-[#eef3f8] px-5 py-3 text-xs uppercase tracking-[0.25em] text-[#7a92af]">

                  Luxury Inspired

                </div>

              </motion.div>

              {/* TITLE */}
              <motion.h2
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="mt-8 text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] text-[#4f4a52] md:text-7xl"
              >

                {title}

              </motion.h2>

              {/* DESCRIPTION */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.4,
                }}
                className="mt-7 max-w-2xl text-lg leading-9 text-[#7b7480]"
              >

                {subtitle}

              </motion.p>

              {/* INFO */}
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
                  delay: 0.5,
                }}
                className="mt-10 grid gap-5 md:grid-cols-2"
              >

                <div className="rounded-[28px] bg-[#f8f3f5] p-6">

                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#b67d86]">
                    Mood
                  </p>

                  <h3 className="mt-3 text-xl font-black text-[#4f4a52]">
                    {mood}
                  </h3>

                </div>

                <div className="rounded-[28px] bg-[#eef3f8] p-6">

                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#7a92af]">
                    Profile
                  </p>

                  <h3 className="mt-3 text-xl font-black text-[#4f4a52]">
                    {profile}
                  </h3>

                </div>

              </motion.div>

              {/* SIZE SELECTOR */}
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
                  delay: 0.6,
                }}
                className="mt-12"
              >

                <p className="text-[10px] uppercase tracking-[0.35em] text-[#7b7480]">
                  Select Size
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">

                  {(
                    [
                      "5ml",
                      "10ml",
                      "30ml",
                    ] as const
                  ).map((size) => (

                    <motion.button
                      whileHover={{
                        y: -4,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      key={size}
                      onClick={() =>
                        setSelectedSize(
                          size
                        )
                      }
                      className={`rounded-[24px] border p-5 transition duration-300 ${
                        selectedSize === size
                          ? "border-[#d89ca4] bg-[#d89ca4] text-white shadow-[0_15px_40px_rgba(216,156,164,0.22)]"
                          : "border-[#efe4e7] bg-white text-[#7b7480] hover:bg-[#8fa8c7] hover:text-white"
                      }`}
                    >

                      <p className="text-[10px] uppercase tracking-[0.2em]">
                        {size}
                      </p>

                      <h3 className="mt-2 text-2xl font-black">
                        R{prices[size]}
                      </h3>

                    </motion.button>

                  ))}

                </div>

              </motion.div>

              {/* QUANTITY */}
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
                  delay: 0.7,
                }}
                className="mt-10 flex items-center justify-between rounded-full bg-[#f8f3f5] px-5 py-4"
              >

                <p className="text-[10px] uppercase tracking-[0.25em] text-[#7b7480]">
                  Quantity
                </p>

                <div className="flex items-center gap-4">

                  <motion.button
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={() =>
                      setQuantity(
                        (prev) =>
                          prev > 1
                            ? prev - 1
                            : 1
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8fa8c7] text-lg text-white"
                  >
                    -
                  </motion.button>

                  <span className="w-6 text-center text-lg font-black text-[#4f4a52]">
                    {quantity}
                  </span>

                  <motion.button
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={() =>
                      setQuantity(
                        (prev) =>
                          prev + 1
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8fa8c7] text-lg text-white"
                  >
                    +
                  </motion.button>

                </div>

              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.8,
                }}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={
                  handleAddToCart
                }
                className="mt-10 rounded-full bg-[#d89ca4] py-6 text-xs uppercase tracking-[0.35em] text-white shadow-[0_20px_60px_rgba(216,156,164,0.24)]"
              >

                Add To Bag · R
                {
                  prices[
                    selectedSize
                  ] * quantity
                }

              </motion.button>

            </div>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  );
}