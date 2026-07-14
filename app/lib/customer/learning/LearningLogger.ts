/**
 * Customer Intelligence — Learning Logger
 *
 * Logging contract for the Preference Learning Framework.
 * Injected into LearningEngine — consumers choose their own sink.
 * createNullLogger() is the safe default until a consumer provides a real sink.
 *
 * Never connects to analytics. Diagnostics and audit trail only.
 */

export interface LearningLogEntry {
  readonly level:     "info" | "warn" | "error";
  readonly message:   string;
  readonly data?:     Readonly<Record<string, unknown>>;
  readonly timestamp: number;
}

export interface LearningLoggerContract {
  log(entry: LearningLogEntry): void;
}

/** No-op logger — discards all entries. */
export function createNullLogger(): LearningLoggerContract {
  return {
    log: () => undefined,
  };
}
