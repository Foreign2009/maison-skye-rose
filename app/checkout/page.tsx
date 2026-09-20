"use client";

import { useState, useRef, useEffect } from "react";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";
import { trackCheckoutStarted, trackRecommendationCheckoutAttributed } from "../lib/analytics";
import { getDiscoveryAttribution, clearDiscoveryAttribution } from "../lib/discoveryAttribution";
import { getRecommendationAttribution, clearRecommendationAttribution } from "../lib/recommendationAttribution";
import { COLLECTION_PROVINCE, computeDelivery } from "../lib/commerce/delivery";

// ── Attempt storage ───────────────────────────────────────────────────────────

const ATTEMPT_SS = "msr_checkout_attempt";

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SavedAttempt = {
  key:      string;
  name:     string;
  phone:    string;
  address:  string;
  province: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { cart, clearCart, cartTotal } = useCart();

  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [address,  setAddress]  = useState("");
  const [province, setProvince] = useState("Cape Town Metro");
  const [loading,  setLoading]  = useState(false);

  const [errors,            setErrors]            = useState<Record<string, string>>({});
  const [orderError,        setOrderError]        = useState("");
  const [showConflictPanel, setShowConflictPanel] = useState(false);

  // Synchronous guard — closes the narrow window between first click and the
  // React re-render that disables the button via the loading state.
  const submittingRef = useRef(false);

  // Attempt key — sole source of truth in memory; sessionStorage for reload
  // persistence. If sessionStorage is unavailable the key stays in memory
  // only (same-page retries are still keyed; reload recovery is unavailable).
  const attemptKeyRef = useRef<string | null>(null);

  // ── Attempt storage helpers ──────────────────────────────────────────────

  function readSavedAttempt(): SavedAttempt | null {
    try {
      const raw = sessionStorage.getItem(ATTEMPT_SS);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SavedAttempt;
      if (!parsed || typeof parsed.key !== "string") return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function writeSavedAttempt(a: SavedAttempt): void {
    attemptKeyRef.current = a.key;
    try {
      sessionStorage.setItem(ATTEMPT_SS, JSON.stringify(a));
    } catch {
      // sessionStorage unavailable — key survives in memory for this session.
    }
  }

  function clearSavedAttempt(): void {
    attemptKeyRef.current = null;
    try {
      sessionStorage.removeItem(ATTEMPT_SS);
    } catch { /* ignore */ }
  }

  // ── Mount: restore or initialise attempt ────────────────────────────────

  useEffect(() => {
    const saved = readSavedAttempt();

    if (saved) {
      if (UUID_V4_RE.test(saved.key)) {
        // Valid stored attempt — restore key and any saved form fields so
        // a reload after a failed submission can retry with the same fingerprint.
        attemptKeyRef.current = saved.key;
        if (saved.name)     setName(saved.name);
        if (saved.phone)    setPhone(saved.phone);
        if (saved.address)  setAddress(saved.address);
        if (saved.province) setProvince(saved.province);
      } else {
        // Stored key is not a valid UUID. Clear it and surface the conflict
        // panel — an earlier attempt may be unresolved.
        clearSavedAttempt();
        setShowConflictPanel(true);
      }
    } else {
      // No stored attempt — generate a fresh key for this session.
      const newKey = crypto.randomUUID();
      writeSavedAttempt({ key: newKey, name: "", phone: "", address: "", province: "Cape Town Metro" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal    = cartTotal; // wholesale-adjusted when active
  const isCollection = province === COLLECTION_PROVINCE;
  const delivery    = computeDelivery(province, subtotal);
  const total       = subtotal + delivery;

  function clearFieldError(field: string) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validateForm(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim())                                              next.name    = "Please enter your full name.";
    if (phone.trim().replace(/\D/g, "").length < 9)               next.phone   = "Please enter a valid phone number.";
    if (!isCollection && !address.trim())                         next.address = "Please enter your delivery address.";
    if (cart.length === 0)                                        next.cart    = "Your cart is empty.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /**
   * Starts a deliberate new order attempt after a conflict.
   *
   * Generates a fresh key. The customer must call this explicitly — the
   * conflict panel must not auto-rotate the key, as an earlier order may
   * have committed and the customer should confirm with us before proceeding.
   */
  function handleStartNewOrder(): void {
    const newKey = crypto.randomUUID();
    writeSavedAttempt({ key: newKey, name, phone, address, province });
    setShowConflictPanel(false);
    setOrderError("");
  }

  const handlePayment = async () => {
    if (submittingRef.current) return;
    setOrderError("");
    setShowConflictPanel(false);
    if (!validateForm()) return;

    // Require a valid key before sending — never submit keyless.
    // If the key is absent (e.g. mount effect has not run or storage failed
    // and no in-memory fallback exists), show an error and abort.
    const attemptKey = attemptKeyRef.current;
    if (!attemptKey) {
      setOrderError(
        "Your checkout session could not be initialized. Please refresh the page and try again.",
      );
      return;
    }

    submittingRef.current = true;
    try {
      setLoading(true);

      trackCheckoutStarted({
        itemCount:      cart.length,
        cartTotal:      total,
        deliveryMethod: province,
      });

      const recAttribution = getRecommendationAttribution();
      if (recAttribution) {
        trackRecommendationCheckoutAttributed({
          surface: recAttribution.surface,
          slug:    recAttribution.slug,
          ageMs:   Date.now() - recAttribution.setAt,
        });
      }

      // Persist the full intent together with the key before sending the
      // request. If the response is lost and the page reloads, this state
      // is restored so the retry can be submitted with a matching fingerprint.
      writeSavedAttempt({ key: attemptKey, name, phone, address, province });

      const discoveryContext = getDiscoveryAttribution();

      const orderResponse = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          customer_name: name,
          phone,
          address,
          province,
          items:    cart,
          subtotal,
          delivery,
          total,
          ...(discoveryContext ? { discovery_context: discoveryContext } : {}),
          checkout_attempt_key: attemptKey,
        }),
      });

      const orderData = await orderResponse.json() as {
        success:    boolean;
        orderRef?:  string;
        message?:   string;
        recovered?: boolean;
      };

      if (orderData.success && orderData.orderRef) {
        // Normal insert or silent recovery of a previous attempt.
        clearDiscoveryAttribution();
        clearRecommendationAttribution();
        // Clear the attempt record — the order is confirmed.
        // Generate a fresh in-memory key in case navigation fails and the
        // user needs to place another order without reloading.
        clearSavedAttempt();
        const freshKey = crypto.randomUUID();
        attemptKeyRef.current = freshKey;

        try {
          localStorage.setItem(
            `msr_purchase_pending_${orderData.orderRef}`,
            JSON.stringify(cart.map((item) => item.id)),
          );
        } catch { /* localStorage unavailable */ }
        clearCart();
        window.location.href = `/payment-success?ref=${encodeURIComponent(orderData.orderRef)}`;

      } else if (orderResponse.status === 409) {
        // An earlier order with this key may already exist.
        // Do NOT auto-rotate the key — the customer must confirm with us or
        // deliberately start a new separate order.
        setShowConflictPanel(true);

      } else {
        setOrderError(
          orderData.message ?? "We could not process your order. Please try again.",
        );
      }

    } catch {
      setOrderError(
        "A connection error occurred. Your order may have been placed — please contact us to confirm before trying again.",
      );
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 pt-32 md:pt-36 pb-20">

        <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4]">
          Your Maison Order
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] text-[#4f4a52]">
          Complete Your Order
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#7b7480]">
          Enter your details below. We&apos;ll handle your order with care and be in touch to confirm.
        </p>

        <div className="mt-12 space-y-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#9b9298]">
            Delivery Details
          </p>

          <div className="space-y-1.5">
            <label htmlFor="checkout-name" className="block text-sm font-semibold text-[#4f4a52]">
              Full Name
            </label>
            <input
              id="checkout-name"
              placeholder="e.g. Jane Smith"
              value={name}
              onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
              className={`w-full rounded-2xl border p-5 transition-colors ${errors.name ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="checkout-phone" className="block text-sm font-semibold text-[#4f4a52]">
              Phone Number
            </label>
            <input
              id="checkout-phone"
              placeholder="e.g. 082 123 4567"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); clearFieldError("phone"); }}
              className={`w-full rounded-2xl border p-5 transition-colors ${errors.phone ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {!isCollection && (
            <div className="space-y-1.5">
              <label htmlFor="checkout-address" className="block text-sm font-semibold text-[#4f4a52]">
                Delivery Address
              </label>
              <textarea
                id="checkout-address"
                placeholder="Street address, suburb, city"
                value={address}
                onChange={(e) => { setAddress(e.target.value); clearFieldError("address"); }}
                className={`w-full rounded-2xl border p-5 transition-colors ${errors.address ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>
          )}

          {isCollection && (
            <div className="rounded-2xl border border-gray-200 bg-[#f5f1eb]/50 p-5">
              <p className="text-sm text-[#7b7480]">
                Our team will confirm collection arrangements when they process your order.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="checkout-province" className="block text-sm font-semibold text-[#4f4a52]">
              Delivery Area / Collection
            </label>
            <select
              id="checkout-province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 p-5"
            >
              <option>Cape Town Metro</option>
              <option>Western Cape Regional</option>
              <option>Gauteng</option>
              <option>KwaZulu-Natal</option>
              <option>Other Major Cities</option>
              <option>Outlying Areas</option>
              <option>Collection / Pickup</option>
            </select>
          </div>

          {errors.cart && <p className="text-sm text-red-500">{errors.cart}</p>}

        </div>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

          <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
            Order Summary
          </p>

          <div className="mt-6 flex justify-between">
            <span>Subtotal</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>

          <div className="mt-4 flex justify-between">
            <span>{isCollection ? "Collection" : "Delivery"}</span>
            <span>{delivery === 0 ? "FREE" : `R${delivery.toFixed(2)}`}</span>
          </div>

          <div className="mt-6 flex justify-between border-t pt-6 text-2xl font-black">
            <span>Total</span>
            <span>R{total.toFixed(2)}</span>
          </div>

          {orderError && (
            <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
              {orderError}
            </p>
          )}

          {showConflictPanel && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-[#d89ca4] bg-[#fdf8f9] px-5 py-4"
            >
              <p className="text-sm font-semibold text-[#4f4a52]">
                An earlier order may already exist.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#7b7480]">
                Please contact us to confirm before placing a separate order. If
                you are certain no earlier order was placed, you may start a new
                one below.
              </p>
              <button
                onClick={handleStartNewOrder}
                className="mt-3 rounded-full border border-[#4f4a52] bg-transparent px-4 py-2 text-xs font-semibold text-[#4f4a52] transition-colors hover:bg-[#4f4a52] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4f4a52] focus:ring-offset-2"
              >
                Start a separate new order
              </button>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-10 w-full rounded-full bg-[#4f4a52] py-5 font-bold text-white transition-all duration-300 hover:bg-black hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#4f4a52] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <p className="mt-5 text-center text-xs leading-relaxed text-[#9b9298]">
            Your order is confirmed the moment it&apos;s placed. We&apos;ll be in touch to confirm and arrange delivery with care.
          </p>

        </div>

      </section>
    </main>
  );
}
