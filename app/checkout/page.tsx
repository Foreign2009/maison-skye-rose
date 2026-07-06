"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";
import { trackCheckoutStarted, trackPaymentStarted } from "../lib/analytics";

const DELIVERY_RATES: Record<string, number> = {
  "Cape Town Metro":       100,
  "Western Cape Regional": 150,
  "Gauteng":               180,
  "KwaZulu-Natal":         180,
  "Other Major Cities":    200,
  "Outlying Areas":        300,
};

export default function CheckoutPage() {

  const { cart } = useCart();

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [province, setProvince] =
    useState("Cape Town Metro");

  const [loading, setLoading] =
    useState(false);

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  const delivery = DELIVERY_RATES[province] ?? 180;

  const total =
    subtotal +
    delivery;

  const handlePayment = async () => {

    try {

      setLoading(true);

      trackCheckoutStarted({
        itemCount: cart.length,
        cartTotal: total,
        deliveryMethod: province,
      });

      /* SAVE ORDER */
      const orderResponse =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customer_name:
                name,

              phone,

              address,

              province,

              items: cart,

              subtotal,

              delivery,

              total,
            }),
          }
        );

      const orderData =
        await orderResponse.json();

      console.log(
        "ORDER RESPONSE:",
        orderData
      );

      /* PAYFAST */
      const response =
        await fetch(
          "/api/payfast",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount: total,

              item_name:
                "Maison Skye & Rose Order",
            }),
          }
        );

      const data =
        await response.json();

      if (
        data.success &&
        data.paymentUrl
      ) {

        trackPaymentStarted({ amount: total });

        window.location.href =
          data.paymentUrl;

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-[#f5f1eb]">

      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-20">

        <h1 className="text-5xl font-black uppercase">

          Checkout

        </h1>

        <div className="mt-10 space-y-5">

          <div className="space-y-1.5">
            <label htmlFor="checkout-name" className="block text-sm font-semibold text-[#4f4a52]">
              Full Name
            </label>
            <input
              id="checkout-name"
              placeholder="e.g. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border p-5"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="checkout-phone" className="block text-sm font-semibold text-[#4f4a52]">
              Phone Number
            </label>
            <input
              id="checkout-phone"
              placeholder="e.g. 082 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border p-5"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="checkout-address" className="block text-sm font-semibold text-[#4f4a52]">
              Delivery Address
            </label>
            <textarea
              id="checkout-address"
              placeholder="Street address, suburb, city"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-2xl border p-5"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="checkout-province" className="block text-sm font-semibold text-[#4f4a52]">
              Delivery Area
            </label>
            <select
              id="checkout-province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-2xl border p-5"
            >
              <option>Cape Town Metro</option>
              <option>Western Cape Regional</option>
              <option>Gauteng</option>
              <option>KwaZulu-Natal</option>
              <option>Other Major Cities</option>
              <option>Outlying Areas</option>
            </select>
          </div>

        </div>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

          <div className="flex justify-between">

            <span>
              Subtotal
            </span>

            <span>
              R{subtotal.toFixed(2)}
            </span>

          </div>

          <div className="mt-4 flex justify-between">

            <span>
              Delivery
            </span>

            <span>
              R{delivery.toFixed(2)}
            </span>

          </div>

          <div className="mt-6 flex justify-between border-t pt-6 text-2xl font-black">

            <span>
              Total
            </span>

            <span>
              R{total.toFixed(2)}
            </span>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-10 w-full rounded-full bg-[#4f4a52] py-5 font-bold text-white transition-all duration-300 hover:bg-black hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#4f4a52] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >

            {loading
              ? "Loading..."
              : "Secure Payment"}

          </button>

        </div>

      </section>

    </main>

  );
}