"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import QuickAddModal from "../components/QuickAddModal";
import IntelligenceSection from "../components/IntelligenceSection";
import { KnowledgeChip } from "../components/knowledge/KnowledgeChip";
import { ProfileInsights } from "../components/profile/ProfileInsights";
import type { ProfileInsight } from "../components/profile/ProfileInsights";
import { ProfileJourney } from "../components/profile/ProfileJourney";
import type { JourneyViewModel } from "../components/profile/ProfileJourney";
import { ProfileNextSteps } from "../components/profile/ProfileNextSteps";
import type { NextStep } from "../components/profile/ProfileNextSteps";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import {
  getCustomerJourney,
  getCustomerStatistics,
  getCustomerConfidence,
} from "../lib/customer/intelligence/CustomerIntelligenceEngine";
import { catalogueMaps } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import { CHARACTER_STAGES } from "../lib/mkc/wardrobeEngine";
import type { CustomerJourneyStage } from "../lib/customer/intelligence/CustomerJourney";
import type { CharacterStage } from "../lib/mkc/wardrobeEngine";
import type { DisplayFragrance } from "../lib/knowledgeAdapter";
import type { FragranceKnowledge } from "../lib/mkc/types";

// ── Stage presentation ────────────────────────────────────────────────────────

const STAGE_LABELS: Record<CustomerJourneyStage, string> = {
  new:        "New Explorer",
  exploring:  "Exploring",
  engaged:    "Engaged",
  converting: "Loyal Customer",
};

const STAGE_PRESENTATION: Record<
  CustomerJourneyStage,
  { headline: string; description: string; color: string }
> = {
  new: {
    headline:    "Welcome to Maison",
    description: "Every fragrance you explore will help shape your Maison profile.",
    color:       "#7b7480",
  },
  exploring: {
    headline:    "Your Discovery is Underway",
    description: "Every fragrance you explore is helping shape your Maison profile.",
    color:       "#7a8fa3",
  },
  engaged: {
    headline:    "A Profile is Taking Shape",
    description: "Your Maison profile is taking shape — recommendations now reflect your fragrance taste.",
    color:       "#6aaa8a",
  },
  converting: {
    headline:    "Your Maison Profile",
    description: "Your Maison profile is well established — recommendations continue to refine to your preferences.",
    color:       "#d89ca4",
  },
};

const STRENGTH_LABELS: Record<"HIGH" | "MEDIUM" | "LOW", string> = {
  HIGH:   "Established",
  MEDIUM: "Developing",
  LOW:    "Building",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractString(payload: Readonly<Record<string, unknown>>, key: string): string | null {
  const value = payload[key];
  return typeof value === "string" ? value : null;
}

function slugsToCards(slugs: readonly string[], limit: number): DisplayFragrance[] {
  return slugs
    .slice(0, limit)
    .map((slug) => catalogueMaps.bySlug.get(slug))
    .filter((k): k is FragranceKnowledge => k !== undefined)
    .map(toDisplayFragrance);
}

function buildActivitySummary(
  viewedCount:   number,
  savedCount:    number,
  hasQuizResult: boolean,
): string {
  const parts: string[] = [];
  if (viewedCount > 0) {
    parts.push(`${viewedCount} ${viewedCount === 1 ? "fragrance" : "fragrances"} explored`);
  }
  if (savedCount > 0) {
    parts.push(`${savedCount} ${savedCount === 1 ? "fragrance" : "fragrances"} saved`);
  }
  if (hasQuizResult) parts.push("Fragrance Profile ready");
  return parts.join(" · ");
}

// ── View model ────────────────────────────────────────────────────────────────

interface HeroViewModel {
  stage:           CustomerJourneyStage;
  headline:        string;
  description:     string;
  stageLabel:      string;
  stageColor:      string;
  profileStrength: string;
  activity:        string;
  isColdStart:     boolean;
}

interface CharacterViewModel {
  stage:    CharacterStage | null;
  family:   string | null;
  occasion: string | null;
  gender:   string | null;
}

interface ProfileViewModel {
  hero:          HeroViewModel;
  hasQuizResult: boolean;
  character:     CharacterViewModel | null;
  insights:      ProfileInsight[];
  journey:       JourneyViewModel | null;
  nextSteps:     NextStep[];
  saved:         DisplayFragrance[];
  explored:      DisplayFragrance[];
  savedCount:    number;
  exploredCount: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FragranceProfilePage() {
  const { profile, isReady } = useUnifiedCustomerProfile();
  const [selected, setSelected]   = useState<DisplayFragrance | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const viewModel = useMemo((): ProfileViewModel | null => {
    if (!profile) return null;

    const journey    = getCustomerJourney(profile);
    const statistics = getCustomerStatistics(profile);
    const confidence = getCustomerConfidence(profile);

    // Cold-start: no signals, no viewed, no saved — absence of all meaningful intelligence.
    // Derived from activity counts rather than journey.stage alone, to be more robust
    // against edge cases where stage can be "new" with partial data.
    const isColdStart =
      statistics.totalSignals      === 0 &&
      statistics.recentlyViewedCount === 0 &&
      statistics.savedCount          === 0;

    // Hero assembly
    const stagePres = STAGE_PRESENTATION[journey.stage];
    const hero: HeroViewModel = {
      stage:           journey.stage,
      headline:        stagePres.headline,
      description:     stagePres.description,
      stageLabel:      STAGE_LABELS[journey.stage],
      stageColor:      stagePres.color,
      profileStrength: STRENGTH_LABELS[confidence.overallConfidence],
      activity:        buildActivitySummary(
        statistics.recentlyViewedCount,
        statistics.savedCount,
        journey.hasQuizResult,
      ),
      isColdStart,
    };

    // Character — direct quiz signal access.
    // CustomerPreferenceSummary.preferredFamilies is non-functional (EP10.0-P5+ not implemented).
    // Quiz signals carry the customer's explicit answers in their payload.
    const quizSignals     = profile.signals.filter((s) => s.source === "quiz");
    const familySignal    = quizSignals.find((s) => s.type === "family_preference");
    const occasionSignal  = quizSignals.find((s) => s.type === "occasion_preference");
    const genderSignal    = quizSignals.find((s) => s.type === "gender_preference");
    const characterSignal = quizSignals.find((s) => s.type === "character_preference");

    const characterValue = characterSignal
      ? extractString(characterSignal.payload, "character")
      : null;
    const characterStage = characterValue
      ? (CHARACTER_STAGES.find((s) => s.character === characterValue) ?? null)
      : null;

    const character: CharacterViewModel | null = journey.hasQuizResult
      ? {
          stage:    characterStage,
          family:   familySignal   ? extractString(familySignal.payload,   "family")   : null,
          occasion: occasionSignal ? extractString(occasionSignal.payload, "occasion") : null,
          gender:   genderSignal   ? extractString(genderSignal.payload,   "gender")   : null,
        }
      : null;

    // Grids — max 4 cards each
    const saved    = slugsToCards(profile.savedSlugs,     4);
    const explored = slugsToCards(profile.recentlyViewed, 4);

    // Profile Insights — translate repository intelligence into editorial statements.
    // Each insight must be supported by actual data. Never invent preferences.
    // Cap at 3 to keep the section focused.
    const insights: ProfileInsight[] = [];

    // Insight 1: Family + Character alignment — the quiz produced both dimensions.
    if (character?.stage && character.family) {
      insights.push({
        id:   "family-character",
        body: `Your preference for ${character.family} fragrances aligns naturally with your ${character.stage.character} character — together they form a clear direction for your Maison recommendations.`,
      });
    }

    // Insight 2: Activity signal — which combination of signals is shaping the profile.
    if (journey.hasQuizResult && journey.hasSaved && statistics.savedCount >= 2) {
      insights.push({
        id:   "quiz-and-saves",
        body: `Your Fragrance Quiz and ${statistics.savedCount} saved ${statistics.savedCount === 1 ? "fragrance" : "fragrances"} together give Maison the clearest picture of your preferences — recommendations across the site reflect both.`,
      });
    } else if (journey.hasQuizResult && !journey.hasSaved) {
      insights.push({
        id:   "quiz-no-saves",
        body: `Your Fragrance Quiz is the most precise signal in your profile. Saving fragrances you love adds the next layer of precision to your Maison recommendations.`,
      });
    } else if (!journey.hasQuizResult && journey.hasSaved && statistics.savedCount >= 2) {
      insights.push({
        id:   "saves-no-quiz",
        body: `Your saved collection is actively shaping your Maison recommendations. Taking the Fragrance Quiz would add the richest layer of precision to your profile — explicit preferences that browsing history alone cannot provide.`,
      });
    } else if (!journey.hasQuizResult && statistics.recentlyViewedCount >= 5) {
      insights.push({
        id:   "exploration-signal",
        body: `Your exploration history is guiding your Maison recommendations. Every fragrance you view helps Maison understand the direction of your taste.`,
      });
    }

    // Insight 3: Occasion context — the quiz captured how and when the customer wears fragrance.
    if (character?.occasion && insights.length < 3) {
      insights.push({
        id:   "occasion-context",
        body: `Your preference for ${character.occasion} fragrances helps guide Maison toward pieces suited to the moments you dress for.`,
      });
    }

    // Journey ViewModel — what the customer has achieved and where to go next.
    // Null for cold-start (stage "new") since the section lives inside !isColdStart.
    let journeyViewModel: JourneyViewModel | null = null;

    if (journey.stage !== "new") {
      // Editorial per stage — explains why the customer is here, not just the stage label.
      const STAGE_EDITORIAL: Record<"exploring" | "engaged" | "converting", string> = {
        exploring:  "You are actively discovering what Maison has to offer. Every fragrance you explore helps Maison understand the direction of your taste.",
        engaged:    "Your Maison profile is taking shape. You have given Maison meaningful signals to work with — recommendations across the site are now personalised to you.",
        converting: "Your Maison journey is well underway. Your full activity history gives Maison the richest possible basis for personalised recommendations.",
      };

      // Milestones — presented in order of escalating engagement, not chronological.
      const milestones: string[] = [];
      if (journey.hasViewed || statistics.recentlyViewedCount > 0) {
        milestones.push("Explored fragrances across the Maison collection");
      }
      if (journey.hasSaved) {
        milestones.push("Saved fragrances to your personal collection");
      }
      if (journey.hasQuizResult) {
        milestones.push("Discovered your Maison fragrance character");
      }
      if (journey.hasPurchased) {
        milestones.push("Made your first Maison purchase");
      }

      // Natural next step — highest-value action the customer has not yet taken.
      let nextStepBody = "";
      let nextStepHref = "";
      let nextStepCta  = "";

      if (journey.stage === "exploring") {
        if (!journey.hasQuizResult) {
          nextStepBody = "Take the Fragrance Quiz to discover your Maison character — the richest signal you can add to your profile.";
          nextStepHref = "/quiz";
          nextStepCta  = "Take the Fragrance Quiz";
        } else {
          nextStepBody = "Save fragrances that resonate with your character to build your Maison collection and deepen your profile.";
          nextStepHref = "/shop";
          nextStepCta  = "Explore the collection";
        }
      } else if (journey.stage === "engaged") {
        if (!journey.hasQuizResult) {
          nextStepBody = "Take the Fragrance Quiz to discover your Maison character — the richest signal you can add to your profile.";
          nextStepHref = "/quiz";
          nextStepCta  = "Take the Fragrance Quiz";
        } else if (character?.stage?.nextStep) {
          nextStepBody = `Your ${character.stage.character} character opens naturally toward ${character.stage.nextStep} fragrances — ${character.stage.nextLabel ?? "the next chapter in a considered fragrance wardrobe"}.`;
          nextStepHref = "/discover/character-journey";
          nextStepCta  = "Explore your next chapter";
        } else {
          nextStepBody = "Continue saving fragrances you love — each piece adds precision to your Maison recommendations.";
          nextStepHref = "/shop";
          nextStepCta  = "Explore the collection";
        }
      } else {
        // converting
        nextStepBody = "Discover what is new in the Maison collection — recommendations are updated to reflect your full journey.";
        nextStepHref = "/new-arrivals";
        nextStepCta  = "View new arrivals";
      }

      journeyViewModel = {
        stageName:    STAGE_LABELS[journey.stage],
        stageColor:   STAGE_PRESENTATION[journey.stage].color,
        editorial:    STAGE_EDITORIAL[journey.stage as "exploring" | "engaged" | "converting"],
        milestones,
        nextStepBody,
        nextStepHref,
        nextStepCta,
      };
    }

    // Profile Next Steps — priority-ordered action candidates, first 3 taken.
    // Academy is always last in the pool so there is always at least one candidate.
    const nextStepCandidates: NextStep[] = [];

    if (!journey.hasQuizResult) {
      nextStepCandidates.push({
        id:          "quiz",
        title:       "Discover Your Maison Character",
        description: "A five-minute quiz that reveals your fragrance sensibility and shapes every recommendation Maison offers you.",
        cta:         "Take the Fragrance Quiz",
        href:        "/quiz",
      });
    }

    if (journey.hasQuizResult && character?.stage?.nextStep) {
      nextStepCandidates.push({
        id:          "character-journey",
        title:       "Continue Your Character Journey",
        description: `Your ${character.stage.character} character opens naturally toward ${character.stage.nextStep} — the next chapter in a considered fragrance wardrobe.`,
        cta:         "Explore your next chapter",
        href:        "/discover/character-journey",
      });
    }

    if (statistics.savedCount < 3) {
      nextStepCandidates.push({
        id:          "build-collection",
        title:       "Build Your Collection",
        description: "Save fragrances that resonate with you. Your saved collection becomes one of the richest signals shaping your Maison recommendations.",
        cta:         "Browse the collection",
        href:        "/shop",
      });
    }

    if (journey.hasSaved || journey.hasQuizResult) {
      nextStepCandidates.push({
        id:          "new-arrivals",
        title:       "Discover New Arrivals",
        description: "Explore the latest additions to the Maison collection — recommended based on the profile you have built.",
        cta:         "View new arrivals",
        href:        "/new-arrivals",
      });
    }

    if (journey.hasQuizResult && journey.hasSaved && statistics.savedCount >= 3) {
      nextStepCandidates.push({
        id:          "retake-quiz",
        title:       "Revisit Your Fragrance Quiz",
        description: "Your taste evolves. Retaking the Fragrance Quiz keeps your Maison character aligned with where your preferences are now.",
        cta:         "Retake the quiz",
        href:        "/quiz",
      });
    }

    nextStepCandidates.push({
      id:          "academy",
      title:       "Deepen Your Fragrance Knowledge",
      description: "Explore the Maison Academy — a curated library of fragrance education that deepens every piece you discover.",
      cta:         "Visit the Academy",
      href:        "/academy",
    });

    const nextSteps = nextStepCandidates.slice(0, 3);

    return {
      hero,
      hasQuizResult: journey.hasQuizResult,
      character,
      insights,
      journey:       journeyViewModel,
      nextSteps,
      saved,
      explored,
      savedCount:    statistics.savedCount,
      exploredCount: statistics.recentlyViewedCount,
    };
  }, [profile]);

  if (!isReady || !viewModel) return null;

  const { hero, hasQuizResult, character, insights, journey: journeyViewModel, nextSteps, saved, explored, savedCount, exploredCount } = viewModel;

  function openQuickAdd(fragrance: DisplayFragrance) {
    setSelected(fragrance);
    setQuickOpen(true);
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-white pb-16 pt-40 md:pt-48">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
            Maison Fragrance Profile
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-[-0.05em] text-[#4f4a52] leading-tight md:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#7b7480]">
            {hero.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ backgroundColor: `${hero.stageColor}18`, color: hero.stageColor }}
            >
              {hero.stageLabel}
            </span>
            <span className="rounded-full border border-[#e8ddd6] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7b7480]">
              {hero.profileStrength}
            </span>
            {hero.activity && (
              <span className="text-[11px] text-[#7b7480]/70">{hero.activity}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── Cold start — quiz + explore CTAs ─────────────────────────────── */}
      {hero.isColdStart && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid max-w-2xl gap-5 md:grid-cols-2">
              <div className="rounded-[28px] border border-[#e8ddd6] bg-[#faf7f5] px-7 py-8">
                <p className="text-[10px] uppercase tracking-[0.45em] text-[#d89ca4]">
                  First Step
                </p>
                <h2 className="mt-3 text-xl font-black text-[#4f4a52]">
                  Discover Your Maison Character
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                  A five-minute quiz that reveals your fragrance sensibility and shapes every Maison recommendation.
                </p>
                <Link
                  href="/quiz"
                  className="mt-6 inline-flex rounded-full bg-[#d89ca4] px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Take the Fragrance Quiz
                </Link>
              </div>

              <div className="rounded-[28px] border border-[#e8ddd6] bg-white px-7 py-8">
                <p className="text-[10px] uppercase tracking-[0.45em] text-[#7b7480]">
                  Explore
                </p>
                <h2 className="mt-3 text-xl font-black text-[#4f4a52]">
                  Begin Your Discovery
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                  Browse 465+ signature fragrances. Every piece you explore is remembered here.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex rounded-full border border-[#4f4a52] px-6 py-2.5 text-sm font-bold text-[#4f4a52] transition hover:bg-[#4f4a52] hover:text-white"
                >
                  Browse Fragrances
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Active customer sections ──────────────────────────────────────── */}
      {!hero.isColdStart && (
        <>
          {/* Maison Character */}
          <section className="bg-[#faf7f5] py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-5">
              <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
                Maison Character
              </p>

              {hasQuizResult && character ? (
                <div className="mt-8">
                  {character.stage && (
                    <>
                      <h2 className="text-3xl font-black tracking-[-0.04em] text-[#4f4a52] md:text-4xl">
                        {character.stage.character}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-[#d89ca4]">
                        {character.stage.role}
                      </p>
                      <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#7b7480]">
                        {character.stage.description}
                      </p>
                      <div className="mt-4 max-w-2xl border-l-2 border-[#e8ddd6] pl-5">
                        <p className="text-sm leading-relaxed italic text-[#7b7480]/80">
                          {character.stage.editorial}
                        </p>
                      </div>
                    </>
                  )}

                  {(character.family || character.occasion || character.gender) && (
                    <div className="mt-7">
                      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4f4a52]/40">
                        Your Preferences
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {character.family && (
                          <KnowledgeChip label={character.family} />
                        )}
                        {character.occasion && (
                          <KnowledgeChip label={character.occasion} variant="bordered" />
                        )}
                        {character.gender && (
                          <KnowledgeChip label={character.gender} variant="bordered" />
                        )}
                      </div>
                      <p className="mt-3 text-[10px] text-[#7b7480]/50">
                        Based on your Fragrance Quiz.
                      </p>
                    </div>
                  )}

                  <Link
                    href="/quiz"
                    className="mt-6 inline-flex text-sm font-semibold text-[#d89ca4] hover:underline"
                  >
                    Retake the Fragrance Quiz →
                  </Link>
                </div>
              ) : (
                <div className="mt-8 max-w-lg rounded-[28px] border border-[#e8ddd6] bg-white px-7 py-8">
                  <h2 className="text-xl font-black text-[#4f4a52]">
                    Discover Your Maison Character
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                    A five-minute quiz that reveals your fragrance sensibility — from Fresh &amp; Light through to Deep &amp; Intense — and shapes your Maison recommendations.
                  </p>
                  <Link
                    href="/quiz"
                    className="mt-6 inline-flex rounded-full bg-[#d89ca4] px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                  >
                    Take the Fragrance Quiz
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Profile Insights */}
          <ProfileInsights insights={insights} />

          {/* Profile Journey */}
          {journeyViewModel && <ProfileJourney journey={journeyViewModel} />}

          {/* Profile Next Steps */}
          <ProfileNextSteps steps={nextSteps} />

          {/* Your Collection */}
          {saved.length > 0 && (
            <section className="bg-white py-16 md:py-20">
              <div className="mx-auto max-w-7xl px-5">
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
                      Saved Fragrances
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#4f4a52]">
                      Your Collection
                    </h2>
                  </div>
                  <Link
                    href="/favorites"
                    className="text-sm font-semibold text-[#d89ca4] hover:underline"
                  >
                    View your collection{savedCount > 4 ? ` (${savedCount})` : ""} →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                  {saved.map((fragrance) => (
                    <ProductCard
                      key={fragrance.title}
                      {...fragrance}
                      onQuickAdd={() => openQuickAdd(fragrance)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Recently Explored */}
          {explored.length > 0 && (
            <section className="bg-[#faf7f5] py-16 md:py-20">
              <div className="mx-auto max-w-7xl px-5">
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
                      Your Journey
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#4f4a52]">
                      Recently Explored
                    </h2>
                  </div>
                  <Link
                    href="/recently-viewed"
                    className="text-sm font-semibold text-[#d89ca4] hover:underline"
                  >
                    Continue exploring{exploredCount > 4 ? ` (${exploredCount})` : ""} →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                  {explored.map((fragrance) => (
                    <ProductCard
                      key={fragrance.title}
                      {...fragrance}
                      onQuickAdd={() => openQuickAdd(fragrance)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Selected For You — discovery or personalised ──────────────────── */}
      <IntelligenceSection
        experience="fragrance_profile"
        personalisedLabel="Selected For You"
        personalisedHeading="Selected For Your Profile"
        personalisedBody="Selected from across the Maison collection based on your explored fragrances, saved pieces, and expressed preferences."
        discoveryLabel="Continue Exploring"
        discoveryHeading="Discover What Awaits"
        discoveryBody="A curated selection from across the Maison collection — each piece worth exploring."
        source="profile-page-recommendation"
        className="bg-[#faf7f5]"
      />

      {selected && (
        <QuickAddModal
          open={quickOpen}
          onClose={() => setQuickOpen(false)}
          title={selected.title}
          images={selected.images}
          prices={selected.prices}
        />
      )}

      <Footer />
    </main>
  );
}
