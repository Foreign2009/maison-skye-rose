"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#4f4a52]">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">Error</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-tight tracking-[-0.05em] text-[#4f4a52] md:text-7xl">
          Something<br />Went Wrong
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-[#7b7480]">
          An unexpected error occurred. Please try again or return to the shop.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-[#d89ca4] px-8 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[#4f4a52]/20 px-8 py-4 text-sm font-semibold text-[#4f4a52] transition hover:bg-[#4f4a52]/5"
          >
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}
