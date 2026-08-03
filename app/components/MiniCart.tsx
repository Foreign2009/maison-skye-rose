"use client";
import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { trackAddToCart, trackWhatsAppCheckout, trackCartRecommendationsShown, trackRecommendationCheckoutAttributed } from "../lib/analytics";
import { setRecommendationAttribution, getRecommendationAttribution } from "../lib/recommendationAttribution";
import { useMemo, useState, useRef, useEffect } from "react";
import { brand } from "../data/brand";
import { getCartRecommendations } from "../lib/customer/sync/CartRecommendationStrategy";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import type { DisplayFragrance } from "../lib/knowledgeAdapter";

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
  const { profile } = useUnifiedCustomerProfile();
  const [showRecommendations, setShowRecommendations] = useState(false);

  const { fromFavorites, recentlyViewed: recentRecs, completeYourCollection } = useMemo(() => {
    const recentTitles: string[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = JSON.parse(localStorage.getItem("recentlyViewed") ?? "[]");
        if (Array.isArray(raw)) {
          for (const item of raw) {
            if (item && typeof item === "object" && typeof item.title === "string") {
              recentTitles.push(item.title);
            }
          }
        }
      } catch { }
    }
    return getCartRecommendations({
      cartTitles:   cart.map((item) => item.title),
      savedTitles:  favorites.map((f) => f.title),
      recentTitles,
      limit: 3,
      profile,
    });
  }, [cart, favorites, profile]);

  const impressionFired = useRef(false);
  useEffect(() => {
    if (!showRecommendations) return;
    if (impressionFired.current) return;
    const total = fromFavorites.length + recentRecs.length + completeYourCollection.length;
    if (total === 0) return;
    impressionFired.current = true;
    trackCartRecommendationsShown({
      fromFavoritesCount:          fromFavorites.length,
      recentlyViewedCount:         recentRecs.length,
      completeYourCollectionCount: completeYourCollection.length,
      totalCount:                  total,
      renderSource:                "minicart",
    });
  }, [showRecommendations, fromFavorites.length, recentRecs.length, completeYourCollection.length]);

  type MiniCartSection =
    | "minicart-favorites"
    | "minicart-recently-viewed"
    | "minicart-complete-collection";

  const quickAddFromSection = (fragrance: DisplayFragrance, section: MiniCartSection) => {
    addToCart({
      id:       fragrance.title.toLowerCase().replace(/\s+/g, "-"),
      title:    fragrance.title,
      image:    fragrance.images["10ml"] || fragrance.images["5ml"],
      price:    fragrance.prices["5ml"],
      quantity: 1,
      size:     "5ml",
    });
    trackAddToCart({
      title:               fragrance.title,
      size:                "5ml",
      price:               fragrance.prices["5ml"],
      source:              "minicart",
      recommendationSource: section,
    });
    setRecommendationAttribution({
      surface: section,
      slug:    fragrance.title.toLowerCase().replace(/\s+/g, "-"),
    });
  };

  const subtotal = cartTotal;
  const progressPercent =
    subtotal >= 1500 ? 100
    : subtotal >= 1000 ? 75 + ((subtotal - 1000) / 500) * 25
    : subtotal >= 700  ? 50 + ((subtotal - 700)  / 300) * 25
    : subtotal >= 400  ? 25 + ((subtotal - 400)  / 300) * 25
    : (subtotal / 400) * 25;

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
  const originalTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
        return `• ${item.title} (${item.size}) x${item.quantity} - R${(
          itemPrice * item.quantity
        ).toFixed(2)}${wholesaleActive ? " (Wholesale)" : ""}`;
      })
      .join("\n");

    const message = `🌹 MAISON SKYE & ROSE
Thank you for choosing Maison Skye & Rose.
${wholesaleActive ? "WHOLESALE ORDER\n\n" : ""}ORDER SUMMARY
${orderLines}
${rewardMessage ? `🎁 REWARDS UNLOCKED\n${rewardMessage}\n` : ""}
Subtotal: R${subtotal.toFixed(2)}
Delivery: ${delivery === 0 ? "FREE" : "Calculated at checkout"}
${delivery === 0 ? `TOTAL: R${total.toFixed(2)}` : `SUBTOTAL: R${subtotal.toFixed(2)}`}

CUSTOMER DETAILS
Name:
Contact Number:
Delivery Area:

A member of our team will confirm your order and delivery details shortly.`;

    trackWhatsAppCheckout({ itemCount: cart.length, cartTotal: total });
    const recAttribution = getRecommendationAttribution();
    if (recAttribution) {
      trackRecommendationCheckoutAttributed({
        surface: recAttribution.surface,
        slug:    recAttribution.slug,
        ageMs:   Date.now() - recAttribution.setAt,
      });
    }
    window.open(`https://wa.me/${brand.social.whatsappNumber}?text=${encodeURIComponent(message)}`, `_blank`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      aria-hidden={!isOpen}
      className={`fixed z-50 bg-[#fffdfb]/95 backdrop-blur-md bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto w-full md:w-[420px] md:rounded-[32px] border border-black/5 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] md:shadow-[0_25px_80px_rgba(0,0,0,0.12)] flex flex-col h-screen md:h-[85vh] overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none ${
        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      
      {/* Mobile Drag/Close Handle — tap to close */}
      <button
        onClick={onClose}
        aria-label="Close cart"
        className="w-full flex justify-center pt-3 pb-2 shrink-0 md:hidden"
      >
        <div className="w-12 h-1.5 bg-zinc-300/60 rounded-full" />
      </button>

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
              <p className="mt-1 text-xs text-green-600">Mix & Match pricing applied</p>
              <p className="mt-1 text-xs font-semibold text-green-700">
                ✓ Free Delivery Included
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-[#f5f1eb] px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#b67d73]">
                Wholesale Available
              </p>

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
          className="p-2 text-zinc-400 hover:text-black transition-colors rounded-full hover:bg-zinc-100"
          aria-label="Close Cart"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable Products Area */}
      <div className="px-6 flex-1 min-h-0 overflow-y-auto space-y-4 pr-4">
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
                sizes="96px"
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
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f1eb] text-[#4f4a52] hover:bg-[#ece6de] transition-colors text-base font-bold"
                >
                  -
                </button>

                <span className="min-w-[24px] text-center text-base font-black text-[#4f4a52]">{item.quantity}</span>

                <button
                  onClick={() => increaseQuantity(item.id, item.size)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f1eb] text-[#4f4a52] hover:bg-[#ece6de] transition-colors text-base font-bold"
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
      {/* Final Polish Fix: Adjusted max-h configuration constraint down to 35vh */}
      <div className="shrink-0 border-t border-black/10 bg-gradient-to-b from-white to-[#fcfaf8] md:rounded-b-[32px] flex flex-col max-h-[35vh]">
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-5 md:px-6 md:pt-6">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-bold">R{subtotal.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span>Delivery</span>
          <span className="font-bold">
            {delivery === 0 ? "FREE" : "Calculated at checkout"}
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
            {delivery === 0 ? "Total" : "Subtotal"}
          </span>

          <span className="text-2xl font-black">
            R{(delivery === 0 ? total : subtotal).toFixed(2)}
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
            <p className={`font-semibold ${subtotal >= 400 ? "text-green-600" : "text-zinc-400"}`}>
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

        <div className="border-t border-black/5 mt-6">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="w-full py-4 text-left flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
                You May Also Like
              </span>
              <p className="mt-0.5 text-[10px] font-normal normal-case tracking-normal text-zinc-400">
                Each addition deepens your collection.
              </p>
            </div>

            <span className="text-xs font-bold text-[#b67d73]">
              {showRecommendations ? "−" : "+"}
            </span>
          </button>

          {showRecommendations && (
            <>
              {/* Favorites Recommendations Subsection */}
              {fromFavorites.length > 0 && (
                <div className="py-4 border-t border-black/5 bg-[#fbf9f6] -mx-5 md:-mx-6 px-5 md:px-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-3">
                    From Your Favorites
                  </p>
                  <div className="space-y-2">
                    {fromFavorites.map((fragrance) => (
                      <div
                        key={fragrance.title}
                        className="flex items-center justify-between gap-3 bg-white border border-black/5 rounded-2xl p-2.5 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 rounded-xl bg-zinc-50 border border-black/5 overflow-hidden">
                            <Image
                              src={fragrance.images["10ml"] || fragrance.images["5ml"]}
                              alt={fragrance.title}
                              fill
                              className="object-contain p-1"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase text-[#4f4a52] truncate max-w-[140px]">
                              {fragrance.title}
                            </h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              From R{fragrance.prices["5ml"]}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => quickAddFromSection(fragrance, "minicart-favorites")}
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
              {recentRecs.length > 0 && (
                <div className="py-4 border-t border-black/5 bg-white -mx-5 md:-mx-6 px-5 md:px-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-3">
                    Recently Viewed
                  </p>

                  <div className="space-y-2">
                    {recentRecs.map((fragrance) => (
                      <div
                        key={fragrance.title}
                        className="flex items-center justify-between gap-3 bg-[#fbf9f6] border border-black/5 rounded-2xl p-2.5 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 rounded-xl bg-zinc-50 border border-black/5 overflow-hidden">
                            <Image
                              src={fragrance.images["10ml"] || fragrance.images["5ml"]}
                              alt={fragrance.title}
                              fill
                              className="object-contain p-1"
                              sizes="40px"
                            />
                          </div>

                          <div>
                            <h4 className="text-xs font-black uppercase text-[#4f4a52] truncate max-w-[140px]">
                              {fragrance.title}
                            </h4>

                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              From R{fragrance.prices["5ml"]}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => quickAddFromSection(fragrance, "minicart-recently-viewed")}
                          className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#4f4a52] hover:bg-[#3f3b42] px-3 py-1.5 rounded-full transition-all duration-200"
                        >
                          + Add 5ml
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completeYourCollection.length > 0 && (
                <div className="py-4 border-t border-black/5 bg-[#fbf9f6] -mx-5 md:-mx-6 px-5 md:px-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-3">
                    Complete Your Collection
                  </p>

                  <div className="space-y-2">
                    {completeYourCollection.map((fragrance) => (
                      <div
                        key={fragrance.title}
                        className="flex items-center justify-between gap-3 bg-white border border-black/5 rounded-2xl p-2.5 shadow-sm"
                      >
                        <div className="min-w-0">
                          <h4 className="text-xs font-black uppercase text-[#4f4a52] truncate">
                            {fragrance.title}
                          </h4>

                          {fragrance.recReason ? (
                            <p className="text-[10px] italic leading-4 text-zinc-400 truncate">
                              {fragrance.recReason}
                            </p>
                          ) : (
                            <p className="text-[10px] text-zinc-400">
                              {fragrance.profile}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => quickAddFromSection(fragrance, "minicart-complete-collection")}
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
        <div className="shrink-0 border-t border-black/10 px-5 pt-4 pb-5 md:px-6 md:pb-6">
          <button
            onClick={handleWhatsAppCheckout}
            disabled={!cart || cart.length === 0}
            className="w-full rounded-full bg-[#4f4a52] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-black hover:scale-[1.01] disabled:opacity-50"
          >
            Checkout via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}