const COOKIE_NAME = "family_session";
const ISSUER = "auth.thephillips.family";
const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{0,31}$/;

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    if (!key || Object.prototype.hasOwnProperty.call(out, key)) continue;
    out[key] = part.slice(eq + 1).trim();
  }
  return out;
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function verifyFamilySession(
  token: string | undefined | null,
  secret: string
): Promise<boolean> {
  if (!token || token.length === 0 || token.length > 4096) return false;
  if (!secret || secret.length < 32) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [headerB64, bodyB64, sigB64] = parts;
  if (!headerB64 || !bodyB64 || !sigB64) return false;

  let header: { alg?: string; typ?: string };
  try {
    header = JSON.parse(new TextDecoder().decode(b64urlToBytes(headerB64)));
  } catch {
    return false;
  }
  if (!header || header.alg !== "HS256" || header.typ !== "JWT") return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = new TextEncoder().encode(`${headerB64}.${bodyB64}`);
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, data));
  let actual: Uint8Array;
  try {
    actual = b64urlToBytes(sigB64);
  } catch {
    return false;
  }
  if (!timingSafeEqual(expected, actual)) return false;

  let payload: {
    sub?: string;
    iat?: number;
    exp?: number;
    iss?: string;
    v?: number;
  };
  try {
    payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(bodyB64)));
  } catch {
    return false;
  }
  if (!payload || typeof payload.sub !== "string" || !USERNAME_RE.test(payload.sub)) return false;
  if (typeof payload.iat !== "number" || typeof payload.exp !== "number") return false;
  if (payload.exp <= payload.iat) return false;
  if (payload.v !== undefined && payload.v !== 1) return false;
  if (payload.iss !== ISSUER) return false;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now - 30) return false;
  if (payload.iat > now + 30) return false;
  const users = (process.env.FAMILY_USERS || "danny,hillary")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (users.length && !users.includes(payload.sub)) return false;
  return true;
}

export function familySessionFromRequest(cookieHeader: string | null): string | null {
  return parseCookies(cookieHeader)[COOKIE_NAME] || null;
}

export { COOKIE_NAME };
