/**
 * Customer Intelligence — Signal Interpreters
 *
 * Concrete placeholder implementations of BaseInterpreter — one per SignalSource.
 * Each returns an empty candidate array until business rules are implemented
 * in EP10.0-P5+.
 *
 * Interpreters are pre-wired via createDefaultLearningEngine() in LearningEngine.ts.
 * To add rule-based extraction: override interpret() in the concrete class and
 * apply LearningRule instances to the signal and context.
 */

import { BaseInterpreter }          from "./BaseInterpreter";
import type { CustomerSignal }      from "../signals/CustomerSignal";
import type { LearningContext }     from "./LearningContext";
import type { PreferenceCandidate } from "./PreferenceCandidate";

export class QuizInterpreter extends BaseInterpreter {
  readonly source = "quiz" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    return [];
  }
}

export class ConciergeInterpreter extends BaseInterpreter {
  readonly source = "concierge" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    return [];
  }
}

export class PurchaseInterpreter extends BaseInterpreter {
  readonly source = "purchase" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    return [];
  }
}

export class FavoriteInterpreter extends BaseInterpreter {
  readonly source = "favorite" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    return [];
  }
}

export class CartInterpreter extends BaseInterpreter {
  readonly source = "cart" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    return [];
  }
}

export class SearchInterpreter extends BaseInterpreter {
  readonly source = "search" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    return [];
  }
}

export class ViewInterpreter extends BaseInterpreter {
  readonly source = "view" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    return [];
  }
}

export class DiscoveryInterpreter extends BaseInterpreter {
  readonly source = "discovery" as const;
  interpret(_signal: CustomerSignal, _context: LearningContext): readonly PreferenceCandidate[] {
    return [];
  }
}
