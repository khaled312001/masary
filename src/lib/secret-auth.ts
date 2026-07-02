import fs from "fs";
import path from "path";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SECRET_COOKIE = "masary_secret_token";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET missing/too short");
  return new TextEncoder().encode(s);
}

export async function signSecretSession() {
  return await new SignJWT({ scope: "secret" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifySecretSession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.scope === "secret";
  } catch {
    return false;
  }
}

export async function hasSecretSession(): Promise<boolean> {
  const token = cookies().get(SECRET_COOKIE)?.value;
  if (!token) return false;
  return verifySecretSession(token);
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkSecretPassword(input: string): boolean {
  const expected = process.env.SECRET_PAGE_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

// ─── Data ────────────────────────────────────────────────────────────
// Credentials are stored in a gitignored JSON file on the SERVER only
// (never committed). Read at runtime; the page shows a friendly message if
// the file is absent (e.g. local dev).

export type SiteEntry = {
  key: string;
  name: string;
  domain: string;
  url: string;
  admin?: { url: string; email: string; password: string } | null;
  email?: { address: string; password: string; webmail: string } | null;
  notes?: string;
};

export type SecretData = {
  hosting: {
    provider: string;
    loginUrl: string;
    email: string;
    password: string;
    webmailUrl: string;
    note: string;
  };
  sites: SiteEntry[];
};

export function loadSecretData(): SecretData | null {
  const candidates = [
    path.join(process.cwd(), "secret-data.json"),
    process.env.SECRET_DATA_PATH || ""
  ].filter(Boolean);
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, "utf8")) as SecretData;
      }
    } catch (e) {
      console.error("[secret] failed to read data file:", e);
    }
  }
  return null;
}
