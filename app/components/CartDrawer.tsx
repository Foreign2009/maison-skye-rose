"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
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

  const [showDetails, setShowDetails] = useState(false);

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

  const handleWhatsAppOrder = () => {
    if (!customerName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!contactNumber.trim()) {
      alert("Please enter your contact number.");
      return;
    }

    if (deliveryArea !== "Collection / Pickup" && !deliveryAddress.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    const phoneNumber = "27696863952";

    const itemsList = cart
      .map((item) => `• ${item.title} (${item.size}) x${item.quantity}`)
      .join("\n");

    const message = `Maison Skye & Rose Order

Customer:
${customerName}

Contact:
${contactNumber}

Delivery Area:
${deliveryArea}

Items:
${itemsList}

Subtotal: R${cartTotal.toFixed(2)}
VAT: R${vat.toFixed(2)}
Delivery: R${delivery.toFixed(2)}

Total: R${finalTotal.toFixed(2)}
${
      deliveryArea !== "Collection / Pickup"
        ? `

Delivery Address:
${deliveryAddress}`
        : ""
}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99998] bg-black/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-md flex-col overflow-hidden border-l border-white/30 bg-white/80 shadow-[0_0_80px_rgba(0,0,0,0.12)] backdrop-blur-[30px]"
          >
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

            {/* CART ITEMS */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4 pb-[230px]">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 to-blue-100 text-4xl">
                    🛍
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-[#4f4a52]">
                    Your bag is empty
                  </h3>

                  <p className="mt-3 max-w-xs text-[#7b7480]">
                    Discover your next signature fragrance.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="rounded-[24px] border border-white/40 bg-white/70 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-[20px]"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-gradient-to-br from-pink-50 to-blue-50">
                          <Image
                            src={item.image || "/images/pink-10ml.png"}
                            alt={item.title || "Fragrance"}
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b67d86]">
                              {item.size}
                            </p>

                            <h3 className="mt-1 text-lg font-black leading-tight text-[#4f4a52]">
                              {item.title}
                            </h3>

                            <p className="mt-2 text-sm text-[#7b7480]">
                              R{item.price.toFixed(2)}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => decreaseQuantity(item.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f6f7] font-bold"
                              >
                                -
                              </button>

                              <span className="font-bold text-[#4f4a52]">
                                {item.quantity}
                              </span>

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
              <div className="relative z-10 border-t border-white/40 bg-white/50 px-6 py-4 backdrop-blur-xl">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mb-3 flex w-full items-center justify-between text-xs font-bold uppercase tracking-[0.25em] text-[#4f4a52]"
                >
                  <span>Delivery Details</span>
                  <span>{showDetails ? "−" : "+"}</span>
                </button>

                {showDetails && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none"
                    />

                    <input
                      type="tel"
                      placeholder="Contact Number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none"
                    />

                    <select
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none"
                    >
                      {Object.keys(deliveryRates).map((area) => (
                        <option key={area}>{area}</option>
                      ))}
                    </select>

                    {deliveryArea !== "Collection / Pickup" && (
                      <textarea
                        placeholder="Delivery Address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none"
                        rows={2}
                      />
                    )}
                  </div>
                )}

                <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R{cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span>VAT (15%)</span>
                    <span>R{vat.toFixed(2)}</span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>R{delivery.toFixed(2)}</span>
                  </div>

                  <div className="mt-3 flex justify-between border-t pt-3 text-lg font-black text-[#4f4a52]">
                    <span>Total</span>
                    <span>R{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <p className="mt-2 text-center text-[11px] text-[#7b7480]">
                  Secure ordering through WhatsApp
                </p>

                <button
                  onClick={handleWhatsAppOrder}
                  className="mt-3 w-full rounded-full bg-gradient-to-r from-pink-400 to-blue-400 py-3 font-bold text-white shadow-lg transition hover:brightness-105"
                >
                  Send Order to WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}