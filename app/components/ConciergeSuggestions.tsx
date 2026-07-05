"use client";

import type { ConversationContext } from "../lib/concierge/types";

interface ConciergeSuggestionsProps {
  context:       ConversationContext;
  onSuggestion:  (text: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  "Help me find my signature scent",
  "What's a good fragrance for the office?",
  "I'm looking for a gift",
  "What's popular right now?",
];

const PDP_SUGGESTIONS = [
  "What occasions is this best for?",
  "How does this compare to others?",
  "Is this suitable as a gift?",
];

const ACADEMY_SUGGESTIONS = [
  "Explain this in simple terms",
  "Which fragrances match this topic?",
  "Where do I start learning about fragrances?",
];

export default function ConciergeSuggestions({ context, onSuggestion }: ConciergeSuggestionsProps) {
  const suggestions = context.mentionedSlug
    ? PDP_SUGGESTIONS
    : context.learningTopic
      ? ACADEMY_SUGGESTIONS
      : DEFAULT_SUGGESTIONS;

  return (
    <div className="px-1 py-4">
      <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
        Ask me anything
      </p>
      <p className="mb-4 text-center text-xs text-zinc-400">
        Your personal fragrance adviser
      </p>
      <div className="flex flex-col gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="w-full rounded-2xl border border-[#efe8e1] bg-white px-4 py-3 text-left text-[13px] font-medium text-[#4f4a52] transition hover:border-[#d89ca4] hover:bg-[#fff7f8]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
