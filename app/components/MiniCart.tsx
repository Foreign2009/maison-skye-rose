"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useFavorites } from "../context/FavoritesContext";
import { useEffect, useState } from "react";
import { fragrances } from "../data/fragrances";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    wholesaleActive,
    getWholesalePrice,
  } = useCart();

  const { favorites } = useFavorites();
  const [recentRecommendations, setRecentRecommendations] = useState<any[]>([]);
  const [collectionRecommendations, setCollectionRecommendations] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const favoriteRecommendations = fragrances
    .filter(
      (fragrance) =>
        favorites.some((fav) => fav.title === fragrance.title) &&
        !cart.some((item) => item.title === fragrance.title)
    )
    .slice(0, 3);

  const quickAddFavorite = (fragrance: any) => {
    addToCart({
      id: fragrance.title,
      title: fragrance.title,
      image:
        fragrance.images?.["10ml"] ||
        fragrance.images?.["5ml"],
      price: fragrance.prices?.["5ml"],
      quantity: 1,
      size: "5ml",
    });
  };

  const quickAddRecent = (fragrance: any) => {
    addToCart({
      id: fragrance.title,
      title: fragrance.title,
      image:
        fragrance.images?.["10ml"] ||
        fragrance.images?.["5ml"],
      price: fragrance.prices?.["5ml"],
      quantity: 1,
      size: "5ml",
    });
  };

  useEffect(() => {
    const viewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    const matches = viewed
      .map((item: any) =>
        fragrances.find(
          (fragrance) => fragrance.title === item.title
        )
      )
      .filter(Boolean)
      .filter(
        (fragrance: any) =>
          !cart.some(
            (cartItem) =>
              cartItem.title === fragrance.title
          )
      )
      .slice(0, 3);

    setRecentRecommendations(matches);
  }, [cart]);

  useEffect(() => {
    if (cart.length === 0) {
      setCollectionRecommendations([]);
      return;
    }

    const cartTitles = cart.map((item) => item.title);

    const cartFragrance = fragrances.find(
      (f) => f.title === cart[0]?.title
    );

    const recommendations = fragrances
      .filter(
        (fragrance) =>
          !cartTitles.includes(fragrance.title)
      )
      .map((fragrance) => {
        let score = 0;

        if (
          fragrance.collection ===
          cartFragrance?.collection
        ) {
          score += 3;
        }

        if (
          fragrance.profile ===
          cartFragrance?.profile
        ) {
          score += 2;
        }

        if (
          fragrance.season ===
          cartFragrance?.season
        ) {
          score += 1;
        }

        if (fragrance.bestSeller) {
          score += 1;
        }

        return {
          ...fragrance,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setCollectionRecommendations(recommendations);
  }, [cart]);

  if (!isOpen) return null;

  const subtotal = cartTotal;

  const progressPercent = Math.min(
    (subtotal / 1500) * 100,
    100
  );

  const nextReward =
    subtotal < 400
      ? { amount: 400, reward: "1 Free 5ml Sample" }
      : subtotal < 700
      ? { amount: 700, reward: "2 Free 5ml Samples" }
      : subtotal < 1000
      ? { amount: 1000, reward: "3 Free 5ml Samples" }
      : subtotal < 1500
      ? { amount: 1500, reward: "Discovery Set (5 × 5ml)" }
      : null;

  const delivery =
    !cart || cart.length === 0
      ? 0
      : wholesaleActive
      ? 0
      : subtotal >= 2000
      ? 0
      : 100;

  const total = subtotal + delivery;

  const originalTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const savings = originalTotal - subtotal;

  const rewardMessage =
    subtotal >= 2000
      ? "✓ Discovery Set (5 × 5ml) + Free Delivery"
      : subtotal >= 1500
      ? "✓ Discovery Set (5 × 5ml)"
      : subtotal >= 1000
      ? "✓ 3 Free 5ml Samples"
      : subtotal >= 700
      ? "✓ 2 Free 5ml Samples"
      : subtotal >= 400
      ? "✓ 1 Free 5ml Sample"
      : "";

  const handleWhatsAppCheckout = () => {
    const orderLines = cart
      .map((item) => {
        const itemPrice = getWholesalePrice(item);
        return `• ${item.title} (${item.size}) x${item.quantity} - R${
          (itemPrice * item.quantity).toFixed(2)
        }${wholesaleActive ? " (Wholesale)" : ""}`;
      })
      .join("\n");

    const message = `🌹 MAISON SKYE & ROSE
Thank you for choosing Maison Skye & Rose.

${wholesaleActive ? "WHOLESALE ORDER\n\n" : ""}ORDER SUMMARY
${orderLines}

${rewardMessage ? `🎁 REWARDS UNLOCKED

${rewardMessage}

` : ""}Subtotal: R${subtotal.toFixed(2)}
Delivery: ${delivery === 0 ? "FREE" : `R${delivery.toFixed(2)}`}
TOTAL: R${total.toFixed(2)}

CUSTOMER DETAILS
Name:
Contact Number:
Delivery Area:

A member of our team will confirm your order and delivery details shortly.`;

    window.open(
      `https://wa.me/27696863952?text=${encodeURIComponent(message)}`,
      `_blank`
    );
  };

  return (
    <div className="fixed z-50 bg-[#fffdfb]/95 backdrop-blur-md bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto w-full md:w-[420px] md:rounded-[32px] border border-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] md:shadow-[0_25px_80px_rgba(0,0,0,0.12)] flex flex-col max-h-[85vh] md:max-h-[none]">
      {/* Mobile Drag/Close Handle Area */}
      <div
        className="flex justify-center pt-3 md:hidden cursor-pointer"
        onClick={onClose}
      >
        <div className="h-1.5 w-12 rounded-full bg-zinc-300" />
      </div>

      {/* Header Section */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Maison Skye & Rose
          </p>
          <h2 className="mt-1 text-xl md:text-2xl font-black uppercase tracking-tight">
            Your Bag
          </h2>

          {wholesaleActive ? (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                Wholesale Pricing Active
              </p>
              <p className="mt-1 text-xs text-green-600">
                Mix & Match pricing applied
              </p>
              <p className="mt-1 text-xs font-semibold text-green-700">
                ✓ Free Delivery Included
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-[#f5f1eb] px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#b67d73]">
                Wholesale Available
              </p>
              
              <div className="mt-2 space-y-1">
                <p
                  className={`text-xs ${
                    subtotal >= 400
                      ? "text-green-600 font-semibold"
                      : "text-zinc-500"
                  }`}
                >
                  {subtotal >= 400
                    ? "✓ 1 Free 5ml Sample Unlocked"
                    : `Only R${(400 - subtotal).toFixed(0)} away from a FREE 5ml Sample`}
                </p>

                <p
                  className={`text-xs ${
                    subtotal >= 700
                      ? "text-green-600 font-semibold"
                      : "text-zinc-500"
                  }`}
                >
                  {subtotal >= 700
                    ? "✓ 2 Free 5ml Samples Unlocked"
                    : `Only R${Math.max(0, 700 - subtotal).toFixed(0)} away from 2 FREE Samples`}
                </p>

                <p
                  className={`text-xs ${
                    subtotal >= 1000
                      ? "text-green-600 font-semibold"
                      : "text-zinc-500"
                  }`}
                >
                  {subtotal >= 1000
                    ? "✓ 3 Free 5ml Samples Unlocked"
                    : `Only R${Math.max(0, 1000 - subtotal).toFixed(0)} away from 3 FREE Samples`}
                </p>

                <p
                  className={`text-xs ${
                    subtotal >= 1500
                      ? "text-green-600 font-semibold"
                      : "text-zinc-500"
                  }`}
                >
                  {subtotal >= 2000
                    ? "✓ Discovery Set + Free Delivery"
                    : subtotal >= 1500
                    ? "✓ Discovery Set Unlocked"
                    : `Only R${Math.max(0, 1500 - subtotal).toFixed(0)} away from a Discovery Set`}
                </p>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full bg-[#b67d73]"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs font-semibold text-[#4f4a52]">
                R{subtotal.toFixed(0)} / R1500 Rewards Progress
              </p>
            </div>
          )}
        </div>

        {/* Desktop Close Button */}
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-black transition-colors rounded-full hover:bg-zinc-100"
          aria-label="Close Cart"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Products Area */}
      <div className="px-6 flex-1 max-h-[50vh] md:max-h-[45vh] space-y-4 overflow-y-auto pr-4 scrollbar-thin">
        {(!cart || cart.length === 0) && (
          <div className="rounded-3xl bg-[#f5f1eb] p-8 text-center my-4">
            <p className="text-sm text-zinc-500">
              Your fragrance selection awaits.
            </p>
          </div>
        )}

        {cart.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex items-center gap-4 rounded-[28px] border border-white/40 bg-white/80 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl"
          >
            {/* Product image */}
            <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0 rounded-[24px] bg-gradient-to-br from-pink-50 to-blue-50">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain p-3"
                unoptimized
              />
            </div>

            {/* Product details */}
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-[15px] font-black uppercase leading-tight text-[#4f4a52]">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">{item.size}</p>

              {/* Wholesale price display */}
              {wholesaleActive && getWholesalePrice(item) !== item.price ? (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 line-through">
                      R{item.price}
                    </span>
                    <span className="font-black text-green-600">
                      R{getWholesalePrice(item)}
                    </span>
                  </div>
                  <p className="text-[10px] text-green-600">
                    Save R{(item.price - getWholesalePrice(item)).toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="mt-1 font-black text-[#b67d73]">
                  R{item.price}
                </p>
              )}

              {/* Quantity controls */}
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(item.id, item.size)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f1eb] text-[#4f4a52] hover:bg-[#ece6de] transition-colors text-base font-bold"
                >
                  -
                </button>

                <span className="min-w-[24px] text-center text-base font-black text-[#4f4a52]">{item.quantity}</span>

                <button
                  onClick={() => increaseQuantity(item.id, item.size)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f1eb] text-[#4f4a52] hover:bg-[#ece6de] transition-colors text-base font-bold"
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="ml-auto text-xs uppercase tracking-[0.15em] text-[#b67d73] font-semibold hover:text-[#a96e65] transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Conversion Footer */}
      <div className="border-t border-black/10 bg-gradient-to-b from-white to-[#fcfaf8] p-5 md:p-6 md:rounded-b-[32px]">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-bold">R{subtotal.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span>Delivery</span>
          <span className="font-bold">
            {delivery === 0 ? "FREE" : `R${delivery.toFixed(2)}`}
          </span>
        </div>

        {savings > 0 && (
          <div className="mt-4 flex justify-between rounded-2xl border border-[#eadfd6] bg-[#faf7f3] px-4 py-3 text-sm text-[#b67d73]">
            <span>You Saved</span>
            <span className="font-bold">
              R{savings.toFixed(2)}
            </span>
          </div>
        )}

        <div className="mt-6 flex justify-between border-t border-[#e9e3dc] pt-6">
          <span className="text-2xl font-black uppercase">
            Total
          </span>

          <span className="text-2xl font-black">
            R{total.toFixed(2)}
          </span>
        </div>

        <div
          className={`mt-5 rounded-2xl p-4 ${
            subtotal >= 1500
              ? "border border-green-200 bg-green-50"
              : "border border-[#eadfd6] bg-[#faf7f3]"
          }`}
        >
          <p
            className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
              subtotal >= 1500 ? "text-green-700" : "text-[#b67d73]"
            }`}
          >
            {subtotal >= 1500
              ? "🎉 Highest Reward Tier Unlocked"
              : "Current Reward"}
          </p>

          <div className="mt-2 text-sm">
            <p className="text-green-600 font-semibold">
              {subtotal >= 1500
                ? "Discovery Set (5 × 5ml)"
                : subtotal >= 1000
                ? "✓ 3 Free 5ml Samples"
                : subtotal >= 700
                ? "✓ 2 Free 5ml Samples"
                : subtotal >= 400
                ? "✓ 1 Free 5ml Sample"
                : "No rewards unlocked yet"}
            </p>
          </div>

          {nextReward && (
            <div className="mt-3 rounded-xl bg-white px-3 py-3 border border-[#eadfd6]">
              <p className="text-[10px] uppercase tracking-widest text-[#b67d73] font-bold">
                Next Reward
              </p>

              <p className="mt-2 text-sm font-semibold text-[#4f4a52]">
                🎁 Only R{(nextReward.amount - subtotal).toFixed(0)} more
              </p>

              <p className="mt-1 text-sm text-[#b67d73] font-bold">
                {nextReward.reward}
              </p>

              <p className="mt-2 text-xs text-zinc-500">
                Add a 5ml fragrance from R89
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleWhatsAppCheckout}
          disabled={!cart || cart.length === 0}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-[#c8948a] to-[#b67d73] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_12px_30px_rgba(182,125,115,0.25)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_16px_40px_rgba(182,125,115,0.35)] disabled:opacity-50"
        >
          Checkout via WhatsApp
        </button>

        <div className="border-t border-black/5 mt-6">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="w-full py-4 text-left flex items-center justify-between"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
              You May Also Like
            </span>

            <span className="text-xs font-bold text-[#b67d73]">
              {showRecommendations ? "−" : "+"}
            </span>
          </button>

          {showRecommendations && (
            <>
              {/* Favorites Recommendations Subsection (v4.0.2 UI) */}
              {favoriteRecommendations.length > 0 && (
                <div className="py-4 border-t border-black/5 bg-[#fbf9f6] -mx-5 md:-mx-6 px-5 md:px-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-3">
                    From Your Favorites
                  </p>
                  <div className="space-y-2">
                    {favoriteRecommendations.map((fragrance) => (
                      <div 
                        key={fragrance.title} 
                        className="flex items-center justify-between gap-3 bg-white border border-black/5 rounded-2xl p-2.5 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 rounded-xl bg-zinc-50 border border-black/5 overflow-hidden">
                            <Image
                              src={fragrance.images?.["10ml"] || fragrance.images?.["5ml"]}
                              alt={fragrance.title}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase text-[#4f4a52] truncate max-w-[140px]">
                              {fragrance.title}
                            </h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              From R{fragrance.prices?.["5ml"]}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => quickAddFavorite(fragrance)}
                          className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#b67d73] hover:bg-[#a96e65] px-3 py-1.5 rounded-full transition-all duration-200"
                        >
                          + Add 5ml
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Viewed Section */}
              {recentRecommendations.length > 0 && (
                <div className="py-4 border-t border-black/5 bg-white -mx-5 md:-mx-6 px-5 md:px-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-3">
                    Recently Viewed
                  </p>

                  <div className="space-y-2">
                    {recentRecommendations.map((fragrance) => (
                      <div
                        key={fragrance.title}
                        className="flex items-center justify-between gap-3 bg-[#fbf9f6] border border-black/5 rounded-2xl p-2.5 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 rounded-xl bg-zinc-50 border border-black/5 overflow-hidden">
                            <Image
                              src={
                                fragrance.images?.["10ml"] ||
                                fragrance.images?.["5ml"]
                              }
                              alt={fragrance.title}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>

                          <div>
                            <h4 className="text-xs font-black uppercase text-[#4f4a52] truncate max-w-[140px]">
                              {fragrance.title}
                            </h4>

                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              From R{fragrance.prices?.["5ml"]}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => quickAddRecent(fragrance)}
                          className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#4f4a52] hover:bg-[#3f3b42] px-3 py-1.5 rounded-full transition-all duration-200"
                        >
                          + Add 5ml
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {collectionRecommendations.length > 0 && (
                <div className="py-4 border-t border-black/5 bg-[#fbf9f6] -mx-5 md:-mx-6 px-5 md:px-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-3">
                    Complete Your Collection
                  </p>

                  <div className="space-y-2">
                    {collectionRecommendations.map((fragrance) => (
                      <div
                        key={fragrance.title}
                        className="flex items-center justify-between gap-3 bg-white border border-black/5 rounded-2xl p-2.5 shadow-sm"
                      >
                        <div>
                          <h4 className="text-xs font-black uppercase text-[#4f4a52]">
                            {fragrance.title}
                          </h4>

                          <p className="text-[10px] text-zinc-400">
                            {fragrance.profile}
                          </p>
                        </div>

                        <button
                          onClick={() => quickAddRecent(fragrance)}
                          className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#b67d73] px-3 py-1.5 rounded-full"
                        >
                          + Add 5ml
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}