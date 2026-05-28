"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";

import { useCart } from "../context/CartContext";

export default function CheckoutPage() {

  const { cart } = useCart();

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [province, setProvince] =
    useState("Western Cape");

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

  const vat =
    subtotal * 0.15;

  const delivery =
    province ===
    "Western Cape"
      ? 100
      : 180;

  const total =
    subtotal +
    vat +
    delivery;

  const handlePayment = async () => {

    try {

      setLoading(true);

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

              vat,

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

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full rounded-2xl border p-5"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="w-full rounded-2xl border p-5"
          />

          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            className="w-full rounded-2xl border p-5"
          />

          <select
            value={province}
            onChange={(e) =>
              setProvince(
                e.target.value
              )
            }
            className="w-full rounded-2xl border p-5"
          >

            <option>
              Western Cape
            </option>

            <option>
              Gauteng
            </option>

            <option>
              KwaZulu-Natal
            </option>

          </select>

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
              VAT
            </span>

            <span>
              R{vat.toFixed(2)}
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
            className="mt-10 w-full rounded-full bg-black py-5 text-white"
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