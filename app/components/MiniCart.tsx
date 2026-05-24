"use client";

import { useCart } from "../context/CartContext";

export default function MiniCart() {

  const {
    cart,
    cartOpen,
    setCartOpen,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const vat = subtotal * 0.15;

  const delivery =
    subtotal >= 500 ? 0 : 100;

  const total =
    subtotal + vat + delivery;

  const whatsappMessage = `
Hello Maison Skye & Rose,

I would like to place an order:

${cart
  .map(
    (item) =>
      `• ${item.title} (${item.size}) x${item.quantity} - R${
        item.price * item.quantity
      }`
  )
  .join("\n")}

Subtotal: R${subtotal.toFixed(2)}
VAT: R${vat.toFixed(2)}
Delivery: ${
    delivery === 0
      ? "FREE"
      : `R${delivery}`
  }

Total: R${total.toFixed(2)}

Customer Name:
Delivery Area:

Thank you.
`;

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() =>
          setCartOpen(false)
        }
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition duration-500 ${
          cartOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* DRAWER */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-white/20 bg-[#f5f1eb]/95 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all duration-500 ${
          cartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* HEADER */}
        <div className="border-b border-black/5 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Your Cart
              </p>

              <h2 className="mt-2 text-3xl font-black uppercase">
                Shopping Bag
              </h2>

            </div>

            <button
              onClick={() =>
                setCartOpen(false)
              }
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:scale-105"
            >
              ✕
            </button>

          </div>

        </div>

        {/* ITEMS */}
        <div className="flex-1 overflow-auto p-6">

          {cart.length === 0 ? (

            <div className="mt-20 text-center">

              <h3 className="text-2xl font-black uppercase">
                Cart Empty
              </h3>

              <p className="mt-5 text-base leading-8 text-zinc-500">
                Add fragrances to begin your
                Maison Skye & Rose journey.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {cart.map((item, index) => (

                <div
                  key={index}
                  className="rounded-[32px] border border-white/30 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition hover:shadow-lg"
                >

                  <div className="flex gap-4">

                    {/* IMAGE */}
                    <div className="flex h-[100px] w-[90px] items-center justify-center rounded-[22px] bg-[#f3efe8]">

                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-contain"
                        style={{
                          height: "80px",
                          width: "auto",
                        }}
                      />

                    </div>

                    {/* INFO */}
                    <div className="flex flex-1 flex-col justify-between">

                      <div>

                        <h3 className="text-lg font-bold leading-6">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-500">
                          {item.size}
                        </p>

                      </div>

                      <div className="flex items-center justify-between">

                        <p className="text-2xl font-black text-[#b67d73]">
                          R
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>

                        <button
                          onClick={() =>
                            removeFromCart(
                              item.title,
                              item.size
                            )
                          }
                          className="text-xs uppercase tracking-[0.15em] text-zinc-500 transition hover:text-black"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* QUANTITY */}
                  <div className="mt-5 flex items-center justify-between">

                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Quantity
                    </p>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.title,
                            item.size
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ece7df] text-lg transition hover:scale-105"
                      >
                        −
                      </button>

                      <span className="w-6 text-center text-sm font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.title,
                            item.size
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg text-white transition hover:scale-105"
                      >
                        +
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* FOOTER */}
        <div className="border-t border-black/5 bg-white/50 p-6 backdrop-blur-xl">

          <div className="mb-8 space-y-4">

            <div className="flex items-center justify-between">

              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                Subtotal
              </p>

              <p className="text-lg font-bold">
                R{subtotal.toFixed(2)}
              </p>

            </div>

            <div className="flex items-center justify-between">

              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                VAT (15%)
              </p>

              <p className="text-lg font-bold">
                R{vat.toFixed(2)}
              </p>

            </div>

            <div className="flex items-center justify-between">

              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                Delivery
              </p>

              <p className="text-lg font-bold">
                {delivery === 0
                  ? "FREE"
                  : `R${delivery}`}
              </p>

            </div>

            <div className="flex items-center justify-between border-t border-black/10 pt-5">

              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                Total
              </p>

              <h3 className="text-3xl font-black text-[#b67d73]">
                R{total.toFixed(2)}
              </h3>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="space-y-4">

            <a
              href={`https://wa.me/27700000000?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              target="_blank"
              className="block w-full rounded-full bg-black px-8 py-5 text-center text-sm uppercase tracking-[0.25em] text-white transition duration-300 hover:scale-[1.02]"
            >
              Checkout on WhatsApp
            </a>

            <button
              onClick={clearCart}
              className="w-full rounded-full border border-black/10 bg-white px-8 py-5 text-sm uppercase tracking-[0.25em] text-zinc-700 transition hover:bg-black hover:text-white"
            >
              Clear Cart
            </button>

          </div>

        </div>

      </div>

    </>
  );
}