/**
 * Customer Intelligence — Signal Version
 *
 * Every CustomerSignal carries a version so future schema migrations can be
 * handled by branching validators without breaking existing stored signals.
 *
 * The version is a discriminated numeric literal, not a string, to prevent
 * accidental coercion and to support exhaustive type narrowing.
 */

export type SignalVersion = 1;

export const CURRENT_SIGNAL_VERSION: SignalVersion = 1;
