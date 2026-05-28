"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useFavorites } from "../context/FavoritesContext";

interface ProductCardProps {
  title: string;
  subtitle: string;
  mood: string;
  profile: string;
  season: string;

  notes: string[];

  prices: {
    [key: string]: number;
  };

  images: {
    [key: string]: string;
  };

  bestSeller?: boolean;
  newArrival?: boolean;

  onQuickAdd?: () => void;
}

export default function ProductCard({
  title,
  subtitle,
  mood,
  profile,
  season,
  notes,
  prices,
  images,
  bestSeller,
  newArrival,
  onQuickAdd,
}: ProductCardProps) {
  const {
    addToFavorites,
    favorites,
  } = useFavorites();

  /* FAVORITES */
  const isFavorite =
    favorites.some(
      (item) =>
        item.title === title
    );

  /* DEFAULT IMAGE */
  const displayImage =
    images?.["10ml"] ||
    Object.values(images)[0];

  /* DEFAULT PRICE */
  const displayPrice =
    prices?.["10ml"] ||
    Object.values(prices)[0];

  /* DETECT BLUE/PINK STYLE */
  const isMale =
    displayImage?.includes(
      "blue"
    );

  /* DYNAMIC THEME */
  const cardTheme = {
    glow:
      isMale
        ? "bg-[#b9dcff]/60"
        : "bg-[#ffd3df]/60",

    badge:
      isMale
        ? "bg-[#78b8ff]"
        : "bg-[#ff9fbc]",

    accent:
      isMale
        ? "text-[#5f9fe3]"
        : "text-[#e17f9f]",

    button:
      isMale
        ? "bg-gradient-to-r from-[#79b9ff] to-[#a8d6ff]"
        : "bg-gradient-to-r from-[#ff9fbc] to-[#ffc3d5]",

    cardBg:
      isMale
        ? "from-[#eef8ff] via-[#ffffff] to-[#dff1ff]"
        : "from-[#fff1f6] via-[#ffffff] to-[#ffe0ea]",

    shadow:
      isMale
        ? "shadow-[0_30px_80px_rgba(121,185,255,0.18)]"
        : "shadow-[0_30px_80px_rgba(255,159,188,0.18)]",
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.6,
      }}
      whileHover={{
        y: -6,
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/40
        bg-white/75
        p-4
        backdrop-blur-[24px]
        transition
        duration-500
        ${cardTheme.shadow}
      `}
    >
      {/* GLOW */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">

        <div
          className={`
            absolute
            left-[-20%]
            top-[-20%]
            h-[200px]
            w-[200px]
            rounded-full
            blur-[90px]
            ${cardTheme.glow}
          `}
        />

        <div
          className={`
            absolute
            bottom-[-20%]
            right-[-20%]
            h-[200px]
            w-[200px]
            rounded-full
            blur-[90px]
            ${cardTheme.glow}
          `}
        />

      </div>

      {/* BADGES */}
      <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">

        {bestSeller && (
          <div
            className={`
              rounded-full
              px-3
              py-2
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-white
              shadow-lg
              ${cardTheme.badge}
            `}
          >
            Best Seller
          </div>
        )}

        {newArrival && (
          <div
            className={`
              rounded-full
              px-3
              py-2
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-white
              shadow-lg
              ${cardTheme.badge}
            `}
          >
            New
          </div>
        )}

      </div>

      {/* FAVORITE */}
      <button
        onClick={() =>
          addToFavorites({
            title,
            image: displayImage,
            price: Number(displayPrice),
          })
        }
        className="
          absolute
          right-4
          top-4
          z-20
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          bg-white/75
          backdrop-blur-[20px]
          transition
          duration-300
          hover:scale-110
        "
      >
        <span className="text-base">
          {isFavorite
            ? "♥"
            : "♡"}
        </span>
      </button>

      {/* IMAGE */}
      <div
        onClick={() =>
          onQuickAdd?.()
        }
        className={`
          relative
          z-10
          flex
          cursor-pointer
          items-center
          justify-center
          overflow-hidden
          rounded-[28px]
          bg-gradient-to-br
          ${cardTheme.cardBg}
          p-6
        `}
      >
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            type: "spring",
            stiffness: 220,
          }}
        >
          <Image
            src={displayImage}
            alt={title}
            width={240}
            height={240}
            className="object-contain"
            style={{
              width: "auto",
              height: "240px",
            }}
            priority
          />
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mt-5">

        <p
          className={`
            text-[10px]
            uppercase
            tracking-[0.25em]
            ${cardTheme.accent}
          `}
        >
          {subtitle}
        </p>

        <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] text-[#4f4a52]">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
          {mood}
        </p>

        {/* NOTES */}
        <div className="mt-4 flex flex-wrap gap-2">

          {notes.map((note) => (
            <span
              key={note}
              className="
                rounded-full
                bg-white/80
                px-3
                py-2
                text-[10px]
                uppercase
                tracking-[0.15em]
                text-[#6d6670]
                shadow-sm
              "
            >
              {note}
            </span>
          ))}

        </div>

        {/* PROFILE */}
        <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-[#8f8792]">

          <span>{profile}</span>

          <span>{season}</span>

        </div>

        {/* PRICE + BUTTON */}
        <div className="mt-6 flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.15em] text-[#9d97a2]">
              Starting From
            </p>

            <p className="text-2xl font-black text-[#4f4a52]">
              R{Number(displayPrice).toFixed(2)}
            </p>

          </div>

          <motion.button
            whileTap={{
              scale: 0.96,
            }}
            onClick={() =>
              onQuickAdd?.()
            }
            className={`
              rounded-full
              px-6
              py-4
              text-sm
              font-bold
              text-white
              shadow-xl
              transition
              duration-300
              hover:scale-[1.02]
              hover:brightness-105
              ${cardTheme.button}
            `}
          >
            Quick Add
          </motion.button>

        </div>

      </div>

    </motion.div>
  );
}