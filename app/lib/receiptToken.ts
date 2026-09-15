export const RECEIPT_EXPIRY_SECONDS = 24 * 60 * 60;

export function getReceiptSecret(): string {
  const s = process.env.ORDER_RECEIPT_SECRET;
  if (!s || s.trim().length === 0)
    throw new Error("[receiptToken] ORDER_RECEIPT_SECRET is not configured");
  return s;
}

async function makeHmacKey(
  secret: string,
  usage: "sign" | "verify",
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

export async function signReceiptToken(ref: string): Promise<string> {
  const payloadB64 = Buffer.from(
    JSON.stringify({
      ref,
      purpose: "confirm",
      exp: Math.floor(Date.now() / 1000) + RECEIPT_EXPIRY_SECONDS,
    }),
  ).toString("base64url");
  const key = await makeHmacKey(getReceiptSecret(), "sign");
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  return `${payloadB64}.${Buffer.from(sig).toString("base64url")}`;
}

export async function verifyReceiptToken(
  token: string,
  expectedRef: string,
): Promise<void> {
  if (!token) throw new Error("Missing token");
  const parts = token.split(".");
  if (parts.length !== 2) throw new Error("Malformed token");
  const [payloadB64, sigB64] = parts;
  const key = await makeHmacKey(getReceiptSecret(), "verify");
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(sigB64, "base64url"),
    new TextEncoder().encode(payloadB64),
  );
  if (!valid) throw new Error("Invalid signature");
  const payload = JSON.parse(
    Buffer.from(payloadB64, "base64url").toString("utf-8"),
  ) as { ref?: unknown; purpose?: unknown; exp?: unknown };
  if (payload.purpose !== "confirm") throw new Error("Wrong purpose");
  if (payload.ref !== expectedRef) throw new Error("Reference mismatch");
  if (
    typeof payload.exp !== "number" ||
    payload.exp < Math.floor(Date.now() / 1000)
  )
    throw new Error("Token expired");
}
