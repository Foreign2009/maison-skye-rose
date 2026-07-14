/**
 * Customer Intelligence — Profile Serializer
 *
 * JSON round-trip for DeviceProfile — the only profile tier that
 * requires persistence (Session is in-memory; Unified is derived).
 *
 * Validation is applied on deserialization. Invalid JSON or a profile
 * that fails validation returns null rather than throwing.
 */

import type { DeviceProfile } from "./DeviceProfile";
import { validateProfile }    from "./ProfileValidator";

export function serializeDeviceProfile(profile: DeviceProfile): string {
  return JSON.stringify(profile);
}

export function deserializeDeviceProfile(json: string): DeviceProfile | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      (parsed as Record<string, unknown>).tier !== "device"
    ) {
      return null;
    }
    const result = validateProfile(parsed);
    if (!result.valid) return null;
    return parsed as DeviceProfile;
  } catch {
    return null;
  }
}
