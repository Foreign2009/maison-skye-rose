"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCartFeedback } from "../context/CartFeedbackContext";
import { trackAddToCart } from "../lib/analytics";
import type { FragranceKnowledge } from "../lib/mkc/types";
import { generateWhyYoullLikeIt } from "../lib/mkc/merchandising";
import { CollectionBadge } from "./knowledge/CollectionBadge";
import { NoteChip } from "./knowledge/NoteChip";
import { KnowledgeChip } from "./knowledge/KnowledgeChip";

// ── Component ─────────────────────────────────────────────────────────────────
interface FragranceQuickViewProps {
  knowledge: FragranceKnowledge | null;
  open: boolean;
  onClose: () => void;
}

export default function FragranceQuickView({
  knowledge,
  open,
  onClose,
}: FragranceQuickViewProps) {
  const [mounted, setMounted]           = useState(false);
  const [selectedSize, setSelectedSize] = useState<"5ml" | "10ml" | "30ml">("10ml");
  const { addToCart }       = useCart();
  const { showFeedback }    = useCartFeedback();
  const dialogRef           = useRef<HTMLDivElement>(null);
  const closeRef            = useRef<HTMLButtonElement>(null);
  const returnFocusRef      = useRef<Element | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Body scroll lock + return-focus capture
  useEffect(() => {
    if (open) {
      returnFocusRef.current     = document.activeElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (returnFocusRef.current instanceof HTMLElement) {
        returnFocusRef.current.focus();
      }
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Initial focus — close button after enter animation begins
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  // Escape key + focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!mounted) return null;

  // Compute display values when knowledge is available
  const bullets     = knowledge ? generateWhyYoullLikeIt(knowledge) : null;
  const allNotes    = knowledge
    ? [...knowledge.notes.top, ...knowledge.notes.heart, ...knowledge.notes.base]
        .filter(Boolean)
        .slice(0, 7)
    : [];
  const currentPrice = knowledge ? knowledge.prices[selectedSize] : 0;

  const handleAddToCart = () => {
    if (!knowledge) return;
    const image = knowledge.images[selectedSize];
    addToCart({
      id:       knowledge.id,
      title:    knowledge.name,
      price:    currentPrice,
      image,
      quantity: 1,
      size:     selectedSize,
    });
    trackAddToCart({
      title:  knowledge.name,
      size:   selectedSize,
      price:  currentPrice,
      source: "quick-add",
    });
    showFeedback({ title: knowledge.name, image, size: selectedSize });
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {open && knowledge && (
        // ── Backdrop ────────────────────────────────────────────────────────
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[99998] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
          onClick={onClose}
          aria-hidden="true"
        >
          {/* ── Panel ───────────────────────────────────────────────────── */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fqv-title"
            initial={{ y: 56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 56, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[40px] bg-white sm:rounded-[40px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile drag handle */}
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-zinc-200 sm:hidden" />

            {/* ── Scrollable body ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">

              {/* Hero image */}
              <div className="relative h-52 w-full shrink-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 sm:h-60">
                <Image
                  src={knowledge.images["10ml"]}
                  alt={knowledge.name}
                  fill
                  className="object-contain p-10"
                  sizes="(max-width: 640px) 100vw, 512px"
                  priority
                />
                {/* Close */}
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#4f4a52] shadow-md backdrop-blur-sm transition hover:bg-white hover:shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-5 px-6 pb-6 pt-5">

                {/* ── Identity ─────────────────────────────────────────── */}
                <div>
                  <CollectionBadge collection={knowledge.collection} />

                  <h2
                    id="fqv-title"
                    className="mt-3 text-[1.6rem] font-black uppercase leading-tight tracking-[-0.04em] text-[#4f4a52]"
                  >
                    {knowledge.name}
                  </h2>

                  {knowledge.subtitle && (
                    <p className="mt-1.5 text-sm font-semibold text-[#d89ca4]">
                      {knowledge.subtitle}
                    </p>
                  )}

                  {knowledge.family.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {knowledge.family.map((f) => (
                        <KnowledgeChip key={f} label={f} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-[#f0ebe5]" />

                {/* ── Why You'll Like It ───────────────────────────────── */}
                {bullets && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                      Why You&apos;ll Like It
                    </p>
                    <ul className="mt-3 space-y-2">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm">
                          <span className="mt-px shrink-0 font-bold text-[#d89ca4]">✓</span>
                          <span className="font-medium leading-snug text-[#4f4a52]">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="h-px bg-[#f0ebe5]" />

                {/* ── Key Notes ────────────────────────────────────────── */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    Key Notes
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allNotes.map((note) => (
                      <NoteChip key={note} note={note} />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[#f0ebe5]" />

                {/* ── Perfect For · Season · Character ─────────────────── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {knowledge.occasions.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                        Perfect For
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {knowledge.occasions.map((o) => (
                          <KnowledgeChip key={o} label={o} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                      Season
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#4f4a52]">
                      {knowledge.season}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                      Character
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#4f4a52]">
                      {knowledge.scentCharacter}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[#f0ebe5]" />

                {/* ── Size selector ────────────────────────────────────── */}
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    Select Size
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["5ml", "10ml", "30ml"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-2xl border py-3 text-center transition-all ${
                          selectedSize === size
                            ? "border-[#d89ca4] bg-pink-50 shadow-sm"
                            : "border-[#ede8e1] bg-white hover:border-[#d89ca4]"
                        }`}
                      >
                        <p className="text-xs font-bold text-[#4f4a52]">{size}</p>
                        <p className="mt-0.5 text-[11px] text-[#7b7480]">R{knowledge.prices[size]}</p>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Sticky CTA footer ────────────────────────────────────── */}
            <div className="shrink-0 border-t border-[#f0ebe5] bg-white px-6 pb-6 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full rounded-full bg-gradient-to-r from-pink-400 to-blue-400 py-4 text-sm font-bold text-white shadow-lg transition hover:brightness-105"
              >
                Add to Cart · R{currentPrice}
              </button>
              <Link
                href={`/product/${knowledge.slug}`}
                onClick={onClose}
                className="mt-3 flex w-full items-center justify-center rounded-full border border-[#ede8e1] py-3.5 text-sm font-semibold text-[#4f4a52] transition hover:bg-[#f9f7f4]"
              >
                View Full Fragrance Profile →
              </Link>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
