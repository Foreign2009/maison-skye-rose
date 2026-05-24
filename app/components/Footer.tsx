export default function Footer() {

  return (
    <footer className="border-t border-black/5 bg-white px-6 py-20">

      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-4">

        {/* BRAND */}
        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Maison
          </p>

          <h2 className="text-4xl font-black uppercase tracking-[-0.04em]">
            Skye & Rose
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-600">
            Luxury-inspired fragrances designed for confidence,
            lifestyle, travel, nightlife, and everyday elegance.
          </p>

        </div>

        {/* SHOP */}
        <div>

          <p className="mb-5 text-sm uppercase tracking-[0.25em] text-zinc-500">
            Shop
          </p>

          <div className="flex flex-col gap-4 text-sm text-zinc-700">

            <a href="/shop" className="transition hover:text-black">
              All Fragrances
            </a>

            <a href="/#new-arrivals" className="transition hover:text-black">
              New Arrivals
            </a>

            <a href="/#collections" className="transition hover:text-black">
              Collections
            </a>

            <a href="/faq" className="transition hover:text-black">
              FAQ
            </a>

          </div>

        </div>

        {/* CONTACT */}
        <div>

          <p className="mb-5 text-sm uppercase tracking-[0.25em] text-zinc-500">
            Contact
          </p>

          <div className="flex flex-col gap-4 text-sm text-zinc-700">

            <a
              href="https://wa.me/27700000000"
              target="_blank"
              className="transition hover:text-black"
            >
              WhatsApp Orders
            </a>

            <a
              href="mailto:orders@maisonskyerose.com"
              className="transition hover:text-black"
            >
              Email Support
            </a>

          </div>

        </div>

        {/* INFO */}
        <div>

          <p className="mb-5 text-sm uppercase tracking-[0.25em] text-zinc-500">
            Information
          </p>

          <div className="flex flex-col gap-4 text-sm text-zinc-700">

            <a href="/about" className="transition hover:text-black">
              About Us
            </a>

            <a href="/shipping" className="transition hover:text-black">
              Shipping Policy
            </a>

            <a href="/returns" className="transition hover:text-black">
              Returns Policy
            </a>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-4 border-t border-black/5 pt-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">

        <p>
          © 2026 Maison Skye & Rose. All rights reserved.
        </p>

        <p>
          Luxury Fragrance Lifestyle.
        </p>

      </div>

    </footer>
  );
}