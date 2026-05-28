"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";

import { fragrances } from "../data/fragrances";

const questions = [
  {
    id: "mood",
    title: "What mood fits you best?",
    options: [
      "Fresh",
      "Sweet",
      "Bold",
      "Elegant",
      "Sexy",
      "Clean",
    ],
  },

  {
    id: "season",
    title: "Favorite season?",
    options: [
      "Summer",
      "Winter",
      "Spring",
      "Autumn",
      "All Season",
    ],
  },

  {
    id: "profile",
    title: "Choose your fragrance profile",
    options: [
      "Fresh Woody",
      "Sweet Amber",
      "Floral",
      "Citrus Woody",
    ],
  },
];

export default function QuizPage() {

  const [answers, setAnswers] =
    useState<Record<string, string>>(
      {}
    );

  const [quickOpen, setQuickOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<any>(null);

  const handleAnswer = (
    questionId: string,
    answer: string
  ) => {

    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

  };

  /* RECOMMENDED PRODUCTS */
  const recommended = useMemo(() => {

    return fragrances.filter(
      (fragrance) => {

        const searchable =
          `
            ${fragrance.title}
            ${fragrance.subtitle}
            ${fragrance.mood}
            ${fragrance.profile}
            ${fragrance.notes.join(" ")}
            ${fragrance.season}
          `
            .toLowerCase();

        return Object.values(
          answers
        ).every((answer) =>
          searchable.includes(
            answer.toLowerCase()
          )
        );

      }
    );

  }, [answers]);

  return (

    <main className="min-h-screen bg-[#f9f6f2]">

      <Navbar />

      {/* HERO */}
      <section className="px-5 pb-12 pt-32">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-[11px] uppercase tracking-[0.45em] text-[#d89ca4]">

            Maison Skye & Rose

          </p>

          <h1 className="mt-5 text-5xl font-black tracking-[-0.08em] text-[#4f4a52] sm:text-6xl">

            Fragrance Discovery

          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#7b7480] sm:text-lg">

            Find your perfect fragrance
            personality through our luxury
            scent discovery experience.

          </p>

        </div>

      </section>

      {/* QUESTIONS */}
      <section className="px-5 pb-10">

        <div className="mx-auto max-w-5xl space-y-8">

          {questions.map((question) => (

            <div
              key={question.id}
              className="
                rounded-[32px]
                border
                border-white/40
                bg-white/70
                p-6
                shadow-[0_20px_60px_rgba(0,0,0,0.06)]
                backdrop-blur-[20px]
              "
            >

              <h2 className="text-2xl font-black tracking-[-0.05em] text-[#4f4a52]">

                {question.title}

              </h2>

              <div className="mt-5 flex flex-wrap gap-3">

                {question.options.map(
                  (option) => {

                    const active =
                      answers[
                        question.id
                      ] === option;

                    return (

                      <button
                        key={option}
                        onClick={() =>
                          handleAnswer(
                            question.id,
                            option
                          )
                        }
                        className={`
                          rounded-full
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          transition-all
                          duration-300
                          ${
                            active
                              ? "bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow-lg"
                              : "bg-white text-[#4f4a52] border border-gray-200"
                          }
                        `}
                      >
                        {option}
                      </button>

                    );

                  }
                )}

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* RESULTS */}
      <section className="px-5 pb-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex items-center justify-between">

            <div>

              <p className="text-[11px] uppercase tracking-[0.35em] text-[#d89ca4]">

                Recommended For You

              </p>

              <h2 className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#4f4a52]">

                Your Matches

              </h2>

            </div>

            <Link
              href="/"
              className="
                rounded-full
                border
                border-gray-200
                px-5
                py-3
                text-sm
                font-semibold
                text-[#4f4a52]
                transition
                hover:bg-white
              "
            >
              Back Home
            </Link>

          </div>

          {recommended.length === 0 ? (

            <div
              className="
                rounded-[32px]
                border
                border-dashed
                border-gray-300
                bg-white/50
                p-12
                text-center
              "
            >

              <h3 className="text-2xl font-black text-[#4f4a52]">

                No Matches Yet

              </h3>

              <p className="mt-4 text-[#7b7480]">

                Select preferences above
                to discover your fragrance
                personality.

              </p>

            </div>

          ) : (

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

              {recommended.map(
                (fragrance) => (

                  <ProductCard
                    key={fragrance.title}
                    {...fragrance}
                    onQuickAdd={() => {

                      setSelectedProduct(
                        fragrance
                      );

                      setQuickOpen(true);

                    }}
                  />

                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* QUICK ADD MODAL */}
      {selectedProduct && (

        <QuickAddModal
          open={quickOpen}
          onClose={() =>
            setQuickOpen(false)
          }
          title={
            selectedProduct.title
          }
          images={
            selectedProduct.images
          }
          prices={
            selectedProduct.prices
          }
        />

      )}

    </main>

  );

}