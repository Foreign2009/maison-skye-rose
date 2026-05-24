"use client";

import {
  useEffect,
  useState,
} from "react";

type ProductModalProps = {
  title: string;
  subtitle: string;
  mood: string;
  profile: string;
  season: string[];
  notes: string[];
  prices: {
    "5ml": number;
    "10ml": number;
    "30ml": number;
  };
  images: {
    "5ml": string;
    "10ml": string;
    "30ml": string;
  };
  onClose: () => void;
};

export default function ProductModal({
  title,
  subtitle,
  mood,
  profile,
  season,
  notes,
  prices,
  images,
  onClose,
}: ProductModalProps) {

  const [selectedSize, setSelectedSize] =
    useState<
      "5ml" |
      "10ml" |
      "30ml"
    >("10ml");

  // LOCK PAGE SCROLL
  useEffect(() => {

    const scrollY =
      window.scrollY;

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${scrollY}px`;

    document.body.style.left =
      "0";

    document.body.style.right =
      "0";

    document.body.style.width =
      "100%";

    return () => {

      document.body.style.position =
        "";

      document.body.style.top =
        "";

      document.body.style.left =
        "";

      document.body.style.right =
        "";

      document.body.style.width =
        "";

      window.scrollTo(
        0,
        scrollY
      );

    };

  }, []);

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/60 backdrop-blur-md">

      {/* CLICK OUTSIDE */}
      <div
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* MODAL WRAPPER */}
      <div className="flex min-h-screen items-start justify-center p-6">

        {/* MODAL */}
        <div className="relative my-10 w-full max-w-5xl overflow-hidden rounded-[40px] bg-[#f5f1eb] shadow-[0_30px_120px_rgba(0,0,0,0.35)] animate-[fadeUp_0.4s_ease]">

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition duration-300 hover:scale-105"
          >
            ✕
          </button>

          <div className="grid md:grid-cols-2">

            {/* LEFT SIDE */}
            <div className="relative flex items-center justify-center bg-[#ece7df] p-10">

              {/* GLOW */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#dfe7ef]/40" />

              <img
                src={images[selectedSize]}
                alt={title}
                className="relative z-10 max-h-[520px] object-contain transition duration-700 hover:scale-105"
              />

            </div>

            {/* RIGHT SIDE */}
            <div className="p-10">

              {/* BRAND */}
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Maison Skye & Rose
              </p>

              {/* TITLE */}
              <h2 className="mt-4 text-5xl font-black uppercase leading-none tracking-[-0.05em]">
                {title}
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-6 leading-8 text-zinc-600">
                {subtitle}
              </p>

              {/* MOOD */}
              <div className="mt-10">

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Mood
                </p>

                <h3 className="mt-3 text-2xl font-bold">
                  {mood}
                </h3>

              </div>

              {/* PROFILE */}
              <div className="mt-10">

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Fragrance Profile
                </p>

                <p className="mt-4 leading-8 text-zinc-700">
                  {profile}
                </p>

              </div>

              {/* NOTES */}
              <div className="mt-10">

                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Notes
                </p>

                <div className="flex flex-wrap gap-2">

                  {notes.map((note) => (

                    <span
                      key={note}
                      className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.15em] shadow-sm"
                    >
                      {note}
                    </span>

                  ))}

                </div>

              </div>

              {/* SEASONS */}
              <div className="mt-10">

                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Best Seasons
                </p>

                <div className="flex flex-wrap gap-2">

                  {season.map((item) => (

                    <span
                      key={item}
                      className="rounded-full bg-[#dfe7ef] px-4 py-2 text-xs uppercase tracking-[0.15em] text-[#5f7386]"
                    >
                      {item}
                    </span>

                  ))}

                </div>

              </div>

              {/* SIZE */}
              <div className="mt-12">

                <p className="mb-5 text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Select Size
                </p>

                <div className="grid grid-cols-3 gap-4">

                  {Object.keys(prices).map((size) => (

                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(
                          size as
                            | "5ml"
                            | "10ml"
                            | "30ml"
                        )
                      }
                      className={`rounded-[24px] p-5 text-center shadow-sm transition duration-300 ${
                        selectedSize === size
                          ? "bg-black text-white shadow-2xl"
                          : "bg-white hover:bg-black hover:text-white"
                      }`}
                    >

                      <p className="text-xs uppercase tracking-[0.2em]">
                        {size}
                      </p>

                      <h4 className="mt-2 text-3xl font-black">
                        R{
                          prices[
                            size as keyof typeof prices
                          ]
                        }
                      </h4>

                    </button>

                  ))}

                </div>

              </div>

              {/* BUTTON */}
              <button
                className="mt-12 w-full rounded-full bg-black py-5 text-sm uppercase tracking-[0.25em] text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition duration-300 hover:scale-[1.02]"
              >
                Add To Bag
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}