"use client";

import { useEffect } from "react";

import { useCart } from "../context/CartContext";

type CartDrawerProps = {
  onClose: () => void;
};

export default function CartDrawer({
  onClose,
}: CartDrawerProps) {

  const {
    cart,
  } = useCart();

  const subtotal =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.price *
          item.quantity,
      0
    );

  const vat =
    subtotal * 0.15;

  const delivery =
    subtotal > 0
      ? 100
      : 0;

  const total =
    subtotal +
    vat +
    delivery;

  // LOCK PAGE SCROLL
  useEffect(() => {

    const scrollY =
      window.scrollY;

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${scrollY}px`;

    document.body.style.left =
      "0";

    document.body.style.right =
      "0";

    document.body.style.width =
      "100%";

    return () => {

      document.body.style.position =
        "";

      document.body.style.top =
        "";

      document.body.style.left =
        "";

      document.body.style.right =
        "";

      document.body.style.width =
        "";

      window.scrollTo(
        0,
        scrollY
      );

    };

  }, []);

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm">

      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* DRAWER */}
      <div className="absolute right-0 top-0 flex h-screen w-full max-w-[480px] flex-col overflow-hidden bg-white shadow-[0_20px_80px_rgba(0,0,0,0.25)] animate-[slideInRight_0.4s_ease]">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-6">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Maison Skye & Rose
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase">
              Your Bag
            </h2>

          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition duration-300 hover:scale-105"
          >
            ✕
          </button>

        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto p-6">

          {cart.length === 0 ? (

            <div className="flex h-full items-center justify-center">

              <p className="text-zinc-500">
                Your bag is empty.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {cart.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="flex gap-4 rounded-[24px] border border-zinc-200 p-4 transition duration-300 hover:shadow-lg"
                  >

                    {/* IMAGE */}
                    <div className="flex h-24 w-24 items-center justify-center rounded-[18px] bg-[#f5f1eb]">

                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-[80px] object-contain"
                      />

                    </div>

                    {/* INFO */}
                    <div className="flex flex-1 flex-col justify-center">

                      <h3 className="text-lg font-bold uppercase leading-tight">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-500">
                        Quantity: {item.quantity}
                      </p>

                      <h4 className="mt-3 text-xl font-black text-[#b67d73]">
                        R{item.price}
                      </h4>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* FOOTER */}
        <div className="border-t border-zinc-200 bg-white p-6">

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                R{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>VAT (15%)</span>
              <span>
                R{vat.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                R{delivery.toFixed(2)}
              </span>
            </div>

          </div>

          {/* TOTAL */}
          <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-5">

            <h3 className="text-2xl font-black uppercase">
              Total
            </h3>

            <h3 className="text-2xl font-black">
              R{total.toFixed(2)}
            </h3>

          </div>

          {/* CHECKOUT */}
          <button className="mt-6 w-full rounded-full bg-black py-5 text-sm uppercase tracking-[0.25em] text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition duration-300 hover:scale-[1.02]">
            Checkout on WhatsApp
          </button>

        </div>

      </div>

    </div>
  );
}