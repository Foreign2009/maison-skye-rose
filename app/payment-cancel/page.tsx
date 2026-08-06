"use client";

import { useEffect } from "react";
import Link from "next/link";

import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import { trackPaymentReturnCancelled } from "../lib/analytics";

const PAYMENT_RETURN_CANCELLED_KEY = "msr_payment_return_cancelled";

export default function PaymentCancelPage() {

  useEffect(() => {
    if (sessionStorage.getItem(PAYMENT_RETURN_CANCELLED_KEY)) return;
    sessionStorage.setItem(PAYMENT_RETURN_CANCELLED_KEY, "1");
    trackPaymentReturnCancelled();
  }, []);

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
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fdf5f6]">
            <span className="text-4xl text-[#d89ca4]" aria-hidden="true">✦</span>
          </div>

          {/* TEXT */}
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
            We&apos;re Glad You&apos;re Here
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.05em] text-[#4f4a52] md:text-6xl">
            Take Your<br />Time
          </h1>

          <p className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-[#7b7480]">
            Your cart is still here, exactly as you left it. There&apos;s no pressure and no deadline — whenever you&apos;re ready, we&apos;ll be here.
          </p>

          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#9b9298]">
            The payment step wasn&apos;t completed. This can happen for many reasons, and nothing has been lost.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-[#d89ca4] px-8 py-5 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-[0_20px_60px_rgba(216,156,164,0.22)]"
              >
                Continue Your Order
              </motion.button>
            </Link>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border border-[#4f4a52]/20 px-8 py-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#4f4a52]"
              >
                Explore Our Collection
              </motion.button>
            </Link>

          </div>

          <p className="mt-8 text-xs leading-relaxed text-[#9b9298]">
            Need help?{" "}
            <Link href="/contact" className="text-[#d89ca4] underline-offset-2 hover:underline">
              Visit our contact page
            </Link>
            {" "}— we&apos;re happy to assist.
          </p>

        </motion.div>

      </section>

    </main>
  );
}