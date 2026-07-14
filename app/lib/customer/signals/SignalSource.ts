/**
 * Customer Intelligence — Signal Source
 *
 * Canonical enumeration of every surface that can emit a CustomerSignal.
 * Paired runtime array enables O(1) validation without keyof/typeof gymnastics.
 */

export type SignalSource =
  | "quiz"
  | "concierge"
  | "purchase"
  | "favorite"
  | "cart"
  | "search"
  | "view"
  | "discovery";

export const SIGNAL_SOURCES: readonly SignalSource[] = [
  "quiz",
  "concierge",
  "purchase",
  "favorite",
  "cart",
  "search",
  "view",
  "discovery",
] as const;
