"use client";

import { useCart } from "../context/CartContext";

export default function MobileBar() {

  const {
    cart,
    setCartOpen,
  } = useCart();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-black/5 bg-white/90 px-6 py-4 shadow-2xl backdrop-blur-xl md:hidden">

      {/* HOME */}
      <a
        href="/"
        className="text-xs uppercase tracking-[0.2em] text-zinc-700"
      >
        Home
      </a>

      {/* SEARCH */}
      <a
        href="#"
        className="text-xs uppercase tracking-[0.2em] text-zinc-700"
      >
        Search
      </a>

      {/* CART */}
      <button
        onClick={() => setCartOpen(true)}
        className="rounded-full bg-black px-5 py-3 text-xs uppercase tracking-[0.2em] text-white"
      >
        Bag ({cart.length})
      </button>

    </div>
  );
}