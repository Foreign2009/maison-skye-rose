"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type Dispatch,
  type ReactNode,
} from "react";
import type { ConversationState, ConversationContext, ConversationTurn, SessionUpdates } from "../lib/concierge/types";

// ── Initial state ─────────────────────────────────────────────────────────────

function createSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

function createInitialState(): ConversationState {
  return {
    sessionId: createSessionId(),
    turns:     [],
    context:   {},
    lastRecommendationSlugs: [],
  };
}

// ── Actions ───────────────────────────────────────────────────────────────────

export type ConciergeAction =
  | { type: "OPEN";                options?: Partial<ConversationContext> }
  | { type: "CLOSE" }
  | { type: "ADD_TURN";            turn: ConversationTurn }
  | { type: "UPDATE_CONTEXT";      context: Partial<ConversationContext> }
  | { type: "SET_RECOMMENDATIONS"; slugs: string[] }
  | { type: "SET_SESSION_CONTEXT"; updates: SessionUpdates }
  | { type: "RESET" };

// ── State ─────────────────────────────────────────────────────────────────────

interface ConciergeUIState {
  isOpen:            boolean;
  conversationState: ConversationState;
}

const INITIAL_UI_STATE: ConciergeUIState = {
  isOpen:            false,
  conversationState: createInitialState(),
};

// ── Reducer ───────────────────────────────────────────────────────────────────

function conciergeReducer(state: ConciergeUIState, action: ConciergeAction): ConciergeUIState {
  switch (action.type) {

    case "OPEN":
      return {
        ...state,
        isOpen: true,
        conversationState: {
          ...state.conversationState,
          context: { ...state.conversationState.context, ...(action.options ?? {}) },
        },
      };

    case "CLOSE":
      return { ...state, isOpen: false };

    case "ADD_TURN":
      return {
        ...state,
        conversationState: {
          ...state.conversationState,
          turns: [...state.conversationState.turns, action.turn].slice(-10),
        },
      };

    case "UPDATE_CONTEXT":
      return {
        ...state,
        conversationState: {
          ...state.conversationState,
          context: { ...state.conversationState.context, ...action.context },
        },
      };

    case "SET_RECOMMENDATIONS":
      return {
        ...state,
        conversationState: {
          ...state.conversationState,
          lastRecommendationSlugs: action.slugs,
        },
      };

    case "SET_SESSION_CONTEXT":
      return {
        ...state,
        conversationState: {
          ...state.conversationState,
          selectedSlug:    action.updates.selectedSlug    ?? state.conversationState.selectedSlug,
          comparisonSlugs: action.updates.comparisonSlugs ?? state.conversationState.comparisonSlugs,
          lastArticleSlug: action.updates.lastArticleSlug ?? state.conversationState.lastArticleSlug,
          lastCollection:  action.updates.lastCollection  ?? state.conversationState.lastCollection,
          profile:         action.updates.profile         ?? state.conversationState.profile,
        },
      };

    case "RESET":
      return { isOpen: false, conversationState: createInitialState() };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface ConciergeContextValue {
  isOpen:            boolean;
  conversationState: ConversationState;
  openConcierge:     (options?: Partial<ConversationContext>) => void;
  closeConcierge:    () => void;
  dispatch:          Dispatch<ConciergeAction>;
}

const ConciergeContext = createContext<ConciergeContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function ConciergeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(conciergeReducer, INITIAL_UI_STATE);

  const openConcierge = useCallback((options?: Partial<ConversationContext>) => {
    dispatch({ type: "OPEN", options });
  }, []);

  const closeConcierge = useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  return (
    <ConciergeContext.Provider
      value={{
        isOpen:            state.isOpen,
        conversationState: state.conversationState,
        openConcierge,
        closeConcierge,
        dispatch,
      }}
    >
      {children}
    </ConciergeContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useConcierge(): ConciergeContextValue {
  const ctx = useContext(ConciergeContext);
  if (!ctx) throw new Error("useConcierge must be used within ConciergeProvider");
  return ctx;
}
