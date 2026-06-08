"use client";

import Link from "next/link";

export default function WholesalePage() {
  return (
    <main className="min-h-screen bg-[#faf7f5]">
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">
            Maison Skye & Rose
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-[-0.06em] text-[#4f4a52]">
            Become A Stockist
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[#7b7480] leading-8">
            Bring Maison Skye & Rose to your boutique, salon,
            gift store, online shop, or customer base.
          </p>
        </div>

        <div className="mt-16 rounded-[40px] bg-white p-8 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <h2 className="text-3xl font-black text-[#4f4a52]">
            Wholesale Pricing
          </h2>

          <p className="mt-3 text-[#7b7480]">
            Minimum order: 10 units
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-black/5 p-8 text-center">
              <h3 className="text-xl font-black">5ml</h3>
              <p className="mt-4 text-4xl font-black text-[#d89ca4]">
                R48
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 p-8 text-center">
              <h3 className="text-xl font-black">10ml</h3>
              <p className="mt-4 text-4xl font-black text-[#d89ca4]">
                R77
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 p-8 text-center">
              <h3 className="text-xl font-black">30ml</h3>
              <p className="mt-4 text-4xl font-black text-[#d89ca4]">
                R180
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-[#faf7f5] p-8">
            <h3 className="text-2xl font-black text-[#4f4a52]">
              Mix & Match Program
            </h3>

            <ul className="mt-6 space-y-3 text-[#7b7480]">
              <li>✓ Minimum order of only 10 units</li>
              <li>✓ Mix any fragrances</li>
              <li>✓ Mix any collections</li>
              <li>✓ Mix any bottle sizes</li>
              <li>✓ No joining fees</li>
              <li>✓ Nationwide delivery available</li>
            </ul>
          </div>

          <div className="mt-12 rounded-3xl border border-black/5 p-8">
            <h3 className="text-2xl font-black text-[#4f4a52]">
              Wholesale Enquiries
            </h3>

            <div className="mt-6 space-y-3 text-[#7b7480]">
              <p>wholesale@maisonskyeandrose.com</p>
              <p>orders@maisonskyeandrose.com</p>
              <p>info@maisonskyeandrose.com</p>
              <p>hello@maisonskyeandrose.com</p>
              <p>support@maisonskyeandrose.com</p>
              <p>WhatsApp: +27 69 686 3952</p>
            </div>

            <Link
              href="mailto:wholesale@maisonskyeandrose.com"
              className="mt-8 inline-flex rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white"
            >
              Become A Stockist
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}