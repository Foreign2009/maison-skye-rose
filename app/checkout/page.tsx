"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";
import { trackCheckoutStarted } from "../lib/analytics";
import { getDiscoveryAttribution, clearDiscoveryAttribution } from "../lib/discoveryAttribution";

const DELIVERY_RATES: Record<string, number> = {
  "Cape Town Metro":       100,
  "Western Cape Regional": 150,
  "Gauteng":               180,
  "KwaZulu-Natal":         180,
  "Other Major Cities":    200,
  "Outlying Areas":        300,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [address,  setAddress]  = useState("");
  const [province, setProvince] = useState("Cape Town Metro");
  const [loading,  setLoading]  = useState(false);

  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [orderError, setOrderError] = useState("");

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const delivery = DELIVERY_RATES[province] ?? 180;
  const total    = subtotal + delivery;

  function clearFieldError(field: string) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validateForm(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim())                                   next.name    = "Please enter your full name.";
    if (phone.trim().replace(/\D/g, "").length < 9)    next.phone   = "Please enter a valid phone number.";
    if (!address.trim())                                next.address = "Please enter your delivery address.";
    if (cart.length === 0)                              next.cart    = "Your cart is empty.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const handlePayment = async () => {
    setOrderError("");
    if (!validateForm()) return;

    try {
      setLoading(true);

      trackCheckoutStarted({
        itemCount:      cart.length,
        cartTotal:      total,
        deliveryMethod: province,
      });

      const discoveryContext = getDiscoveryAttribution();

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone,
          address,
          province,
          items:    cart,
          subtotal,
          delivery,
          total,
          ...(discoveryContext ? { discovery_context: discoveryContext } : {}),
        }),
      });

      const orderData = await orderResponse.json() as {
        success:   boolean;
        orderRef?: string;
        message?:  string;
      };

      if (orderData.success && orderData.orderRef) {
        clearDiscoveryAttribution();
        clearCart();
        router.push(
          `/payment-success?ref=${encodeURIComponent(orderData.orderRef)}&total=${total.toFixed(2)}`
        );
      } else {
        setOrderError(orderData.message ?? "We could not process your order. Please try again.");
      }

    } catch {
      setOrderError("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb]">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-20">

        <h1 className="text-5xl font-black uppercase">Checkout</h1>

        <div className="mt-10 space-y-5">

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

          <div className="space-y-1.5">
            <label htmlFor="checkout-province" className="block text-sm font-semibold text-[#4f4a52]">
              Delivery Area
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
            </select>
          </div>

          {errors.cart && <p className="text-sm text-red-500">{errors.cart}</p>}

        </div>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>

          <div className="mt-4 flex justify-between">
            <span>Delivery</span>
            <span>R{delivery.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex justify-between border-t pt-6 text-2xl font-black">
            <span>Total</span>
            <span>R{total.toFixed(2)}</span>
          </div>

          {orderError && (
            <p className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
              {orderError}
            </p>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-10 w-full rounded-full bg-[#4f4a52] py-5 font-bold text-white transition-all duration-300 hover:bg-black hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#4f4a52] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

        </div>

      </section>
    </main>
  );
}
