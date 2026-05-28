"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import Navbar from "../components/Navbar";

export default function PaymentCancelPage() {

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1eb] text-[#4f4a52]">

      <Navbar />

      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6">

        {/* GLOWS */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute left-[-120px] top-[80px] h-[320px] w-[320px] rounded-full bg-[#f7d7dc]/70 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute right-[-120px] top-[160px] h-[320px] w-[320px] rounded-full bg-[#dce8f8]/70 blur-[120px]"
        />

        {/* CARD */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative w-full max-w-3xl overflow-hidden rounded-[42px] border border-white/40 bg-white/75 p-10 text-center shadow-[0_35px_120px_rgba(216,156,164,0.16)] backdrop-blur-2xl"
        >

          {/* ICON */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#fde7ea]"
          >

            <span className="text-5xl">
              ✕
            </span>

          </motion.div>

          {/* TEXT */}
          <p className="mt-10 text-xs uppercase tracking-[0.45em] text-[#d89ca4]">

            Payment Cancelled

          </p>

          <h1 className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#4f4a52] md:text-7xl">

            Checkout
            <br />
            Cancelled

          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-[#7b7480]">

            Your payment was not completed. Your cart is still available
            and you can continue your Maison Skye & Rose shopping experience anytime.

          </p>

          {/* BUTTONS */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">

            <Link href="/checkout">

              <motion.button
                whileHover={{
                  scale: 1.04,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="rounded-full bg-[#d89ca4] px-8 py-5 text-xs uppercase tracking-[0.35em] text-white shadow-[0_20px_60px_rgba(216,156,164,0.22)]"
              >

                Return To Checkout

              </motion.button>

            </Link>

            <Link href="/">

              <motion.button
                whileHover={{
                  scale: 1.04,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="rounded-full bg-[#eef3f8] px-8 py-5 text-xs uppercase tracking-[0.35em] text-[#7a92af]"
              >

                Continue Shopping

              </motion.button>

            </Link>

          </div>

        </motion.div>

      </section>

    </main>
  );
}