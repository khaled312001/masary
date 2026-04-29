import { cookies } from "next/headers";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:4000";

export const TOKEN_COOKIE = "masary_admin_token";

export type ApiOptions = RequestInit & { token?: string | null };

export async function apiFetch<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>)
  };
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
    cache: "no-store"
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const error = (data as any)?.error || `HTTP ${res.status}`;
    throw new Error(error);
  }
  return data as T;
}

// Server-side: read token from cookie
export function getServerToken(): string | null {
  return cookies().get(TOKEN_COOKIE)?.value ?? null;
}

// Server-side fetch with token
export async function apiServer<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getServerToken();
  return await apiFetch<T>(path, { ...init, token });
}

// Server-side fetch that returns null on auth/server errors (so pages don't crash)
export async function apiServerSafe<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await apiServer<T>(path, init);
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: e?.message ?? "تعذر جلب البيانات" };
  }
}
