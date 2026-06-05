"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartFeedback } from "../context/CartFeedbackContext";

export default function CartSuccessToast() {
  const { feedback } = useCartFeedback();

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="fixed bottom-28 left-1/2 z-[999999] w-[92%] max-w-sm -translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/75 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.12)] backdrop-blur-[30px]">
            {/* GLOW */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-pink-300/30 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-blue-300/30 blur-3xl" />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-pink-50 to-blue-50">
                <Image
                  src={feedback.image}
                  alt={feedback.title}
                  width={70}
                  height={70}
                  priority
                  className="object-contain"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>

              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#d89ca4]">Added To Bag</p>
                <h3 className="mt-2 text-lg font-black leading-tight text-[#4f4a52]">{feedback.title}</h3>
                <p className="mt-1 text-sm text-[#7b7480]">{feedback.size}</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow-lg">
                ✓
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}