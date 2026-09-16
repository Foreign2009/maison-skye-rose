"use client";

import { Sparkles } from "lucide-react";
import { useConcierge } from "../context/ConciergeContext";
import { useCartUI } from "../context/CartUIContext";
import { useSearchUI } from "../context/SearchUIContext";
import { trackAiChatStarted } from "../lib/analytics";

export default function ConciergeButton() {
  const { isOpen, openConcierge, conversationState } = useConcierge();
  const { cartOpen } = useCartUI();
  const { searchOpen } = useSearchUI();

  if (isOpen || cartOpen || searchOpen) return null;

  return (
    <button
      onClick={() => {
        openConcierge();
        trackAiChatStarted({ trigger: "float-button", sessionId: conversationState.sessionId });
      }}
      aria-label="Ask the Maison Concierge"
      className="fixed bottom-[80px] right-4 md:bottom-[80px] md:right-5 z-[75] flex items-center gap-3 rounded-full bg-[#4f4a52] px-5 py-3.5 text-white shadow-2xl transition hover:scale-105 hover:bg-black"
    >
      <Sparkles size={18} />
      <span className="hidden font-semibold text-sm md:block">Ask Maison</span>
    </button>
  );
}
