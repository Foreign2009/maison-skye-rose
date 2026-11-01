import { cookies }                     from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

// SERVER-ONLY. The single admin session check for every admin page and privileged
// server action. Import only from server components and "use server" modules — the
// next/headers import makes a client-component import fail the build, so neither the
// secret nor the expected token can reach the browser.

export const ADMIN_SESSION_COOKIE = "msr-ops-session";

// Unchanged derivation: existing sessions issued by loginAction stay valid.
const SESSION_SALT = "msr-ops-v1";

// A session token is a lowercase hex SHA-256 digest; anything else is malformed.
const SESSION_TOKEN_PATTERN = /^[0-9a-f]{64}$/;

/** One-way hash of the secret — never reversible to the secret itself. */
export function computeAdminSessionToken(secret: string): string {
  return createHash("sha256").update(secret + SESSION_SALT).digest("hex");
}

/**
 * Fails closed: a missing or empty secret never authenticates, so the predictable
 * token derived from an empty secret is always rejected. Constant-time compare.
 */
export function isValidAdminSessionToken(
  secret: string | undefined,
  token:  string | undefined,
): boolean {
  if (!secret || !token || !SESSION_TOKEN_PATTERN.test(token)) return false;
  return timingSafeEqual(
    Buffer.from(token, "utf-8"),
    Buffer.from(computeAdminSessionToken(secret), "utf-8"),
  );
}

/** True only for a request carrying a valid admin session cookie. */
export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminSessionToken(
    process.env.ADMIN_SECRET,
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );
}
