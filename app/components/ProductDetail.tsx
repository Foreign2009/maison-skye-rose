"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useCartUI } from "../context/CartUIContext";
import Link from "next/link";
import { fragrances } from "../data/fragrances";
import { brand } from "../data/brand";

export default function ProductDetail({
  fragrance,
}: {
  fragrance: any;
}) {
  const [selectedSize, setSelectedSize] =
    useState<"5ml" | "10ml" | "30ml">("10ml");
    
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

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = existing.filter((item: any) => item.title !== fragrance.title);
    const entry = {
      title: fragrance.title,
      subtitle: fragrance.subtitle,
      mood: fragrance.mood,
      profile: fragrance.profile,
      season: fragrance.season,
      notes: fragrance.notes,
      prices: fragrance.prices,
      images: fragrance.images,
    };
    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify([entry, ...filtered].slice(0, 12))
    );
  }, [fragrance.title]);

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

  const handleBuyNow = () => {
    addToCart({
      id: fragrance.title.toLowerCase().replace(/\s+/g, "-"),
      title: fragrance.title,
      price: fragrance.prices[selectedSize],
      image: fragrance.images[selectedSize],
      quantity: 1,
      size: selectedSize,
    });

    const message = encodeURIComponent(
      `Hi Maison Skye & Rose! 👋\n\nI'd like to order the following:\n\n🧴 Fragrance: ${fragrance.title}\n📦 Size: ${selectedSize}\n🔢 Quantity: 1\n💰 Price: R${fragrance.prices[selectedSize]}\n\nPlease let me know the total including delivery and send me the payment details.\n\nThank you!`
    );

    const whatsappUrl = `https://wa.me/${brand.social.whatsappNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Breadcrumb section */}
      <section className="px-4 md:px-6 pt-16 md:pt-28 pb-6">
        <div className="hidden md:block mx-auto mb-8 max-w-7xl">
          <p className="text-sm text-zinc-500">
            Shop / {fragrance.collection} / {fragrance.title}
          </p>
        </div>

        <div className="mx-auto max-w-7xl grid gap-3 md:p-8 lg:grid-cols-2">

          {/* Product Gallery */}
          <div className="flex flex-col items-center">
            <img
              src={fragrance.images[selectedSize]}
              alt={fragrance.title}
              className="mx-auto max-w-[160px] rounded-3xl bg-white p-6 shadow-lg object-contain"
            />

            <div className="mt-4 flex gap-3">
              {(["5ml", "10ml", "30ml"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl border p-2 transition ${
                    selectedSize === size
                      ? "border-[#d89ca4] bg-[#fff7f8]"
                      : "border-[#efe8e1]"
                  }`}
                >
                  <img
                    src={fragrance.images[size]}
                    alt={size}
                    className="h-16 w-16 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="hidden md:block text-xs uppercase tracking-[0.2em] text-[#d89ca4]">
              {fragrance.collection}
            </p>

            <h1 className="mt-1 text-[1.8rem] leading-none md:text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">
              {fragrance.title}
            </h1>

            <p className="mt-2 text-lg md:text-xl font-semibold text-[#b67d73]">
              {fragrance.subtitle}
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium shadow-sm">
                {fragrance.profile}
              </span>

              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium shadow-sm">
                {fragrance.season}
              </span>

              {fragrance.bestSeller && (
                <span className="rounded-full bg-[#d89ca4] px-3 py-1.5 text-xs font-medium text-white">
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

            <div className="mt-2">
              <p className="text-2xl font-black text-[#4f4a52]">
                R{fragrance.prices[selectedSize]}
              </p>
            </div>

            <div className="mt-3">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Select Size
              </p>

              {/* Premium Size Selector */}
              <div className="grid grid-cols-3 gap-3">
                {(["5ml", "10ml", "30ml"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full rounded-xl px-3 py-2 border transition-all font-semibold ${
                      selectedSize === size
                        ? "bg-[#d89ca4] text-white border-[#d89ca4] shadow-lg scale-[1.02]"
                        : "bg-white border-[#efe8e1] hover:border-[#d89ca4]"
                    }`}
                  >
                    <div className="font-bold">{size}</div>

                    <div className="text-[10px] opacity-90 mt-1">
                      {size === "5ml" && "Perfect for Trying"}
                      {size === "10ml" && (
                        <span className="inline-block rounded-full bg-white/20 px-2 py-0.5">
                          Most Popular
                        </span>
                      )}
                      {size === "30ml" && (
                        <span className="inline-block rounded-full bg-white/20 px-2 py-0.5">
                          Best Value
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold mt-2">
                      R{fragrance.prices[size]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#efe8e1] bg-white p-4">
              🎁 Orders over R400 receive a FREE 5ml Sample
            </div>

            {/* Main Trust Signals Block */}
            <div className="mt-4 space-y-2 text-sm text-zinc-600">
              <p>✓ Nationwide South African Delivery</p>
              <p>✓ 465+ Signature Fragrances Available</p>
              <p>✓ Secure Checkout</p>
              <p>✓ Luxury Inspired Fragrance Collection</p>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-3 w-full rounded-2xl bg-[#d89ca4] py-3 font-bold text-white transition hover:opacity-90"
            >
              Add To Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="mt-3 w-full rounded-2xl border-2 border-[#d89ca4] bg-transparent py-3 font-bold text-[#d89ca4]"
            >
              Buy Now
            </button>

            <div className="mt-6 rounded-3xl border border-[#efe8e1] bg-white p-5 md:p-8">
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

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-6 md:p-10 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-[#4f4a52]">
              The Experience
            </h2>
            <p className="mt-6 max-w-3xl leading-7 text-zinc-600">
              {fragrance.title} is designed for those who appreciate
              luxury, confidence and timeless style.

              Built around {fragrance.notes.join(", ")},
              this fragrance delivers a refined scent profile
              that transitions effortlessly from daytime wear
              to evening occasions.
            </p>
          </div>

          <h2 className="mb-8 text-2xl md:text-3xl font-black text-[#4f4a52]">
            Fragrance Notes
          </h2>

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

      <section className="px-6 pb-52 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl md:text-3xl font-black text-[#4f4a52]">
            You May Also Like
          </h2>

          <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-4">
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
                  className="rounded-3xl bg-white p-4 md:p-6 transition hover:shadow-lg"
                >
                  <img
                    src={item.images["5ml"]}
                    alt={item.title}
                    className="mx-auto h-24 md:h-40 object-contain"
                  />
                  <h3 className="mt-4 font-bold text-sm md:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-zinc-500">
                    From R{item.prices["5ml"]}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#efe8e1] bg-white/90 backdrop-blur-xl shadow-2xl md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              {/* Dynamic conversion context added here */}
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                {selectedSize} • {
                  selectedSize === "10ml"
                    ? "Most Popular"
                    : selectedSize === "30ml"
                    ? "Best Value"
                    : "Starter Size"
                }
              </p>
              <h3 className="max-w-[120px] truncate font-bold text-[#4f4a52] leading-tight">
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