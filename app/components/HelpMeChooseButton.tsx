"use client";

import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted } from "../lib/analytics";

export default function HelpMeChooseButton() {
  const { openConcierge, conversationState } = useConcierge();

  return (
    <button
      onClick={() => {
        openConcierge();
        trackAiChatStarted({ trigger: "discover", sessionId: conversationState.sessionId });
      }}
      className="rounded-full border border-[#ede8e1] bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#4f4a52] transition hover:border-[#d89ca4] hover:text-[#d89ca4]"
    >
      ✦ Help Me Choose
    </button>
  );
}
