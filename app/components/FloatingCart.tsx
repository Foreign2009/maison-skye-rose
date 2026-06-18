"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useCart } from "../context/CartContext";

import { useCartUI } from "../context/CartUIContext";

export default function FloatingCart() {

  const {
    cartCount,
    cartTotal,
  } = useCart();

  const {
    openCart,
  } = useCartUI();

  return (

    <AnimatePresence>

      {false && (

        <motion.div
          initial={{
            y: 120,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 120,
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
          }}
          className="
            fixed
            bottom-5
            left-1/2
            z-[99999]
            w-[92%]
            max-w-md
            -translate-x-1/2
            sm:hidden
          "
        >

          <motion.button
            whileTap={{
              scale: 0.98,
            }}
            onClick={openCart}
            className="
              relative
              w-full
              overflow-hidden
              rounded-full
              border
              border-white/40
              bg-white/70
              px-5
              py-4
              shadow-[0_20px_80px_rgba(0,0,0,0.12)]
              backdrop-blur-[30px]
            "
          >

            {/* GLOW */}
            <div className="absolute inset-0 overflow-hidden">

              <div className="absolute -left-10 top-0 h-24 w-24 rounded-full bg-pink-300/30 blur-3xl" />

              <div className="absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-blue-300/30 blur-3xl" />

            </div>

            {/* CONTENT */}
            <div className="relative z-10 flex items-center justify-between">

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-r
                    from-pink-400
                    to-blue-400
                    text-xl
                    shadow-lg
                  "
                >
                  🛍
                </div>

                <div>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.25em]
                      text-[#8a8490]
                    "
                  >
                    Cart Ready
                  </p>

                  <p className="text-sm font-bold text-[#4f4a52]">

                    {cartCount} Item
                    {cartCount > 1
                      ? "s"
                      : ""}

                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-[#8a8490]
                  "
                >
                  Total
                </p>

                <p className="text-xl font-black text-[#4f4a52]">

                  R
                  {cartTotal.toFixed(2)}

                </p>

              </div>

            </div>

          </motion.button>

        </motion.div>

      )}

    </AnimatePresence>

  );

}

