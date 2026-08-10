"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import QuickAddModal from "../components/QuickAddModal";

import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { DisplayFragrance } from "../lib/knowledgeAdapter";
import { recommendFragrances } from "../lib/recommendFragrances";
import type { RecommendationResults } from "../lib/recommendFragrances";
import { getKnowledgeRecommendations } from "../lib/intelligence";
import RecommendationCard from "../components/RecommendationCard";
import IntelligenceSection from "../components/IntelligenceSection";
import {
  trackQuizAnswer,
  trackQuizCompleted,
  trackQuizResults,
  trackQuizWhatsApp,
} from "../lib/analytics";
import { setDiscoveryAttribution } from "../lib/discoveryAttribution";
import { mkcNameToSlug } from "../lib/mkc/catalogueLookup";
import { createLocalStorageProfileStorage } from "../lib/customer/storage/localStorageProfileStorage";
import { createProfileManager } from "../lib/customer/profile/CustomerProfileManager";
import { addSignalToDevice } from "../lib/customer/profile/DeviceProfile";
import { buildQuizSignals } from "../lib/customer/quiz/quizSignalFactory";
import { getOrCreateDeviceId } from "../lib/customer/identity/DeviceIdentity";
import { CHARACTER_STAGES } from "../lib/mkc/wardrobeEngine";
import { getArticlesForFamily, resolveArticles } from "../lib/academy/academyRelationships";

const adaptedCatalogue = catalogueMaps.adapted;
const displayByTitle = new Map<string, DisplayFragrance>(
  [...catalogueMaps.byName.entries()].map(([name, k]) => [name, toDisplayFragrance(k)])
);

const CHARACTER_ACCENTS: Record<string, string> = {
  "Fresh & Light":       "#7a8fa3",
  "Balanced Signature":  "#6aaa8a",
  "Rich & Full-Bodied": "#c4935a",
  "Deep & Intense":      "#9b7ce0",
};


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
      "Vanilla",
      "Oud",
      "Spicy",
      "Fruity",
    ],
  },

  {
    id: "character",
    title: "Which scent character sounds most like you?",
    options: [
      "Fresh & Light",
      "Balanced Signature",
      "Rich & Full-Bodied",
      "Deep & Intense",
    ],
  },
];

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quickOpen, setQuickOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const hasTrackedResults = useRef<boolean>(false);
  const hasPersisted      = useRef<boolean>(false);

  const handleAnswer = (questionId: string, answer: string) => {
    const isNew = answers[questionId] === undefined;
    const newCompletionCount = isNew ? completed + 1 : completed;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    trackQuizAnswer({ questionId, answer, completionCount: newCompletionCount });
  };

  const completed = Object.keys(answers).length;
  const progress = (completed / questions.length) * 100;

  // Authoritative recommendation engine output — preserves RecommendationResults slot structure internally
  const recommendationResults = useMemo((): RecommendationResults | null => {
    if (Object.keys(answers).length === 0) return null;
    return recommendFragrances(adaptedCatalogue, {
      gender: answers.gender?.toLowerCase(),
      occasion: answers.occasion,
      vibe: answers.vibe,
      family: answers.family,
      character: answers.character,
    });
  }, [answers]);

  // Rendering adapter — flattens RecommendationResults to display-shape array for the existing ProductCard grid
  const recommended = useMemo(() => {
    if (!recommendationResults) return [];
    const { bestMatch, similarMatches, luxuryUpgrade, hiddenGem } = recommendationResults;
    const seen = new Set<string>();
    const flat: DisplayFragrance[] = [];
    for (const f of [bestMatch, ...similarMatches, luxuryUpgrade, hiddenGem]) {
      if (!f || seen.has(f.name)) continue;
      const display = displayByTitle.get(f.name);
      if (!display) continue;
      seen.add(f.name);
      flat.push(display);
      if (flat.length === 6) break;
    }
    return flat;
  }, [recommendationResults]);

  // KIE structured recommendation slots — exposes Luxury Upgrade and Hidden Gem as typed KnowledgeSummary objects
  const kieResults = useMemo(() => {
    if (Object.keys(answers).length === 0) return null;
    return getKnowledgeRecommendations({
      gender:    answers.gender?.toLowerCase(),
      occasion:  answers.occasion,
      vibe:      answers.vibe,
      family:    answers.family,
      character: answers.character,
    });
  }, [answers]);

  // Full FragranceKnowledge lookups for RecommendationCard (requires profile, mood, notes, sensor bars)
  const luxuryKnowledge = useMemo(
    () => kieResults?.luxuryUpgrade ? (catalogueMaps.byName.get(kieResults.luxuryUpgrade.name) ?? null) : null,
    [kieResults],
  );
  const gemKnowledge = useMemo(
    () => kieResults?.hiddenGem ? (catalogueMaps.byName.get(kieResults.hiddenGem.name) ?? null) : null,
    [kieResults],
  );

  const characterStage = useMemo(
    () => CHARACTER_STAGES.find((s) => s.character === answers.character) ?? null,
    [answers.character],
  );

  const learnArticles = useMemo(() => {
    if (!answers.family) return [];
    return resolveArticles(getArticlesForFamily(answers.family)).slice(0, 2);
  }, [answers.family]);

  useEffect(() => {
    if (completed !== questions.length) return;
    trackQuizCompleted({ answers });
    setDiscoveryAttribution({ source: "quiz" });
  }, [completed]);

  // Track only the first completed recommendation set.
  // Re-answer recommendation updates are intentionally not tracked.
  useEffect(() => {
    if (hasTrackedResults.current) return;
    if (recommended.length === 0) return;
    if (completed < questions.length) return;
    hasTrackedResults.current = true;
    trackQuizResults({
      recommendedTitles: recommended.map((f) => f.title),
      resultCount: recommended.length,
    });
  }, [recommended]);

  // Persist quiz signals and result slugs to the Customer Intelligence Platform.
  // Fires once per page load on first complete quiz result.
  // Failures are swallowed so storage unavailability never breaks the quiz.
  useEffect(() => {
    if (hasPersisted.current) return;
    if (completed !== questions.length) return;
    if (recommended.length === 0) return;
    hasPersisted.current = true;

    try {
      const storage  = createLocalStorageProfileStorage();
      const manager  = createProfileManager(storage);
      const deviceId = getOrCreateDeviceId();

      // Build HIGH-confidence signals from explicit quiz answers
      const signals = buildQuizSignals(answers);
      const withSignals = signals.reduce(
        (device, signal) => addSignalToDevice(device, signal),
        manager.loadDevice(deviceId),
      );
      manager.saveDevice(withSignals);

      // Resolve result titles to mkcCatalogue slugs and persist
      const slugs = recommended
        .map((f) => mkcNameToSlug.get(f.title))
        .filter((s): s is string => !!s);
      if (slugs.length > 0) {
        manager.recordQuizResult(deviceId, slugs);
      }
    } catch {
      // localStorage unavailable — continue without persistence
    }
  }, [completed, recommended, answers]);

  return (
    <main className="min-h-screen bg-[#f9f6f2]">
      <Navbar />

      {/* HERO */}
      <section className="px-6 pb-14 pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mt-5 text-5xl md:text-6xl font-black tracking-[-0.08em] text-[#4f4a52]">
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

              {/* LUXURY UPGRADE — Elite Collection slot from KIE recommendation engine */}
              {kieResults?.luxuryUpgrade && luxuryKnowledge && (
                <div className="mb-10">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-gradient-to-r from-[#9b7ce0]/30 to-transparent" />
                    <div className="text-center">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#9b7ce0]">Luxury Upgrade</p>
                      <h3 className="mt-1 text-xl font-black text-[#4f4a52]">Step Into the Elite Collection</h3>
                    </div>
                    <span className="h-px flex-1 bg-gradient-to-l from-[#9b7ce0]/30 to-transparent" />
                  </div>
                  <p className="mb-5 text-center text-sm text-zinc-500 max-w-md mx-auto">
                    A premium composition from the Elite Collection that aligns with your profile — built for depth and distinction.
                  </p>
                  <div className="mx-auto max-w-md">
                    <RecommendationCard
                      title={kieResults.luxuryUpgrade.name}
                      subtitle={kieResults.luxuryUpgrade.subtitle ?? undefined}
                      profile={luxuryKnowledge.profile}
                      mood={luxuryKnowledge.mood}
                      notes={[...luxuryKnowledge.notes.top, ...luxuryKnowledge.notes.heart].slice(0, 5)}
                      freshness={luxuryKnowledge.freshness}
                      warmth={luxuryKnowledge.warmth}
                      sweetness={luxuryKnowledge.sweetness}
                      intensity={luxuryKnowledge.intensity}
                      versatility={luxuryKnowledge.versatility}
                      reasons={[...kieResults.luxuryUpgrade.whyYoullLikeIt]}
                      slug={kieResults.luxuryUpgrade.slug}
                    />
                  </div>
                </div>
              )}

              {/* HIDDEN GEM — less-discovered slot from KIE recommendation engine */}
              {kieResults?.hiddenGem && gemKnowledge && (
                <div className="mb-10">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-gradient-to-r from-[#9b7ce0]/30 to-transparent" />
                    <div className="text-center">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#9b7ce0]">Hidden Gem</p>
                      <h3 className="mt-1 text-xl font-black text-[#4f4a52]">Beyond the Bestsellers</h3>
                    </div>
                    <span className="h-px flex-1 bg-gradient-to-l from-[#9b7ce0]/30 to-transparent" />
                  </div>
                  <p className="mb-5 text-center text-sm text-zinc-500 max-w-md mx-auto">
                    A less-discovered fragrance that fits your profile — found before the crowd does.
                  </p>
                  <div className="mx-auto max-w-md">
                    <RecommendationCard
                      title={kieResults.hiddenGem.name}
                      subtitle={kieResults.hiddenGem.subtitle ?? undefined}
                      profile={gemKnowledge.profile}
                      mood={gemKnowledge.mood}
                      notes={[...gemKnowledge.notes.top, ...gemKnowledge.notes.heart].slice(0, 5)}
                      freshness={gemKnowledge.freshness}
                      warmth={gemKnowledge.warmth}
                      sweetness={gemKnowledge.sweetness}
                      intensity={gemKnowledge.intensity}
                      versatility={gemKnowledge.versatility}
                      reasons={[...kieResults.hiddenGem.whyYoullLikeIt]}
                      slug={kieResults.hiddenGem.slug}
                    />
                  </div>
                </div>
              )}

              <div className="mb-8 grid gap-6 lg:grid-cols-3">
                {recommended.map((fragrance, index) => (
                  <ProductCard
                    key={fragrance.title}
                    {...fragrance}
                    onQuickAdd={() => {
                      setSelectedProduct(fragrance);
                      setQuickOpen(true);
                    }}
                    source="quiz"
                    rank={index}
                  />
                ))}
              </div>

              {/* Quick WhatsApp CTA Button */}
              <a
                href="https://wa.me/27696863952"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackQuizWhatsApp({ ctaType: "help" })}
                className="mx-auto mt-10 flex w-fit rounded-full bg-black px-8 py-4 text-white font-bold transition-transform duration-300 hover:scale-105"
              >
                Need Help Choosing?
              </a>
              <a
                href={`https://wa.me/27696863952?text=${encodeURIComponent(
                  `My Maison AI Results:%0A%0ATop Match: ${recommended[0]?.title}%0AAlternative Match: ${recommended[1]?.title}%0ATrending Choice: ${recommended[2]?.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackQuizWhatsApp({
                    ctaType: "results",
                    productTitles: recommended.slice(0, 3).map((f) => f.title),
                  })
                }
                className="mx-auto mt-4 flex w-fit rounded-full bg-[#d89ca4] px-8 py-4 text-white font-bold transition-transform duration-300 hover:scale-105"
              >
                Send My Results To WhatsApp
              </a>

              {/* PROFILE FEEDBACK — confirms quiz signals were recorded */}
              {completed === questions.length && (
                <div className="mt-10 rounded-[28px] border border-[#e8ddd6] bg-[#faf7f5] px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#d89ca4]/15">
                      <span className="text-[#d89ca4] text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#4f4a52]">
                        Your Fragrance Profile is ready.
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[#7b7480]">
                        Your answers have shaped your Maison profile — recommendations across the site will now reflect your fragrance preferences.
                      </p>
                      <Link
                        href="/fragrance-profile"
                        className="mt-3 inline-flex text-sm font-semibold text-[#d89ca4] hover:underline"
                      >
                        View your Fragrance Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* PART B — YOUR FRAGRANCE JOURNEY */}
              {completed === questions.length && characterStage && (
                <div className="mt-16">
                  <div className="mb-6 flex items-center gap-3">
                    <span
                      className="h-px flex-1"
                      style={{ background: `linear-gradient(to right, ${CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4"}40, transparent)` }}
                    />
                    <div className="text-center">
                      <p
                        className="text-[11px] uppercase tracking-[0.35em]"
                        style={{ color: CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4" }}
                      >
                        Your Fragrance Journey
                      </p>
                      <h3 className="mt-1 text-xl font-black text-[#4f4a52]">Your Scent Character</h3>
                    </div>
                    <span
                      className="h-px flex-1"
                      style={{ background: `linear-gradient(to left, ${CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4"}40, transparent)` }}
                    />
                  </div>

                  <div className="rounded-[32px] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-[16px]">
                    <div
                      className="mb-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.45em]"
                      style={{
                        backgroundColor: `${CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4"}15`,
                        color: CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4",
                      }}
                    >
                      Stage {CHARACTER_STAGES.findIndex((s) => s.character === characterStage.character) + 1} of 4
                    </div>

                    <h4 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#4f4a52]">
                      {characterStage.character}
                    </h4>
                    <p
                      className="mt-1 text-sm font-semibold"
                      style={{ color: CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4" }}
                    >
                      {characterStage.role}
                    </p>

                    <p className="mt-4 text-sm leading-7 text-[#7b7480]">
                      {characterStage.description}
                    </p>

                    <div
                      className="mt-5 border-l-2 pl-5"
                      style={{ borderColor: CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4" }}
                    >
                      <p className="text-sm leading-relaxed text-[#7b7480]">
                        {characterStage.editorial}
                      </p>
                    </div>

                    {characterStage.nextStep && (
                      <p className="mt-5 text-xs text-[#7b7480]">
                        Ready to go deeper?{" "}
                        <span
                          className="font-semibold"
                          style={{ color: CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4" }}
                        >
                          {characterStage.nextLabel}
                        </span>
                      </p>
                    )}

                    <Link
                      href="/discover/character-journey"
                      className="mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors hover:opacity-80"
                      style={{
                        borderColor: CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4",
                        color: CHARACTER_ACCENTS[characterStage.character] ?? "#d89ca4",
                      }}
                    >
                      Explore the Character Journey →
                    </Link>
                  </div>
                </div>
              )}

              {/* PART C — CONTINUE LEARNING */}
              {completed === questions.length && learnArticles.length > 0 && (
                <div className="mt-12">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px flex-1 bg-gradient-to-r from-[#d89ca4]/30 to-transparent" />
                    <div className="text-center">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#d89ca4]">
                        Continue Learning
                      </p>
                      <h3 className="mt-1 text-xl font-black text-[#4f4a52]">Deepen Your Knowledge</h3>
                    </div>
                    <span className="h-px flex-1 bg-gradient-to-l from-[#d89ca4]/30 to-transparent" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {learnArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/academy/${article.slug}`}
                        className="group rounded-[24px] border border-white/60 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-[16px] transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4]">
                          {article.category}
                        </p>
                        <h4 className="mt-2 text-lg font-black tracking-[-0.03em] text-[#4f4a52] group-hover:text-[#d89ca4] transition-colors">
                          {article.title}
                        </h4>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#7b7480]">
                          {article.excerpt}
                        </p>
                        <p className="mt-4 text-xs font-semibold text-[#7b7480]">
                          {article.readTime} min read →
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* PART A — CONTINUE DISCOVERING */}
      {completed === questions.length && (
        <IntelligenceSection
          experience="quiz"
          personalisedLabel="Selected For You"
          personalisedHeading="Selected For Your Fragrance Profile"
          personalisedBody="Based on the preferences you have shared, these fragrances from across the Maison collection reflect the style and character you are drawn to."
          discoveryLabel="Continue Discovering"
          discoveryHeading="Explore the Maison Collection"
          discoveryBody="A curated introduction to the depth and range of Maison Skye & Rose — fragrances worth discovering next."
          source="quiz-continuation"
        />
      )}

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