"use client";

import { useConcierge } from "../context/ConciergeContext";
import { trackAiChatStarted } from "../lib/analytics";
import type { ConversationContext } from "../lib/concierge/types";

interface MomentConciergeButtonProps {
  context: Partial<ConversationContext>;
  label:   string;
}

export default function MomentConciergeButton({
  context,
  label,
}: MomentConciergeButtonProps) {
  const { openConcierge, conversationState } = useConcierge();

  return (
    <button
      onClick={() => {
        openConcierge(context);
        trackAiChatStarted({
          trigger:   "discover",
          sessionId: conversationState.sessionId,
        });
      }}
      className="inline-flex items-center gap-2.5 rounded-full bg-[#4f4a52] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-black hover:scale-[1.02]"
    >
      ✦ {label}
    </button>
  );
}
