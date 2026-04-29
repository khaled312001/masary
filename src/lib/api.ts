import { cookies } from "next/headers";

export const API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const TOKEN_COOKIE = "masary_admin_token";

export type ApiOptions = RequestInit & { token?: string | null };

export async function apiFetch<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>)
  };
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;

  const url = `${API_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...opts,
      headers,
      cache: "no-store"
    });
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
    if (process.env.NODE_ENV !== "production") {
      console.error(`[apiServerSafe] ${path}:`, msg);
    } else {
      console.error(`[apiServerSafe] ${path}: ${msg}`);
    }
    return { data: null, error: msg };
  }
}
