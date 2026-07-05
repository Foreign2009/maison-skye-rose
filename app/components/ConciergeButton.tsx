"use client";

import { Sparkles } from "lucide-react";
import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted } from "../lib/analytics";

export default function ConciergeButton() {
  const { isOpen, openConcierge, conversationState } = useConcierge();

  if (isOpen) return null;

  return (
    <button
      onClick={() => {
        openConcierge();
        trackAiChatStarted({ trigger: "float-button", sessionId: conversationState.sessionId });
      }}
      aria-label="Ask the Maison Concierge"
      className="fixed bottom-52 right-4 md:bottom-24 md:right-5 z-[75] flex items-center gap-3 rounded-full bg-[#4f4a52] px-5 py-3.5 text-white shadow-2xl transition hover:scale-105 hover:bg-black"
    >
      <Sparkles size={18} />
      <span className="hidden font-semibold text-sm md:block">Ask Maison</span>
    </button>
  );
}
