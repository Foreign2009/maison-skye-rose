/**
 * Customer Intelligence — Learning Context
 *
 * Immutable context passed to every interpreter during a LearningEngine run.
 * Provides the interpreter with access to existing profile state and the full
 * signal batch for cross-signal reasoning (e.g. an interpreter may check other
 * signals in the same run to resolve ambiguity).
 *
 * Integration points:
 *   LearningEngine  — constructs and passes context on every run()
 *   BaseInterpreter — receives context in interpret()
 *   DeviceProfile   — optional existing preference state
 */

import type { DeviceProfile }  from "../profile/DeviceProfile";
import type { CustomerSignal } from "../signals/CustomerSignal";

export interface LearningContext {
  /** Existing device profile — provides current preference state. Absent on cold-start. */
  readonly deviceProfile?: DeviceProfile;
  /** All signals in the current batch — enables cross-signal reasoning. */
  readonly batchSignals:   readonly CustomerSignal[];
  /** Unix ms when this learning run started. */
  readonly runAt:          number;
}
