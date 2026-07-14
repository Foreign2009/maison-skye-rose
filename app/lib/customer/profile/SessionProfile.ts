/**
 * Customer Intelligence — Session Profile
 *
 * Volatile, in-memory, tab-scoped profile tier.
 * Never persisted. Discarded when the tab closes.
 *
 * The identity subtype guarantees sessionId is always a string,
 * eliminating non-null assertions at call sites.
 *
 * Mutations return new objects — SessionProfile is immutable.
 */

import type { CustomerProfile } from "./CustomerProfile";
import type { CustomerSignal }  from "../signals/CustomerSignal";
import { generateId }           from "./ProfileIdentity";
import { createProfileMetadata, touchMetadata } from "./ProfileMetadata";

export interface SessionProfile extends CustomerProfile {
  readonly tier:     "session";
  readonly signals:  readonly CustomerSignal[];
  /** sessionId is guaranteed present on session-tier profiles. */
  readonly identity: {
    readonly sessionId:  string;
    readonly deviceId?:  string;
    readonly accountId?: string;
  };
}

export function createSessionProfile(sessionId?: string): SessionProfile {
  return {
    tier:     "session",
    identity: { sessionId: sessionId ?? generateId() },
    metadata: createProfileMetadata(),
    signals:  [],
  };
}

export function addSignalToSession(
  profile: SessionProfile,
  signal:  CustomerSignal,
): SessionProfile {
  return {
    ...profile,
    signals:  [...profile.signals, signal],
    metadata: touchMetadata(profile.metadata),
  };
}
