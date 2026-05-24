"use client";

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
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (!open) {
    return null;
  }

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  const vat =
    subtotal * 0.15;

  const delivery =
    cart.length > 0
      ? 100
      : 0;

  const total =
    subtotal +
    vat +
    delivery;

  const whatsappMessage =
    encodeURIComponent(
      `
Maison Skye & Rose Order

${cart
  .map(
    (item) =>
      `${item.title}
Qty: ${item.quantity}
Price: R${item.price}`
  )
  .join("\n\n")}

Subtotal: R${subtotal.toFixed(2)}
VAT: R${vat.toFixed(2)}
Delivery: R${delivery.toFixed(2)}

Total: R${total.toFixed(2)}
`
    );

  return (
    <>

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* DRAWER */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#f5f1eb] shadow-[0_0_80px_rgba(0,0,0,0.35)] animate-[slideIn_0.35s_ease]">

        {/* HEADER */}
        <div className="border-b border-black/10 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Maison Skye & Rose
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase">
                Your Bag
              </h2>

            </div>

            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition duration-300 hover:scale-105"
            >
              ✕
            </button>

          </div>

        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-6">

          {cart.length === 0 ? (

            <div className="flex h-full flex-col items-center justify-center text-center">

              <div className="rounded-full bg-white p-8 shadow-lg">

                <span className="text-5xl">
                  🛍️
                </span>

              </div>

              <h3 className="mt-8 text-2xl font-black uppercase">
                Your Bag Is Empty
              </h3>

              <p className="mt-4 max-w-sm leading-7 text-zinc-600">
                Discover luxury-inspired fragrances crafted for confidence,
                travel, nightlife, and everyday elegance.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {cart.map((item, index) => (

                <div
                  key={index}
                  className="rounded-[30px] bg-white p-4 shadow-sm"
                >

                  <div className="flex gap-4">

                    {/* IMAGE */}
                    <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-[#ece7df]">

                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 object-contain"
                      />

                    </div>

                    {/* INFO */}
                    <div className="flex flex-1 flex-col">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <h3 className="text-sm font-black uppercase leading-5">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm text-[#b67d73]">
                            R{item.price}
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.title)
                          }
                          className="text-sm text-red-500 transition hover:opacity-70"
                        >
                          ✕
                        </button>

                      </div>

                      {/* QUANTITY */}
                      <div className="mt-auto flex items-center gap-3 pt-5">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.title)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"
                        >
                          -
                        </button>

                        <span className="w-6 text-center font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.title)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* FOOTER */}
        {cart.length > 0 && (

          <div className="border-t border-black/10 bg-white p-6">

            {/* TOTALS */}
            <div className="space-y-3">

              <div className="flex justify-between text-sm">

                <span className="text-zinc-500">
                  Subtotal
                </span>

                <span>
                  R{subtotal.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-zinc-500">
                  VAT (15%)
                </span>

                <span>
                  R{vat.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-zinc-500">
                  Delivery
                </span>

                <span>
                  R{delivery.toFixed(2)}
                </span>

              </div>

            </div>

            {/* TOTAL */}
            <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-6">

              <h3 className="text-2xl font-black uppercase">
                Total
              </h3>

              <p className="text-2xl font-black">
                R{total.toFixed(2)}
              </p>

            </div>

            {/* WHATSAPP */}
            <a
              href={`https://wa.me/27841234567?text=${whatsappMessage}`}
              target="_blank"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-black py-5 text-xs uppercase tracking-[0.3em] text-white shadow-[0_15px_40px_rgba(0,0,0,0.25)] transition duration-300 hover:scale-[1.02]"
            >
              Checkout On WhatsApp
            </a>

          </div>

        )}

      </div>

    </>
  );
}