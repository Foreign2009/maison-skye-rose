"use client";

type RecommendationCardProps = {
  title: string;

  profile: string;

  mood: string;

  notes: string[];

  freshness?: number;

  warmth?: number;

  sweetness?: number;

  intensity?: number;

  versatility?: number;
};

export default function RecommendationCard({
  title,
  profile,
  mood,
  notes,
  freshness = 5,
  warmth = 3,
  sweetness = 2,
  intensity = 4,
  versatility = 5,
}: RecommendationCardProps) {

  return (

    <div
      className="
        rounded-[32px]
        border
        border-white/40
        bg-white/80
        p-6
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        backdrop-blur-xl
      "
    >

      <div className="mb-4">

        <p className="text-[10px] uppercase tracking-[0.35em] text-[#d89ca4]">

          AI Recommendation

        </p>

        <h3 className="mt-2 text-2xl font-black text-[#4f4a52]">

          {title}

        </h3>

      </div>

      <p className="text-sm font-semibold text-[#d89ca4]">

        {profile}

      </p>

      <p className="mt-3 text-sm leading-7 text-[#7b7480]">

        {mood}

      </p>

      {/* WHY IT MATCHES */}

      <div className="mt-6">

        <h4 className="font-bold text-[#4f4a52]">

          Why It Matches You

        </h4>

        <ul className="mt-3 space-y-2 text-sm text-[#7b7480]">

          <li>✓ Popular signature scent</li>

          <li>✓ Matches your fragrance profile</li>

          <li>✓ Complements your lifestyle</li>

          <li>✓ Recommended by Maison AI</li>

        </ul>

      </div>

      {/* SCENT JOURNEY */}

      <div className="mt-6">

        <h4 className="font-bold text-[#4f4a52]">

          Inspired Scent Journey

        </h4>

        <div className="mt-3 flex flex-wrap gap-2">

          {notes.map((note) => (

            <span
              key={note}
              className="
                rounded-full
                bg-pink-50
                px-3
                py-1
                text-xs
                font-semibold
                text-[#d89ca4]
              "
            >
              {note}
            </span>

          ))}

        </div>

      </div>

      {/* STYLE PROFILE */}

      <div className="mt-8">

        <h4 className="mb-4 font-bold text-[#4f4a52]">

          Style Profile

        </h4>

        <div className="space-y-3">

          <Metric
            label="Freshness"
            value={freshness}
          />

          <Metric
            label="Warmth"
            value={warmth}
          />

          <Metric
            label="Sweetness"
            value={sweetness}
          />

          <Metric
            label="Intensity"
            value={intensity}
          />

          <Metric
            label="Versatility"
            value={versatility}
          />

        </div>

      </div>

      {/* DISCLAIMER */}

      <div
        className="
          mt-8
          rounded-2xl
          bg-[#f9f6f2]
          p-4
        "
      >

        <p className="text-xs leading-6 text-[#7b7480]">

          Fragrance descriptions and
          scent journeys are educational
          scent guides inspired by the
          original fragrance profile.
          Individual scent perception and
          performance may vary.

        </p>

      </div>

    </div>

  );

}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {

  return (

    <div>

      <div className="mb-1 flex justify-between">

        <span className="text-sm text-[#4f4a52]">

          {label}

        </span>

        <span className="text-sm font-bold text-[#d89ca4]">

          {value}/5

        </span>

      </div>

      <div className="h-2 rounded-full bg-gray-100">

        <div
          className="
            h-2
            rounded-full
            bg-gradient-to-r
            from-pink-400
            to-blue-400
          "
          style={{
            width: `${value * 20}%`,
          }}
        />

      </div>

    </div>

  );

}