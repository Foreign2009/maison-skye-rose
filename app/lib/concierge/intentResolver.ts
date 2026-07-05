/**
 * Maison Concierge — Intent Resolver
 *
 * Classifies free-text customer messages into one of 8 supported intents
 * and extracts entity references (fragrance slugs, collection hints) using
 * the catalogueMaps from the discovery layer.
 */

import { parseIntent } from "../intentParser";
import { catalogueMaps } from "../discovery";
import type { ConversationIntent, ConversationContext } from "./types";
import type { IntentSignals } from "../intentParser";

// ── Intent trigger phrases ────────────────────────────────────────────────────

const COMPARISON_TRIGGERS  = [" vs ", " versus ", "compare", "difference between", "vs.", "which is better", "which one"];
const EDUCATION_TRIGGERS   = ["what is ", "what are ", "explain ", "teach me", "how does", "why does", "tell me about", "how do", "what makes", "what's the difference between"];
const GIFT_TRIGGERS        = ["gift", "present", "for my ", "someone else", "for her", "for him", "for them", "buying for", "mother", "father", "partner", "friend"];
const SIMILAR_TRIGGERS     = ["similar to", "like ", "reminds me of", "same as", "alternatives to", "dupe for", "smells like", "something like"];
const SEASONAL_TRIGGERS    = ["in summer", "for summer", "in winter", "for winter", "in spring", "for spring", "in autumn", "for autumn", "summer ", "winter ", "autumn ", "spring "];

// ── Public types ──────────────────────────────────────────────────────────────

export interface ResolvedIntent {
  intent:      ConversationIntent;
  signals:     IntentSignals;
  entitySlug?: string;
  compareSlug: string[];
}

// ── Entity extraction ─────────────────────────────────────────────────────────

function extractFragranceSlugs(q: string): string[] {
  // Sort by name length (longest first) to prevent substring matches
  const sortedNames = [...catalogueMaps.byName.keys()].sort((a, b) => b.length - a.length);
  const found: string[] = [];
  for (const name of sortedNames) {
    if (q.includes(name.toLowerCase())) {
      const k = catalogueMaps.byName.get(name);
      if (k && !found.includes(k.slug)) found.push(k.slug);
    }
  }
  return found;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function resolveIntent(message: string, context: ConversationContext): ResolvedIntent {
  const q       = message.toLowerCase();
  const signals = parseIntent(q);

  // 1. Resolve fragrance entities from message text
  const mentionedSlugs = extractFragranceSlugs(q);
  let entitySlug: string | undefined;
  let compareSlug: string[] = [];

  if (mentionedSlugs.length === 1) {
    entitySlug = mentionedSlugs[0];
  } else if (mentionedSlugs.length >= 2) {
    compareSlug  = mentionedSlugs.slice(0, 2);
    [entitySlug] = compareSlug;
  }

  // Fall back to context entity if none found in this message
  if (!entitySlug && context.mentionedSlug) {
    entitySlug = context.mentionedSlug;
  }

  // 2. Classify intent

  if (compareSlug.length >= 2 || COMPARISON_TRIGGERS.some((t) => q.includes(t))) {
    return { intent: "comparison", signals, entitySlug, compareSlug };
  }

  if (EDUCATION_TRIGGERS.some((t) => q.includes(t))) {
    return { intent: "education", signals, entitySlug, compareSlug: [] };
  }

  if (GIFT_TRIGGERS.some((t) => q.includes(t))) {
    return { intent: "gift", signals, entitySlug, compareSlug: [] };
  }

  if (SIMILAR_TRIGGERS.some((t) => q.includes(t)) && entitySlug) {
    return { intent: "similar_to", signals, entitySlug, compareSlug: [] };
  }

  if (entitySlug && !signals.occasion && !signals.family) {
    return { intent: "similar_to", signals, entitySlug, compareSlug: [] };
  }

  if (SEASONAL_TRIGGERS.some((t) => q.includes(t)) || signals.occasion?.match(/summer|winter|spring|autumn/i)) {
    return { intent: "seasonal", signals, entitySlug, compareSlug: [] };
  }

  if (signals.occasion) {
    return { intent: "occasion_search", signals, entitySlug, compareSlug: [] };
  }

  // Very short message with no signals → ask for clarification
  if (q.split(" ").length <= 3 && !signals.family && !signals.vibe) {
    return { intent: "clarification", signals, entitySlug, compareSlug: [] };
  }

  return { intent: "general_discovery", signals, entitySlug, compareSlug: [] };
}
