"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import Link from "next/link";
import { fragrances } from "../data/fragrances";

export default function ProductDetail({
  fragrance,
}: {
  fragrance: any;
}) {
  const [selectedSize, setSelectedSize] =
    useState<"5ml" | "10ml" | "30ml">("5ml");
    
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { addToCart } = useCart();
  const { openCart } = useCartUI();

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addToCart({
      id: fragrance.title.toLowerCase().replace(/\s+/g, "-"),
      title: fragrance.title,
      price: fragrance.prices[selectedSize],
      image: fragrance.images[selectedSize],
      quantity: 1,
      size: selectedSize,
    });

    openCart();
  };

  return (
    <>
      {/* Edit 5 — Add Breadcrumb */}
      <section className="px-6 pt-28 pb-12">
        <div className="hidden md:block mx-auto mb-8 max-w-7xl">
          <p className="text-sm text-zinc-500">
            Shop / {fragrance.collection} / {fragrance.title}
          </p>
        </div>

        <div className="mx-auto max-w-7xl grid gap-5 md:p-8 lg:grid-cols-2">

          <div>
            {/* Edit 2 — Make Product Image Feel Premium */}
            <img
              src={fragrance.images[selectedSize]}
              alt={fragrance.title}
              className="mx-auto max-w-[120px] md:max-w-none rounded-2xl bg-white p-2 md:p-12 shadow-lg object-contain"
            />
          </div>

          <div>
            <p className="hidden md:block text-xs uppercase tracking-[0.2em] text-[#d89ca4]">
              {fragrance.collection}
            </p>

            <h1 className="mt-1 text-[2rem] md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">
              {fragrance.title}
            </h1>

            <p className="mt-2 text-lg md:text-xl font-semibold text-[#b67d73]">
              {fragrance.subtitle}
            </p>

            {/* Edit 1 — Add Premium Badges Under The Title */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm">
                {fragrance.profile}
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm">
                {fragrance.season}
              </span>

              {fragrance.bestSeller && (
                <span className="rounded-full bg-[#d89ca4] px-4 py-2 text-sm font-medium text-white">
                  Best Seller
                </span>
              )}

              {fragrance.newArrival && (
                <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
                  New Arrival
                </span>
              )}
            </div>

            <p className="hidden md:block mt-6 text-zinc-600 leading-8">
              {fragrance.mood}
            </p>

            <div className="mt-4">
              <p className="text-4xl font-black text-[#4f4a52]">
                R{fragrance.prices[selectedSize]}
              </p>
            </div>

            <div className="mt-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Select Size
              </p>

              <div className="flex gap-3">
                {(["5ml", "10ml", "30ml"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-2xl px-4 py-3 border transition-all font-semibold ${
                      selectedSize === size
                        ? "bg-[#d89ca4] text-white border-[#d89ca4]"
                        : "bg-white border-[#efe8e1] hover:border-[#d89ca4]"
                    }`}
                  >
                    <div>{size}</div>
                    <div className="text-sm">
                      R{fragrance.prices[size]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#efe8e1] bg-white p-4">
              🎁 Orders over R400 receive a FREE 5ml Sample
            </div>

            {/* Step 4 — Connect Button */}
            <button
              onClick={handleAddToCart}
              className="mt-4 w-full rounded-2xl bg-[#d89ca4] py-4 font-bold text-white transition hover:opacity-90"
            >
              Add To Cart
            </button>

            {/* Updated Buy Now Button with onClick Handler */}
            <button
              onClick={handleAddToCart}
              className="mt-4 w-full rounded-2xl border-2 border-[#d89ca4] bg-transparent py-4 font-bold text-[#d89ca4] transition hover:bg-[#d89ca4] hover:text-white"
            >
              Buy Now
            </button>

            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <p>✓ Nationwide South African Delivery</p>
              <p>✓ Secure Checkout</p>
              <p>✓ Luxury Inspired Fragrances</p>
              <p>✓ FREE 5ml Sample Over R400</p>
            </div>

            {/* Priority 2: Fragrance Profile Section */}
            <div className="mt-12 rounded-3xl border border-[#efe8e1] bg-white p-5 md:p-8">
              <h3 className="text-xl font-black text-[#4f4a52]">
                Fragrance Profile
              </h3>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Collection
                  </p>
                  <p className="mt-2 font-semibold">
                    {fragrance.collection}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Profile
                  </p>
                  <p className="mt-2 font-semibold">
                    {fragrance.profile}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Season
                  </p>
                  <p className="mt-2 font-semibold">
                    {fragrance.season}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Best For
                  </p>
                  <p className="mt-2 font-semibold">
                    Daily Wear
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Priority 3: Premium Storytelling Section */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl bg-white p-10 mb-12">
            <h2 className="text-3xl font-black text-[#4f4a52]">
              The Experience
            </h2>

            <p className="mt-6 max-w-3xl leading-8 text-zinc-600">
              {fragrance.title} is designed for those who appreciate
              luxury, confidence and timeless style.

              Built around {fragrance.notes.join(", ")},
              this fragrance delivers a refined scent profile
              that transitions effortlessly from daytime wear
              to evening occasions.
            </p>
          </div>

          <h2 className="mb-8 text-3xl font-black text-[#4f4a52]">
            Fragrance Notes
          </h2>

          {/* Edit 4 — Upgrade Notes Into A Pyramid */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 md:p-8 shadow-sm">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-zinc-400">
                Top Note
              </p>
              <p className="text-lg font-semibold">
                {fragrance.notes[0]}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 md:p-8 shadow-sm">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-zinc-400">
                Heart Note
              </p>
              <p className="text-lg font-semibold">
                {fragrance.notes[1]}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 md:p-8 shadow-sm">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-zinc-400">
                Base Note
              </p>
              <p className="text-lg font-semibold">
                {fragrance.notes[2]}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Priority 4: Related Fragrances */}
      <section className="px-6 pb-44 md:pb-32">
        <div className="mx-auto max-w-7xl">

          <h2 className="mb-8 text-3xl font-black text-[#4f4a52]">
            You May Also Like
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            {fragrances
              .filter(
                (f) =>
                  f.collection === fragrance.collection &&
                  f.title !== fragrance.title
              )
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item.title}
                  href={`/product/${item.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="rounded-3xl bg-white p-6 transition hover:shadow-lg"
                >
                  <img
                    src={item.images["5ml"]}
                    alt={item.title}
                    className="mx-auto h-40 object-contain"
                  />

                  <h3 className="mt-4 font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    From R{item.prices["5ml"]}
                  </p>
                </Link>
              ))}
          </div>

        </div>
      </section>

      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#efe8e1] bg-white/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                {selectedSize}
              </p>

              <h3 className="font-bold text-[#4f4a52] leading-tight">
                {fragrance.title}
              </h3>

              <p className="font-black text-[#d89ca4]">
                R{fragrance.prices[selectedSize]}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="rounded-2xl bg-[#d89ca4] px-6 py-3 font-bold text-white whitespace-nowrap"
            >
              Add To Cart
            </button>

          </div>
        </div>
      )}
    </>
  );
}






