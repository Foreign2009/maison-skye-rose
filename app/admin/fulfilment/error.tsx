"use client";

import Link from "next/link";

// Shown if the fulfilment page fails to render. No error details are displayed.
export default function FulfilmentError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1eb] px-6">
      <div role="alert" className="w-full max-w-sm space-y-4 text-center">
        <p className="text-sm text-[#4f4a52]">The fulfilment dashboard could not be displayed.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-[44px] rounded-full bg-[#4f4a52] px-5 text-sm font-semibold text-white hover:bg-black"
          >
            Try again
          </button>
          <Link href="/admin" className="inline-flex min-h-[44px] items-center rounded-full border border-[#e8ddd6] bg-white px-5 text-sm font-semibold text-[#4f4a52]">
            Back to Operations
          </Link>
        </div>
      </div>
    </main>
  );
}
