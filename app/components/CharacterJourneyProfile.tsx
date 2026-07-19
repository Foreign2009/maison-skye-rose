"use client";

import { useMemo } from "react";
import { useUnifiedCustomerProfile } from "../lib/customer/hooks/useUnifiedCustomerProfile";
import { CHARACTER_STAGES } from "../lib/mkc/wardrobeEngine";
import { generateCollection } from "../lib/discovery";
import { toDisplayFragrance } from "../lib/mkc/displayAdapter";
import type { AnalyticsSource } from "../lib/analytics";
import DiscoverCollectionGrid from "./DiscoverCollectionGrid";

const CHARACTER_ACCENTS: Record<string, string> = {
  "Fresh & Light":       "#7a8fa3",
  "Balanced Signature":  "#6aaa8a",
  "Rich & Long Wearing": "#c4935a",
  "Deep & Intense":      "#9b7ce0",
};

const SOURCE: AnalyticsSource = "character-journey-profile";

export default function CharacterJourneyProfile() {
  const { profile, isReady } = useUnifiedCustomerProfile();

  // Signals are insertion-ordered, newest last. No explicit sort needed.
  const customerCharacter = useMemo(() => {
    if (!profile) return null;
    const signal = profile.signals
      .filter((s) => s.type === "character_preference")
      .slice(-1)[0];
    if (!signal) return null;
    const char = signal.payload.character;
    return typeof char === "string" ? char : null;
  }, [profile]);

  const stage = useMemo(
    () =>
      customerCharacter
        ? (CHARACTER_STAGES.find((s) => s.character === customerCharacter) ?? null)
        : null,
    [customerCharacter],
  );

  const stageIndex = useMemo(
    () => (stage ? CHARACTER_STAGES.findIndex((s) => s.character === stage.character) : -1),
    [stage],
  );

  const characterFragrances = useMemo(() => {
    if (!stage) return [];
    return generateCollection({
      id:          `character-profile-${stage.character.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name:        stage.character,
      description: stage.description,
      tags:        [],
      icon:        "",
      accentColor: CHARACTER_ACCENTS[stage.character] ?? "#d89ca4",
      featured:    false,
      filters:     [{ type: "scentCharacter", value: stage.character }],
      boosts:      [
        { type: "bestSeller", points: 20 },
        { type: "popularity", points:  8 },
      ],
      maxItems: 6,
    }).map((k) => ({ ...toDisplayFragrance(k), scentCharacter: k.scentCharacter }));
  }, [stage]);

  if (!isReady || !stage) return null;

  const accent       = CHARACTER_ACCENTS[stage.character] ?? "#d89ca4";
  const nextIndex    = stage.nextStep
    ? CHARACTER_STAGES.findIndex((s) => s.character === stage.nextStep)
    : -1;

  return (
    <section className="px-4 pb-12 md:pb-16">
      <div className="mx-auto max-w-7xl">

        {/* Section label */}
        <div className="mb-6 flex items-center gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4] shrink-0">
            Your Fragrance Profile
          </p>
          <div className="h-px flex-1 bg-[#ede8e1]" />
        </div>

        {/* Part A — Your Current Character */}
        <div
          className="rounded-[24px] p-6 md:p-10 mb-6"
          style={{ backgroundColor: `${accent}10` }}
        >
          <div className="flex items-start gap-4 mb-5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-black"
              style={{ backgroundColor: `${accent}20`, color: accent }}
            >
              {stageIndex + 1}
            </span>
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.45em]"
                style={{ color: accent }}
              >
                Your Current Character — Stage {stageIndex + 1} of {CHARACTER_STAGES.length}
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#4f4a52] md:text-3xl">
                {stage.character}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#7b7480]">
                {stage.role}
              </p>
            </div>
          </div>

          <p className="text-sm leading-7 text-[#7b7480] max-w-2xl">
            {stage.description}
          </p>

          <div className="mt-5 border-l-2 pl-5" style={{ borderColor: accent }}>
            <p className="text-sm leading-relaxed text-[#7b7480] italic">
              {stage.editorial}
            </p>
          </div>
        </div>

        {/* Part B — Your Next Step */}
        {stage.nextStep !== null && nextIndex !== -1 && (
          <div className="mb-6 rounded-[24px] border border-[#ede8e1] bg-white p-6 md:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d89ca4] mb-3">
              Your Next Step
            </p>
            <p className="text-sm leading-7 text-[#7b7480] max-w-2xl mb-5">
              {stage.nextLabel} — the fragrances that await you at the next stage of your journey are below.
            </p>
            <a
              href={`#stage-${nextIndex + 1}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#ede8e1] bg-[#faf7f5] px-5 py-2.5 text-sm font-bold text-[#4f4a52] transition-all hover:border-[#d89ca4] hover:text-[#d89ca4]"
            >
              {stage.nextStep} <span aria-hidden="true">↓</span>
            </a>
          </div>
        )}

        {/* Part C — Fragrances For Your Character */}
        {characterFragrances.length > 0 && (
          <>
            <div className="mb-5 flex items-center gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.55em] text-[#d89ca4] shrink-0">
                Fragrances For Your Character
              </p>
              <div className="h-px flex-1 bg-[#ede8e1]" />
            </div>
            <DiscoverCollectionGrid
              fragrances={characterFragrances}
              source={SOURCE}
              columns={3}
            />
          </>
        )}

      </div>
    </section>
  );
}
