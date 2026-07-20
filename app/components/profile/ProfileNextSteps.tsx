// Presentational component — receives only pre-derived next steps from the parent's useMemo.
// No intelligence calculations here. Steps are computed upstream and passed in.

import Link from "next/link";

export interface NextStep {
  id:          string;
  title:       string;
  description: string;
  cta:         string;
  href:        string;
}

interface ProfileNextStepsProps {
  steps: readonly NextStep[];
}

export function ProfileNextSteps({ steps }: ProfileNextStepsProps) {
  if (steps.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <p className="text-[10px] uppercase tracking-[0.55em] text-[#d89ca4]">
          What&apos;s Next
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col rounded-[24px] border border-[#e8ddd6] bg-[#faf7f5] p-6 md:p-7"
            >
              <h3 className="text-base font-black text-[#4f4a52]">
                {step.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#7b7480]">
                {step.description}
              </p>
              <Link
                href={step.href}
                className="mt-5 inline-flex text-sm font-semibold text-[#d89ca4] hover:underline"
              >
                {step.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
