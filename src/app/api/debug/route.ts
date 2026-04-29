import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "(NOT SET — defaults to localhost:4000)";

  const env = {
    API_URL: process.env.API_URL ? process.env.API_URL : "MISSING",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : "MISSING",
    AUTH_SECRET: process.env.AUTH_SECRET
      ? `set (${process.env.AUTH_SECRET.length} chars)`
      : "MISSING",
    NODE_ENV: process.env.NODE_ENV
  };

  let backend: any = { ok: false };
  try {
    const target = apiUrl.startsWith("(NOT") ? "http://localhost:4000" : apiUrl;
    const res = await fetch(`${target}/api/healthz`, { cache: "no-store" });
    const txt = await res.text();
    backend = { ok: res.ok, status: res.status, body: txt.slice(0, 500) };
  } catch (e: any) {
    backend = { ok: false, error: e?.message ?? String(e) };
  }

  return NextResponse.json({ env, backend, time: new Date().toISOString() });
}
