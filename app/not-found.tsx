import Link from "next/link";
import Navbar from "./components/Navbar";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#4f4a52]">
      <Navbar />
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-[#d89ca4]">404</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-tight tracking-[-0.05em] text-[#4f4a52] md:text-7xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-[#7b7480]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-flex items-center rounded-full bg-[#4f4a52] px-8 py-4 text-sm font-bold text-white transition hover:bg-black"
        >
          Return to Shop
        </Link>
      </section>
    </main>
  );
}
