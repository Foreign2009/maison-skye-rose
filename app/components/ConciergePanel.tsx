"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { useConcierge }     from "../context/ConciergeContext";
import ConciergeMessage, { type UIMessage } from "./ConciergeMessage";
import ConciergeSuggestions from "./ConciergeSuggestions";
import {
  trackAiQuery,
  trackAiRecommendation,
  trackAiProductClicked,
  trackAiArticleOpened,
  trackAiFollowupClicked,
  trackAiSessionCompleted,
} from "../lib/analytics";
import type { FormattedResponse } from "../lib/concierge/types";

const MAX_CHARS = 280;

export default function ConciergePanel() {
  const { isOpen, closeConcierge, dispatch, conversationState } = useConcierge();

  const [messages,   setMessages]   = useState<UIMessage[]>([]);
  const [input,      setInput]      = useState("");
  const [isLoading,  setIsLoading]  = useState(false);
  const [mounted,    setMounted]    = useState(false);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionId  = conversationState.sessionId;

  // Lazy mount — keep in DOM after first open for smooth animation
  useEffect(() => {
    if (isOpen && !mounted) setMounted(true);
  }, [isOpen, mounted]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus textarea on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Interaction handlers ────────────────────────────────────────────────────

  const handleSend = useCallback(async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || isLoading) return;

    setInput("");

    const userUIMessage: UIMessage = { role: "user", content: userMessage, timestamp: Date.now() };
    setMessages((prev) => [...prev, userUIMessage]);

    const userTurn = { role: "user" as const, content: userMessage, timestamp: Date.now() };
    dispatch({ type: "ADD_TURN", turn: userTurn });
    trackAiQuery({ query: userMessage, sessionId });

    setIsLoading(true);

    try {
      const stateForApi = {
        ...conversationState,
        turns: [...conversationState.turns, userTurn],
      };

      const res  = await fetch("/api/concierge", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: userMessage, state: stateForApi }),
      });

      const data: FormattedResponse = await res.json();

      const assistantUIMessage: UIMessage = {
        role:                "assistant",
        content:             data.content,
        timestamp:           Date.now(),
        fragrances:          data.fragrances,
        articles:            data.articles,
        followUpSuggestions: data.followUpSuggestions,
      };
      setMessages((prev) => [...prev, assistantUIMessage]);

      const assistantTurn = {
        role:           "assistant" as const,
        content:        data.content,
        timestamp:      Date.now(),
        retrievedSlugs: data.fragrances.map((f) => f.slug),
      };
      dispatch({ type: "ADD_TURN",            turn: assistantTurn });
      dispatch({ type: "SET_RECOMMENDATIONS", slugs: data.fragrances.map((f) => f.slug) });

      if (data.fragrances.length > 0) {
        trackAiRecommendation({ slugs: data.fragrances.map((f) => f.slug), intent: data.intent, sessionId });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role:      "assistant" as const,
          content:   "I'm having a moment — please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, conversationState, dispatch, sessionId]);

  const handleFollowUp = useCallback((suggestion: string) => {
    trackAiFollowupClicked({ suggestion, sessionId });
    handleSend(suggestion);
  }, [handleSend, sessionId]);

  const handleProductClick = useCallback((slug: string, name: string) => {
    trackAiProductClicked({ slug, name, sessionId });
  }, [sessionId]);

  const handleArticleClick = useCallback((slug: string, title: string) => {
    trackAiArticleOpened({ slug, title, sessionId });
  }, [sessionId]);

  const handleClose = useCallback(() => {
    if (messages.length > 0) {
      trackAiSessionCompleted({ turnCount: messages.length, sessionId });
    }
    closeConcierge();
  }, [messages.length, sessionId, closeConcierge]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount    = input.length;
  const isOverLimit  = charCount > MAX_CHARS;
  const canSend      = input.trim().length > 0 && !isLoading && !isOverLimit;
  const hasMessages  = messages.length > 0;

  if (!mounted) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[79] bg-black/30 md:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[80] flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:w-[380px] md:border-l md:border-black/5 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Maison Concierge"
        aria-modal="true"
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/5 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4f4a52]">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4f4a52]">
                Maison Concierge
              </p>
              <p className="text-[10px] text-zinc-400">Your fragrance adviser</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/5 text-zinc-500 transition hover:border-[#d89ca4] hover:text-[#d89ca4]"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Conversation area ────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!hasMessages ? (
            <ConciergeSuggestions
              context={conversationState.context}
              onSuggestion={(s) => handleSend(s)}
            />
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <ConciergeMessage
                  key={i}
                  message={m}
                  onFollowUp={handleFollowUp}
                  onProductClick={handleProductClick}
                  onArticleClick={handleArticleClick}
                />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5f1eb]">
                    <Sparkles size={12} className="text-[#d89ca4]" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-[#efe8e1] bg-white px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d89ca4] [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d89ca4] [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d89ca4] [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ────────────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-black/5 bg-white px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a fragrance…"
              rows={1}
              disabled={isLoading}
              aria-label="Message"
              className="flex-1 resize-none rounded-2xl border border-[#efe8e1] bg-[#faf7f5] px-4 py-2.5 text-[13px] text-[#4f4a52] placeholder-zinc-400 outline-none transition focus:border-[#d89ca4] disabled:opacity-50"
              style={{ maxHeight: "96px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!canSend}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d89ca4] text-white transition hover:bg-[#c98a92] disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </div>
          {isOverLimit && (
            <p className="mt-1.5 text-right text-[10px] text-red-400">
              {charCount}/{MAX_CHARS} — message too long
            </p>
          )}
        </div>
      </div>
    </>
  );
}
