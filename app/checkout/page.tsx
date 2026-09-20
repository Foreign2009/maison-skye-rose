"use client";

import { useState, useRef, useEffect } from "react";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";
import { trackCheckoutStarted, trackRecommendationCheckoutAttributed } from "../lib/analytics";
import { getDiscoveryAttribution, clearDiscoveryAttribution } from "../lib/discoveryAttribution";
import { getRecommendationAttribution, clearRecommendationAttribution } from "../lib/recommendationAttribution";
import { COLLECTION_PROVINCE, computeDelivery } from "../lib/commerce/delivery";

// ── Attempt storage ───────────────────────────────────────────────────────────

const ATTEMPT_SS  = "msr_checkout_attempt";
// Persists a "potentially unresolved" signal across reloads when the stored
// attempt record is found to be malformed or invalid on mount. Cleared only
// when the user explicitly starts a new order or a submission succeeds.
const CONFLICT_SS = "msr_checkout_conflict";

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CanonicalItem = { id: string; size: string; quantity: number };

type SavedAttempt = {
  key:       string;
  name:      string;
  phone:     string;
  address:   string;
  province:  string;
  items:     CanonicalItem[];
  // True once the first request has been sent. The snapshot (all other fields)
  // is immutable once submitted — subsequent form edits are never written back.
  submitted: boolean;
};

type AttemptState =
  | { kind: "ok";                 attempt: SavedAttempt }
  | { kind: "missing"  }          // nothing stored; fresh session
  | { kind: "corrupted" }         // stored data is unreadable or invalid
  | { kind: "storage-unavailable" }; // sessionStorage throws on any access

// ── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { cart, clearCart, cartTotal } = useCart();

  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [address,  setAddress]  = useState("");
  const [province, setProvince] = useState("Cape Town Metro");
  const [loading,  setLoading]  = useState(false);

  const [errors,             setErrors]             = useState<Record<string, string>>({});
  const [orderError,         setOrderError]          = useState("");
  // 409 conflict — prior order may already exist; user must contact us or
  // explicitly start a new separate order.
  const [showConflictPanel,  setShowConflictPanel]   = useState(false);
  // Blocking conflict — stored state is corrupted; prior attempt may be
  // unresolved. Only handleStartNewOrder may clear this.
  const [showBlockingConflict, setShowBlockingConflict] = useState(false);

  // Synchronous guard — closes the narrow window between first click and the
  // React re-render that disables the button via the loading state.
  const submittingRef = useRef(false);

  // Attempt key — sole in-memory source of truth; sessionStorage for reload
  // persistence. If sessionStorage is unavailable the key lives only in
  // memory (same-page retries are still keyed; reload recovery is not).
  const attemptKeyRef = useRef<string | null>(null);

  // ── Storage helpers ────────────────────────────────────────────────────────

  function isValidSavedAttempt(v: unknown): boolean {
    if (!v || typeof v !== "object") return false;
    const a = v as Record<string, unknown>;
    return (
      typeof a.key      === "string" && UUID_V4_RE.test(a.key) &&
      typeof a.name     === "string" &&
      typeof a.phone    === "string" &&
      typeof a.address  === "string" &&
      typeof a.province === "string"
      // submitted and items are optional for P8b compatibility
    );
  }

  function normalizeAttempt(raw: Record<string, unknown>): SavedAttempt {
    const items: CanonicalItem[] = [];
    if (Array.isArray(raw.items)) {
      for (const entry of raw.items as unknown[]) {
        if (entry && typeof entry === "object") {
          const i = entry as Record<string, unknown>;
          if (
            typeof i.id       === "string" &&
            typeof i.size     === "string" &&
            typeof i.quantity === "number"
          ) {
            items.push({ id: i.id, size: i.size, quantity: i.quantity });
          }
        }
      }
    }
    const submitted =
      typeof raw.submitted === "boolean"
        ? raw.submitted
        : items.length > 0; // P8b records: infer from whether items were saved
    return {
      key:      (raw.key as string).toLowerCase(),
      name:     raw.name     as string,
      phone:    raw.phone    as string,
      address:  raw.address  as string,
      province: raw.province as string,
      items,
      submitted,
    };
  }

  function readAttemptState(): AttemptState {
    try {
      const raw = sessionStorage.getItem(ATTEMPT_SS);

      if (raw === null) {
        // No attempt record — but check for a persisted conflict flag left by
        // a previous load that found a corrupted record.
        const hasFlag = sessionStorage.getItem(CONFLICT_SS) !== null;
        return hasFlag ? { kind: "corrupted" } : { kind: "missing" };
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Malformed JSON — set the flag so corruption persists across reloads
        // even after the raw data may be overwritten.
        setConflictFlag();
        return { kind: "corrupted" };
      }

      if (!isValidSavedAttempt(parsed)) {
        setConflictFlag();
        return { kind: "corrupted" };
      }

      return { kind: "ok", attempt: normalizeAttempt(parsed as Record<string, unknown>) };

    } catch {
      // sessionStorage itself is unavailable (quota, SecurityError, etc.)
      return { kind: "storage-unavailable" };
    }
  }

  function setConflictFlag(): void {
    try { sessionStorage.setItem(CONFLICT_SS, "1"); } catch { /* ignore */ }
  }

  function writeSavedAttempt(a: SavedAttempt): void {
    attemptKeyRef.current = a.key;
    try {
      sessionStorage.setItem(ATTEMPT_SS, JSON.stringify(a));
      sessionStorage.removeItem(CONFLICT_SS); // clear stale conflict flag on valid write
    } catch { /* sessionStorage unavailable — key lives in memory only */ }
  }

  function clearSavedAttempt(): void {
    attemptKeyRef.current = null;
    try {
      sessionStorage.removeItem(ATTEMPT_SS);
      sessionStorage.removeItem(CONFLICT_SS);
    } catch { /* ignore */ }
  }

  // ── Mount: restore or initialise attempt ──────────────────────────────────

  useEffect(() => {
    const state = readAttemptState();

    if (state.kind === "ok") {
      attemptKeyRef.current = state.attempt.key;
      if (state.attempt.name)     setName(state.attempt.name);
      if (state.attempt.phone)    setPhone(state.attempt.phone);
      if (state.attempt.address)  setAddress(state.attempt.address);
      if (state.attempt.province) setProvince(state.attempt.province);

    } else if (state.kind === "missing") {
      const newKey = crypto.randomUUID();
      writeSavedAttempt({
        key: newKey, name: "", phone: "", address: "",
        province: "Cape Town Metro", items: [], submitted: false,
      });

    } else if (state.kind === "corrupted") {
      // Stored state exists but cannot be read or validated. A prior attempt
      // may be unresolved. Show the blocking panel — only handleStartNewOrder
      // may clear this; a plain refresh keeps the state visible.
      setShowBlockingConflict(true);

    }
    // storage-unavailable: key remains null until first submission, at which
    // point handlePayment generates a fresh key in memory.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal    = cartTotal;
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
   * Starts a deliberate new order attempt. This is the ONLY action that may
   * clear a blocking conflict (corrupted stored state) or a 409 conflict.
   * The customer must call this explicitly — no automatic rotation occurs.
   */
  function handleStartNewOrder(): void {
    const newKey = crypto.randomUUID();
    writeSavedAttempt({
      key: newKey, name, phone, address, province, items: [], submitted: false,
    });
    setShowConflictPanel(false);
    setShowBlockingConflict(false);
    setOrderError("");
  }

  const handlePayment = async () => {
    if (submittingRef.current) return;

    // If the blocking conflict panel is showing (corrupted session state),
    // the customer must contact us or start a new order before proceeding.
    if (showBlockingConflict) {
      setOrderError(
        "Please contact us or start a new order below before placing another order.",
      );
      return;
    }

    setOrderError("");
    setShowConflictPanel(false);
    if (!validateForm()) return;

    // Guarantee a valid key before sending — never submit keyless.
    let attemptKey = attemptKeyRef.current;
    if (!attemptKey) {
      // storage-unavailable path: generate a key in memory for this submission.
      const freshKey = crypto.randomUUID();
      attemptKeyRef.current = freshKey;
      attemptKey = freshKey;
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

      // Snapshot the intent before sending. Only the FIRST submission writes
      // to the stored record. Subsequent form edits never overwrite the snapshot
      // so the original intent remains available for retry after a reload.
      const currentState = readAttemptState();
      const isFirstSubmit =
        currentState.kind === "ok"     && !currentState.attempt.submitted ||
        currentState.kind === "missing";

      if (isFirstSubmit) {
        const canonicalItems: CanonicalItem[] = cart.map(i => ({
          id:       i.id,
          size:     i.size,
          quantity: i.quantity,
        }));
        writeSavedAttempt({
          key: attemptKey, name, phone, address, province,
          items:     canonicalItems,
          submitted: true,
        });
      }

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
        clearDiscoveryAttribution();
        clearRecommendationAttribution();
        clearSavedAttempt();

        // Generate a fresh in-memory key for any edge-case retry before navigation.
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
        // Do NOT auto-rotate the key — the customer must confirm or explicitly
        // start a new separate order.
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

          {showBlockingConflict && (
            <div
              role="alert"
              aria-live="assertive"
              className="mt-6 rounded-2xl border border-amber-400 bg-amber-50 px-5 py-4"
            >
              <p className="text-sm font-semibold text-[#4f4a52]">
                We could not read your session data — an earlier order may be unresolved.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#7b7480]">
                Please contact us before placing another order to avoid a duplicate.
                If you are certain no earlier order was placed, you may start a new one below.
              </p>
              <button
                onClick={handleStartNewOrder}
                className="mt-3 rounded-full border border-[#4f4a52] bg-transparent px-4 py-2 text-xs font-semibold text-[#4f4a52] transition-colors hover:bg-[#4f4a52] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4f4a52] focus:ring-offset-2"
              >
                Start a separate new order
              </button>
            </div>
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
