/**
 * Customer Intelligence — Signal Metadata
 *
 * Optional contextual data attached to a CustomerSignal.
 * Metadata is for attribution and debugging — it does not influence
 * preference computation.
 *
 * All fields are optional: signals are valid without metadata.
 */

export interface SignalMetadata {
  /** Session that produced this signal. */
  readonly sessionId?:     string;
  /** Stable device identifier from localStorage. */
  readonly deviceId?:      string;
  /** Supabase account id — reserved for Phase 4 (authenticated customers). */
  readonly accountId?:     string;
  /** Page or surface context, e.g. "quiz", "pdp/soleil-dore", "search". */
  readonly pageContext?:   string;
  /** Links related signals emitted by the same user interaction. */
  readonly correlationId?: string;
}
