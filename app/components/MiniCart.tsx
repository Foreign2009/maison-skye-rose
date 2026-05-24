"use client";

import { useCart } from "../context/CartContext";

export default function MiniCart() {

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  const vat = subtotal * 0.15;

  const delivery =
    cart.length > 0 ? 100 : 0;

  const total =
    subtotal + vat + delivery;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] rounded-[32px] bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.18)]">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Maison Skye & Rose
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase">
            Your Bag
          </h2>

        </div>

      </div>

      <div className="mt-6 max-h-[320px] space-y-4 overflow-y-auto pr-2">

        {cart.length === 0 && (

          <div className="rounded-3xl bg-[#f5f1eb] p-8 text-center">

            <p className="text-sm text-zinc-500">
              Your bag is empty.
            </p>

          </div>

        )}

        {cart.map((item, index) => (

          <div
            key={index}
            className="flex items-center gap-4 rounded-3xl border border-black/5 p-4"
          >

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f5f1eb]">

              <img
                src={item.image}
                alt={item.title}
                className="h-14 object-contain"
              />

            </div>

            <div className="flex-1">

              <h3 className="text-sm font-black uppercase">
                {item.title}
              </h3>

              <p className="mt-2 font-black text-[#b67d73]">
                R{item.price}
              </p>

              <div className="mt-3 flex items-center gap-3">

                <button
                  onClick={() =>
                    decreaseQuantity(item.title)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"
                >
                  -
                </button>

                <span className="text-sm font-bold">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(item.title)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"
                >
                  +
                </button>

                <button
                  onClick={() =>
                    removeFromCart(item.title)
                  }
                  className="ml-auto text-xs uppercase tracking-[0.2em] text-red-500"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-6 border-t border-black/10 pt-6">

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>R{subtotal.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span>VAT (15%)</span>
          <span>R{vat.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span>Delivery</span>
          <span>R{delivery.toFixed(2)}</span>
        </div>

        <div className="mt-5 flex justify-between border-t border-black/10 pt-5">

          <span className="text-2xl font-black uppercase">
            Total
          </span>

          <span className="text-2xl font-black">
            R{total.toFixed(2)}
          </span>

        </div>

        <button className="mt-6 w-full rounded-full bg-black px-6 py-5 text-xs uppercase tracking-[0.35em] text-white transition duration-300 hover:scale-[1.02]">
          Checkout on WhatsApp
        </button>

      </div>

    </div>
  );
}