"use client";

import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted } from "../lib/analytics";

interface AskAcademyButtonProps {
  topic: string;
}

export default function AskAcademyButton({ topic }: AskAcademyButtonProps) {
  const { openConcierge, conversationState } = useConcierge();

  return (
    <button
      onClick={() => {
        openConcierge({ learningTopic: topic });
        trackAiChatStarted({ trigger: "academy", sessionId: conversationState.sessionId });
      }}
      className="inline-flex items-center gap-2 rounded-full border border-[#efe8e1] bg-white px-5 py-2.5 text-sm font-semibold text-[#4f4a52] shadow-sm transition hover:border-[#d89ca4] hover:text-[#d89ca4]"
    >
      ✦ Ask a Question
    </button>
  );
}
