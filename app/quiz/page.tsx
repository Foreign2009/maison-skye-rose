"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import QuickAddModal from "../components/QuickAddModal";

import { fragrances } from "../data/fragrances";

const questions = [
  {
    id: "gender",
    title: "Who are you shopping for?",
    options: [
      "Male",
      "Female",
      "Unisex",
    ],
  },

  {
    id: "occasion",
    title: "Where will you wear it most?",
    options: [
      "Daily Wear",
      "Office",
      "Date Night",
      "Wedding",
      "Luxury Events",
    ],
  },

  {
    id: "vibe",
    title: "How do you want to be perceived?",
    options: [
      "Luxury",
      "Sexy",
      "Professional",
      "Confident",
      "Elegant",
      "Playful",
      "Mysterious",
    ],
  },

  {
    id: "family",
    title: "Which scent profile attracts you most?",
    options: [
      "Fresh",
      "Citrus",
      "Floral",
      "Woody",
      "Sweet",
      "Amber",
    ],
  },

  {
    id: "character",
    title: "Which scent character sounds most like you?",
    options: [
      "Fresh & Light",
      "Balanced Signature",
      "Rich & Long Wearing",
      "Deep & Intense",
    ],
  },
];

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quickOpen, setQuickOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const completed = Object.keys(answers).length;
  const progress = (completed / questions.length) * 100;

  // Upgraded Fast Search Recommendation Filter Logic
  const recommended = useMemo(() => {
    const scored = fragrances.map((fragrance) => {
      let score = 0;

      const profile = fragrance.profile.toLowerCase();
      const mood = fragrance.mood.toLowerCase();
      const season = fragrance.season.toLowerCase();
      const notes = fragrance.notes.join(" ").toLowerCase();

      if (answers.gender === "Male" && fragrance.collection === "Skye") score += 3;
      if (answers.gender === "Female" && fragrance.collection === "Rose") score += 3;

      if (
        answers.family &&
        (profile.includes(answers.family.toLowerCase()) ||
          notes.includes(answers.family.toLowerCase()))
      ) {
        score += 3;
      }

      if (
        answers.vibe &&
        mood.includes(answers.vibe.toLowerCase())
      ) {
        score += 2;
      }

      if (
        answers.character === "Fresh & Light" &&
        (profile.includes("fresh") || season.includes("summer"))
      ) {
        score += 2;
      }

      if (
        answers.character === "Deep & Intense" &&
        (profile.includes("amber") || season.includes("winter"))
      ) {
        score += 2;
      }

      if (fragrance.bestSeller) {
        score += 1;
      }

      return {
        fragrance,
        score,
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.fragrance);
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
            Maison AI Scent Finder
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#7b7480] sm:text-lg">
            Answer a few questions and discover fragrances that match your
            style, personality and scent preferences.
          </p>

          {/* PROGRESS */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#7b7480]">
                Progress
              </span>

              <span className="text-sm font-bold text-[#d89ca4]">
                {completed}/{questions.length}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-pink-400
                  to-blue-400
                  transition-all
                  duration-500
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
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
                {question.options.map((option) => {
                  const active = answers[question.id] === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(question.id, option)}
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
                })}
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
                Maison AI Results
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#4f4a52]">
                Your Fragrance Matches
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
                Build Your Scent Profile
              </h3>

              <p className="mt-4 text-[#7b7480]">
                Answer the questions above and our Maison AI Scent Finder will
                recommend fragrances that suit your preferences.
              </p>
            </div>
          ) : (
            <>
              {/* Custom Titles and Counter Updates */}
              <h2 className="mb-8 text-center text-4xl font-black text-[#4f4a52]">
                Your Perfect Matches
              </h2>

              <p className="mb-8 text-center text-zinc-500">
                Found {recommended.length} fragrance matches
              </p>

              <div className="mb-8 rounded-[32px] bg-gradient-to-r from-pink-50 to-blue-50 p-6">
                <h3 className="text-2xl font-black text-[#4f4a52]">
                  Perfect Match Results
                </h3>

                <p className="mt-3 text-[#7b7480]">
                  These recommendations are educational scent guides inspired by
                  the fragrance profiles available through Maison Skye & Rose.
                </p>
              </div>

              <div className="mb-10 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-gradient-to-r from-pink-100 to-pink-50 p-5">
                  <p className="text-xs uppercase tracking-widest text-[#d89ca4]">
                    Top Match
                  </p>
                  <h3 className="mt-2 text-xl font-black text-[#4f4a52]">
                    {recommended[0]?.title}
                  </h3>
                </div>

                <div className="rounded-3xl bg-gradient-to-r from-blue-100 to-blue-50 p-5">
                  <p className="text-xs uppercase tracking-widest text-[#6b8cff]">
                    Alternative Match
                  </p>
                  <h3 className="mt-2 text-xl font-black text-[#4f4a52]">
                    {recommended[1]?.title}
                  </h3>
                </div>

                <div className="rounded-3xl bg-gradient-to-r from-[#f5e7d8] to-[#faf7f5] p-5">
                  <p className="text-xs uppercase tracking-widest text-[#b67d73]">
                    Trending Choice
                  </p>
                  <h3 className="mt-2 text-xl font-black text-[#4f4a52]">
                    {recommended[2]?.title}
                  </h3>
                </div>
              </div>

              <div className="mb-8 grid gap-6 lg:grid-cols-3">
                {recommended.map((fragrance) => (
                  <ProductCard
                    key={fragrance.title}
                    {...fragrance}
                    onQuickAdd={() => {
                      setSelectedProduct(fragrance);
                      setQuickOpen(true);
                    }}
                  />
                ))}
              </div>

              {/* Quick WhatsApp CTA Button */}
              <a
                href="https://wa.me/27696863952"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-10 flex w-fit rounded-full bg-black px-8 py-4 text-white font-bold transition-transform duration-300 hover:scale-105"
              >
                Need Help Choosing?
              </a>
            </>
          )}
        </div>
      </section>

      {/* Floating WhatsApp Component Mounted Here */}
      <FloatingWhatsApp />

      {selectedProduct && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selectedProduct.title}
          images={selectedProduct.images}
          prices={selectedProduct.prices}
        />
      )}
    </main>
  );
}
