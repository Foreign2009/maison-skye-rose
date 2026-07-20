// Presentational component — receives only a pre-derived JourneyViewModel.
// No intelligence calculations here. All editorial copy and next-step logic
// are computed upstream in the profile page useMemo.

import Link from "next/link";

export interface JourneyViewModel {
  stageName:    string;
  stageColor:   string;
  editorial:    string;
  milestones:   string[];
  nextStepBody: string;
  nextStepHref: string;
  nextStepCta:  string;
}

interface ProfileJourneyProps {
  journey: JourneyViewModel;
}

export function ProfileJourney({ journey }: ProfileJourneyProps) {
  return (
    <section className="bg-[#faf7f5] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">

          {/* Section kicker */}
          <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
            Your Maison Journey
          </p>

          {/* Current stage */}
          <div className="mt-8">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ backgroundColor: `${journey.stageColor}18`, color: journey.stageColor }}
            >
              {journey.stageName}
            </span>
            <p className="mt-4 text-base leading-relaxed text-[#7b7480]">
              {journey.editorial}
            </p>
          </div>

          {/* Journey progress — milestones achieved */}
          {journey.milestones.length > 0 && (
            <div className="mt-8">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4f4a52]/40">
                Your Progress
              </p>
              <div className="space-y-3">
                {journey.milestones.map((milestone) => (
                  <div key={milestone} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d89ca4]/15 text-[9px] font-black text-[#d89ca4]">
                      ✓
                    </span>
                    <p className="text-sm text-[#4f4a52]">{milestone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Natural next step */}
          {journey.nextStepBody && (
            <div className="mt-8 rounded-[20px] border border-[#e8ddd6] bg-white px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4f4a52]/40">
                Natural Next Step
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                {journey.nextStepBody}
              </p>
              <Link
                href={journey.nextStepHref}
                className="mt-4 inline-flex text-sm font-semibold text-[#d89ca4] hover:underline"
              >
                {journey.nextStepCta} →
              </Link>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
