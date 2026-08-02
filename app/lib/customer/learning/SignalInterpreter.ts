/**
 * Customer Intelligence — Signal Interpreters
 *
 * Concrete implementations of BaseInterpreter — one per SignalSource.
 *
 * Active interpreters (EP19.2 + EP20-P1):
 *   QuizInterpreter      — maps explicit quiz payload fields to candidates (HIGH)
 *   FavoriteInterpreter  — derives fragrance attributes from saves (MEDIUM)
 *   ViewInterpreter      — derives fragrance attributes from views (LOW)
 *   SearchInterpreter    — parses query intent via parseIntent() (MEDIUM)
 *   CartInterpreter      — derives fragrance attributes from cart adds (MEDIUM)
 *   ConciergeInterpreter — maps explicit concierge preference signals to candidates (HIGH/MEDIUM)
 *
 * Placeholder interpreters (signals not yet emitted):
 *   PurchaseInterpreter  — no fragrance_purchase signals emitted; deferred
 *   DiscoveryInterpreter — discovery_path deferred to post-EP19.1
 *
 * Metadata resolution:
 *   getSummaryForSlug() from PreferenceScorer provides the canonical
 *   slug → KnowledgeSummary lookup. No new catalogue map constructed.
 */

import { BaseInterpreter }          from "./BaseInterpreter";
import type { CustomerSignal }      from "../signals/CustomerSignal";
import type { LearningContext }     from "./LearningContext";
import type { PreferenceCandidate } from "./PreferenceCandidate";
import { getSummaryForSlug }        from "../recommendations/PreferenceScorer";
import { parseIntent }              from "../../intentParser";

// ── Shared helpers ────────────────────────────────────────────────────────────

function candidate(
  signal:   CustomerSignal,
  type:     PreferenceCandidate["type"],
  value:    string,
  positive: boolean,
): PreferenceCandidate {
  return { type, value, confidence: signal.confidence, signal, positive };
}

/**
 * Derive preference candidates from all relevant attributes of a fragrance
 * identified by slug. Reuses the PreferenceScorer's module-level SUMMARY_MAP.
 */
function fragranceCandidates(
  slug:     string,
  signal:   CustomerSignal,
  positive: boolean,
): PreferenceCandidate[] {
  const summary = getSummaryForSlug(slug);
  if (!summary) return [];
  const out: PreferenceCandidate[] = [];
  for (const f of summary.family)    out.push(candidate(signal, "family_preference",   f, positive));
  for (const o of summary.occasions) out.push(candidate(signal, "occasion_preference", o, positive));
  for (const s of summary.seasons)   out.push(candidate(signal, "season_preference",   s, positive));
  out.push(candidate(signal, "gender_preference", summary.gender, positive));
  return out;
}

// ── Active interpreters ───────────────────────────────────────────────────────

export class QuizInterpreter extends BaseInterpreter {
  readonly source = "quiz" as const;

  interpret(signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    const { payload } = signal;

    if (signal.type === "family_preference") {
      const family = payload.family;
      return typeof family === "string"
        ? [candidate(signal, "family_preference", family, true)]
        : [];
    }

    if (signal.type === "occasion_preference") {
      const occasion = payload.occasion;
      return typeof occasion === "string"
        ? [candidate(signal, "occasion_preference", occasion, true)]
        : [];
    }

    if (signal.type === "gender_preference") {
      const gender = payload.gender;
      return typeof gender === "string"
        ? [candidate(signal, "gender_preference", gender, true)]
        : [];
    }

    if (signal.type === "character_preference") {
      const character = payload.character;
      return typeof character === "string"
        ? [candidate(signal, "character_preference", character, true)]
        : [];
    }

    return [];
  }
}

export class FavoriteInterpreter extends BaseInterpreter {
  readonly source = "favorite" as const;

  interpret(signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    if (signal.type !== "fragrance_save") return [];
    // Unsave is ambiguous (list housekeeping vs avoidance) — emit only on save.
    if (signal.payload.saved !== true) return [];
    const slug = signal.payload.slug;
    return typeof slug === "string" ? fragranceCandidates(slug, signal, true) : [];
  }
}

export class ViewInterpreter extends BaseInterpreter {
  readonly source = "view" as const;

  interpret(signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    if (signal.type !== "fragrance_engagement") return [];
    const slug = signal.payload.slug;
    return typeof slug === "string" ? fragranceCandidates(slug, signal, true) : [];
  }
}

export class SearchInterpreter extends BaseInterpreter {
  readonly source = "search" as const;

  interpret(signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    if (signal.type !== "search_query") return [];
    const query = signal.payload.query;
    if (typeof query !== "string") return [];

    const intent = parseIntent(query);
    const out: PreferenceCandidate[] = [];

    if (intent.family)    out.push(candidate(signal, "family_preference",    intent.family,    true));
    if (intent.occasion)  out.push(candidate(signal, "occasion_preference",  intent.occasion,  true));
    if (intent.gender)    out.push(candidate(signal, "gender_preference",    intent.gender,    true));
    if (intent.character) out.push(candidate(signal, "character_preference", intent.character, true));

    return out;
  }
}

export class CartInterpreter extends BaseInterpreter {
  readonly source = "cart" as const;

  interpret(signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    if (signal.type !== "fragrance_engagement") return [];
    if (signal.payload.action !== "cart_add") return [];
    const slug = signal.payload.slug;
    return typeof slug === "string" ? fragranceCandidates(slug, signal, true) : [];
  }
}

// ── Concierge interpreter (EP20-P1) ──────────────────────────────────────────

export class ConciergeInterpreter extends BaseInterpreter {
  readonly source = "concierge" as const;

  interpret(signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    const out: PreferenceCandidate[] = [];

    if (signal.type === "family_preference") {
      const family = signal.payload.family;
      if (typeof family === "string") out.push(candidate(signal, "family_preference", family, true));
    }

    // family_avoidance signals → family_preference candidate with positive: false
    // CustomerPreferenceSummary checks (type === "family_preference" && !positive) for avoidedFamilies
    if (signal.type === "family_avoidance") {
      const family = signal.payload.family;
      if (typeof family === "string") out.push(candidate(signal, "family_preference", family, false));
    }

    if (signal.type === "occasion_preference") {
      const occasion = signal.payload.occasion;
      if (typeof occasion === "string") out.push(candidate(signal, "occasion_preference", occasion, true));
    }

    if (signal.type === "season_preference") {
      const season = signal.payload.season;
      if (typeof season === "string") out.push(candidate(signal, "season_preference", season, true));
    }

    if (signal.type === "gender_preference") {
      const gender = signal.payload.gender;
      if (typeof gender === "string") out.push(candidate(signal, "gender_preference", gender, true));
    }

    return out;
  }
}

// ── Placeholder interpreters (signals not yet emitted) ────────────────────────

export class PurchaseInterpreter extends BaseInterpreter {
  readonly source = "purchase" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    // No fragrance_purchase signals currently emitted — placeholder.
    return [];
  }
}

export class DiscoveryInterpreter extends BaseInterpreter {
  readonly source = "discovery" as const;

  interpret(signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    if (signal.type !== "discovery_path") return [];

    const { families, occasions, seasons } = signal.payload as {
      families?: unknown;
      occasions?: unknown;
      seasons?:  unknown;
    };

    const out: PreferenceCandidate[] = [];
    if (Array.isArray(families))  for (const f of families)  if (typeof f === "string") out.push(candidate(signal, "family_preference",   f, true));
    if (Array.isArray(occasions)) for (const o of occasions) if (typeof o === "string") out.push(candidate(signal, "occasion_preference", o, true));
    if (Array.isArray(seasons))   for (const s of seasons)   if (typeof s === "string") out.push(candidate(signal, "season_preference",   s, true));
    return out;
  }
}
