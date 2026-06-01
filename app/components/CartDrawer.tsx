"use client";

import Image from "next/image";
import { useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {

  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const vat = cartTotal * 0.15;

  const [deliveryArea, setDeliveryArea] = useState("Collection / Pickup");
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const deliveryRates = {
    "Collection / Pickup": 0,
    "Cape Town Metro": 100,
    "Western Cape Regional": 150,
    Johannesburg: 180,
    Durban: 180,
    "Other Major Cities": 200,
    "Outlying Areas": 300,
  };

  const delivery =
    cartTotal > 0
      ? deliveryRates[deliveryArea as keyof typeof deliveryRates]
      : 0;

  const finalTotal = cartTotal + vat + delivery;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99998] bg-black/30 backdrop-blur-sm"
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 240,
            }}
            className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-md flex-col overflow-hidden border-l border-white/30 bg-white/80 shadow-[0_0_80px_rgba(0,0,0,0.12)] backdrop-blur-[30px]"
          >
            {/* GLOW */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-10 top-0 h-52 w-52 rounded-full bg-pink-300/20 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl" />
            </div>

            {/* HEADER */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/40 px-6 py-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a8490]">
                  Maison Skye & Rose
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#4f4a52]">
                  Your Bag
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-md"
              >
                ✕
              </button>
            </div>

            {/* ITEMS */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-blue-100 text-4xl">
                    🛍
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-[#4f4a52]">Your bag is empty</h3>
                  <p className="mt-3 max-w-xs text-[#7b7480]">Discover your next signature fragrance.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="rounded-[30px] border border-white/40 bg-white/70 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[20px]"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-28 w-28 items-center justify-center rounded-[24px] bg-gradient-to-br from-pink-50 to-blue-50">
                          <Image
                            src={item.image || "/images/pink-10ml.png"}
                            alt={item.title || "Fragrance"}
                            width={100}
                            height={100}
                            className="object-contain"
                            style={{ width: "auto", height: "100px" }}
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b67d86]">{item.size}</p>
                            <h3 className="mt-1 text-lg font-black leading-tight text-[#4f4a52]">{item.title}</h3>
                            <p className="mt-2 text-sm text-[#7b7480]">R{item.price.toFixed(2)}</p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => decreaseQuantity(item.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f6f7] font-bold"
                              >
                                -
                              </button>
                              <span className="font-bold text-[#4f4a52]">{item.quantity}</span>
                              <button
                                onClick={() => increaseQuantity(item.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f6f7] font-bold"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm font-semibold text-[#ff7b9d]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="relative z-10 border-t border-white/40 bg-white/70 p-6 backdrop-blur-[20px]">
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-[#4f4a52]">
                    Delivery Method
                  </label>
                  <select
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm"
                  >
                    <option>Collection / Pickup</option>
                    <option>Cape Town Metro</option>
                    <option>Western Cape Regional</option>
                    <option>Johannesburg</option>
                    <option>Durban</option>
                    <option>Other Major Cities</option>
                    <option>Outlying Areas</option>
                  </select>

                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 p-4"
                    />
                    <input
                      type="text"
                      placeholder="Contact Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 p-4"
                    />
                    {deliveryArea !== "Collection / Pickup" && (
                      <textarea
                        placeholder="Delivery Address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={3}
                        className="w-full rounded-2xl border border-gray-200 p-4"
                      />
                    )}
                  </div>
                </div>

                {/* TOTALS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-[#7b7480]">
                    <span>Subtotal</span>
                    <span>R{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#7b7480]">
                    <span>VAT (15%)</span>
                    <span>R{vat.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#7b7480]">
                    <span>Delivery</span>
                    <span>R{delivery.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-[28px] bg-gradient-to-r from-pink-50 to-blue-50 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-[#7b7480]">Total</span>
                    <span className="text-3xl font-black text-[#4f4a52]">R{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!customerName.trim()) { alert("Please enter your full name"); return; }
                    if (!contactNumber.trim()) { alert("Please enter your contact number"); return; }
                    if (deliveryArea !== "Collection / Pickup" && !deliveryAddress.trim()) { alert("Please enter your delivery address"); return; }

                    const orderLines = cart
                      .map((item) => `• ${item.title} (${item.size}) x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`)
                      .join("\n");

                    const message = `🌹 Maison Skye & Rose Order

Customer:
${customerName}

Contact Number:
${contactNumber}

Delivery Method:
${deliveryArea}

${deliveryArea !== "Collection / Pickup" ? `Delivery Address:
${deliveryAddress}

` : ""}

Items:

${orderLines}

Subtotal: R${cartTotal.toFixed(2)}
VAT (15%): R${vat.toFixed(2)}
Delivery: R${delivery.toFixed(2)}

Total: R${finalTotal.toFixed(2)}
`;
                    window.open(`https://wa.me/27696863952?text=${encodeURIComponent(message)}`, "_blank");
                    onClose();
                  }}
                  className="mt-5 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-blue-400 py-5 text-lg font-bold text-white shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
                >
                  Checkout on WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}