// API client used by server components.
//
// Since the Next.js app is now fully self-contained (the Express backend was
// migrated to Next.js route handlers under /api/*), there is no external API
// host to talk to. Server components and route handlers go through Prisma /
// internal libs directly. This file remains for two reasons:
//   1) Backwards compatibility — many existing server components use apiServer
//      / apiServerSafe to fetch from /api/*. They still work; we route them to
//      the same Next.js process via internal fetch.
//   2) It centralises the cookie/token name used by the admin auth cookie.

import { cookies, headers } from "next/headers";

export const TOKEN_COOKIE = "masary_admin_token";

function baseUrl(): string {
  // Prefer the runtime request host so server components hit the same node
  // process (lets the route handler read the admin cookie too).
  try {
    const h = headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  } catch {
    /* outside request scope */
  }
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://127.0.0.1:3000";
}

export type ApiOptions = RequestInit & { token?: string | null };

export async function apiFetch<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${baseUrl()}${path}`;
  const headersOut: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>)
  };
  if (opts.token) headersOut["Authorization"] = `Bearer ${opts.token}`;
  // Forward the admin cookie so the in-process call passes requireAdmin.
  try {
    const c = cookies().get(TOKEN_COOKIE)?.value;
    if (c && !headersOut["Cookie"]) headersOut["Cookie"] = `${TOKEN_COOKIE}=${c}`;
  } catch {
    /* outside request scope */
  }

  let res: Response;
  try {
    res = await fetch(url, { ...opts, headers: headersOut, cache: "no-store" });
  } catch (e: any) {
    throw new Error(`fetch failed (${url}): ${e?.message ?? e}`);
  }

  const text = await res.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text.slice(0, 200) };
    }
  }

  if (!res.ok) {
    const error = data?.error || data?.raw || `HTTP ${res.status}`;
    throw new Error(error);
  }
  return data as T;
}

export function getServerToken(): string | null {
  try {
    return cookies().get(TOKEN_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

export async function apiServer<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getServerToken();
  return await apiFetch<T>(path, { ...init, token });
}

export async function apiServerSafe<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await apiServer<T>(path, init);
    return { data, error: null };
  } catch (e: any) {
    const msg = e?.message ?? "تعذر جلب البيانات";
    console.error(`[apiServerSafe] ${path}: ${msg}`);
    return { data: null, error: msg };
  }
}

// Kept as an export so old imports don't break. Returns the public site URL.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.SITE_URL || "https://masaary.com";
