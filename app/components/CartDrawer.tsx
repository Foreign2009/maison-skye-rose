"use client";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {

  if (!open) {
    return null;
  }

  return (
    <>

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* DRAWER */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-black/10 p-6">

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
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white"
          >
            ✕
          </button>

        </div>

        {/* EMPTY */}
        <div className="flex flex-1 items-center justify-center p-6">

          <p className="text-zinc-500">
            Your cart is empty.
          </p>

        </div>

      </div>

    </>
  );
}