"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

import { useCart } from "../context/CartContext";
import { useCartFeedback } from "../context/CartFeedbackContext";

interface QuickAddModalProps {
  open: boolean;

  onClose: () => void;

  title: string;

  images?: {
    [key: string]: string;
  };

  prices?: {
    [key: string]: number;
  };
}

export default function QuickAddModal({
  open,
  onClose,
  title,
  images = {},
  prices = {},
}: QuickAddModalProps) {

  const { addToCart } =
    useCart();

  const { showFeedback } =
    useCartFeedback();

  /* SIZE OPTIONS */
  const sizeOptions =
    Object.entries(prices);

  /* DEFAULT SIZE */
  const [selectedSize, setSelectedSize] =
    useState(
      sizeOptions?.[0]?.[0] || "10ml"
    );

  const [quantity, setQuantity] =
    useState(1);

  /* RESET WHEN OPENING */
  useEffect(() => {

    if (sizeOptions.length > 0) {

      setSelectedSize(
        sizeOptions[0][0]
      );

    }

    setQuantity(1);

  }, [open]);

  /* CURRENT PRICE */
  const selectedPrice =
    prices?.[selectedSize] || 0;

  /* TOTAL */
  const total =
    selectedPrice * quantity;

  /* CURRENT IMAGE */
  const selectedImage =
    images?.[selectedSize] ||
    Object.values(images)[0] ||
    "/images/pink-10ml.png";

  return (

    <AnimatePresence>

      {open && (

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
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-end
            justify-center
            bg-black/40
            backdrop-blur-sm
            sm:items-center
          "
        >

          {/* MODAL */}
          <motion.div
            initial={{
              y: 100,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 100,
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-t-[38px]
              bg-white
              p-6
              shadow-[0_30px_100px_rgba(0,0,0,0.18)]
              sm:rounded-[38px]
            "
          >

            {/* GLOW BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden">

              <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-pink-200/30 blur-3xl" />

              <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />

            </div>

            {/* CONTENT */}
            <div className="relative z-10">

              {/* IMAGE */}
              <div className="flex justify-center">

                <motion.div
                  key={selectedImage}
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="
                    rounded-[28px]
                    bg-gradient-to-br
                    from-[#fff3f7]
                    to-[#eef7ff]
                    p-6
                  "
                >

                  <Image
                    src={selectedImage}
                    alt={title}
                    width={180}
                    height={180}
                    className="object-contain"
                    style={{
                      width: "auto",
                      height: "180px",
                    }}
                    priority
                  />

                </motion.div>

              </div>

              {/* TITLE */}
              <h2
                className="
                  mt-5
                  text-center
                  text-2xl
                  font-black
                  uppercase
                  tracking-[-0.05em]
                  text-[#4f4a52]
                "
              >
                {title}
              </h2>

              {/* SIZE SELECTOR */}
              <div className="mt-6">

                <p
                  className="
                    mb-3
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    text-[#7b7480]
                  "
                >
                  Select Size
                </p>

                <div className="flex gap-3">

                  {sizeOptions.map(
                    ([size, price]) => (

                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSize(size)
                        }
                        className={`
                          flex-1
                          rounded-2xl
                          border
                          px-4
                          py-4
                          transition-all
                          duration-300
                          ${
                            selectedSize === size
                              ? "border-[#ff9fbc] bg-gradient-to-br from-pink-50 to-blue-50 shadow-lg scale-[1.02]"
                              : "border-gray-200 bg-white"
                          }
                        `}
                      >

                        <p className="text-sm font-bold text-[#4f4a52]">

                          {size}

                        </p>

                        <p className="mt-1 text-xs text-[#7b7480]">

                          R
                          {Number(price).toFixed(
                            2
                          )}

                        </p>

                      </button>

                    )
                  )}

                </div>

              </div>

              {/* QUANTITY */}
              <div className="mt-6">

                <p
                  className="
                    mb-3
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    text-[#7b7480]
                  "
                >
                  Quantity
                </p>

                <div className="flex items-center justify-center gap-4">

                  <motion.button
                    whileTap={{
                      scale: 0.92,
                    }}
                    onClick={() =>
                      setQuantity((prev) =>
                        prev > 1
                          ? prev - 1
                          : 1
                      )
                    }
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f6f6f7]
                      text-xl
                      font-bold
                      shadow-sm
                    "
                  >
                    -
                  </motion.button>

                  <span className="text-xl font-bold text-[#4f4a52]">

                    {quantity}

                  </span>

                  <motion.button
                    whileTap={{
                      scale: 0.92,
                    }}
                    onClick={() =>
                      setQuantity(
                        (prev) => prev + 1
                      )
                    }
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f6f6f7]
                      text-xl
                      font-bold
                      shadow-sm
                    "
                  >
                    +
                  </motion.button>

                </div>

              </div>

              {/* TOTAL */}
              <div
                className="
                  mt-6
                  rounded-3xl
                  bg-gradient-to-r
                  from-pink-50
                  to-blue-50
                  p-5
                "
              >

                <div className="flex items-center justify-between">

                  <span
                    className="
                      text-sm
                      uppercase
                      tracking-[0.2em]
                      text-[#7b7480]
                    "
                  >
                    Total
                  </span>

                  <span className="text-3xl font-black text-[#4f4a52]">

                    R
                    {total.toFixed(2)}

                  </span>

                </div>

              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex gap-3">

                <button
                  onClick={onClose}
                  className="
                    flex-1
                    rounded-full
                    border
                    border-gray-200
                    py-4
                    font-semibold
                    text-[#4f4a52]
                    transition
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>

                <motion.button
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() => {

                    addToCart({
                      id: `${title}-${selectedSize}`,

                      title,

                      price: selectedPrice,

                      quantity,

                      image: selectedImage,

                      size: selectedSize,
                    });

                    showFeedback({
                      title,

                      image: selectedImage,

                      size: selectedSize,
                    });

                    onClose();

                  }}
                  className="
                    flex-1
                    rounded-full
                    bg-gradient-to-r
                    from-pink-400
                    to-blue-400
                    py-4
                    font-semibold
                    text-white
                    shadow-lg
                    transition
                    hover:brightness-105
                  "
                >
                  Add To Cart
                </motion.button>

              </div>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}