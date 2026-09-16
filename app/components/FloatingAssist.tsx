"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { brand } from "../data/brand";
import { useConcierge } from "../context/ConciergeContext";
import { useCartUI } from "../context/CartUIContext";
import { useSearchUI } from "../context/SearchUIContext";
import { trackAiChatStarted } from "../lib/analytics";

export default function FloatingAssist() {
  const { isOpen: conciergeOpen, openConcierge, conversationState } = useConcierge();
  const { cartOpen } = useCartUI();
  const { searchOpen } = useSearchUI();
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Collapse the mobile menu when clicking outside
  useEffect(() => {
    if (!expanded) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [expanded]);

  // Collapse if any overlay opens
  useEffect(() => {
    if (conciergeOpen || cartOpen || searchOpen) setExpanded(false);
  }, [conciergeOpen, cartOpen, searchOpen]);

  if (conciergeOpen || cartOpen || searchOpen) return null;

  const handleConcierge = () => {
    setExpanded(false);
    openConcierge();
    trackAiChatStarted({ trigger: "float-button", sessionId: conversationState.sessionId });
  };

  return (
    <>
      {/* ── Desktop: two compact stacked buttons ──────────────────────────── */}
      <div className="hidden md:flex fixed bottom-5 right-5 z-[9999] flex-col items-end gap-2">
        <button
          onClick={handleConcierge}
          aria-label="Ask the Maison Concierge"
          className="flex items-center gap-2 rounded-full bg-[#4f4a52] px-4 py-3 text-white shadow-2xl transition hover:scale-105 hover:bg-black"
        >
          <Sparkles size={16} />
          <span className="text-sm font-semibold">Ask Maison</span>
        </button>
        <a
          href={brand.social.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-2xl transition hover:scale-105 hover:bg-green-600"
        >
          <MessageCircle size={16} />
          <span className="text-sm font-semibold">WhatsApp</span>
        </a>
      </div>

      {/* ── Mobile: compact FAB that expands to both options ──────────────── */}
      <div
        ref={menuRef}
        className="md:hidden fixed bottom-5 right-4 z-[9999] flex flex-col items-end gap-2"
      >
        {expanded && (
          <>
            <button
              onClick={handleConcierge}
              aria-label="Ask the Maison Concierge"
              className="flex items-center gap-2 rounded-full bg-[#4f4a52] px-4 py-3 text-white shadow-xl transition active:scale-95"
            >
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Ask Maison</span>
            </button>
            <a
              href={brand.social.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-xl transition active:scale-95"
              onClick={() => setExpanded(false)}
            >
              <MessageCircle size={16} />
              <span className="text-sm font-semibold">WhatsApp</span>
            </a>
          </>
        )}
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Close assistance menu" : "Get assistance"}
          aria-expanded={expanded}
          className="h-12 w-12 rounded-full bg-[#4f4a52] text-white shadow-2xl flex items-center justify-center transition hover:scale-105 hover:bg-black"
        >
          {expanded ? (
            <X size={18} />
          ) : (
            <span className="flex flex-col gap-0.5 items-center">
              <Sparkles size={13} />
              <MessageCircle size={11} />
            </span>
          )}
        </button>
      </div>
    </>
  );
}
